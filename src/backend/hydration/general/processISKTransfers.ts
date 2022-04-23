import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {logger} from "../../utils/logger/logger";
import {createCharAgg} from "../../domains/characters/aggregates/createCharAgg";

async function processISKTransfers(DALs: IDALs) {
  const journalsAggregates = await DALs.journalDAL.getUnhandledISKTransfers();

  for (const journalAgg of journalsAggregates) {
    const journalEntry = journalAgg.getJournalEntry();
    // The person who transferred the ISK
    const charAgg = await createCharAgg(journalEntry.first_party_id)

    // If the player donation is NOT EVEFIN, we just ignore it, but mark it as processed
    if (journalEntry.reason !== 'EVEFIN') {
      journalAgg.setFields({
        __processed: true
      });
      await journalAgg.save();
      continue;
    }

    if (!charAgg.getChar().charID) {
      logger.error(`ISK Transfer error - ISK Transfer from a non existing character`);
      journalAgg.setFields({
        __processed: true
      });
      await journalAgg.save();
      continue;
    }

    // Some safety
    // TODO this is business logic!, it belongs inside the charAgg!
    charAgg.setFields({
      creditBalance: (charAgg.getChar().creditBalance || 0) + (journalEntry.amount || 0)
    });

    if (typeof charAgg.getChar().creditBalance !== 'number') {
      // TODO do we want an alert here?
      logger.error(`System - ISK Transfer error - resulting isk balance is not a number! CharID: ${charAgg.getChar().charID}`);
      journalAgg.setFields({
        __processed: true
      });
      await journalAgg.save();
      continue;
    }

    // If we passed all the checks, lets update the character
    await charAgg.save();
    journalAgg.setFields({
      __processed: true
    });
    await journalAgg.save();
    logger.success(`${charAgg.getChar().charName} - ISK Transfer registered - Adding ${journalEntry.amount} credits to character ${charAgg.getChar().charID}`);
  }

  logger.info(`System - Processing ISK Transfer done`);
}


export {processISKTransfers}
