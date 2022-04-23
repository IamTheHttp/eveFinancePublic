import {logger} from "../../utils/logger/logger";
import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {getMarketOrdersDAL} from "../../domains/marketOrders/data/get.marketOrdersDAL";

async function characterMarketOrdersHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const AREA_NAME = 'Market Orders';
  const marketOrdersDAL = await getMarketOrdersDAL();
  let response = await esiNetworkDriver.getCharacterOrders(charAgg.getChar());

  if (shouldHandleResponse(response, charAgg.getChar(), AREA_NAME)) {
    logger.info(`${charAgg.getChar().charName} - ${AREA_NAME} - prepare to delete`);
    await marketOrdersDAL.deleteWhere({
      apiCharID: charAgg.getChar().charID
    });

    logger.info(`${charAgg.getChar().charName} - ${AREA_NAME} - deleted`);

    const marketOrders = response.body;
    // TODO implement paging to fetch all market orders
    await marketOrdersDAL.upsertMany(marketOrders.map((marketOrder) => {
      return {
        ...marketOrder,
        apiCharID: charAgg.getChar().charID
      }
    }));
    logger.success(`${charAgg.getChar().charName} - Market orders - (Inserted ${marketOrders.length})`);
  }
}

export default characterMarketOrdersHydration;
