import {IDALs} from "../dataSources/DAL/getAllDAL";
import {ESINetworkDriver} from "../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import playerStructureHydration from "./general/playerStructureHydration";

import hydrateJITAMarketOrders from "./general/hydrateJITAMarketOrders";
import {logger} from "../utils/logger/logger";
import {hydrateAll} from "./character/hydrateAll";
import {setCharacterFailedRefreshAttempt} from "./setCharacterFailedRefreshAttempt";
import {refreshCharacterAccessToken} from "../server/middlewares/refreshCharacterAccessToken";
import {processISKTransfers} from "./general/processISKTransfers";
import {createCharAgg} from "../domains/characters/aggregates/createCharAgg";


async function initializeHydration(DALs: IDALs, esiNetworkDriver: ESINetworkDriver) {
  const charAgg = await createCharAgg();
  // TODO getActiveCharacters() should be moved to the DAL layer
  const charAggregates = await charAgg.getActiveCharacters();

  logger.bold('System - ***** Starting hydration cycle ******');
  logger.success(`System - Found ${charAggregates.length} Characters, beginning hydration`);

  // prevent a corporation from being hydrated twice in the same run
  const hydratedCorporations: { [index: number]: boolean } = {};

  for (let i = 0; i < charAggregates.length; i++) {
    const character = charAggregates[i].getChar();
    logger.bold(`${character.charName} - Start hydration`);

    if (character.failedRefreshTokenAttempts && character.failedRefreshTokenAttempts > 5) {
      logger.error(`${character.charName} - Skipping hydration , refresh token limit exceeded, failed attempts:${character.failedRefreshTokenAttempts})`);
      continue; // skip this character
    }

    const corpID = character.corporationID;

    if (i === 0) { // only for the first character
      await playerStructureHydration({charAgg: charAggregates[i], esiNetworkDriver});
    }

    await hydrateAll(charAggregates[i], !hydratedCorporations[corpID], esiNetworkDriver);

    await charAggregates[i].reload();
    hydratedCorporations[corpID] = true; // mark corp as hydrated
  }

  logger.info(`System - Hydrating JITA market orders`);
  await hydrateJITAMarketOrders(DALs);

  logger.info(`System - Processing ISK transfers`);
  await processISKTransfers(DALs);
}

export {initializeHydration}