import {IColumn} from "../../../../../components/Table/interfaces";
import {formatTime} from "../../../../../utils/formatTime";

export const isTrialHeader: IColumn = {
  name: 'is trial',
  getClassName: () => {
    return 'text-center'
  },
  calcColumnValue: (row) => {
    return row.isTrial.toString();
  }
}

export const includeCorporationsHeader: IColumn = {
  name: 'include corporations',
  getClassName: () => {
    return 'text-center'
  },
  calcColumnValue: (row) => {
    return row.includeCorporations.toString();
  }
}

export const createdDateHeader: IColumn = {
  name: 'Created Date',
  calcColumnValue: (row) => {
    return formatTime(row.createdDate);
  }
}
