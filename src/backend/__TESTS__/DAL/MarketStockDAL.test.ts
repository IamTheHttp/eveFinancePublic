import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {getTestCharacter} from "../utils/getTestCharacter";
import {commonPreTestDbSetup} from "../utils/commonPreTestDbSetup";
import {CharacterDocument} from "../../domains/characters/documents/CharacterDocument";
import {MarketOrdersDAL} from "../../domains/marketOrders/data/MarketOrdersDAL";
import {MarketStocksDAL} from "../../domains/marketStocks/data/MarketStocksDAL";



// Structure
function getHammerheadMarketOrder(character: CharacterDocument, typeID = 2185, locationID = 60000004, orderID = Date.now()) {
  return{
    order_id : orderID,
    apiCharID : character.charID,
    duration : 90,
    is_corporation : true,
    issued : new Date().toISOString(), // still a string in the database
    location_id : locationID,
    price : 843900,
    range : 'region',
    region_id : 10000002,
    type_id : typeID,
    volume_remain : 1125,
    volume_total : 1199
  }
}


function getMarketStockRequest(character: CharacterDocument, systemID = 30002780, typeID = 2185) {
 return {
   "apiCharID" : character.charID,
   "systemID" : systemID,
   "typeID" : typeID,
   "quantity" : 20
 }
}


describe('Test the QuotasDAL', () => {
  const testCharacter = getTestCharacter();
  let DALs: IDALs;
  let marketStockDAL: MarketStocksDAL;
  let marketDAL: MarketOrdersDAL;

  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;

    marketStockDAL = dbReady.DALs.marketStocksDAL;
    marketDAL = dbReady.DALs.marketOrders;
  });

  it ('Calculates stocks of existing items', async () => {
    const marketOrder = getHammerheadMarketOrder(testCharacter);
    marketOrder.volume_remain = 1000;

    const stockRequest = getMarketStockRequest(testCharacter);
    stockRequest.quantity = 2000;

    await marketDAL.upsert(marketOrder);
    await marketStockDAL.upsert(stockRequest);

    // Query!
    const res = await marketStockDAL.getMarketStocks(testCharacter);

    expect(res[0].itemsInMarket.length).toBeGreaterThan(0);
    expect(res[0].quantity).toBe(2000);
    expect(res[0].itemsInMarket[0].volume_remain).toBe(1000);
  });

  it ('Calculates missing asset stocks for market stock requests when no stock exists', async () => {
    const marketOrder = getHammerheadMarketOrder(testCharacter);
    marketOrder.volume_remain = 1000;

    const stockRequest = getMarketStockRequest(testCharacter);
    stockRequest.quantity = 2000;

    await marketDAL.upsert(marketOrder);
    await marketStockDAL.upsert(stockRequest);

    // Query!
    const res = await marketStockDAL.getMarketRequestAssetsReport(testCharacter);

    expect(res[0].quantity).toBe(2000);
  });

  it('Calculates missing asset stocks for market stock requests when some stock exists', async () => {
    const stockRequest = getMarketStockRequest(testCharacter);
    stockRequest.quantity = 2000;

    await DALs.assetsDAL.upsert({
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: 60000004,
      type_id: stockRequest.typeID,
      quantity: stockRequest.quantity / 2
    })

    await marketStockDAL.upsert(stockRequest);

    // Query without any stock stations, this gets everything
    const res1 = await marketStockDAL.getMarketRequestAssetsReport({...testCharacter, stockStations: []});

    expect(res1[0].quantityInAssets).toBe(1000);
    expect(res1[0].quantity).toBe(2000);

    // Query with only the stock station, this should get nothing (as it's not placed in the right station)
    const res2 = await marketStockDAL.getMarketRequestAssetsReport(testCharacter);

    expect(res2[0].quantityInAssets).toBe(0);
    expect(res2[0].quantity).toBe(2000);
  });

  it ('Calculates the asset report stocks for market stock requests when enough stock exists', async () => {
    const stockRequest = getMarketStockRequest(testCharacter);
    stockRequest.quantity = 2000;

    await DALs.assetsDAL.upsert({
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: 666, // testCharacter stockStation
      type_id: stockRequest.typeID,
      quantity: stockRequest.quantity * 2
    })

    await marketStockDAL.upsert(stockRequest);

    // Query!
    const res = await marketStockDAL.getMarketRequestAssetsReport(testCharacter);

    expect(res[0].quantityInAssets).toBe(4000);
    expect(res[0].quantity).toBe(2000);
  });

  it ('Calculates the asset report stocks for a player structure', async () => {
    await DALs.playerStructuresDAL.upsert({
      owner_id: 1,
      name: 'foo',
      structureID: 666,
      solar_system_id: 30002780,
      type_id: 1,
      // position: 1
    })

    const stockRequest = getMarketStockRequest(testCharacter);
    stockRequest.quantity = 2000;
    stockRequest.systemID = 30002780;

    await DALs.assetsDAL.upsert({
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: 666,
      type_id: stockRequest.typeID,
      quantity: stockRequest.quantity * 2
    })

    await marketStockDAL.upsert(stockRequest);

    // Query!
    const res = await marketStockDAL.getMarketRequestAssetsReport(testCharacter);

    expect(res[0].quantityInAssets).toBe(4000);
    expect(res[0].quantity).toBe(2000);
  });
})