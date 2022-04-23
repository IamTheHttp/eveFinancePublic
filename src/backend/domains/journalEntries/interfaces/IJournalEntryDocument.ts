import MongoClient from "mongodb";

export interface IJournalEntryDocument {
  __processed: boolean;
  _id : MongoClient.ObjectId,
  amount : number,
  balance : number,
  date : string, // still a string in the database
  description : string,
  first_party_id : number,
  id : number,
  reason : string,
  ref_type : string,
  second_party_id : number,
  context_id: number,
  context_id_type: string
}