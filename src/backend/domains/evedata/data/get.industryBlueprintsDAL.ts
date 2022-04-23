import {connectMongo} from "../../../mongoConnect";
import {BlueprintsDAL} from "./BlueprintsDAL";

async function getIndustryBlueprintsDAL(): Promise<BlueprintsDAL> {
  if (getIndustryBlueprintsDAL.res) {
    return getIndustryBlueprintsDAL.res;
  }

  const {db} = await connectMongo();
  const industryBlueprintsDAL = new BlueprintsDAL(db);

  await industryBlueprintsDAL.createIndex({typeID: 1}, false)


  getIndustryBlueprintsDAL.res = industryBlueprintsDAL;
  return industryBlueprintsDAL;
}

namespace getIndustryBlueprintsDAL {
  export var res: BlueprintsDAL | undefined;
}

export {getIndustryBlueprintsDAL};