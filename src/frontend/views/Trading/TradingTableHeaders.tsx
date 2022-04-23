import {IColumn} from "../../components/Table/interfaces";
import {CopyValueToClipboard} from "../../components/CopyValueToClipboard/CopyValueToClipboard";
import {IGroupedTXRecord} from "../../../backend/domains/reports/data/ReportsDAL";



export const TYPE_NAME: IColumn = {
  name: 'Name',
  calcColumnValue: (row) => {
    return CopyValueToClipboard({value: row.typeName})
  }
}

export const Q_BUY: IColumn = {
  name: 'Bought',
  calcColumnValue: (row:IGroupedTXRecord) => {
    return row.boughtUnits
  }
}

export const Q_SELL: IColumn = {
  name: 'Sold',
  calcColumnValue: (row:IGroupedTXRecord) => {
    return row.soldUnits
  }
}

export const AVG_BUY: IColumn = {
  name: 'Avg. Buy',
  calcColumnValue: (row:IGroupedTXRecord) => {
    return row.avgBuyValue
  }
}

export const AVG_SELL: IColumn = {
  name: 'Avg. Sell',
  calcColumnValue: (row:IGroupedTXRecord) => {
    return row.avgSellValue
  }
}

export const GROSS_PROFIT: IColumn = {
  name: 'Gross Profit',
  calcColumnValue: (row:IGroupedTXRecord) => {
    return row.grossProfit
  }
}

export const PROFIT_MARGINS: IColumn = {
  name: 'Profit margin',
  getClassName() {
    return 'text-right';
  },
  calcColumnValue: (row: IGroupedTXRecord) => {
    return `${Math.floor(row.profitMargins * 100)}%`
  }
}