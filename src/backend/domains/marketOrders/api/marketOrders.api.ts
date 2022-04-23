import {Express} from "express";
import {ServerError} from "../../../ServerError";
import {getMarketOrdersDAL} from "../data/get.marketOrdersDAL";
import {getJournalDAL} from "../../journalEntries/data/get.journalDAL";

async function getMarketOrders(app: Express) {
  const journalDAL = await getJournalDAL();
  const marketOrdersDAL = await getMarketOrdersDAL();

  app.get('/auth/marketOrders', async (req, res) => {
    let char = res.locals.character;

    let marketOrders = await marketOrdersDAL.getMarketOrderStatus(res.locals.character);
    res.send({
      data: marketOrders,
      errorID: ServerError.OK,
    })
  });

  app.get('/auth/weeklyTradingVolume', async (req, res) => {
    const result = await journalDAL.getWeeklyTradingVolume(res.locals.character);

    res.send({
      data: result,
      errorID: ServerError.OK,
    })
  });
}

export default getMarketOrders;
