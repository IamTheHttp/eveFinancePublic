import MongoClient from "mongodb";
import {secureConfig} from "../config/secureConfig";

export const uri = secureConfig.MONGO_URI;

/**
 * Return a singleton mongodb connection, this function is memoized - only a single db connection is created
 * @param dbName
 */
async function connectMongo(dbName?: string) {
  // TODO we might want to switch away from async so we can return primitive values
  //   - This looks like a code smell (connectMongo() and connectMongo.db)
  if (connectMongo.db) {
    return {
      db : connectMongo.db,
      client : connectMongo.client
    }
  }

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const db = client.db(dbName || secureConfig.DB_NAME);

  connectMongo.client = client;
  connectMongo.db = db;

  return {
    db,
    client
  }
}

namespace connectMongo {
  export var db : MongoClient.Db;
  export var client : MongoClient.MongoClient;
}

export {connectMongo}
