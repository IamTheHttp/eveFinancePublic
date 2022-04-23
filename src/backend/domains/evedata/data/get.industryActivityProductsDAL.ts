import {connectMongo} from "../../../mongoConnect";
import {IndustryActivityProductsDAL} from "./IndustryActivityProductsDAL";

async function getIndustryActivityProductsDAL(): Promise<IndustryActivityProductsDAL> {
  if (getIndustryActivityProductsDAL.res) {
    return getIndustryActivityProductsDAL.res;
  }

  const {db} = await connectMongo();
  const industryActivityProductsDAL = new IndustryActivityProductsDAL(db);

  await industryActivityProductsDAL.createIndex({typeID: 1}, false)
  await industryActivityProductsDAL.createIndex({productTypeID: 1}, false)


  getIndustryActivityProductsDAL.res = industryActivityProductsDAL;
  return industryActivityProductsDAL;
}

namespace getIndustryActivityProductsDAL {
  export var res: IndustryActivityProductsDAL | undefined;
}

export {getIndustryActivityProductsDAL};