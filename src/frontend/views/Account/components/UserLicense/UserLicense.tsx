import React, {useContext} from 'react';
import {useEffect, useState} from "react";
import fetchData from "../../../../utils/fetchData";
import {LicenseDocument} from "../../../../../backend/domains/licenses/data/LicenseDocument";
import './UserLicense.scss';
import {ConfirmLicensePurchase} from "./ConfirmLicensePurchase";
import {UserLicenseSelect} from "./UserLicenseSelect";
import {UserLicenseInfo} from "./UserLicenseInfo";
import postData from "../../../../utils/postData";
import {UserContext} from "../../../../components/IsLoggedIn";
import {IUserLicensePostResponse} from "../../../../../backend/domains/licenses/api/interfaces/IUserLicensePostResponse";
import {ILicensesGetResponse} from "../../../../../backend/domains/licenses/api/interfaces/ILicensesGetResponse";

require('../../../../../backend/domains/licenses/api/interfaces/IUserLicensePostResponse');

async function postNewLicense(licenseID: string) {
  return await postData<IUserLicensePostResponse>('secure/license', {
    licenseID
  });
}


function UserLicense() {
  const userState = useContext(UserContext);

  const [licenses, setLicenses] = useState<LicenseDocument[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<LicenseDocument>(null);
  const [showConfirmBuy, setShowConfirmBuy] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const serverLicensesData = await fetchData<ILicensesGetResponse>('public/licenses');
      setLicenses(serverLicensesData.data);
    })();
  }, []);

  return (
    <div className='user-select-license'>
      <div>
        <UserLicenseSelect licenses={licenses} onChange={(selectedLicense) => {
          setSelectedLicense(selectedLicense)
        }}/>
        <UserLicenseInfo selectedLicense={selectedLicense} showBuyBtn={!showConfirmBuy} onBuyClick={() => {
          setShowConfirmBuy(true)
        }}/>
        <ConfirmLicensePurchase showConfirmBuy={showConfirmBuy} confirm={async (confirmed) => {
          // if false, we close the popup
          if (confirmed) {
            const response = await postNewLicense(selectedLicense._id.toString());

            if (response.error) {
              alert(response.error);
            }

            if (!response.error) {
              userState.$$setCharState({
                ...userState,
                status: 'premium',
                creditBalance: userState.creditBalance - response.data.priceInMillions * 1000000,
                licenseExpirationDate: new Date(response.data.licenseExpirationDate)
              });
            }
          }
          setShowConfirmBuy(false);
        }}/>
      </div>
    </div>
  );
}

export {UserLicense}