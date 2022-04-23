import {connectMongo} from "../../../mongoConnect";
import {UniverseMarketOrdersDAL} from "./UniverseMarketOrdersDAL";

async function getUniverseMarketOrdersDAL(): Promise<UniverseMarketOrdersDAL> {
  if (getUniverseMarketOrdersDAL.res) {
    return getUniverseMarketOrdersDAL.res;
  }

  const {db} = await connectMongo();
  const universeMarketOrdersDAL = new UniverseMarketOrdersDAL(db);

  await universeMarketOrdersDAL.setup({
    uniqueKeys: ['order_id']
  });

  getUniverseMarketOrdersDAL.res = universeMarketOrdersDAL;
  return universeMarketOrdersDAL;
}

namespace getUniverseMarketOrdersDAL {
  export var res: UniverseMarketOrdersDAL | undefined;
}

export {getUniverseMarketOrdersDAL};