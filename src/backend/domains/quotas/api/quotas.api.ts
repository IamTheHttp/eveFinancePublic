import {Express} from "express";
import {IProductionQuota} from "../data/QuotasDAL";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";

async function quotasQueries(app: Express) {
  const DALs = await getAllDAL();
  const {quotasDAL} = DALs;

  app.get('/auth/quotas/materials', async (req, res) => {
    // TODO Fix types
    const data:any[] = await quotasDAL.getMaterialsForQuotas(res.locals.character);

    res.send({
      data,
      errorID: ServerError.OK,
    });
  });

  app.get('/auth/quotas/completed', async (req, res) => {
    const data:IProductionQuota[] = await quotasDAL.getProductionQuotas(res.locals.character, {
      filter: {
        completionDate: {$ne:null}
      },
      sort: {
        completionDate: -1
      },
      limit: 5
    });

    res.send({
      data,
      errorID: ServerError.OK,
    });
  });


  app.get('/auth/quotas', async (req, res) => {
    const data:IProductionQuota[] = await quotasDAL.getProductionQuotas(res.locals.character, {
      filter: {
        completionDate: null
      },
      sort: {
        createdDate: 1
      }
    });

    res.send({
      data,
      errorID: ServerError.OK,
    });
  });


  app.post('/auth/quotas', async (req, res) => {
    let payload = req.body;
    let data = await quotasDAL.insert({
      apiCharID: res.locals.character.charID,
      amount: payload.amount,
      typeID: payload.typeID,
      createdDate: new Date(),
      completionDate: null,
      isOpen: false
    });

    // TODO we might want an enum of error codes :)
    const errCode = data.result.n === data.result.ok ? 0 : 1

    res.send({
      data: errCode ? 'Error inserting quota' : 'OK',
      error: errCode,
    });
  });

  app.delete('/auth/quotas/:quotaID', async (req, res) => {
    let data = await quotasDAL.deleteWhere({
      _id: req.params.quotaID,
      apiCharID: res.locals.character.charID
    });

    res.send({
      data: 'OK',
      errorID: ServerError.OK,
    });
  });
}

export default quotasQueries;
