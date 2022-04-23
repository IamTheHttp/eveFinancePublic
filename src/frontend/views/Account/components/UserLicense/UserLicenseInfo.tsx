import React from "react";
import {LicenseDocument} from "../../../../../backend/domains/licenses/data/LicenseDocument";

function UserLicenseInfo(props: {selectedLicense:LicenseDocument, showBuyBtn:boolean, onBuyClick:() => void}) {
  const selectedLicense = props.selectedLicense;
  const showBuyBtn = props.showBuyBtn;
  const onBuyClick= props.onBuyClick;

  return (
    selectedLicense && <div className='user-select-license__lic-info'>
      <div><span className='user-licence-label'>Name:</span><span>{selectedLicense.name}</span></div>
      <div><span className='user-licence-label'>Price:</span><span>{selectedLicense.priceInMillions}M ISK</span>
      </div>
      <div><span className='user-licence-label'>Duration:</span><span>{selectedLicense.durationInDays} Days</span>
      </div>
      <div><span className='user-licence-label'>Max Characters:</span><span>{selectedLicense.maxCharacters}</span>
      </div>
      <div><span
        className='user-licence-label'>Include corporation:</span><span>{selectedLicense.includeCorporations ? 'Yes' : 'No'}</span>
      </div>
      {showBuyBtn && <button
        className='btn btn-success'
        onClick={() => {
          onBuyClick()
        }}
      >Buy</button>}
    </div>
  )
}

export {UserLicenseInfo}