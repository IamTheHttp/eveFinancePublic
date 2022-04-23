import DBTable from '../../../dataSources/DAL/DbTable';
import MongoClient from 'mongodb';
import {LicenseLogDocument} from '../documents/LicenseLogDocument';
import {LicenseLogAggregate} from "../../licenses/aggregates/LicenseLogAggregate";
import {ILicenseLogData} from "../../../../frontend/views/Admin/components/LicenseLogsView/LicenseLogsView";


/**
 * The seed of a system-wide query language on DAL objects
 */
interface DALQueryObject<CustomData = never> {
  limit?: number;
  customData?: CustomData
}


class LicenseLogsDAL extends DBTable<LicenseLogDocument> {
  constructor(dbConnection?: MongoClient.Db) {
    super('licenseLogs', dbConnection);
  }

  async getAllLogs(query?: DALQueryObject): Promise<LicenseLogAggregate[]> {
    const queryRes = await this.getTable().aggregate([
      {
        $lookup: {
          from: 'characters',
          as: 'characterData',
          let: {'characterID': '$characterID'},
          pipeline: [
            {
              $match: {
                $expr:
                  {
                    $and:
                      [
                        {$eq: ['$charID', '$$characterID']},
                      ]
                  }
              }
            },
          ]
        }
      },
      {
        $unwind: '$characterData'
      },
      {$sort: {date: -1}},
      {
        $limit: 20
      },
      {
        $project: {
          ISKPaid: '$ISKPaid',
          characterID: '$characterID',
          characterName: '$characterData.charName',
          characterLastSeen: '$characterData.lastSeen',
          characterCorp: '$characterData.corporationName',
          date: '$date',
          licenseID: '$licenseID',
          licenseName: '$licenseName',
          message: '$message'
        }
      }
    ]);

    const arrRes = await queryRes.toArray();

    return arrRes.map((data: ILicenseLogData) => {
      return new LicenseLogAggregate(data);
    });
  }

  async save(licenseLog: LicenseLogDocument): Promise<this> {
    await this.upsert(licenseLog);

    return this;
  }
}

export {LicenseLogsDAL};