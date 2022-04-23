import {connectMongo} from "../../../mongoConnect";
import {AssetsDAL} from "./AssetsDAL";

async function getAssetsDAL(): Promise<AssetsDAL> {
  if (getAssetsDAL.res) {
    return getAssetsDAL.res;
  }

  const {db} = await connectMongo();
  const assetsDAL = new AssetsDAL(db);

  await assetsDAL.createIndex({type_id: 1}, false);
  await assetsDAL.createIndex({corpID: 1}, false);
  await assetsDAL.createIndex({apiCharID: 1}, false);
  await assetsDAL.setup({
    uniqueKeys: ['item_id']
  });


  getAssetsDAL.res = assetsDAL;
  return assetsDAL;
}

namespace getAssetsDAL {
  export var res: AssetsDAL | undefined;
}

export {getAssetsDAL};