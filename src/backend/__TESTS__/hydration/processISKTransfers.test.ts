import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {TestJournalActions} from "../utils/TestJournalActions";
import {getTestCharacter} from "../utils/getTestCharacter";
import {commonPreTestDbSetup} from "../utils/commonPreTestDbSetup";
import {processISKTransfers} from "../../hydration/general/processISKTransfers";
import {createCharAgg} from "../../domains/characters/aggregates/createCharAgg";


describe('Test the QuotasDAL', () => {
  const testCharacter = getTestCharacter();
  let DALs: IDALs;
  let journalActions: TestJournalActions;

  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;
    journalActions = new TestJournalActions(DALs, testCharacter);
  })

  it('Correctly finds isk transfers that were not handled', async () => {
    await DALs.journalDAL.getTable().deleteMany({});

    const charAgg1 = await createCharAgg({...testCharacter, charID: 999});
    await charAgg1.save();

    const charAgg2 = await createCharAgg({...testCharacter, charID: 91335790}); // Jenny
    await charAgg2.save();

    const firstParty = charAgg1.getChar();
    const secondParty = charAgg2.getChar();

    await journalActions.transferISKFromPlayerToPlayer(firstParty, secondParty, new Date());
    const journalEntries = await DALs.journalDAL.getUnhandledISKTransfers();

    expect(journalEntries.length).toBe(1);

    await processISKTransfers(DALs);

    // const journalEntryAggregates = await DALs.journalDAL.getUnhandledISKTransfers();
    // const rawJournalEntries = await DALs.journalDAL.getAllData();

    // await charAgg1.reload();
    // const firstPartyFromDB = charAgg1.getChar();
    //
    // expect(journalEntryAggregates.length).toBe(0);
    //
    // expect(rawJournalEntries.length).toBe(1);
    // // Ensure the journal is marked as processed
    // expect(rawJournalEntries[0].__processed).toBe(true);
    // // ensure we didn't change the date type by accident (This happened =/)
    // expect(typeof rawJournalEntries[0].date).toBe('string');
    // // Ensure the player was credited correctly
    // expect(firstPartyFromDB.creditBalance).toBe(100);
  });
})