import {connectMongo} from "../../../mongoConnect";
import {JournalDAL} from "./JournalDAL";

async function getJournalDAL() {
  if (getJournalDAL.res) {
    return getJournalDAL.res;
  }

  const {db} = await connectMongo();
  const journalDAL = new JournalDAL( db);

  getJournalDAL.res = journalDAL;

  await journalDAL.createIndex({ref_type: 1}, false);
  await journalDAL.createIndex({date: 1}, false);
  await journalDAL.setup({
    uniqueKeys: ['id', 'amount', 'first_party_id']
  });

  return journalDAL;
}


namespace getJournalDAL {
  export var res: JournalDAL;
}


export {getJournalDAL}

