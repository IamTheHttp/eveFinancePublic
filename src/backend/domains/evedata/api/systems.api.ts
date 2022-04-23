import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";

async function dashboard(app:Express) {
  const DALs = await getAllDAL();
  const {mapSolarSystemsDAL} = DALs;

  app.get('/auth/systems/:regionID', async (req, res) => {
    let data = await mapSolarSystemsDAL.getWhere({
      regionID: +req.params.regionID
    });

    res.send({
      data,
      errorID: ServerError.OK,
    })
  });
}
export default dashboard;
