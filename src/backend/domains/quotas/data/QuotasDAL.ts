import DBTable from "../../../dataSources/DAL/DbTable";
import MongoClient from 'mongodb';
import {$match} from "../../../dataSources/DAL/_dalUtils/$match";
import {$lookup} from "../../../dataSources/DAL/_dalUtils/$lookup";
import {$unwind} from "../../../dataSources/DAL/_dalUtils/$unwind";
import {baseQuotaQuery} from "./baseQuotaQuery";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {CharacterModel} from "../../characters/models/CharacterModel";
import {CharacterDocument} from "../../characters/documents/CharacterDocument";

const INDUSTRTY_ACTIVITY_IDS = {
  RESEARCH: 8
}

/**
 * This function will add a lookup pipeline stage and join the industryJobs collection, on your specified localField
 * This function also returns only invention jobs
 */
function lookupIndustryByOutputProduct(character: CharacterDocument, localField: string = 'requiredBlueprint.typeID', as: string = 'activeIndustryJobsWithOutputID') {
  return {
    $lookup: {
      from: 'industryJobs', // CONST
      as,
      let: {"outputTypeID": localField},
      pipeline: [
        {
          $match:
            {
              $expr:
                {
                  $and:
                    [
                      {$eq: ["$status", 'active']}, // CONST
                      {$eq: ["$product_type_id", '$$outputTypeID']}, // CONST + variable
                      {$or: $characterFilter(character)}
                    ]
                }
            }
        },
        $lookup('__industryActivityProducts', 'product_type_id', 'productTypeID', 'activityOutput'),
        $unwind('$activityOutput'),
        $match({
          'activityOutput.activityID': INDUSTRTY_ACTIVITY_IDS.RESEARCH
        })
      ],
    }
  };
};


export interface IProductionQuota {
  _id: string,
  quotaID: string,
  apiCharID: number,
  amount: number,
  typeName: string,
  typeID: number,
  completionDate: Date,
  createdDate: Date,
  isOpen: boolean,
  runsSuccessful?: number,
  runsInProgress?: number,
  runsDoneAndInProgress?: number
}

interface IIndustryJob {
  _id: string,
  successful_runs: number,
  probabilityRuns: number
}


export interface IPotentialIndustryJobs extends IProductionQuota {
  industryJobs: IIndustryJob[]
}

export interface INeededMaterial {
  _id: number,
  materialName: string,
  neededForAllQuotas: number,
  quantityInAssets: number
}


class QuotasDAL extends DBTable<IProductionQuota> {
  constructor(dbConnection: MongoClient.Db) {
    super('quotas', dbConnection);
  }
  /**
   * Get all the industry jobs that are unassigned, that could be relevant to this quota
   * @param {CharacterModel} character
   * @param quotaID
   */
  async getPotentialIndustryJobsForQuota(character:CharacterModel, quotaID: string): Promise<IPotentialIndustryJobs[]> {
    return this.getTable().aggregate([
      {
        $match: {
          _id: new MongoClient.ObjectID(quotaID)
        }
      },
      {
        $lookup: {
          from: 'industryJobs',
          as: 'industryJobs',
          let: {createdDate: "$createdDate", "quotaTypeID": "$typeID"},
          pipeline: [
            {
              $match: {
                $expr:
                  {
                    $and: [{$eq: [`$product_type_id`, "$$quotaTypeID"]}]
                  },
              }
            },
            {
              $match: {
                quotaID: {$exists: false},
                $expr:
                  {
                    $or: $characterFilter(character)
                  },
              }
            },
            {
              $addFields: {
                completed_date: {
                  $dateFromString: {
                    dateString: `$completed_date`
                  }
                },
                start_date: {
                  $dateFromString: {
                    dateString: `$start_date`
                  }
                },
                end_date: {
                  $dateFromString: {
                    dateString: `$end_date`
                  }
                },
                probabilityRuns: {$multiply: ['$runs', '$probability']}
              }
            },
            {
              $match: {
                $expr:
                  {
                    $and:
                      [
                        {$gt: ["$start_date", "$$createdDate"]},
                        {$or: $characterFilter(character)}
                      ]
                  }
              }
            },
          ],
        }
      },
    ]).toArray();
  }

