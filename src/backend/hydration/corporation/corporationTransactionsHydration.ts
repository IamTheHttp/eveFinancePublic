import {logger} from "../../utils/logger/logger";
import {IESITransactionEntry} from "../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESITransactionEntry";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {getTransactionsDAL} from "../../domains/transactions/data/get.transactionsDAL";
import {HydrationPayload} from "../character/hydrateAll";

async function corporationTransactionsHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const transactionsDAL = await getTransactionsDAL();

  for (let divisionID =1; divisionID < 8; divisionID++) {
    const response = await esiNetworkDriver.getCorporationTransactions(divisionID, charAgg.getChar());

    if (shouldHandleResponse(response, charAgg.getChar(), `Corporation Transactions - Division:${divisionID}`)) {
      let transactionEntries = response.body
      let allEntries: IESITransactionEntry[] = [].concat(transactionEntries);
      allEntries = allEntries.concat(transactionEntries);

      while (true) {
        const oldestTransactionID = allEntries[allEntries.length - 1].transaction_id;
        const response = await esiNetworkDriver.getCorporationTransactions(divisionID, charAgg.getChar(), oldestTransactionID);

        if (shouldHandleResponse(response, charAgg.getChar(), `Corporation Transactions Division:${divisionID} - (From TX: ${oldestTransactionID}`)) {
          transactionEntries = response.body
          allEntries = allEntries.concat(transactionEntries);

          // Only one response, same transaction ID as before, nothing to do.
          if (transactionEntries.length === 1 && transactionEntries[0].transaction_id === oldestTransactionID) {
            logger.info(`${charAgg.getChar().charName} Corporation Transactions Division:${divisionID} - Oldest TX in ESI history - ${oldestTransactionID}`);
            break;
          }
        } else {
          break;
        }
      }

      if (allEntries && allEntries.length) {
        await transactionsDAL.upsertMany(allEntries.map((entry) => {
          return {
            ...entry,
            apiCharID: charAgg.getChar().charID,
            apiCorpID: charAgg.getChar().corporationID,
            divisionID: divisionID
          }
        }));

        logger.success(`${charAgg.getChar().charName} - Corporation Transactions Division:${divisionID} (Inserted: ${allEntries.length})`);
      } else {
        logger.info(`${charAgg.getChar().charName} - Corporation Transactions Division:${divisionID} - No new data`);
      }
    }
  }
}


export {corporationTransactionsHydration}
