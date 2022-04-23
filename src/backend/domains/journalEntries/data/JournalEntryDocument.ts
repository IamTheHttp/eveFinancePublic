import MongoClient from 'mongodb';

class JournalEntryDocument {
  _id?: MongoClient.ObjectID;
  amount: number;
  first_party_id: number;
  id: number;
  context_id: number;
  context_id_type: "market_transaction_id" | string;
  date: string;
  description: string;
  ref_type: "market_transaction" | 'player_donation' | string;
  second_party_id: number;
  __processed : boolean;
  reason: string;
}

export {JournalEntryDocument}