import React, {useEffect, useState,} from "react";
import fetchData from "../../../../utils/fetchData";
import Table from "../../../../components/Table/Table";
import {
  CharacterID, LastSeenDate, licenseID,
  PurchaseDate
} from "./TableHeaders/LicensesListTableHeaders";

// Todo find a better place to put this interface?
export interface ILicenseLogData {
  ISKPaid: number;
  characterCorp: string;
  characterID: number;
  characterName: string;
  date: string;
  licenseID: string;
  licenseName: string;
  message: string;
  _id: string;
}


function LicenseLogsView() {
  const [licenses, setLicenseLogs] = useState<ILicenseLogData[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetchData<ILicenseLogData[]>('admin/licenseLogs');
      setLicenseLogs(res.data);
    })()

  }, []);

  return (
    <div>
      <Table
        data={licenses}
        hideSummary={true}
        columns={[
          CharacterID,
          'characterName',
          'characterCorp',
          LastSeenDate,
          'ISKPaid',
          PurchaseDate,
          licenseID,
          'licenseName',
          'message',
        ]}/>
    </div>
  )
}

export {LicenseLogsView}