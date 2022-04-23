import {IColumn} from "../../../../../components/Table/interfaces";
import {formatTime} from "../../../../../utils/formatTime";
import {ShortifyText} from "../../../../../components/ShortifyText/ShortifyText";

export const CharacterID: IColumn = {
  name: 'CharID',
  calcColumnValue: (row) => {
    return row.characterID && row.characterID.toString();
  }
}

export const PurchaseDate: IColumn = {
  name: 'Date',
  calcColumnValue: (row) => {
    return formatTime(row.date);
  }
}

export const licenseID: IColumn = {
  name: 'LicenseID',
  calcColumnValue: (row) => {
    return ShortifyText({value: row.licenseID})
  }
}

export const LastSeenDate: IColumn = {
  name: 'Last seen',
  calcColumnValue: (row) => {
    if (!row.characterLastSeen) {
      return 'unknown'
    }
    return formatTime(row.characterLastSeen);
  }
}