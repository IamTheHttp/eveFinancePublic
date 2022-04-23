import {Express} from "express";
import {$characterFilter} from "../../../dataSources/DAL/_dalUtils/$characterFilter";
import {ServerError} from "../../../ServerError";
import {getTransactionsDAL} from "../data/get.transactionsDAL";

// Not currently used, was deprecated in favor of reports.api
async function salesMetrics(app: Express) {
  const transactionsDAL = await getTransactionsDAL();
  app.get('/auth/sales', async (req, res) => {
    let data = await transactionsDAL.getTable().aggregate([
      {
        $match: {
          $or: $characterFilter(res.locals.character)
        }
      },
      {$match: {'is_buy': false}},
      {
        $addFields: {
          date: {$dateFromString: {dateString: '$date'}},
          ISKVolume: {$multiply: ['$unit_price', '$quantity']}
        }
      },
      {
        $group: {
          _id: {typeID: '$type_id', date: {$dateToString: {format: '%Y-%m', date: '$date'}}},
          sumISKVolume: {$sum: '$ISKVolume'},
          sumQuantity: {$sum: '$quantity'}
        }
      },
      {
        $lookup: {
          from: '__invTypes',
          localField: '_id.typeID',
          foreignField: 'typeID',
          as: 'item'
        }
      },
      {$unwind: '$item'},
      {
        $project: {
          monthYearCombo: '$_id.date',
          typeName: '$item.typeName',
          typeID: '$item.typeID',
          sumISKVolume: '$sumISKVolume',
          sumQuantity: '$sumQuantity'
        },
      },
      {$unset: '_id'},
      {
        $group: {
          _id: '$typeID',
          typeName: {$first: '$typeName'},
          typeID: {$first: '$typeID'},
          tradingDataByWeek: {$push: '$$ROOT'}
        }
      },
    ]).toArray();

    res.send({
      data: data,
      errorID: ServerError.OK,
    })
  });
}

export default salesMetrics;
