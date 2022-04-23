import {connectMongo} from "../../../mongoConnect";
import {IndustryActivityProductsDAL} from "./IndustryActivityProductsDAL";

async function getIndustryActivityMaterialsDAL(): Promise<IndustryActivityProductsDAL> {
  if (getIndustryActivityMaterialsDAL.res) {
    return getIndustryActivityMaterialsDAL.res;
  }

  const {db} = await connectMongo();
  const industryActivityMaterialsDAL = new IndustryActivityProductsDAL(db);

  await industryActivityMaterialsDAL.createIndex({typeID: 1}, false);


  getIndustryActivityMaterialsDAL.res = industryActivityMaterialsDAL;
  return industryActivityMaterialsDAL;
}

namespace getIndustryActivityMaterialsDAL {
  export var res: IndustryActivityProductsDAL | undefined;
}

export {getIndustryActivityMaterialsDAL};