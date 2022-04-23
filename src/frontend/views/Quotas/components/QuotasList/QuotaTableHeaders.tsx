import {formatTime} from "../../../../utils/formatTime";
import {IColumn} from "../../../../components/Table/interfaces";
import React from "react";
import {CopyValueToClipboard} from "../../../../components/CopyValueToClipboard/CopyValueToClipboard";


export const MATERIAL_NAME: IColumn = {
  name: 'Name',
  calcColumnValue: (row) => {
    return CopyValueToClipboard({value: row.materialName})
  }
}

export const TYPE_NAME: IColumn = {
  name: 'Name',
  calcColumnValue: (row) => {
    return CopyValueToClipboard({value: row.typeName})
  }
}

export const AMOUNT: IColumn = {
  name: 'Plan',
  calcColumnValue: (row) => {
    return row.amount;
  }
}

export const CREATED_DATE: IColumn = {
  name: 'Date',
  calcColumnValue: (row) => {
    if (row.SUMMARY) {
      return '';
    }
    return formatTime(new Date(row.createdDate));
  }
}

export const MATERIALS_TO_BUY: IColumn = {
  name: 'To Buy',
  calcColumnValue: (row) => {
    return row.neededForAllQuotas - row.quantityInAssets;
  }
}

export const COMPLETION_DATE: IColumn = {
  name: 'Completed',
  calcColumnValue: (row) => {
    if (row.SUMMARY) {
      return '';
    }
    return formatTime(new Date(row.completionDate));
  }
}


export const LEFT_TO_BUILD: IColumn = {
  name: 'Remaining',
  calcColumnValue: (row) => {
    return row.amount - row.runsDoneAndInProgress;
  }
};


export const PERCENT_DONE: IColumn = {
  name: '% Done',
  calcColumnValue: (row) => {
    return row.runsDoneAndInProgress * 100 / row.amount;
  }
}


export function calcLeftToBuild(row: any) {
  return row.amount - row.runsDoneAndInProgress;
}

export function calcMissingBpcInStock(row: any) {
  return calcLeftToBuild(row) - row.availableBPCRunsNet;
}

export function calcMissingBpcAfterResearch(row: any) {
  return calcMissingBpcInStock(row) - row.newBpcInProgress;
}


export const MISSING_BPC_RUNS: IColumn = {
  name: 'Blueprints',
  getClassName: (row) => {
    const leftToBuild = calcLeftToBuild(row);
    const missingBpcInStock = calcMissingBpcInStock(row)
    const missingBpcAfterResearch = calcMissingBpcAfterResearch(row)

    const hasEnoughInCurrentStock = row.bpoCount || missingBpcInStock <= 0;

    if (hasEnoughInCurrentStock) {
      return 'enough-bpc--ok';
    } else {
      const hasEnoughWithResearchJobs = missingBpcAfterResearch <= 0

      if (hasEnoughWithResearchJobs) {
        return 'enough-bpc--warn'
      } else {
        return 'enough-bpc--error'
      }
    }
  },
  calcColumnValue: (row) => {
    const missingBPCRunsInStock = Math.max(calcMissingBpcAfterResearch(row), 0)

    if (row.bpoCount) {
      return (
        <div style={{fontSize: '0.8rem'}}>
          <div>BPO:{row.bpoCount}</div>
        </div>
      )
    } else {
      return (
        <div style={{fontSize: '0.8rem'}}>
          <div>Runs Avail:{row.availableBPCRuns}</div>
          <div>In Research:{Math.floor(row.newBpcInProgress)}</div>
          <div style={{textDecoration: 'underline'}}>Missing runs: {Math.round(missingBPCRunsInStock)}</div>
        </div>
      )
    }
  }
};