import {connectMongo} from "../../../mongoConnect";
import {LicenseLogsDAL} from "./LicenseLogsDAL";

async function getLicenseLogsDAL(): Promise<LicenseLogsDAL> {
  if (getLicenseLogsDAL.res) {
    return getLicenseLogsDAL.res;
  }

  const {db} = await connectMongo();
  const licensesDAL = new LicenseLogsDAL(db);

  getLicenseLogsDAL.res = licensesDAL;
  return licensesDAL;
}

namespace getLicenseLogsDAL {
  export var res: LicenseLogsDAL | undefined;
}

export {getLicenseLogsDAL};