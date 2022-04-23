import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IEveItem {

}

class EveItemsDAL extends DBTable<IEveItem> {
  constructor(dbConnection: MongoClient.Db) {
    super('__invTypes', dbConnection);
  }
}

export {EveItemsDAL};