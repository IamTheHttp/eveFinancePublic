require("../interfaces/interfaces");
import {MarketViewIState} from "../interfaces/interfaces";

export function getInitial(): MarketViewIState {
  return {
    lastFetchRequest: new Date(), // TODO find a better name :)
    eveRegionSystems: [],
    eveRegions: [],
    eveMarketItems: [],
    exactMatchItem: null,
    marketStock: [],
    marketRequestsAssetReport:[],
    // Fields for adding a new row
    selectedSystem: null,
    selectedRegion: {
      regionName: null,
      regionID: 0
    },
    selectedQuantity: 0
  }
}
