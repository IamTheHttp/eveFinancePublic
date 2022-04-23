import DBTable from "../../../dataSources/DAL/DbTable";
import {CharacterDocument} from "../documents/CharacterDocument";
import MongoClient from "mongodb";
import {CharacterAggregate} from "../aggregates/CharacterAggregate";
import {getLicenseLogsDAL} from "./getLicenseLogsDAL";
import {logger} from "../../../utils/logger/logger";

class CharactersDAL extends DBTable<CharacterDocument> {
  constructor(dbConnection?: MongoClient.Db) {
    super('characters', dbConnection);
  }

  async getByID(charID: number) {
    const res = await this.getTable().aggregate([
      {$match: {charID}},
      {
        $lookup: {
          from: 'characters',
          as: 'linkedCharactersData',
          let: {'linkedCharacters': '$linkedCharacters'},
          pipeline: [
            {
              $match: {
                $expr:
                  {
                    $and:
                      [
                        {$eq: [true, {$in: ['$charID', '$$linkedCharacters']}]},
                      ]
                  }
              }
            },
            {
              $project: {
                charID: '$charID',
                gaveCorporationPermission: '$gaveCorporationPermission',
                isDirector: '$isDirector',
                canQueryCorpWallet: '$canQueryCorpWallet'
              }
            }
          ]
        }
      }
    ]).toArray();
    return res[0];
  }

  async getActiveCharacters() {
    const date = new Date();
    date.setDate(date.getDate() - 5);

    return await this.getWhere({
      status: {$ne: 'deleted'},
      // licenseExpirationDate: {$gt: date}, // TODO re-introduce LIMITED_TRIAL - re-include it to improve performance
      failedRefreshTokenAttempts: {$ne: 5}
    });
  }

  async getAllCharacters(): Promise<CharacterAggregate[]> {
    try {
      const res = await this.getTable().aggregate([
        { $unset: 'sso' }
      ]);
      const arr =  <CharacterDocument[]> await  res.toArray();

      return arr.map((charDocument) => {
        // TODO CharacterAggregate shouldn't use a DAL
        return new CharacterAggregate(this).setFields(charDocument);
      });
    } catch(e) {
      logger.error(`${__filename} - ${e}`);
    }
  }


  async save(charAgg: CharacterAggregate) {
    const licLogDAL = await getLicenseLogsDAL();
    // TODO we're very optimistic that licLogDAL saved correctly
    if (charAgg.getLicPurchaseToLog()) {
      await licLogDAL.upsert(charAgg.getLicPurchaseToLog());
    }
    return await this.upsert(charAgg.getChar());
  }
}


export {CharactersDAL};