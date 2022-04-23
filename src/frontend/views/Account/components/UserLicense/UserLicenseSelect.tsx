import React from "react";
import {LicenseDocument} from "../../../../../backend/domains/licenses/data/LicenseDocument";

function UserLicenseSelect(props: {licenses: LicenseDocument[], onChange:(l:LicenseDocument) => void}) {
  const licenses = props.licenses;
  const onChange = props.onChange;

  return (
    <select defaultValue='tmp'
            onChange={(e) => {
              const selectedLic = licenses.find((license) => {
                return license._id.toString() === e.target.value.toString()
              });
              onChange(selectedLic)
            }}
    >
      <option value='tmp' disabled>Select a license</option>
      {licenses.map((license) => {
        if (license.isTrial) {
          return;
        }
        return <option value={license._id.toString()} key={license.name}>{`${license.name} - ${license.priceInMillions}M`}</option>
      }).filter((a) => a)}
    </select>
  )
}

export {UserLicenseSelect}