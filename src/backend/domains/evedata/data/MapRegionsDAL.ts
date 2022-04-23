import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IMapRegion {

}

class MapRegionsDAL extends DBTable<IMapRegion> {
  constructor(dbConnection: MongoClient.Db) {
    super('__mapRegions', dbConnection);
  }
}

export {MapRegionsDAL};