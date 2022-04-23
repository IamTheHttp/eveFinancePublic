import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {CharacterDocument} from "../../domains/characters/documents/CharacterDocument";
import {CharacterModel} from "../../domains/characters/models/CharacterModel";
import {ITransactionDocument} from "../../domains/transactions/data/TransactionsDAL";
import {IJournalEntryDocument} from "../../domains/journalEntries/interfaces/IJournalEntryDocument";

export class TestJournalActions {
  private TX_ID_COUNTER = 1000;
  private JOURNAL_ID_COUNTER = 10000;
  private DALs: IDALs;
  private actingCharID: number

  /**
   *
   * @param DALs
   * @param actingCharacter - The character who's doing the buying and selling
   */
  constructor(DALs: IDALs, actingCharacter: CharacterDocument) {
    this.DALs = DALs;
    this.actingCharID = actingCharacter.charID;
  }


  async sellItem(quantity:number, price:number, toCharID?:number, itemID?:number) {
    await this.insertJournalEntry({
      first_party_id: 0,
      second_party_id: this.actingCharID
    });

    await this.insertTransactionEntry({
      apiCharID: this.actingCharID,
      quantity:quantity,
      unit_price: price,
      is_buy: false
    });

    this.bumpAllIDs();
  }


  async buyWithEscrowAsBuyOrder(quantity: number, price: number) {
    await this.insertTransactionEntry({
      apiCharID: this.actingCharID,
      client_id: 0,
      quantity,
      is_buy: true,
      unit_price: price
    });
  }

  async setBuyOrderJournalEntry(amount: number) {
    return this.insertJournalEntry({
      first_party_id: 0,
      second_party_id: this.actingCharID,
      context_id: 1,
      amount
    });
  }

  async buyItem(quantity: number, price:number, fromCharID?:number, itemID?:number) {
    // first/second party should depend on the isBuy
    await this.insertJournalEntry({
      first_party_id: this.actingCharID,
      second_party_id: 0
    });

    await this.insertTransactionEntry({
      apiCharID: this.actingCharID,
      quantity:quantity,
      unit_price: price,
      is_buy: true
    });

    this.bumpAllIDs();
  }

  async transferISKFromPlayerToPlayer(firstParty: CharacterModel, secondParty: CharacterModel, when: Date) {
    return await this.insertJournalEntry({
      amount: 100,
      date: when.toISOString(),
      first_party_id: firstParty.charID,
      second_party_id: secondParty.charID,
      ref_type : 'player_donation',
      reason: 'EVEFIN'
    });
  }

  private bumpAllIDs() {
    this.TX_ID_COUNTER++;
    this.JOURNAL_ID_COUNTER++;
  }

  private async insertJournalEntry(fields: Partial<IJournalEntryDocument>) {
    return this.DALs.journalDAL.upsert(Object.assign({}, {
      "date" : new Date().toISOString(), // still a string in the database
      "description" : 'Test journal entry',
      "context_id_type": 'market_transaction_id',
      "ref_type" : 'market_transaction',
      "first_party_id" : 1, // you should overwrite these
      "second_party_id" : 2, // you should overwrite these
      "id" : this.JOURNAL_ID_COUNTER, // you should overwrite these
      "context_id": this.TX_ID_COUNTER // you should overwrite these
    }, fields));
  }

  private async insertTransactionEntry (fields: Partial<ITransactionDocument>) {
    return this.DALs.transactionsDAL.upsert(Object.assign({}, {
      client_id : 2117138499,
      date : new Date().toISOString(),
      is_buy : false, // you should overwrite these
      is_personal : true,
      location_id : 60014710,
      quantity : 1, // you should overwrite these
      transaction_id : this.TX_ID_COUNTER, // you should overwrite these
      journal_ref_id: this.JOURNAL_ID_COUNTER,
      type_id : 2, // you should probably overwrite these
      unit_price : 3 // you should overwrite these
    }, fields));
  }
}