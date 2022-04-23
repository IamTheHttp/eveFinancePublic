import React, {useState} from "react";
import './LicenseForm.scss'
import {ILicensePostRequestData} from "../../../../../backend/domains/licenses/api/interfaces/ILicensePostRequestData";

interface IProps {
  onCancel:() => void,
  onSubmit:(licenseData: ILicensePostRequestData) => void
}

function LicenseForm(props: IProps) {
  const [licenseName, setLicenseName] = useState('Just a name');
  const [licensePriceInMillions, setLicensePriceInMillions] = useState(500);
  const [licensedurationInDays, setLicensedurationInDays] = useState(30);
  const [licenseMaxCharacters, setLicenseMaxCharacters] = useState(1);
  const [licenseCorporateCheck, setLicenseCorporateCheck] = useState(false);
  const [licenseIsTrial, setLicenseIsTrial] = useState(false);

  return (
    <div className='license-form'>
      <div>
        <label className='license-form__label'>Name</label> &nbsp;
        <input value={licenseName} type='text' onChange={(e) => {
          setLicenseName(e.target.value);
        }}/>
      </div>
      <div>
        <label className='license-form__label'>License Price</label> &nbsp;
        <input value={licensePriceInMillions} type='number' onChange={(e) => {
          setLicensePriceInMillions(Math.max(+e.target.value, 1));
        }}/>
      </div>
      <div>
        <label className='license-form__label'>License duration</label> &nbsp;
        <input value={licensedurationInDays} type='number' onChange={(e) => {
          setLicensedurationInDays(Math.max(+e.target.value, 1));
        }}/>
      </div>
      <div>
        <label className='license-form__label'>Max Characters</label> &nbsp;
        <input value={licenseMaxCharacters} type='number' onChange={(e) => {
          setLicenseMaxCharacters(Math.max(+e.target.value, 1));
        }}/>
      </div>
      <div>
        <label className='license-form__label'>Includes corporations</label>&nbsp;
        <input type='checkbox' onChange={(e) => {
          setLicenseCorporateCheck(e.target.checked);
        }}/>
      </div>
      <div>
        <label className='license-form__label'>Set as trial </label>&nbsp;
        <input type='checkbox' onChange={(e) => {
          setLicenseIsTrial(e.target.checked);
        }}/>
      </div>
      <div>
        <button className='btn btn-success'
                onClick={() => {
                  props.onSubmit({
                    name: licenseName,
                    priceInMillions: licensePriceInMillions,
                    durationInDays: licensedurationInDays,
                    maxCharacters: licenseMaxCharacters,
                    includeCorporations: licenseCorporateCheck,
                    isTrial: licenseIsTrial
                  });
                }}
        >Submit</button>
        <button className='btn btn-secondary'
                onClick={props.onCancel}
        >cancel</button>
      </div>
    </div>
  )
}

export {LicenseForm}