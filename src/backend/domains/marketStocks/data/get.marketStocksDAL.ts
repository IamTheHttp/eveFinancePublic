import {connectMongo} from "../../../mongoConnect";
import {MarketStocksDAL} from "./MarketStocksDAL";

async function getMarketStocksDAL(): Promise<MarketStocksDAL> {
  if (getMarketStocksDAL.res) {
    return getMarketStocksDAL.res;
  }

  const {db} = await connectMongo();
  const marketStocksDAL = new MarketStocksDAL(db);

  await marketStocksDAL.createIndex({systemID: 1}, false);
  await marketStocksDAL.createIndex({typeID: 1}, false);
  await marketStocksDAL.setup({
    uniqueKeys: ['apiCharID', 'systemID', 'typeID']
  });

  getMarketStocksDAL.res = marketStocksDAL;
  return marketStocksDAL;
}

namespace getMarketStocksDAL {
  export var res: MarketStocksDAL | undefined;
}

export {getMarketStocksDAL};