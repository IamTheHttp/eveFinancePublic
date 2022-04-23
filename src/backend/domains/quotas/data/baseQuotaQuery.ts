import {$lookup} from "../../../dataSources/DAL/_dalUtils/$lookup";
import {$unwind} from "../../../dataSources/DAL/_dalUtils/$unwind";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {CharacterDocument} from "../../characters/documents/CharacterDocument";



function baseQuotaQuery(character:CharacterDocument) {
  return [
    $lookup('__invTypes', 'typeID', 'typeID', 'item'),
    $unwind('$item'),
    $lookup('industryJobs', '_id', 'quotaID', 'industryJobs',
      $characterFilter(character)
    ),
    $unwind('$industryJobs', true),
    {
      $addFields: {
        runsSuccessful: {$sum: {$cond: ['$industryJobs.successful_runs', '$industryJobs.successful_runs', 0]}},
        runsInProgress: {$sum: {$cond: [{$not: '$industryJobs.successful_runs'}, {$multiply: ['$industryJobs.runs', '$industryJobs.probability']}, 0]}},
      }
    },
    {
      $group: {
        _id: '$_id',
        runsSuccessful: {$sum: '$runsSuccessful'},
        runsInProgress: {$sum: '$runsInProgress'},
        quotaID: {$first: '$_id'},
        typeID: {$first: '$typeID'},
        amount: {$first: '$amount'},
        createdDate: {$first: '$createdDate'},
        typeName: {$first: '$item.typeName'},
        completionDate: {$first: '$completionDate'},
        apiCharID: {$first: '$apiCharID'},
        item: {$first: '$item'},
      }
    },
    {
      $addFields: {runsDoneAndInProgress: {$sum: ['$runsSuccessful', '$runsInProgress']}}
    },
  ]
}


export {baseQuotaQuery};
