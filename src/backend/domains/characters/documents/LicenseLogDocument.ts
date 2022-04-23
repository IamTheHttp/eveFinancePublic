import MongoClient from "mongodb";

class LicenseLogDocument {
  _id?: MongoClient.ObjectID;
  date: Date;
  characterID: number;
  ISKPaid: number;
  licenseName: string;
  licenseID: MongoClient.ObjectID;
  message: string;
}


export {LicenseLogDocument}