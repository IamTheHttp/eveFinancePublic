import {publicConfig} from "../../config/publicConfig";
import {AbstractCache} from "./AbstractCache";

class MemBasedCache extends AbstractCache {
  private map: Map<string, { lastAccess: any, data: any }>;

  constructor() {
    super();
    this.map = new Map();
  }

  addItem(key: string, value: any) {
    if (this.map.size < 500) {
      this.map.set(key, {lastAccess: Date.now(), data: value});
    }

    setTimeout(() => {
      this.destroyItem(key);
    }, publicConfig.ITEM_TYPE_SEARCH_CACHE_DURATION_MIN * 1000 * 60)
  }

  destroyItem(key: string) {
    this.map.delete(key);
  }

  hasItem(key: string) {
    return this.map.has(key);
  }

  getItem(key: string) {
    const item = this.map.get(key);
    if (item) { // extra safety
      item.lastAccess = Date.now();
      this.map.set(key, item);
      return item.data;
    }
  }
}

export {MemBasedCache};