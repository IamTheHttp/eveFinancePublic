import {IColumn} from "../../components/Table/interfaces";
import {CopyValueToClipboard} from "../../components/CopyValueToClipboard/CopyValueToClipboard";
import {IParsedMarketItem} from "./interfaces/interfaces";
import {
  SIMarketRequestSingleAssetReport
} from "../../Interfaces/Server/SIMarketRequestAssetReport";
import {EditableValue} from "../../components/Forms/EditableValue";
import React from "react";
import postData from "../../utils/postData";
import {ENDPOINTS} from "../../../sharedInterfaces/ApiSystemInteraces";

require('../../Interfaces/Server/SIMarketRequestAssetReport');

export const ASSETS_ITEM_NAME: IColumn = {
  name: 'Item',
  calcColumnValue: (row: IParsedMarketItem) => {
    return CopyValueToClipboard({value: row.itemName})
  }
}

export const ITEM_NAME: IColumn = {
  name: 'Item',
  calcColumnValue: (row: IParsedMarketItem) => {
    const HAS_ENOUGH_TO_STOCK = (row.onTheMarket + row.quantityInAssets) >= row.targetStockInSystem;
    const SYSTEM_IS_STOCKED = row.onTheMarket >= row.targetStockInSystem;
    const CANNOT_STOCK_SYSTEM = !HAS_ENOUGH_TO_STOCK;

    let classNames = '';

    if (SYSTEM_IS_STOCKED) {
      classNames = 'stockitem full-stock';
    } else if (HAS_ENOUGH_TO_STOCK) {
      classNames = 'stockitem can-stock';
    } else if (CANNOT_STOCK_SYSTEM) {
      classNames = 'stockitem cannot-stock'
    }

    return CopyValueToClipboard({value: row.itemName, classNames})
  }
}

export const STOCK_NEEDED: IColumn = {
  name: 'Available / Needed',
  getClassName: (row: SIMarketRequestSingleAssetReport) => {
    return row.quantity <= row.quantityInAssets ? 'isk-positive-cell' : 'isk-negative-cell';
  },
  calcColumnValue: (row: SIMarketRequestSingleAssetReport) => {
    return `${row.quantityInAssets} / ${row.quantity}`
  }
}

export const SYSTEM: IColumn = {
  name: 'System',
  calcColumnValue: (row: IParsedMarketItem) => {
    return row.systemName;
  }
}

export const MARKET_TARGET: IColumn = {
  name: 'Selling / Target',
  style: {
    maxWidth: '150px'
  },
  calcColumnValue: (row: IParsedMarketItem, onChange) => {
    return (<div><span>{row.onTheMarket}</span> / <EditableValue
      initialValue={row.targetStockInSystem}
      onChange={async (newValue: number) => {
        const res = await postData<ENDPOINTS["auth/marketStock/:typeID"]>(`auth/marketStock/${row.typeID}`, {
          quantity: +newValue,
          systemID: row.systemID,
          typeID: row.typeID
        });

        if (res.errorID === 0) {
          onChange({
            quantity: +newValue,
            systemID: row.systemID,
            typeID: row.typeID
          });
        } else {
          // TODO error
        }
      }}
    /></div>)
  }
}
