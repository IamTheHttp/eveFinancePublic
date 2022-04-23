import getDALConnections, {IDALs} from "../../dataSources/DAL/getAllDAL";
import {connectMongo} from "../../mongoConnect";
import {getTestCharacter} from "./getTestCharacter";

export async function commonPreTestDbSetup() {
  await connectMongo();

  const testCharacter = getTestCharacter();
  const testCharacter2 = getTestCharacter(4321);
  testCharacter2.stockStations.push({
    "stationID" : 777,
    "solarSystemID" : 777,
    "stationName" : "Hell in space2!",
    "isPlayerOwned" : true
  });
  testCharacter.linkedCharacters.push(testCharacter2.charID)

  // This imports static files to the test DB
  // await startImport('TEST_DB')

  const DALs = await getDALConnections();

  await DALs.journalDAL.getTable().deleteMany({});
  await DALs.transactionsDAL.getTable().deleteMany({});
  await DALs.charactersDAL.getTable().deleteMany({});
  await DALs.quotasDAL.getTable().deleteMany({});
  await DALs.assetsDAL.getTable().deleteMany({});
  await DALs.marketOrders.getTable().deleteMany({});
  await DALs.licensesDAL.getTable().deleteMany({});
  await DALs.licenseLogsDAL.getTable().deleteMany({});
  await DALs.marketStocksDAL.getTable().deleteMany({});

  await DALs.charactersDAL.upsert(testCharacter);
  await DALs.charactersDAL.upsert(testCharacter2);



  return {
    DALs,
    testCharacter
  }
}