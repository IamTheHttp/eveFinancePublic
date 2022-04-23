import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IndustryActivityProduct {

}

class IndustryActivityMaterialsDAL extends DBTable<IndustryActivityProduct> {
  constructor(dbConnection: MongoClient.Db) {
    super('__industryActivityMaterials', dbConnection);
  }
}

export {IndustryActivityMaterialsDAL};