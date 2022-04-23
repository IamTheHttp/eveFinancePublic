import {connectMongo} from "../../../mongoConnect";
import {ESICacheDAL} from "./ESICacheDAL";

async function getESICacheDAL(): Promise<ESICacheDAL> {
  if (getESICacheDAL.res) {
    return getESICacheDAL.res;
  }

  const {db} = await connectMongo();
  const esiCacheDAL = new ESICacheDAL(db);

  getESICacheDAL.res = esiCacheDAL;
  return esiCacheDAL;
}

namespace getESICacheDAL {
  export var res: ESICacheDAL | undefined;
}

export {getESICacheDAL};