import DBTable from "../../../dataSources/DAL/DbTable";
import {LicenseDocument} from "./LicenseDocument";
import MongoClient from "mongodb";
import {createLicenseAggregate} from "../aggregates/createLicenseAggregate";

class LicensesDAL extends DBTable<LicenseDocument> {
  constructor(dbConnection?: MongoClient.Db) {
    super('licenses', dbConnection);
  }

  /**
   * Clears all of the licenses that contain isTrial
   */
  async clearIsTrial() {
    await this.getTable().updateMany({
      isTrial: true,
    }, {
      $set: {
        isTrial: false,
      }
    }, {
      // upsert: true
    })
  };

  async getByID(id: string | MongoClient.ObjectId) {
    const data = await this.getByKey('_id', new MongoClient.ObjectId(id));

    return await createLicenseAggregate(data[0]);
  }

  async getTrialLicense() {
    const data = await this.getByKey('isTrial', true);

    // do nothing if nothing was found
    if (data[0]) {
      return await createLicenseAggregate(data[0]);
    } else {
      return await createLicenseAggregate();
    }
  }

  async deleteByID(id: string | MongoClient.ObjectId) {
    let idToDel: MongoClient.ObjectId;
    if (typeof id === 'string') {
      idToDel = new MongoClient.ObjectId(id)
    } else {
      idToDel = id;
    }

    return await this.deleteByKey('_id', idToDel);
  }

}


export {LicensesDAL}