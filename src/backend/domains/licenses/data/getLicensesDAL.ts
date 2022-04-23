import {connectMongo} from "../../../mongoConnect";
import {LicensesDAL} from "./LicensesDAL";

async function getLicensesDAL(): Promise<LicensesDAL> {
  if (getLicensesDAL.res) {
    return getLicensesDAL.res;
  }

  const {db} = await connectMongo();
  const licensesDAL = new LicensesDAL( db);

  getLicensesDAL.res = licensesDAL;
  return licensesDAL;
}

namespace getLicensesDAL {
  export var res: LicensesDAL | undefined;
}

export {getLicensesDAL};