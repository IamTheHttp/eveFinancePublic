import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IUniverseMarketOrder {

}

class UniverseMarketOrdersDAL extends DBTable<IUniverseMarketOrder> {
  constructor(dbConnection: MongoClient.Db) {
    super('universeMarketOrders', dbConnection);
  }
}

export {UniverseMarketOrdersDAL};