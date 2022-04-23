import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {IESIBlueprint} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESIBlueprint";
import getAllDAL from "../../dataSources/DAL/getAllDAL";
import {HydrationPayload} from "../character/hydrateAll";

async function corporationBlueprintsHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const DALs = await getAllDAL();
  const {blueprintsDAL} = DALs;
  let page = 1;
  let allBlueprints: IESIBlueprint[] = [];

  // Above this line is refactored

  while (page < 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Blueprints - Fetching page ${page}`);
    let response = await esiNetworkDriver.getCorporationBlueprints(charAgg.getChar(), page);

    if (shouldHandleResponse(response, charAgg.getChar(), "Corporation Blueprints")) {
      allBlueprints = allBlueprints.concat(response.body);
      page++;

      if (response.totalPages < page) {
        logger.info(`${charAgg.getChar().charName} - Corporation Blueprints - Out of pages!`);
        break; // Out of pages
      }
    } else {
      // Since we need to delete all the items in order to insert
      // if one of the pages is cached - we shouldn't do anything
      logger.info(`${charAgg.getChar().charName} - Corporation Blueprints - at least one page is cached, skipping!`);
      return;
    }
  }

  if (page == 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Blueprints - Warning! too many pages found for charAgg.getChar() ${charAgg.getChar().charName}`);
  }

  if (allBlueprints && allBlueprints.length) {
    await blueprintsDAL.deleteWhere({
      apiCorpID: charAgg.getChar().corporationID
    });

    await blueprintsDAL.upsertMany(allBlueprints.map((entry) => {
      return {
        ...entry,
        apiCharID: charAgg.getChar().charID,
        apiCorpID: charAgg.getChar().corporationID
      }
    }));

    logger.success(`${charAgg.getChar().charName} - Corporation Blueprints (Inserted: ${allBlueprints.length})`);
  } else {
    logger.error(`${charAgg.getChar().charName} - Corporation - Blueprints`);
  }
}

export default corporationBlueprintsHydration;
