import MongoClient, {FilterQuery} from 'mongodb';
import {connectMongo} from "../../mongoConnect";

interface IJoinOptions {
  select: string[],
  where: {[key:string]: string|number};
  from: string;
  thisField: string;
  thatField:string;
  as: string;
}

class DBTable<T> {
  public mainTableName: string;
  db: MongoClient.Db;
  index: Record<string, any>;

  constructor(mainTableName: string, db?: MongoClient.Db) {
    // @ts-ignore
    // This is memoized after being called first in index.ts in the backend
    this.db = connectMongo.db;
    this.mainTableName = mainTableName;
  }

  toObjectID(val:string) {
    return new MongoClient.ObjectId(val);
  }

  async createIndex(idx: Record<string, any>, unique = true) {
    this.index = idx;
    await this.getTable().createIndex(this.index, {unique})
  }

  getTable() {
    return this.db.collection(this.mainTableName);
  }

  async deleteWhere(condition: Record<string, any>) {
    if (condition._id) {
      condition._id = new MongoClient.ObjectID(condition._id);
    }
    return this.getTable().deleteMany({
      ...condition
    })
  }

  async setup(setupOptions: { uniqueKeys?: string[] } = {}) {
    await this.db.createCollection(this.mainTableName);
    if (setupOptions.uniqueKeys) {
      let idx:any = {};
      for (let i = 0; i < setupOptions.uniqueKeys.length; i++) {
        idx[setupOptions.uniqueKeys[i]] = 1;
      }

      if (Object.keys(idx).length) {
        await this.createIndex(idx);
      }
    }
  }

  async insert(record: Partial<T>) {
    return await this.getTable().insertOne( record);
  }

  async upsert(record: Partial<T> & {_id?:MongoClient.ObjectId}): Promise<string> {
    let filter:Partial<T> & { _id?: MongoClient.ObjectId} = {};
    // If we have an index, we upsert by the indices
    if (this.index) {
      Object.keys(this.index).forEach((key) => {
        const k = key as keyof T;
        filter[k] = record[k];
      });
      // if no index, lets see if we have a _id present (Are we saving or are we updating?)
    } else if (record._id) {
      filter._id = record._id
    }

    // If we have any filter
    if (Object.keys(filter).length) {
      const res = await this.getTable().updateOne(filter, {
        $set: {...record}
      }, {
        upsert: true
      });

      return res?.upsertedId?._id?.toString() || '';
    } else {
      const res = await this.insert(record);
      return res.insertedId;
    }
  }

  async upsertMany(records: any[]) {
    let ops = records.map((record: any) => {
      let filter:any = {};
      Object.keys(this.index || {}).forEach((key) => {
        filter[key] = record[key];
      });

      return {updateOne: {filter: filter, update: {$set: {...record}}, upsert: true}}
    });

    return await this.getTable().bulkWrite(ops);
  }

  // TODO remove ANY
  async getWhere($find: FilterQuery<T>, project: any = {}): Promise<T[]> {
    return this.getTable().find($find).project(project).toArray();
  }

  // TODO getByKey should allow to return a single item
  async getByKey(keyName: keyof T, keyValue: boolean | string | number | MongoClient.ObjectId, project: any = {}): Promise<T[]> {
    return this.getTable().find({[keyName]: keyValue}).project(project).toArray();
  }

  async getRecent(args = {limit: 50, project: {}}) {
    const {limit, project} = args;
    return this.getTable().find({}).project(project).limit(limit).toArray();
  }

  async getAllData(project: Record<string, any> = {}): Promise<T[]> {
    return this.getTable().find({}).project(project).toArray();
  }

  async join(joinOptions: IJoinOptions) {
    let pipeline:any[] = [
      { $match:joinOptions.where},
      {$lookup:{
          from: joinOptions.from,
          localField: joinOptions.thisField,
          foreignField: joinOptions.thatField,
          as: joinOptions.as
        }
      },
      {$unwind: `$${joinOptions.as}`},
    ];

    if (joinOptions.select.length) {
      let select:Record<string, number> = {};

      joinOptions.select.forEach((field) => {
        select[field] = 1;
      });
      pipeline.push({$project: {...select}});
    }

    return this.getTable().aggregate(pipeline).toArray();
  }

  async deleteByKey(keyName: keyof T, keyValue: string | number | MongoClient.ObjectId) {
    return await this.getTable().deleteMany({[keyName]: keyValue});
  }

  updateByKey(keyName: string) {

  }
}

export default DBTable;
