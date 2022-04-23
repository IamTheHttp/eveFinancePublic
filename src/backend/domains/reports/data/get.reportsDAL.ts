import {connectMongo} from "../../../mongoConnect";
import {ReportsDAL} from "./ReportsDAL";

async function getReportsDAL(): Promise<ReportsDAL> {
  if (getReportsDAL.res) {
    return getReportsDAL.res;
  }

  const {db} = await connectMongo();
  const reportsDAL = new ReportsDAL(db);

  getReportsDAL.res = reportsDAL;
  return reportsDAL;
}

namespace getReportsDAL {
  export var res: ReportsDAL | undefined;
}

export {getReportsDAL};