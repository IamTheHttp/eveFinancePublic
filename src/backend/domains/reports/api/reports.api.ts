import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";

// export interface IReportForItem {
//   open: { quantity: number, value: number, avg: number },
//   buy: { quantity: number, value: number, avg: number },
//   build: { quantity: number, value: number, avg: number },
//   sell: { quantity: number, value: number, avg: number },
//   consumed: { quantity: number, value: number, avg: number },
//   close: { quantity: number, value: number, avg: number },
//   week: number,
//   month: number,
//   year: number;
//   typeName: string;
// }


// export type IWeeklyReportResponse = Record<number, Record<number, IWeeklyReport>>

// function getEmptyData(): IReportForItem {
//   return {
//     open: {quantity: 0, value: 0, avg: 0},
//     buy: {quantity: 0, value: 0, avg: 0},
//     build: {quantity: 0, value: 0, avg: 0},
//     sell: {quantity: 0, value: 0, avg: 0},
//     consumed: {quantity: 0, value: 0, avg: 0},
//     close: {quantity: 0, value: 0, avg: 0},
//     typeName: 'unknown',
//     week: 0,
//     month: 0,
//     year: 0
//   };
// }

async function reportsAPI(app: Express) {
  const DALs = await getAllDAL();
  const {reportsDALL} = DALs;


  app.post('/auth/reports', async (req, res) => {
    const ALLOWED_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const requestedMonth = +req.body.month;
    const requestedYear = +req.body.year;
    const minGrossProfit = +req.body.minGrossProfit
    const allYear = +req.body.allYear === 1

    const safeRequestedMonth = ALLOWED_MONTHS.includes(requestedMonth) ? requestedMonth : new Date().getMonth() + 1;
    const safeRequestedYear = requestedYear < 3000 && requestedYear > 2019 ? requestedYear : new Date().getFullYear();

    const queryRes = await reportsDALL.getAllTransactions({
      characterDoc: res.locals.character,
      groupBy: allYear ? 'year' : 'month',
      month: safeRequestedMonth,
      year: safeRequestedYear, minGrossProfit
    });

    const responseData = queryRes.map((data: any) => {
      delete data._id;
      return data;
    });

    res.send({
      data: responseData,
      errorID: ServerError.OK,
    });
  });
}

export default reportsAPI;
