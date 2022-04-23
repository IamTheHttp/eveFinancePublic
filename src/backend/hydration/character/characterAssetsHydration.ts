import {logger} from "../../utils/logger/logger";
import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {IESIAsset} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESIAsset";
import {getAssetsDAL} from "../../domains/assets/data/get.assetsDAL";

async function characterAssetsHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const assetsDAL = await getAssetsDAL();
  let allAssets: IESIAsset[] = [];
  let page = 1;

  while (page < 50) {
    logger.info(`${charAgg.getChar().charName} - Assets - Fetching page ${page}`);
    const response = await esiNetworkDriver.getCharacterAssets(charAgg.getChar(), page);

    if (shouldHandleResponse(response, charAgg.getChar(), "Assets")) {
      allAssets = allAssets.concat(response.body);
      page++;

      if (response.totalPages < page) {
        logger.info(`${charAgg.getChar().charName} - Assets - Out of pages!`);
        break; // Out of pages
      }
    } else {
      // Since we need to delete all the items in order to insert
      // if one of the pages is cached - we shouldn't do anything
      logger.info(`${charAgg.getChar().charName} - Assets - at least one page is cached, skipping!`);
      return;
    }
  }

  if (page == 50) {
    logger.info(`${charAgg.getChar().charName} - Warning! too many asset pages found for charAgg.getChar() ${charAgg.getChar().charName}`);
  }

  const updateArray = allAssets.map((asset) => {
    return {
      ...asset,
      apiCharID: charAgg.getChar().charID
    }
  });

  logger.info(`${charAgg.getChar().charName} - Delete Old Assets`);
  await assetsDAL.deleteWhere({
    apiCharID: charAgg.getChar().charID,
    apiCorpID: {$exists: false}
  });

  logger.info(`${charAgg.getChar().charName} - Insert Assets`);
  await assetsDAL.upsertMany(updateArray);

  logger.success(`${charAgg.getChar().charName} - Assets (Inserted ${allAssets.length})`);

  return allAssets;
}

export default characterAssetsHydration;
