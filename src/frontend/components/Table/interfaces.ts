import {CSSProperties, ReactNode} from "react";

export type IColumn = {
  getClassName?:(row:any) => string,
  calcColumnValue: (row:any, onChange?: (e:any) => void) => string|number| ReactNode,
  style?: CSSProperties
  name: string,
  decimals?: number;
} | string;

export type ITableData = Record<any, any>[];

export interface ITableProps {
  onChange?: (e:any) => void;
  data: ITableData,
  columns: IColumn[],
  HideColumnTitles?: boolean;
  hideSummary?: boolean;
  $actions?: [{
    name: string,
    cb: (a: any) => void
  }]
}
