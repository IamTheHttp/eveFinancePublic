import {connectMongo} from "../../../mongoConnect";
import {QuotasDAL} from "./QuotasDAL";

async function getQuotasDAL(): Promise<QuotasDAL> {
  if (getQuotasDAL.res) {
    return getQuotasDAL.res;
  }

  const {db} = await connectMongo();
  const quotasDAL = new QuotasDAL(db);

  await quotasDAL.createIndex({typeID: 1}, false);
  await quotasDAL.createIndex({corpID: 1}, false);
  await quotasDAL.createIndex({apiCharID: 1}, false);
  await quotasDAL.createIndex({createdDate: 1}, false);
  await quotasDAL.createIndex({completionDate: 1}, false);
  await quotasDAL.setup({})


  getQuotasDAL.res = quotasDAL;
  return quotasDAL;
}

namespace getQuotasDAL {
  export var res: QuotasDAL | undefined;
}

export {getQuotasDAL};