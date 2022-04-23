import {connectMongo} from "../../../mongoConnect";
import {TransactionsDAL} from "./TransactionsDAL";

async function getTransactionsDAL(): Promise<TransactionsDAL> {
  if (getTransactionsDAL.res) {
    return getTransactionsDAL.res;
  }

  const {db} = await connectMongo();
  const transactionsDAL = new TransactionsDAL(db);


  await transactionsDAL.createIndex({transaction_id: 1}, false);
  await transactionsDAL.setup({
    uniqueKeys: ['journal_ref_id']
  });

  getTransactionsDAL.res = transactionsDAL;
  return transactionsDAL;
}

namespace getTransactionsDAL {
  export var res: TransactionsDAL | undefined;
}

export {getTransactionsDAL};