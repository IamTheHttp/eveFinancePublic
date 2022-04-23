import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {IESIAsset} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESIAsset";
import {getAssetsDAL} from "../../domains/assets/data/get.assetsDAL";
import {HydrationPayload} from "../character/hydrateAll";

async function corporationAssetHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const assetsDAL = await getAssetsDAL();
  let page = 1;
  let allAssets: IESIAsset[] = [];

  while (page < 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Assets - Fetching page ${page}`);
    let response = await esiNetworkDriver.getCorporationAssets(charAgg.getChar(), page);

    if (shouldHandleResponse(response, charAgg.getChar(), "Corporation Assets")) {
      allAssets = allAssets.concat(response.body);
      page++;

      if (response.totalPages < page) {
        logger.info(`${charAgg.getChar().charName} - Corporation Assets - Out of pages!`);
        break; // Out of pages
      }
    } else {
      // Since we need to delete all the assets,
      // if one of the pages is cached - we shouldn't do anything
      logger.info(`${charAgg.getChar().charName} - Corporation Assets - at least one page is cached, skipping!`);
      return;
    }
  }

  if (page == 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Assets - Warning! too many pages found for charAgg.getChar() ${charAgg.getChar().charName}`);
  }

  if (allAssets && allAssets.length) {
    const updateArray = allAssets.map((entry) => {
      return {
        ...entry,
        apiCharID: charAgg.getChar().charID,
        apiCorpID: charAgg.getChar().corporationID
      }
    });

    logger.info(`${charAgg.getChar().charName} - Corporation Assets - Delete Old Assets`);
    await assetsDAL.deleteWhere({
      apiCorpID: charAgg.getChar().corporationID
    });

    logger.info(`${charAgg.getChar().charName} - Corporation Assets - Insert Assets`);
    await assetsDAL.upsertMany(updateArray);

    logger.success(`${charAgg.getChar().charName} - Corporation Assets (Inserted: ${allAssets.length})`);
  } else {
    logger.info(`${charAgg.getChar().charName} - Corporation Assets - No new data`);
  }
}

export {corporationAssetHydration};
