import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IMapSolarSystem {

}

class MapSolarSystemsDAL extends DBTable<IMapSolarSystem> {
  constructor(dbConnection: MongoClient.Db) {
    super('__mapSolarSystems', dbConnection);
  }
}

export {MapSolarSystemsDAL};