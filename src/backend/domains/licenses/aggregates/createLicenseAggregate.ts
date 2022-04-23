import {LicenseAggregate} from "./LicenseAggregate";
import {LicenseDocument} from "../data/LicenseDocument";
import {LicensesDAL} from "../data/LicensesDAL";
import MongoClient from "mongodb";


async function createLicenseAggregate(licenseData?:  LicenseDocument): Promise<LicenseAggregate>
async function createLicenseAggregate(licID?: string | MongoClient.ObjectId): Promise<LicenseAggregate>
async function createLicenseAggregate(dataOrID?: string | MongoClient.ObjectId | LicenseDocument): Promise<LicenseAggregate> {
  const licAgg = new LicenseAggregate()

  if (typeof dataOrID === 'string' || dataOrID instanceof MongoClient.ObjectId) {
    const dal = new LicensesDAL()
    return await dal.getByID(dataOrID);
  }

  if (typeof dataOrID === 'object') {
    licAgg.setFields(dataOrID);
    return licAgg;
  }

  return licAgg;
}

export {createLicenseAggregate}