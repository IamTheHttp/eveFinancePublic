import {IParsedMarketItem} from "../interfaces/interfaces";
import {SIMarketStockRecord} from "../../../Interfaces/Server/SIMarketStockRecord";
import {SIMarketRequestAssetReport} from "../../../Interfaces/Server/SIMarketRequestAssetReport";
// Stupid import for hot module reloading
require("../../../Interfaces/Server/SIMarketStockRecord");

export function mapMarketStockRecord(itemStockRequest: SIMarketStockRecord, itemsInAssets: SIMarketRequestAssetReport): IParsedMarketItem {
  const quantityInAssets = itemsInAssets.find((itemInAssets) => { return itemInAssets.typeID === itemStockRequest.typeID}).quantityInAssets || 0

  return {
    quantityInAssets,
    typeID: itemStockRequest.typeID,
    systemID: itemStockRequest.systemID,
    systemName: itemStockRequest.solarSystem.solarSystemName,
    itemName: itemStockRequest.item.typeName,
    targetStockInSystem: itemStockRequest.quantity,
    onTheMarket: itemStockRequest.itemsInMarket.reduce((acc, marketOrder) => {

      // Only include stock from the same system
      if (itemStockRequest.solarSystem.solarSystemID === marketOrder.marketOrderSolarSystemID) {
        return acc + marketOrder.volume_remain;
      } else {
        return acc;
      }
    }, 0)
  }
}
