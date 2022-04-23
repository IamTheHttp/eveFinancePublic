import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";
import {IStationDocument} from "../interfaces/IStationDocument";


class StationsDAL extends DBTable<IStationDocument> {
  constructor(dbConnection: MongoClient.Db) {
    super('__staStations', dbConnection);
  }
}

export {StationsDAL};