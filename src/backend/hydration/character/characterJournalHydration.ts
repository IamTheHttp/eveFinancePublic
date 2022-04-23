import {logger} from "../../utils/logger/logger";
import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {getJournalDAL} from "../../domains/journalEntries/data/get.journalDAL";

async function characterJournalHydration({charAgg, esiNetworkDriver}: HydrationPayload): Promise<void> {
  const journalDAL = await getJournalDAL();

  let response = await esiNetworkDriver.getJournal(charAgg.getChar());

  // TODO Implement paging here
  if (shouldHandleResponse(response, charAgg.getChar(), 'Journal')) {
    const journalEntries = response.body;
    await journalDAL.upsertMany(journalEntries.map((journalEntry) => {
      return {
        ...journalEntry,
        apiCharID: charAgg.getChar().charID
      }
    }));

    logger.success(`${charAgg.getChar().charName} - Journal (Inserted ${journalEntries.length})`);
  }
}

export default characterJournalHydration;
