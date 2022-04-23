import {connectMongo} from "../../../mongoConnect";
import {EveItemsDAL} from "./EveItemsDAL";

async function getEveItemsDAL(): Promise<EveItemsDAL> {
  if (getEveItemsDAL.res) {
    return getEveItemsDAL.res;
  }

  const {db} = await connectMongo();
  const eveItemsDAL = new EveItemsDAL(db);

  await eveItemsDAL.createIndex({typeID: 1}, false);


  getEveItemsDAL.res = eveItemsDAL;
  return eveItemsDAL;
}

namespace getEveItemsDAL {
  export var res: EveItemsDAL | undefined;
}

export {getEveItemsDAL};