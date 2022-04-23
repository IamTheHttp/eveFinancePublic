import MongoClient from 'mongodb';


function getDefaultFields() {
  return {
    durationInDays: 0,
    includeCorporations: false,
    isTrial: true,
    maxCharacters: 1,
    name: '',
    priceInMillions: 500,
    createdDate: new Date(),
  }
}

class LicenseDocument {
  _id?: MongoClient.ObjectID;
  durationInDays: number;
  includeCorporations: boolean;
  isTrial: boolean;
  maxCharacters: number;
  name: string;
  priceInMillions: number;
  createdDate?: Date;

  constructor() {
    Object.assign(this, getDefaultFields())
  }
}

export {LicenseDocument}