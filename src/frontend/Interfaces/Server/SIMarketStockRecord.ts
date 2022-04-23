export interface SIMarketStockRecord {
  systemID: number;
  typeID: number;
  apiCharID: number;
  quantity: number;
  item: {
    typeName: string
  },
  solarSystem: {
    solarSystemName: string;
    solarSystemID: number
  },
  itemsInMarket: {
    volume_remain: number;
    volume_total: number;
    apiCharID: number;
    marketOrderSolarSystemID: number;
    type_id: number;
  }[]
}