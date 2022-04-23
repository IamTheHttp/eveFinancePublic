import {JournalEntryDocument} from "../data/JournalEntryDocument";

class JournalEntry extends JournalEntryDocument {
  constructor(journalData?: Partial<JournalEntryDocument>) {
    super();
    Object.assign(this, journalData || {});
  }
}

export {JournalEntry}