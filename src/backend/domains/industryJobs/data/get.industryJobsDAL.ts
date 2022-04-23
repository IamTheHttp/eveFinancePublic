import {connectMongo} from "../../../mongoConnect";
import {IndustryJobsDAL} from "./IndustryJobsDAL";

async function getIndustryJobsDAL(): Promise<IndustryJobsDAL> {
  if (getIndustryJobsDAL.res) {
    return getIndustryJobsDAL.res;
  }

  const {db} = await connectMongo();
  const industryJobsDAL = new IndustryJobsDAL(db);

  await industryJobsDAL.createIndex({blueprint_id: 1}, false);
  await industryJobsDAL.createIndex({status: 1}, false);
  await industryJobsDAL.setup({
    uniqueKeys: ['job_id', 'installer_id']
  });


  getIndustryJobsDAL.res = industryJobsDAL;
  return industryJobsDAL;
}

namespace getIndustryJobsDAL {
  export var res: IndustryJobsDAL | undefined;
}

export {getIndustryJobsDAL};