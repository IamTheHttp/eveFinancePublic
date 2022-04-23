import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {IESIJournalEntry} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESIJournalEntry";
import {HydrationPayload} from "../character/hydrateAll";
import {getJournalDAL} from "../../domains/journalEntries/data/get.journalDAL";

async function corpJournalHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const journalDAL = await getJournalDAL();

  for (let divisionID =1; divisionID < 8; divisionID++) {
    let page = 1;
    let allJournalEntries: IESIJournalEntry[] = [];

    while (page < 100) {
      logger.info(`${charAgg.getChar().charName} - Corporation Journal Division:${divisionID} - Fetching page ${page}`);
      let response = await esiNetworkDriver.getCorporationJournal(divisionID,charAgg.getChar(), page);

      if (shouldHandleResponse(response, charAgg.getChar(), `Corporation Journal Division:${divisionID} `)) {
        allJournalEntries = allJournalEntries.concat(response.body);
        page++;

        if (response.totalPages < page) {
          logger.info(`${charAgg.getChar().charName} - Corporation Journal Division:${divisionID} - Out of pages!`);
          break; // Out of pages
        }
      } else {
        // If we shouldn't handle the first page, we're done here.
        // Since we don't delete all previous journal hits
        // We don't have to stop the entire process like in assets or blueprints
        if (page === 1) {
          return;
        }
        break;
      }
    }

    if (page == 100) {
      logger.info(`${charAgg.getChar().charName} - Corporation Journal Division:${divisionID} - Warning! too many pages found for charAgg.getChar() ${charAgg.getChar().charName}`);
    }

    if (allJournalEntries && allJournalEntries.length) {
      await journalDAL.upsertMany(allJournalEntries.map((journalEntry) => {
        return {
          ...journalEntry,
          apiCharID: charAgg.getChar().charID,
          apiCorpID: charAgg.getChar().corporationID,
        }
      }));

      logger.success(`${charAgg.getChar().charName} - Corporation Journal Division:${divisionID} (Inserted: ${allJournalEntries.length})`);
    } else {
      logger.info(`${charAgg.getChar().charName} - Corporation Journal Division:${divisionID} - No new data`);
    }
  }
}

export default corpJournalHydration;
