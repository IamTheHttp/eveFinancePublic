import {QuotasDAL} from "../../domains/quotas/data/QuotasDAL";
import {LicensesDAL} from "../../domains/licenses/data/LicensesDAL";
import {getTransactionsDAL} from "../../domains/transactions/data/get.transactionsDAL";
import {getCharactersDAL} from "../../domains/characters/data/getCharactersDAL";
import {getMarketOrdersDAL} from "../../domains/marketOrders/data/get.marketOrdersDAL";
import {getAssetsDAL} from "../../domains/assets/data/get.assetsDAL";
import {getLicensesDAL} from "../../domains/licenses/data/getLicensesDAL";
import {getLicenseLogsDAL} from "../../domains/characters/data/getLicenseLogsDAL";
import {TransactionsDAL} from "../../domains/transactions/data/TransactionsDAL";
import {LicenseLogsDAL} from "../../domains/characters/data/LicenseLogsDAL";
import {CharactersDAL} from "../../domains/characters/data/CharactersDAL";
import {MarketOrdersDAL} from "../../domains/marketOrders/data/MarketOrdersDAL";
import {AssetsDAL} from "../../domains/assets/data/AssetsDAL";
import {getUniverseMarketOrdersDAL} from "../../domains/evedata/data/get.universeMarketOrders";
import {getMapRegionsDAL} from "../../domains/evedata/data/get.mapRegionsDAL";
import {getMapSolarSystemsDAL} from "../../domains/evedata/data/get.mapSolarSystemsDAL";
import {getMarketStocksDAL} from "../../domains/marketStocks/data/get.marketStocksDAL";
import {MarketStocksDAL} from "../../domains/marketStocks/data/MarketStocksDAL";
import {getEveItemsDAL} from "../../domains/evedata/data/get.eveItemsDAL";
import {getIndustryJobsDAL} from "../../domains/industryJobs/data/get.industryJobsDAL";
import {getPlayerStructuresDAL} from "../../domains/evedata/data/get.playerStructuresDAL";
import {getStationsDAL} from "../../domains/evedata/data/get.stationsDAL";
import {getQuotasDAL} from "../../domains/quotas/data/get.quotasDAL";
import {getBlueprintsDAL} from "../../domains/evedata/data/get.blueprintsDAL";
import {getIndustryActivityProductsDAL} from "../../domains/evedata/data/get.industryActivityProductsDAL";
import {getIndustryActivityMaterialsDAL} from "../../domains/evedata/data/get.industryActivityMaterialsDAL";
import {IndustryActivityMaterialsDAL} from "../../domains/evedata/data/IndustryActivityMaterialsDAL";
import {IndustryActivityProductsDAL} from "../../domains/evedata/data/IndustryActivityProductsDAL";
import {IndustryJobsDAL} from "../../domains/industryJobs/data/IndustryJobsDAL";
import {EveItemsDAL} from "../../domains/evedata/data/EveItemsDAL";
import {MapRegionsDAL} from "../../domains/evedata/data/MapRegionsDAL";
import {MapSolarSystemsDAL} from "../../domains/evedata/data/MapSolarSystemsDAL";
import {UniverseMarketOrdersDAL} from "../../domains/evedata/data/UniverseMarketOrdersDAL";
import {BlueprintsDAL} from "../../domains/evedata/data/BlueprintsDAL";
import {getIndustryBlueprintsDAL} from "../../domains/evedata/data/get.industryBlueprintsDAL";
import {IndustryBlueprintsDAL} from "../../domains/evedata/data/IndustryBlueprintsDAL";
import {getESICacheDAL} from "../../domains/cache/data/get.ESICacheDAL";
import {ESICacheDAL} from "../../domains/cache/data/ESICacheDAL";
import {PlayerStructuresDAL} from "../../domains/evedata/data/PlayerStructuresDAL";
import {StationsDAL} from "../../domains/evedata/data/StationsDAL";
import {JournalDAL} from "../../domains/journalEntries/data/JournalDAL";
import {getJournalDAL} from "../../domains/journalEntries/data/get.journalDAL";
import {getReportsDAL} from "../../domains/reports/data/get.reportsDAL";
import {ReportsDAL} from "../../domains/reports/data/ReportsDAL";






export interface IDALs {
  transactionsDAL: TransactionsDAL,
  charactersDAL: CharactersDAL,
  marketOrders: MarketOrdersDAL,
  journalDAL: JournalDAL,
  assetsDAL: AssetsDAL,
  universeMarketOrdersDAL: UniverseMarketOrdersDAL,
  mapSolarSystemsDAL: MapSolarSystemsDAL,
  mapRegionsDAL: MapRegionsDAL,
  marketStocksDAL: MarketStocksDAL,
  eveItemsDAL: EveItemsDAL,
  industryJobsDAL: IndustryJobsDAL,
  stationsDAL: StationsDAL,
  blueprintsDAL: BlueprintsDAL,
  quotasDAL: QuotasDAL,
  industryActivityProductsDAL: IndustryActivityProductsDAL
  industryActivityMaterialsDAL: IndustryActivityMaterialsDAL
  industryBlueprintsDAL: IndustryBlueprintsDAL,
  playerStructuresDAL: PlayerStructuresDAL,
  esiCacheDAL: ESICacheDAL
  licensesDAL: LicensesDAL,
  licenseLogsDAL: LicenseLogsDAL,
  reportsDALL: ReportsDAL
}


async function getDALConnections(): Promise<IDALs> {
  const transactionsDAL = await getTransactionsDAL();
  const charactersDAL = await getCharactersDAL();
  const journalDAL = await getJournalDAL();
  const marketOrders = await getMarketOrdersDAL();
  const assetsDAL = await getAssetsDAL();
  const licensesDAL = await getLicensesDAL();
  const licenseLogsDAL = await getLicenseLogsDAL();
  const universeMarketOrdersDAL = await getUniverseMarketOrdersDAL();
  const mapRegionsDAL = await getMapRegionsDAL();
  const mapSolarSystemsDAL = await getMapSolarSystemsDAL();
  const marketStocksDAL = await getMarketStocksDAL();
  const eveItemsDAL = await getEveItemsDAL();
  const industryJobsDAL = await getIndustryJobsDAL();
  const playerStructuresDAL = await getPlayerStructuresDAL();
  const stationsDAL = await getStationsDAL();
  const quotasDAL = await getQuotasDAL();
  const blueprintsDAL = await getBlueprintsDAL();
  const industryActivityProductsDAL = await getIndustryActivityProductsDAL();
  const industryActivityMaterialsDAL = await getIndustryActivityMaterialsDAL();
  const industryBlueprintsDAL = await getIndustryBlueprintsDAL();
  const esiCacheDAL = await getESICacheDAL();
  const reportsDALL = await getReportsDAL();

  return {
    transactionsDAL,
    charactersDAL,
    journalDAL,
    marketOrders,
    assetsDAL,
    licensesDAL,
    licenseLogsDAL,
    universeMarketOrdersDAL,
    mapRegionsDAL,
    mapSolarSystemsDAL,
    marketStocksDAL,
    eveItemsDAL,
    industryJobsDAL,
    stationsDAL,
    quotasDAL,
    blueprintsDAL,
    industryActivityProductsDAL,
    industryActivityMaterialsDAL,
    industryBlueprintsDAL,
    playerStructuresDAL,
    esiCacheDAL,
    reportsDALL
  }
}


export default getDALConnections;
