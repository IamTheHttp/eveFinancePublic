import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IBlueprint {
  item_id : number,
  apiCharID : number,
  apiCorpID : number,
  location_flag : string,
  location_id : number,
  material_efficiency : number,
  quantity : number,
  runs : number,
  time_efficiency : number,
  type_id : number
}

class BlueprintsDAL extends DBTable<IBlueprint> {
  constructor(dbConnection: MongoClient.Db) {
    super('blueprints', dbConnection);
  }
}

export {BlueprintsDAL};