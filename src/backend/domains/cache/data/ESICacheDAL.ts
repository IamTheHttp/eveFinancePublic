import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IESICache {

}

class ESICacheDAL extends DBTable<IESICache> {
  constructor(dbConnection: MongoClient.Db) {
    super('esiCache', dbConnection);
  }
}

export {ESICacheDAL};