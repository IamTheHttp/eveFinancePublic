import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IIndustryBlueprint {

}

class IndustryBlueprintsDAL extends DBTable<IIndustryBlueprint> {
  constructor(dbConnection: MongoClient.Db) {
    super('__industryBlueprints', dbConnection);
  }
}

export {IndustryBlueprintsDAL};