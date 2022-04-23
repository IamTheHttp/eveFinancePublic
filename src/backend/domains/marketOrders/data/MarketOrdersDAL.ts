import DBTable from "../../../dataSources/DAL/DbTable";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {CharacterDocument} from "../../characters/documents/CharacterDocument";
import MongoClient from "mongodb";

class MarketOrdersDAL extends DBTable<any> {
  constructor(dbConnection: MongoClient.Db) {
    super('marketOrders', dbConnection);
  }

  async getMarketOrderStatus(character: CharacterDocument) {
    return this.getTable().aggregate([
      {
        $match : {
          $or: $characterFilter(character)
        }
      },
      {
        $group: {
          _id: "$apiCharID",
          sumBuyOrders: {$sum: '$escrow'},
          sumSellOrders: {$sum: {$cond: ['$is_buy_order', 0, {$multiply: ['$price', '$volume_remain']}]}}
        }
      },
      {
        $lookup: {
          from: 'characters',
          localField: '_id',
          foreignField: 'charID',
          as: 'character'
        }
      },
      {$unwind: "$character"},
      {
        $project: {
          _id: 0,
          charID: '$_id',
          'sumBuyOrders': '$sumBuyOrders',
          'sumSellOrders': '$sumSellOrders',
          charName: '$character.charName'
        }
      },
    ]).toArray();
  }
}

export {MarketOrdersDAL}
