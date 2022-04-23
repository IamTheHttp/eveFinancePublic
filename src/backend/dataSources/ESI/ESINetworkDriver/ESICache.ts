import {ESICacheDAL} from "../../../domains/cache/data/ESICacheDAL";

export interface CacheRecord {
  expires: string;
  etag: string;
}

class ESICache {
  private persistence: ESICacheDAL;
  private readonly memMap:{ [index: string] :CacheRecord; }

  constructor(db: ESICacheDAL) {
    this.persistence = db;
    this.memMap = {};
  }

  async findRecord(cacheKey: string): Promise<CacheRecord | null> {
    return new Promise((resolve, reject) => {
      resolve(this.memMap[cacheKey]);
    });
  }

  addRecord(cacheKey: string, cacheRecord: CacheRecord): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.memMap[cacheKey] = cacheRecord;
      resolve(true);
    });
  }
}

export {ESICache}