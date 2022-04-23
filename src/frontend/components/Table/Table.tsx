import * as React from 'react';
import {IColumn, ITableData, ITableProps} from "./interfaces";
import isStrNumber from "./utils/isStrNumber";
import renderVal from "./utils/renderVal";

// Stupid import to force webpack build-on-change
require("./interfaces");


function renderHeader(column: IColumn) {
  if (typeof column === 'string') {
    return (<th key={Math.random()} scope="col">{column}</th>)
  } else {
    return (<th key={Math.random()} scope="col">{column.name}</th>)
  }
}

function renderTableBody(columns: IColumn[], tableData: ITableData, props: ITableProps) {
  const summary: any[] = [];
  const onChange = props.onChange || function(){}

  const tableRowsJSX = tableData.map((row, rowNumber) => {
    return (
      <tr key={Math.random()} className='table-active table__data-row'>

        {columns.map((column: IColumn, headerIndex) => {
          summary[headerIndex] = summary[headerIndex] || 0;
          let cellClassName = '';
          let cellStyle = {};
          let val: any = 0;

          if (typeof column !== "string" && !row.SUMMARY) {
            cellClassName = column.getClassName ? column.getClassName(row) : '';
            cellStyle = column.style ? column.style : {};
          }


          if (column === 'actions') {
            val = props.$actions.map((action) => {
              return <button
                className='btn btn-secondary'
                key={Math.random()}
                onClick={() => {
                  action.cb(row);
                }}>{action.name}</button>
            })
          } else if (column === 'icon') {
            val = <img className='table-icon' src={row[column]}/>
          } else {
            if (typeof column === 'string') {
              val = row[column] ? row[column] : 0;
            } else {
              val = column.calcColumnValue(row, onChange);
            }
          }

          if (headerIndex === 0) {
            summary[0] = 'Total';
          } else {
            if (typeof val === 'number' && !isNaN(val)) {
              summary[headerIndex] += val;
            }
          }

          return <td
            key={Math.random()}
            className={cellClassName}
            style={{textAlign: isStrNumber(val) ? 'right' : 'left', ...cellStyle}}
            scope="col">
            {renderVal(val)}
          </td>
        })}
      </tr>
    )
  });

  if (!props.hideSummary) {
    tableRowsJSX.push(<tr key={Math.random()} className={'table-active table__summary'}>
      {summary.map((val) => {
        return (<td
          key={Math.random()}
          style={{textAlign: isStrNumber(val) ? 'right' : 'left'}}
          scope="col">
          {renderVal(val)}
        </td>)
      })}
    </tr>);
  }
  return tableRowsJSX;
}

function Table<TableRecords>(props: ITableProps) {
  let {data, columns} = props;
  let tableData = data;

  if (!data || data.length === 0) {
    return null;
  }

  if (props.$actions) {
    columns.push('actions');
  }

  return (
    <table className="table-sm table-hover">
      {!props.HideColumnTitles && <thead>
      <tr className='table__head-row'>
        {columns.map(renderHeader)}
      </tr>
      </thead>}
      <tbody>
      {renderTableBody(columns, tableData, props)}
      </tbody>
    </table>
  )
}

export default Table;