import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerError} from "../../../ServerError";
import {ServerValidations} from "../../../ServerValidations";
import {MemBasedCache} from "../../../cache/MemBasedCache";


async function getEveMarketItems(app: Express) {
  const DALs = await getAllDAL();
  const {eveItemsDAL} = DALs;
  const itemSearchCache = new MemBasedCache();

  app.get('/auth/marketItems', async (req, res) => {
    let items = await eveItemsDAL.getWhere(
      {
        'marketGroupID': {$gt: 0},
      },
    );

    res.send({
      data: {
        items,
      },
      errorID: ServerError.OK,
    });
  })

  app.get('/auth/marketItems/:itemName', async (req, res) => {
    const validation = ServerValidations.validateFieldsStringLength(100, req.params, ['itemName']);
    if (validation.isError) {
      res.send({
        data: {},
        error: validation.error,
        errorID: validation.errorID,
      });
      // Error, we're done
      return;
    }

    // Do we have cache?
    if (itemSearchCache.hasItem(req.params.itemName)) {
      res.send({
        data: itemSearchCache.getItem(req.params.itemName),
        errorID: ServerError.OK,
      });
      // Cache response
      return;
    }

    // TODO move these queries into its own instance/class
    const projection = {description: 1, typeName: 1, typeID: 1}
    // Add response to cache
    itemSearchCache.addItem(req.params.itemName, {
      // Get exact match query
      exactMatch: await eveItemsDAL.getWhere({
          'marketGroupID': {$gt: 0},
          typeName: {$regex: new RegExp(`^${req.params.itemName}$`, 'i')}
        },
        projection
      ),
      // Get regex match query
      search: await eveItemsDAL.getWhere({
          'marketGroupID': {$gt: 0},
          typeName: {$regex: new RegExp(req.params.itemName, 'i')}
        },
        projection
      )
    });

    res.send({
      data: itemSearchCache.getItem(req.params.itemName),
      errorID: ServerError.OK,
    });
  });
}

export default getEveMarketItems;
