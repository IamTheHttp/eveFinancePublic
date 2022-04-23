// TODO designate SERVER interfaces accordingly
import {SIEveMarketItem} from "../../../Interfaces/Server/SImarketItem";
import {SIMarketRequestAssetReport} from "../../../Interfaces/Server/SIMarketRequestAssetReport";

export interface IParsedMarketItem {
  typeID: number,
  systemID: number,
  systemName: string,
  itemName: string,
  targetStockInSystem: number,
  onTheMarket: number
  quantityInAssets: number;
}

export interface SIEveMarketItemResponse  {
  exactMatch: SIEveMarketItem[],
  search: SIEveMarketItem[]
}

export interface SIEveRegion {
  regionName: string;
  regionID: number;
}

export interface SIEveSystem {
  solarSystemName: string;
  regionID: number;
  constellationID: number;
  solarSystemID: number;
}

export interface MarketViewIState {
  lastFetchRequest: Date,
  eveRegionSystems: SIEveSystem[],
  eveRegions: SIEveRegion[],
  eveMarketItems: SIEveMarketItem[],
  exactMatchItem:SIEveMarketItem;
  selectedRegion: SIEveRegion | null;
  selectedSystem: SIEveSystem | null;
  selectedQuantity: number;
  marketStock: IParsedMarketItem[],
  marketRequestsAssetReport:SIMarketRequestAssetReport;
}


