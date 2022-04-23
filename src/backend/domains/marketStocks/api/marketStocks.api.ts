import {Express} from "express";
import getAllDAL from "../../../dataSources/DAL/getAllDAL";
import {ServerValidations} from "../../../ServerValidations";
import {ServerError} from "../../../ServerError";
import {ENDPOINTS} from "../../../../sharedInterfaces/ApiSystemInteraces";

async function getEveMarketItems(app: Express) {
  const DALs = await getAllDAL();
  const {eveItemsDAL, marketStocksDAL} = DALs;

  app.delete('/auth/marketStocks', async (req, res) => {
    let data = await marketStocksDAL.deleteWhere({
      apiCharID: res.locals.character.charID,
      systemID: req.body.systemID,
      typeID: req.body.typeID
    });

    res.send({
      data: {
        msg: 'OK',
        row: req.body,
      },
      errorID: ServerError.OK,
    })
  })

  app.get('/auth/marketStocks', async (req, res) => {
    let data = await marketStocksDAL.getMarketStocks(res.locals.character);

  // .find({marketGroupID: {$gt:0} });
    // TODO Optimize this, we don't need all the fields on the client side
    res.send({
      data: data,
      errorID: ServerError.OK,
    })
  });

  // Update the stock for the typeID in a specific system
  app.post('/auth/marketStock/:typeID', async (req, res) => {
    const REQ_PARAMS = {...req.params, ...req.body} as ENDPOINTS["auth/marketStock/:typeID"]["REQUEST_PARAMS"];

    const validation = ServerValidations.validateFieldsGreaterThan(0, REQ_PARAMS, ['quantity', 'typeID']);
    if (validation.isError) {
      res.send({
        data: {},
        error: validation.error,
        errorID: validation.errorID,
      });
      // Error, we're done
      return;
    }

    const {typeID, quantity, systemID} = REQ_PARAMS;

    let data = await marketStocksDAL.updateMarketStocks({
      apiCharID: res.locals.character.charID,
      systemID: REQ_PARAMS.systemID,
      typeID: REQ_PARAMS.typeID,
      quantity: REQ_PARAMS.quantity
    });

    res.send({
      data: [typeID, quantity, systemID],
      errorID: ServerError.OK,
    });
  });

  app.get('/auth/marketRequestAssetsReport', async (req, res) => {
    let data = await marketStocksDAL.getMarketRequestAssetsReport(res.locals.character);

    res.send({
      data: data,
      errorID: ServerError.OK,
    })
  });

  app.post('/auth/marketStocks', async (req, res) => {
    const validationResponse = ServerValidations.validateFieldsGreaterThan(0, req.body,['addSystemID', 'addTypeID', 'addQuantity']);

    if (validationResponse.isError === false) {
      let {addSystemID, addTypeID, addQuantity} = req.body;
      let char = res.locals.character;
      let stockLevels = {
        apiCharID: char.charID,
        systemID: addSystemID,
        typeID: addTypeID,
        quantity:addQuantity
      };
      await marketStocksDAL.upsert(stockLevels);
      res.send({
        data: 'OK',
        errorID: ServerError.OK,
      });
    } else {
      res.send({
        data: 'ERROR',
        errorID: validationResponse.errorID,
        error: validationResponse.error
      });
    }
  });
}

export default getEveMarketItems;
