import {CharacterDocument} from "../../characters/documents/CharacterDocument";
import DBTable from "../../../dataSources/DAL/DbTable";
import {$lookup} from "../../../dataSources/DAL/_dalUtils/$lookup";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import MongoClient from "mongodb";
import {$unwind} from "../../../dataSources/DAL/_dalUtils/$unwind";


interface MarketStockQueryResult {
  apiCharID: number,
  systemID: number,
  typeID: number,
  quantity: number,
  solarSystem: {},
  item: {},
  itemsInMarket: {
    apiCharID: number,
    marketOrderSolarSystemID: number,
    volume_remain: number,
    volume_total: number,
    type_id: number
  }[]
}


class MarketStocksDAL extends DBTable<any> {
  constructor(dbConnection: MongoClient.Db) {
    super('marketStocks', dbConnection);
  }

  private getMarketStocksPipeline(character: CharacterDocument): any[]{
    return [
      // Match required market stocks of the user and his linked characters
      {
        $match: {
          $or: $characterFilter(character)
        }
      },
      // Add solar system information for this market stock request
      {
        $lookup: {
          from: '__mapSolarSystems',
          localField: 'systemID',
          foreignField: 'solarSystemID',
          as: 'solarSystem'
        }
      },
      // Add item type information for this market stock request
      {
        $lookup: {
          from: '__invTypes',
          localField: 'typeID',
          foreignField: 'typeID',
          as: 'item'
        }
      },
      // Add the market orders to the stock request (To see how much we have in stock)
      {
        $lookup: {
          from: 'marketOrders',
          as: 'itemsInMarket',
          let: {systemID: "$systemID", quantity: '$quantity', typeID: '$typeID'},
          pipeline: [
            // Only bring market orders for this character (and linked characters)
            {
              $match: {
                $or: $characterFilter(character)
              }
            },
            // Bring station information for the market order
            {
              $lookup: {
                from: '__staStations',
                as: 'station',
                let: {location_id: "$location_id"},
                pipeline: [
                  {
                    $match:
                      {
                        $expr:
                          {
                            $and:
                              [
                                {$eq: ["$stationID", "$$location_id"]}
                              ]
                          }
                      }
                  },
                  {$project:{_id:0, solarSystemID: '$solarSystemID'}}
                ],
              },
            },
            {$unwind: {path: '$station', preserveNullAndEmptyArrays: true}},
            // Bring player structure information for this order
            {
              $lookup: {
                from: 'playerStructures',
                as: 'structure',
                let: {location_id: "$location_id"},
                pipeline: [
                  {
                    $match:
                      {
                        $expr:
                          {
                            $and:
                              [
                                {$eq: ["$structureID", "$$location_id"]}
                              ]
                          }
                      }
                  },
                  {$project: {_id: 0, solarSystemID: '$solar_system_id'}}
                ],
              },
            },
            {$unwind: {path: '$structure', preserveNullAndEmptyArrays: true}},
            {
              $addFields: {
                marketOrderSolarSystemID: {$cond: ['$station.solarSystemID', '$station.solarSystemID', '$structure.solarSystemID']},
              }
            },
            {
              $project: {
                apiCharID: '$apiCharID',
                marketOrderSolarSystemID: '$marketOrderSolarSystemID',
                volume_remain: '$volume_remain',
                volume_total: '$volume_total',
                type_id: '$type_id'
              }
            },
            {
              $match:
                {
                  $expr:
                    {
                      $and:
                        [
                          {$eq: ["$type_id", "$$typeID"]},
                          {$eq: ["$marketOrderSolarSystemID", "$$systemID"]}
                        ]
                    }
                }
            },
          ],
        }
      },
      {$unwind: {path: '$solarSystem', preserveNullAndEmptyArrays: true}},
      {$unwind: {path: '$item', preserveNullAndEmptyArrays: true}}
    ];
  }


