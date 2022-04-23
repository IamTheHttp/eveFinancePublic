import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IAssetDocument {
  item_id : number;
  apiCharID : number;
  is_singleton : boolean;
  location_flag : string;
  location_id : number;
  location_type : string;
  quantity : number;
  type_id : number;
}

class AssetsDAL extends DBTable<IAssetDocument> {
  constructor(dbConnection: MongoClient.Db) {
    super('assets', dbConnection);
  }
}

export {AssetsDAL};