import {IParsedMarketItem} from "../interfaces/interfaces";
import {mapMarketStockRecord} from "./mapMarketStockRecord";
import {SIMarketStockRecord} from "../../../Interfaces/Server/SIMarketStockRecord";
import {SIMarketRequestAssetReport} from "../../../Interfaces/Server/SIMarketRequestAssetReport";


function sortBySystemAndType(a: IParsedMarketItem, b: IParsedMarketItem) {
  if (a.systemName === b.systemName) {
    if (a.itemName < b.itemName) {
      return -1;
    }
    if (a.itemName > b.itemName) {
      return 1;
    }
  }

  if (a.systemName < b.systemName) {
    return -1;
  }
  if (a.systemName > b.systemName) {
    return 1;
  }
  return 0;
}

export function getMarketStock(plannedMarketStocks: SIMarketStockRecord[], itemsInAssets: SIMarketRequestAssetReport) {
  return plannedMarketStocks.filter((r) => {
    // Ensure we have the right fields, filter out malformed data
    // this should never occur, but is added as a failsafe
    return r.solarSystem && r.systemID && r.solarSystem && r.itemsInMarket && r.quantity
  }).map((item) => {
    return mapMarketStockRecord(item, itemsInAssets);
  }).sort(sortBySystemAndType);
}