import {Express} from "express";
import {IDALs} from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";
import {getJournalDAL} from "../data/get.journalDAL";


async function weeklyJournalByType(app: Express) {
  const journalDAL = await getJournalDAL();
  app.get('/auth/weeklyJournalByType', async (req, res) => {
    let data = await journalDAL.getWeeklyJournalEntriesByType(res.locals.character);

    res.send({
      data: data,
      errorID: ServerError.OK,
    })
  });
}

export default weeklyJournalByType;
