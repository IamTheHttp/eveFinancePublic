import React, {useEffect, useState,} from "react";
import fetchData from "../../../../utils/fetchData";
import {ILicensesGetResponse} from "../../../../../backend/domains/licenses/api/interfaces/ILicensesGetResponse";
import Table from "../../../../components/Table/Table";
import {createdDateHeader, includeCorporationsHeader, isTrialHeader} from "./TableHeaders/LicensesListTableHeaders";
import deleteData from "../../../../utils/deleteData";
import {IDataDeletedSuccessResponse} from "../../../../../backend/server/IDataDeletedSuccessResponse";
import {LicenseDocument} from "../../../../../backend/domains/licenses/data/LicenseDocument";


function ListLicenses() {
  const [licenses, setLicenses] = useState<LicenseDocument[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetchData<ILicensesGetResponse>('public/licenses');
      setLicenses(res.data);
    })()

  }, []);

  return (
    <div>
      <Table
        data={licenses}
        hideSummary={true}
        $actions={[{
          name: 'delete',
          cb: async (row) => {
            const {data, error, errorID} = await deleteData<IDataDeletedSuccessResponse>(`admin/licenses/${row._id}`);
            if (!errorID && data.deleted) {
              const newLicenses = licenses.filter((lic) => {
                return lic._id !== row._id;
              });

              setLicenses(newLicenses);
            }
          }
        }]}
        columns={[
          'name',
          createdDateHeader,
          'durationInDays',
          'priceInMillions',
          'maxCharacters',
          isTrialHeader,
          includeCorporationsHeader
        ]}/>
    </div>
  )
}

export {ListLicenses}