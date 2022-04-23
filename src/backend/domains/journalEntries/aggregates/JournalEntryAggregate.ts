import {JournalEntryDocument} from "../data/JournalEntryDocument";
import MongoClient from "mongodb";
import {JournalEntry} from "../entities/JournalEntry";
import {JournalDAL} from "../data/JournalDAL";

class JournalEntryAggregate {
  private journalEntry: JournalEntry;

  constructor(private dal?: JournalDAL) {
    this.dal = dal || new JournalDAL();
    this.journalEntry = new JournalEntry();
  }

  setFields(journalData: Partial<JournalEntryDocument>) {
    Object.assign(this.journalEntry, journalData);
  }

  getJournalEntry(): JournalEntry {
    return this.journalEntry;
  }

  /**
   * Since the origin of this data is always external, this function never inserts, but merely updates based on _id
   */
  async save() {
    const journalEntry = this.journalEntry;
    journalEntry.__processed = journalEntry.__processed || false;
    await this.dal.upsert(journalEntry)
    return this;
  }


  async getByID(id: string | MongoClient.ObjectId) {
    const data = await this.dal.getByKey('_id', new MongoClient.ObjectId(id));

    this.setFields(data[0]);
    return this;
  }
}

export {JournalEntryAggregate}