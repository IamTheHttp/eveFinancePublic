import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {IESIIndustryJob} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESIIndustryJob";
import getAllDAL from "../../dataSources/DAL/getAllDAL";
import {HydrationPayload} from "../character/hydrateAll";

async function corporationIndustryHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const DALs = await getAllDAL();
  let {industryJobsDAL} = DALs;

  let page = 1;
  let allIndustrialJobs:IESIIndustryJob[] = [];

  while (page < 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Industry - Fetching page ${page}`);
    let response = await esiNetworkDriver.getCorporationIndustryJobs(charAgg.getChar(), page);

    if (shouldHandleResponse(response, charAgg.getChar(), "Corporation Industry")) {
      allIndustrialJobs = allIndustrialJobs.concat(response.body);
      page++;

      if (response.totalPages < page) {
        logger.info(`${charAgg.getChar().charName} - Corporation Industry - Out of pages!`);
        break; // Out of pages
      }
    } else {
      // If we shouldn't handle the first page, we're done here.
      // Since we don't delete all previous industry jobs
      // We don't have to stop the entire process like in assets or blueprints
      if (page === 1) {
        return;
      }
      break;
    }
  }

  if (page == 100) {
    logger.info(`${charAgg.getChar().charName} - Corporation Industry - Warning! too many pages found for charAgg.getChar() ${charAgg.getChar().charName}`);
  }

  if (allIndustrialJobs && allIndustrialJobs.length) {
    await industryJobsDAL.upsertMany(allIndustrialJobs.map((entry) => {
      return {
        ...entry,
        apiCharID: charAgg.getChar().charID,
        apiCorpID: charAgg.getChar().corporationID
      }
    }));
    logger.success(`${charAgg.getChar().charName} - Corporation Industry (Inserted: ${allIndustrialJobs.length})`);
  } else {
    logger.info(`${charAgg.getChar().charName} - Corporation Industry - No new data`);
  }
}

export {corporationIndustryHydration};
