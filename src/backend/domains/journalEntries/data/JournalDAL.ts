import DBTable from "../../../dataSources/DAL/DbTable";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {IJournalEntryDocument} from "../interfaces/IJournalEntryDocument";
import {CharacterModel} from "../../characters/models/CharacterModel";
import {CharacterDocument} from "../../characters/documents/CharacterDocument";
import MongoClient from "mongodb";
import {JournalEntry} from "../entities/JournalEntry";
import {createJournalEntryAgg} from "../aggregates/createJournalEntryAggregate";
import {JournalEntryDocument} from "./JournalEntryDocument";
import {JournalEntryAggregate} from "../aggregates/JournalEntryAggregate";

class JournalDAL extends DBTable<IJournalEntryDocument> {
  constructor(dbConnection?: MongoClient.Db) {
    super('journal', dbConnection);
  }

  getWeeklyTradingVolume(character: CharacterDocument) {
    let d = new Date(new Date().setDate(new Date().getDate() - 120));
    let str = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0');

    return this.db.collection('transactions').aggregate([
      {
        $match: {
          $or: $characterFilter(character)
        }
      },
      {$match: {date: {$gt: str}}},
      {
        $project: {
          'unitPrice': '$unit_price',
          'quantity': '$quantity',
          buyVolume: {$cond: ['$is_buy', {$multiply: ['$unit_price', '$quantity']}, 0]},
          sellVolume: {$cond: ['$is_buy', 0, {$multiply: ['$unit_price', '$quantity']}]},
          totalVolume: {$multiply: ['$unit_price', '$quantity']},
          date: {
            $dateFromString: {
              dateString: '$date'
            }
          }
        }
      },
      {
        $group: {
          _id: {$dateToString: {format: '%Y-%m', date: '$date'}},
          buyVolume: {$sum: '$buyVolume'},
          sellVolume: {$sum: '$sellVolume'},
          totalVolume: {$sum: '$totalVolume'}
        }
      },
      {$sort: {_id: -1}},
      {$limit: 10},
      {$sort: {_id: 1}},
    ]).toArray();
  }

  async getWeeklyJournalEntriesByType(character: CharacterModel) {
    let d = new Date(new Date().setDate(new Date().getDate() - 120));
    let str = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0');

    return this.getTable().aggregate([
      {
        $match: {
          $or: $characterFilter(character)
        }
      },
      {$match: {date: {$gt: str}}},
      // TODO refactor to $addField?
      {
        $project: {
          amount: '$amount',
          ref_type: '$ref_type',
          date: {
            $dateFromString: {
              dateString: '$date'
            }
          }
        }
      },
      {
        $group: {
          _id: {
            _id: {
              $dateToString: {format: '%Y-%m', date: '$date'}
            },
            ref_type: '$ref_type'
          },
          amount: {$sum: '$amount'}
        }
      },
      {
        $project: {
          _id: 0,
          week: '$_id._id',
          transferType: '$_id.ref_type',
          amount: '$amount'
        }
      },
      {
        $group: {
          _id: '$week',
          data: {$push: {amount: '$amount', transferType: '$transferType'}}
        }
      },
      {$sort: {_id: -1}},
      {$limit: 4},
      {$sort: {_id: 1}}
    ]).toArray();
  }

  async getUnhandledISKTransfers(): Promise<JournalEntryAggregate[]> {
    let d = new Date(new Date().setDate(new Date().getDate() - 14));
    let str = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0');

    const rows = await this.getTable().aggregate([
      {
        $match: {
          second_party_id: 91335790,
          ref_type: 'player_donation',
          __processed: {$ne: true}
        }
      },
      {$match: {date: {$gt: str}}},
      {
        $limit: 100
      }
    ]).toArray();

    const promises = [];
    for (let i = 0; i < rows.length ; i++) {
      promises.push(createJournalEntryAgg(rows[i]));
    }

    return Promise.all(promises)
  }
}

export {JournalDAL}
