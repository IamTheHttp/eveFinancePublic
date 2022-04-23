import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";

export interface ITransactionDocument {
  _id : MongoClient.ObjectId,
  apiCharID: number,
  client_id : number,
  date : string,
  is_buy : boolean,
  is_personal : boolean,
  journal_ref_id : number,
  location_id : number,
  quantity : number,
  transaction_id : number,
  type_id : number,
  unit_price : number
}

class TransactionsDAL extends DBTable<ITransactionDocument> {
  constructor(dbConnection: MongoClient.Db) {
    super('transactions', dbConnection);
  }
}

export {TransactionsDAL};