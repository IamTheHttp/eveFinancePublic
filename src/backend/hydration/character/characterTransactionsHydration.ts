import {logger} from "../../utils/logger/logger";
import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {getTransactionsDAL} from "../../domains/transactions/data/get.transactionsDAL";

async function characterTransactionsHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  let response = await esiNetworkDriver.getTransactions(charAgg.getChar());

  if(shouldHandleResponse(response, charAgg.getChar(), 'Transactions')) {
    const transactionsDAL = await getTransactionsDAL();
    const txs = response.body;
    await transactionsDAL.upsertMany(txs.map((tx) => {
      return {
        ...tx,
        apiCharID: charAgg.getChar().charID
      }
    }));
    logger.success(`${charAgg.getChar().charName} - Transactions (Inserted ${txs.length})`);
  }
}

export default characterTransactionsHydration;
