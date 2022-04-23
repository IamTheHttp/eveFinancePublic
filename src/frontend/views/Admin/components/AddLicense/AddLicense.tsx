import React, {useState} from 'react';
import {LicenseForm} from "./LicenseForm";
import postData from "../../../../utils/postData";
import {IDataSavedSuccessResponse} from "../../../../../backend/server/IDataSavedSuccessResponse";

function AddLicense() {
  const [showAddLicenseForm, setShowAddLicense] = useState(false);

  return (
    <div>
      <div>
        License types:
        <button onClick={() => {
          setShowAddLicense(true)
        }}>Add license</button>
      </div>
      <div>
        {showAddLicenseForm && <LicenseForm
          onCancel={() => {
            setShowAddLicense(false);
          }}
          onSubmit={async (data) => {
            setShowAddLicense(false);
            await postData<IDataSavedSuccessResponse>('admin/licenses', data);
          }}/>}
      </div>
      <div>
        System Licenses
      </div>
    </div>
  )
}

export {AddLicense};