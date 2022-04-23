import {connectMongo} from "../../../mongoConnect";
import {BlueprintsDAL} from "./BlueprintsDAL";

async function getBlueprintsDAL(): Promise<BlueprintsDAL> {
  if (getBlueprintsDAL.res) {
    return getBlueprintsDAL.res;
  }

  const {db} = await connectMongo();
  const blueprintsDAL = new BlueprintsDAL(db);

  await blueprintsDAL.createIndex({type_id: 1}, false);
  await blueprintsDAL.setup({uniqueKeys: ['item_id']})


  getBlueprintsDAL.res = blueprintsDAL;
  return blueprintsDAL;
}

namespace getBlueprintsDAL {
  export var res: BlueprintsDAL | undefined;
}

export {getBlueprintsDAL};