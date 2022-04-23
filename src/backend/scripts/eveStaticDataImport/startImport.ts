import {InvTypes} from "./tables/invTypes";
import {IndustryActivity} from "./tables/industryActivity";
import {IndustryActivityProducts} from "./tables/industryActivityProducts";
import {IndustryBlueprints} from "./tables/industryBlueprints";
import {IndustryActivityMaterials} from "./tables/industryActivityMaterials";
import {MapRegions} from "./tables/mapRegions";
import {MapSolarSystems} from "./tables/mapSolarSystems";
import {StaStations} from "./tables/staStations";
import {logger} from "../../utils/logger/logger";
const tables = [
  InvTypes,
  IndustryActivity,
  IndustryActivityProducts,
  IndustryBlueprints,
  IndustryActivityMaterials,
  MapRegions,
  MapSolarSystems,
  StaStations
];

export async function startImport(dbName = 'eveonline') {
  for (let i = 0; i < tables.length ; i++) {
    const table = new tables[i];
    logger.info(`System - **** ${table.displayName} ****`);

    await table.cleanup();
    await table.download();
    await table.unzip();
    await table.normalizeToJSON();
    await table.mongoImport(dbName);
    await table.cleanup();
  }
}