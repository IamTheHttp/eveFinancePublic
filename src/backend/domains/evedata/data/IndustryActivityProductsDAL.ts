import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IndustryActivityProduct {

}

class IndustryActivityProductsDAL extends DBTable<IndustryActivityProduct> {
  constructor(dbConnection: MongoClient.Db) {
    super('__industryActivityProducts', dbConnection);
  }
}

export {IndustryActivityProductsDAL};