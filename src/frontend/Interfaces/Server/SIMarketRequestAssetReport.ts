
export interface SIMarketRequestSingleAssetReport {
  typeID: number;
  itemName: string;
  quantityInAssets: number;
  quantity: number;
}

export type SIMarketRequestAssetReport = SIMarketRequestSingleAssetReport[];
