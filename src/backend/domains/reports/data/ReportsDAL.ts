import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from "mongodb";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {CharacterDocument} from "../../characters/documents/CharacterDocument";
import {$lookup} from "../../../dataSources/DAL/_dalUtils/$lookup";
import {$unwind} from "../../../dataSources/DAL/_dalUtils/$unwind";

export interface IGroupedTXRecord {
  typeName: string,
  boughtUnits: number,
  soldUnits: number,
  boughtValue: number,
  soldValue: number,
  month: number,
  year: number,
  typeID: number,
  avgBuyValue: number,
  avgSellValue: number,
  avgProfit: number,
  grossProfit: number,
  profitMargins: number
}

interface IGetAllTxInput {
  characterDoc: CharacterDocument,
  groupBy: 'week' | 'month' | 'year',
  month: number;
  year: number;
  minGrossProfit: number;
}

class ReportsDAL extends DBTable<any> {
  constructor(dbConnection: MongoClient.Db) {
    super('reports', dbConnection);
  }


  async getAllTransactions({
                             characterDoc,
                             groupBy,
                             month,
                             year,
                             minGrossProfit
                           }: IGetAllTxInput): Promise<IGroupedTXRecord[]> {

    const filterByGroupValue = groupBy === 'month' ? month : year;

    const res = this.db.collection('transactions').aggregate([
      {
        $match: {
          $or: $characterFilter(characterDoc)
        }
      },
      {
        $sort: {'transaction_id': 1},
      },
      {
        $addFields: {
          date: {$dateFromString: {dateString: '$date'}}
        }
      },
      // Add dates to each Transaction
      {
        $addFields: {
          month: {$month: '$date'},
          week: {$isoWeek: '$date'},
          year: {$year: '$date'}
        }
      },
      {$match: {[groupBy]: filterByGroupValue}},
      {$match: {year: year}},
      // Add item name to each transaction and delete the item
      $lookup('__invTypes', 'type_id', 'typeID', 'item'),
      $unwind('$item'),
      {
        $addFields: {
          typeName: '$item.typeName',
        }
      },
      {$unset: 'item'},
      // Group by typeId, week/month and a year
      {
        $group:
          {
            // for example groupBy: Week, month or year
            _id: {typeID: '$type_id', [groupBy]: `$${groupBy}`, year: '$year'},
            // transactions: {$push: '$$ROOT'}, // For debugging
            typeName: {$first: '$typeName'},
            boughtUnits: {$sum: {$cond: ['$is_buy', '$quantity', 0]}},
            soldUnits: {$sum: {$cond: ['$is_buy', 0, '$quantity']}},
            boughtValue: {$sum: {$cond: ['$is_buy', {$multiply: ['$unit_price', '$quantity']}, 0]}},
            soldValue: {$sum: {$cond: ['$is_buy', 0, {$multiply: ['$unit_price', '$quantity']}]}}
          }
      },
      {
        $addFields: {
          [groupBy]: `$_id.${groupBy}`,
          year: '$_id.year',
          typeID: '$_id.typeID',
          avgBuyValue: {$cond: [{$eq: ['$boughtUnits', 0]}, 0, {$divide: ['$boughtValue', '$boughtUnits']}]},
          avgSellValue: {$cond: [{$eq: ['$soldUnits', 0]}, 0, {$divide: ['$soldValue', '$soldUnits']}]},
        },
      },
      {
        $addFields: {
          avgProfit: {$cond: [{$and: [{$gt: ['$avgSellValue', 0]}, {$gt: ['$avgBuyValue', 0]}]}, {$subtract: ['$avgSellValue', '$avgBuyValue']}, 0]}
        },
      },
      {
        $addFields: {
          profitMargins: {$cond: [{$gt: ['$avgProfit', 0]}, {$divide: ['$avgProfit', '$avgBuyValue']}, 0]},
          grossProfit: {
            $multiply: [{$min: ['$soldUnits', '$boughtUnits']}, '$avgProfit']
          }
        }
      },
      {
        $match: {
          grossProfit: {
            $gt: minGrossProfit
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          [`_id.${groupBy}`]: 1
        }
      }
    ]);

    return await res.toArray();
  }
}

export {
  ReportsDAL
};