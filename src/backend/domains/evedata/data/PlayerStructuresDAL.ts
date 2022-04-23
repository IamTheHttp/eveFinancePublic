import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

interface IPlayerStructureDocument {
  "name" : string,
  "owner_id" : number,
  "position" : {
    "x" : number,
    "y" : number,
    "z" : number
  },
  "solar_system_id" : number,
  "type_id" : number,
  "structureID" : number
}

export {IPlayerStructureDocument}

class PlayerStructuresDAL extends DBTable<IPlayerStructureDocument> {
  constructor(dbConnection: MongoClient.Db) {
    super('playerStructures', dbConnection);
  }
}

export {PlayerStructuresDAL}
