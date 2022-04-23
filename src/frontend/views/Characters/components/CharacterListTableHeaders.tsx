import {IColumn} from "../../../components/Table/interfaces";
import {formatTime} from "../../../utils/formatTime";

export const CHAR_NAME: IColumn = {
  name: 'Name',
  calcColumnValue: (row) => {
    return row.charName;
  }
}

export const CORP_NAME: IColumn = {
  name: 'Corp',
  calcColumnValue: (row) => {
    return row.corporationName;
  }
}

export const CREDITS: IColumn = {
  name: 'Credits',
  calcColumnValue: (row) => {
    return row.creditBalance;
  }
}

export const ISK: IColumn = {
  name: 'ISK',
  calcColumnValue: (row) => {
    return row.walletBalance;
  }
}

export const CORP_ISK: IColumn = {
  name: 'Corp ISK',
  calcColumnValue: (row) => {
    return row.totalCorporationBalance;
  }
}

export const CORP_PERM: IColumn = {
  name: 'Corp Perm.',
  calcColumnValue: (row) => {
    return row.gaveCorporationPermission;
  }
}

export const REFRESH_TOKEN_FAILURES: IColumn = {
  name: 'Ref. Tok. Fails',
  calcColumnValue: (row) => {
    return row.failedRefreshTokenAttempts;
  }
}

export const LAST_SEEN: IColumn = {
  name: 'Last Seen',
  calcColumnValue: (row) => {
    return row.lastSeen ? formatTime(row.lastSeen) : 'Unknown';
  }
}

export const REGISTRATION_DATE: IColumn = {
  name: 'Reg. Date',
  calcColumnValue: (row) => {
    return row.registrationDate ? formatTime(row.registrationDate) : 'Unknown';
  }
}

export const LAST_HYDRATION: IColumn = {
  name: 'Hydration',
  calcColumnValue: (row) => {
    return row.lastSuccessfulHydration ? formatTime(row.lastSuccessfulHydration) : 'Unknown';
  }
}

export const LAST_FAILED_HYDRATION: IColumn = {
  name: 'Failed Hydration',
  calcColumnValue: (row) => {
    return row.lastFailedHydration ? formatTime(row.lastFailedHydration) : 'Unknown';
  }
}