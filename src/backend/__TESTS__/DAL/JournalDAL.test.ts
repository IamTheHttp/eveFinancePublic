import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {TestJournalActions} from "../utils/TestJournalActions";
import {getTestCharacter} from "../utils/getTestCharacter";
import {commonPreTestDbSetup} from "../utils/commonPreTestDbSetup";

describe('Test the QuotasDAL', () => {
  const testCharacter = getTestCharacter();
  let DALs: IDALs;
  let journalActions: TestJournalActions;

  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;
    journalActions = new TestJournalActions(DALs, testCharacter);
  })

  it('Sums sales correctly', async () => {
    await journalActions.sellItem(1, 1000);
    await journalActions.sellItem(1, 5000);
    await journalActions.sellItem(1, 10000);

    const tradingVolumes = await DALs.journalDAL.getWeeklyTradingVolume(testCharacter);

    return expect(tradingVolumes[0].sellVolume).toBe(16000);
  });

  it('Sums buys correctly', async () => {
    await journalActions.buyItem(1, 1000);
    await journalActions.buyItem(1, 5000);
    await journalActions.buyItem(1, 10000);

    const tradingVolumes = await DALs.journalDAL.getWeeklyTradingVolume(testCharacter);
    return expect(tradingVolumes[0].buyVolume).toBe(16000);
  });

  it('Spent Escrow should count as buying volume', async () => {
    await DALs.journalDAL.getTable().deleteMany({});
    await DALs.transactionsDAL.getTable().deleteMany({});
    await journalActions.buyWithEscrowAsBuyOrder(1, 1000);
    const tradingVolumes = await DALs.journalDAL.getWeeklyTradingVolume(testCharacter);

    return expect(tradingVolumes[0].buyVolume).toBe(1000);
  });

  it('Setting escrow should not count as buying', async () => {
    await DALs.journalDAL.getTable().deleteMany({});
    await DALs.transactionsDAL.getTable().deleteMany({});

    await journalActions.setBuyOrderJournalEntry(5000);

    const tradingVolumes = await DALs.journalDAL.getWeeklyTradingVolume(testCharacter);
    return expect(tradingVolumes.length).toBe(0);
  });
})