  async getMarketStocks(character: CharacterDocument): Promise<MarketStockQueryResult[]> {
    return this.getTable().aggregate(
      this.getMarketStocksPipeline(character)
    ).toArray()
  }

  async updateMarketStocks({apiCharID, typeID, systemID, quantity}: {apiCharID: number, typeID: number, systemID: number; quantity:number}) {
    return this.getTable().updateOne({
      apiCharID,
      typeID,
      systemID
    }, {
      $set: {
        quantity
      }
    })
  }


  /**
   * This function will return the quantity of an item in the assets, given that that item is part of a market request
   * Assets fetched will be in stock stations if those were configured by the user
   * @param character
   */
  async getMarketRequestAssetsReport(character: CharacterDocument) {
    const stockStations = character.stockStations.map((st) => {
      return st.stationID;
    });

    const charIDs = [character.charID, ...character.linkedCharacters];

    const foo = this.getMarketStocksPipeline(character).concat([
      {$unwind: {path: "$itemsInMarket", preserveNullAndEmptyArrays: true}},
      {
        $group: {
          _id: "$typeID",
          TMP_ROOT: {"$first": "$$ROOT"},
          itemsInMarket: {$addToSet: "$itemsInMarket"}
        }
      },
      {$replaceRoot: {newRoot: {$mergeObjects: ['$TMP_ROOT', "$$ROOT"]}}},
      {$unset: 'TMP_ROOT'},
      // TODO this is a copy paste from QuotasDAL, we should really consider reusing this...
      {
        $lookup: {
          from: 'assets', // CONST
          as: 'itemInAssets',
          let: {"apiCharID": '$apiCharID', "materialTypeID": '$_id'},
          pipeline: [
            {
              $match:
                {
                  $expr:
                    {
                      $and:
                        [
                          {$eq: [true, {$in: ['$apiCharID', charIDs]}]},
                          {$eq: ["$type_id", "$$materialTypeID"]},
                        ]
                    }
                }
            },
            /**
             * Create a recursive hierarchy of locations, each location will contain an array of location documents
             */
            {
              $graphLookup: {
                from: "assets",
                startWith: "$location_id",
                connectFromField: "location_id",
                connectToField: "item_id",
                as: "hierarchy"
              }
            },
            /**
             * Create a field containing the locationID values from the hierarchy of the asset (Assets can be in containers!)
             */
            {
              "$addFields": {
                "containedWithin": {
                  "$map": {
                    "input": "$hierarchy",
                    "as": "el",
                    "in": "$$el.location_id"
                  }
                }
              }
            },
            /**
             * Create a field containing any location that's part of the recurisve hierarchy, and also is a stockStation
             */
            {
              "$addFields": {
                "fullHierarchy": {
                  "$setIntersection": ['$containedWithin', stockStations]
                }
              }
            },
            {
              $match:
                {
                  $expr:
                    {
                      $or:
                        [
                          // if stockStations is empty, we fetch all assets
                          {$eq: [true, stockStations.length > 0 ? {$in: ['$location_id', stockStations]} : true]},
                          {$gt: [{$size: '$fullHierarchy'}, 0]},
                        ]
                    }
                }
            },
          ]
        }
      },
      $unwind('$itemInAssets' ,true),
      {
        $group: {
          _id: "$typeID",
          itemName: {"$first": "$item.typeName"},
          TMP_ROOT: {"$first": "$$ROOT"},
          quantityInAssets: {'$sum': "$itemInAssets.quantity"}
        }
      },
      {$replaceRoot: {newRoot: {$mergeObjects: ['$TMP_ROOT', "$$ROOT"]}}},
      {$unset: ['TMP_ROOT', 'itemInAssets', 'itemsInMarket', 'solarSystem', 'item', 'systemID','apiCharID', '_id']},
      {$sort: {itemName: 1}}
    ]);

    return this.getTable().aggregate(
      foo
    ).toArray();
  }
}

export {MarketStocksDAL}
