import {connectMongo} from "../../../mongoConnect";
import {MarketOrdersDAL} from "./MarketOrdersDAL";

async function getMarketOrdersDAL(): Promise<MarketOrdersDAL> {
  if (getMarketOrdersDAL.res) {
    return getMarketOrdersDAL.res;
  }

  const {db} = await connectMongo();
  const marketOrdersDAL = new MarketOrdersDAL(db);

  await marketOrdersDAL.createIndex({apiCharID: 1}, false);
  await marketOrdersDAL.createIndex({type_id: 1}, false);
  await marketOrdersDAL.createIndex({location_id: 1}, false);
  await marketOrdersDAL.setup({
    uniqueKeys: ['order_id']
  });


  getMarketOrdersDAL.res = marketOrdersDAL;
  return marketOrdersDAL;
}

namespace getMarketOrdersDAL {
  export var res: MarketOrdersDAL | undefined;
}

export {getMarketOrdersDAL};