import {JournalEntryAggregate} from "./JournalEntryAggregate";
import {JournalEntryDocument} from "../data/JournalEntryDocument";

async function createJournalEntryAgg(charIDorData: JournalEntryDocument): Promise<JournalEntryAggregate> {
  const journalAgg = new JournalEntryAggregate();

  if(typeof charIDorData === 'object') {
    await journalAgg.setFields(charIDorData);
  }

  return journalAgg;
}

export {createJournalEntryAgg}