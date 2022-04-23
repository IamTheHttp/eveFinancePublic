import {logger} from "../../utils/logger/logger";
import DBTable from "../../dataSources/DAL/DbTable";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import getAllDAL from "../../dataSources/DAL/getAllDAL";
import {HydrationPayload} from "../character/hydrateAll";


/**
 * Get known structures from the DB as a sorted, flat array of structureIDs
 * @param playerStructuresDAL
 */
async function getKnownStructures(playerStructuresDAL: DBTable<any>) {
  const knownStructures = await playerStructuresDAL.getTable().aggregate([
    {
      $project: {
        structureID: '$structureID'
      }
    }
  ]).toArray();

  return knownStructures.map((structure) => {
    return structure.structureID;
  }).sort();
}


async function playerStructureHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const DALs = await getAllDAL();
  const {playerStructuresDAL} = DALs;
  // get ESI Structures
  const response = await esiNetworkDriver.getPlayerStructures(charAgg.getChar());

  if (shouldHandleResponse(response, charAgg.getChar(), 'Player owned structures')) {
    const ESIStructureIDs = response.body.sort();
    const knownStructureIDs = await getKnownStructures(playerStructuresDAL);

    let updateCount = 0;
    logger.info(`System - Fetching new structure from ESI`);
    for (let i = 0; i < ESIStructureIDs.length; i++) {
      const logPrefix = `Structures - ${i + 1}/${ESIStructureIDs.length}`
      const structID = ESIStructureIDs[i];
      let isESIStructureKnown = false;

      // Search for the ESI Structure in the known structure array
      for (let j = 0; j < knownStructureIDs.length; j++) {
        if (structID === knownStructureIDs[j]) {
          isESIStructureKnown = true;
          break;
        }
      }

      if (isESIStructureKnown) {
        // ESI Structure is KNOWN, no action needed
      } else {
        // ESI Structure is NOT KNOWN, it needs to be inserted
        logger.info(`System - ${logPrefix} - Fetching new structure from ESI`);
        const structureData = <any>await esiNetworkDriver.getPlayerStructures(charAgg.getChar(), structID.toString());

        if (structureData.length >= 0) {
          logger.error(`Got array as a response, something is wrong ${JSON.stringify(structID)}`);
          throw 'Got array as a response, something is wrong';
        }

        structureData.structureID = structID;

        updateCount++;
        await playerStructuresDAL.insert(structureData);
      }
    }

    logger.success(`System - Player owned structures (Inserting: ${updateCount})`);

    // Delete things in the DB that aren't in ESI
    for (let i = 0; i < knownStructureIDs.length; i++) {
      let isStructInESI = false;

      for (let j = 0; j < ESIStructureIDs.length; j++) {
        if (knownStructureIDs[i] === ESIStructureIDs[j]) {
          isStructInESI = true;
          break;
        }
      }

      if (isStructInESI) {
        // do nothing
      } else {
        // remove from DB
        await playerStructuresDAL.deleteWhere({
          structureID: knownStructureIDs[i]
        });
      }
    }
  }
}

export default playerStructureHydration;
