import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";

async function dashboard(app:Express) {
  const DALs = await getAllDAL();
  const {mapRegionsDAL} = DALs;

  app.get('/auth/regions', async (req, res) => {
    let char = res.locals.character;

    let data = await mapRegionsDAL.getAllData();

    res.send({
      data,
      errorID: ServerError.OK,
    })
  });
}
export default dashboard;