  /**
   *
   * Steps explained
   *    - Get all quotas, based on a filter from the outside
   *    - Get item details as an object (Lookup with invTypes + unwind)
   *    - Get all industry jobs for this QuotaID (Lookup with industryJobs based on quotaID)
   *    - Unwind industry jobs
   *      ** At this point we have an array of duplicates, we need to group back!
   *      - Add a field for runsSuccessful
   *      - Add a field for runsInProgress
   *      - Group and summarise $runsSuccessful, $runsInProgress
   *      ** Back to the original quota list, with extra fields
   *    - Add field runsDoneAndInProgress based on the sums provided by $runsSuccessful, $runsInProgress
   *
   *    ** Now it's time to see how many BPCs we have
   *    - Find what blueprint makes our item (lookup with __industryActivityProducts) (as $requiredBlueprint)
   *    - Unwind $requiredBlueprint to an object
   *    - Get all active industry jobs, and their blueprint details
   *    - Group and sum to get bpcRunsInProgress
   *    - Look up all blueprints based on requiredBlueprint
   *    - Sum all available BPOs and bpcRuns
   *    - Add field of availableRunsNet (runs - bpcRunsInProgress)
   *    - Cleanup needless fields
   */
  async getProductionQuotas(character:CharacterDocument, options: { filter?: {}, sort?: {}, limit?: number } = {}): Promise<IProductionQuota[]> {
    // Start from quotas

    return this.getTable().aggregate([
      options.filter && $match(options.filter),
      $match({
        $or: $characterFilter(character)
      }),
      ...baseQuotaQuery(character),
      $lookup('__industryActivityProducts', 'typeID', 'productTypeID', 'requiredBlueprint'),
      $unwind('$requiredBlueprint'),
      {
        $lookup: {
          from: 'industryJobs',
          as: 'activeIndustryJobs',
          let: {"quotaTypeID": "$typeID"},
          pipeline: [
            {
              $match:
                {
                  $expr:
                    {
                      $and:
                        [
                          {$eq: ["$status", 'active']},
                          {$eq: ["$product_type_id", '$$quotaTypeID']},
                          {$or: $characterFilter(character)}
                        ]
                    }
                }
            },
            $lookup('blueprints', 'blueprint_id', 'item_id', 'currentlyUsedBlueprint', $characterFilter(character)),
            $unwind('$currentlyUsedBlueprint')
          ],
        }
      },
      $unwind('$activeIndustryJobs', true),
      {
        $group: {
          _id: '$_id',
          TMP_ROOT: {"$first": "$$ROOT"},
          bpcRunsInProgress: {$sum: {$cond: [{$eq: ['$activeIndustryJobs.currentlyUsedBlueprint.quantity', -2]}, '$activeIndustryJobs.currentlyUsedBlueprint.runs', 0]}},
        }
      },
      {$replaceRoot: {newRoot: {$mergeObjects: ['$TMP_ROOT', "$$ROOT"]}}},
      {$unset: 'TMP_ROOT'},
      {$unset: 'activeIndustryJobs'},
      $lookup('blueprints', 'requiredBlueprint.typeID', 'type_id', 'availableBlueprints',
        $characterFilter(character)
      ),
      $unwind('$availableBlueprints', true),
      {
        $group: {
          _id: '$_id',
          TMP_ROOT: {"$first": "$$ROOT"},
          availableBPCRuns: {$sum: {$cond: [{$gt: ['$availableBlueprints.runs', 0]}, '$availableBlueprints.runs', 0]}},
          bpoCount: {$sum: {$cond: [{$eq: ['$availableBlueprints.quantity', -1]}, 1, 0]}},
        }
      },
      {$replaceRoot: {newRoot: {$mergeObjects: ['$TMP_ROOT', "$$ROOT"]}}},
      {$unset: 'TMP_ROOT'},
      {
        $addFields: {
          availableBPCRunsNet: {$subtract: ['$availableBPCRuns', '$bpcRunsInProgress']}
        }
      },
      lookupIndustryByOutputProduct(character, '$requiredBlueprint.typeID'),
      $unwind('$activeIndustryJobsWithOutputID', true),
      {
        $group: {
          _id: '$_id',
          TMP_ROOT: {"$first": "$$ROOT"},
          newBpcInProgress: {$sum: {$multiply: ['$activeIndustryJobsWithOutputID.runs', '$activeIndustryJobsWithOutputID.probability', '$activeIndustryJobsWithOutputID.activityOutput.quantity']}},
        }
      },
      {$replaceRoot: {newRoot: {$mergeObjects: ['$TMP_ROOT', "$$ROOT"]}}},
      {
        $unset: [
          'TMP_ROOT',
          'availableBlueprints',
          'requiredBlueprint',
          'activeIndustryJobsWithOutputID'
        ]
      },
      options.sort && {
        $sort: options.sort
      },
      options.limit && {
        $limit: options.limit
      }
    ].filter(a => a)).toArray();
  }


  async getMaterialsForQuotas(character:CharacterDocument): Promise<INeededMaterial[]> {
    const stockStations = character.stockStations.map((st) => {
      return st.stationID;
    });

    const charIDs = [character.charID, ...character.linkedCharacters];
    // Start from quotas

    return this.getTable().aggregate([
      $match({completionDate: null}), // only quotas that aren't done
      $match({
        $or: $characterFilter(character)
      }), // Quotas belonging to this user group
      // Add character data
      ...baseQuotaQuery(character),
      $lookup('__industryActivityProducts', 'typeID', 'productTypeID', 'requiredBlueprint'),
      $unwind('$requiredBlueprint'),
      $lookup('__industryActivityMaterials', 'requiredBlueprint.typeID', 'typeID', 'singleRunMaterials', [
        {activityID: 1} // activityID === 1(Production)
      ]),
      $unwind('$singleRunMaterials'),
      {
        $group: {
          _id: null,
          requiredItem: {
            $push: {
              _id: '$singleRunMaterials._id',
              materialTypeID: '$singleRunMaterials.materialTypeID',
              apiCharID: '$apiCharID',
              quantityForSingle: "$singleRunMaterials.quantity",
              typeID: "$singleRunMaterials.typeID",
              remainingQuotaToBuild: {$subtract: ['$amount', '$runsDoneAndInProgress']},
              quantityForQuota: {$multiply: ["$singleRunMaterials.quantity", {$subtract: ['$amount', '$runsDoneAndInProgress']}]}
            }
          }
        }
      },
      $unwind('$requiredItem'),
      {$replaceRoot: {newRoot: '$requiredItem'}},
      $lookup('__invTypes', 'materialTypeID', 'typeID', 'materialData'),
      $unwind('$materialData'),
      {
        $group: {
          _id: '$materialTypeID',
          materialData: {$first: '$materialData'},
          materialName: {$first: '$materialData.typeName'},
          neededForAllQuotas: {$sum: '$quantityForQuota'},
          apiCharID: {$first: '$apiCharID'},
        }
      },
      // Join the main character from this character group
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
          _id: '$_id',
          materialName: {$first: '$materialName'},
          neededForAllQuotas: {$first: '$neededForAllQuotas'},
          quantityInAssets: {$sum: '$itemInAssets.quantity'}
        }
      },
      {$sort: {materialName: 1}}
    ]).toArray();
  }
}

export {QuotasDAL}
