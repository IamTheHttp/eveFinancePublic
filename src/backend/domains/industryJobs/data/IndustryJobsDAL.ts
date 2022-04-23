import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IIndustryJobs {

}

class IndustryJobsDAL extends DBTable<IIndustryJobs> {
  constructor(dbConnection: MongoClient.Db) {
    super('industryJobs', dbConnection);
  }
}

export {IndustryJobsDAL};