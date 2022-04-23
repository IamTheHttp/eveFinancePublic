import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {IStructureOrStation} from "../interfaces/IStructureOrStation";
import {ServerError} from "../../../ServerError";


async function stationsAndStructures(app:Express) {
  const DALs = await getAllDAL();
  const {stationsDAL, playerStructuresDAL} = DALs;

  app.get('/auth/stationsAndStructures/:solarSystemID', async (req, res) => {
    let char = res.locals.character;

    let stations = await stationsDAL.getWhere({
      solarSystemID: +req.params.solarSystemID
    });

    let structures = await playerStructuresDAL.getWhere({
      solar_system_id: +req.params.solarSystemID
    });

    // Combine structures and stations
    const data:IStructureOrStation[] = [...stations, ...structures].map((a) => {
      if ('structureID' in a) {
        return {
          stationID: a.structureID,
          solarSystemID: a.solar_system_id,
          stationName: a.name,
          isPlayerOwned: true
        }
      } else {
        return {
          stationID: a.stationID,
          solarSystemID: a.solarSystemID,
          stationName: a.stationName,
          isPlayerOwned: false
        }
      }
    });

    res.send({
      data,
      errorID: ServerError.OK,
    })
  });
}
export default stationsAndStructures;
