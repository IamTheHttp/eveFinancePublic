import {logger} from "../../utils/logger/logger";
import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";

async function characterWalletHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const response = await esiNetworkDriver.getCharacterBalance(charAgg.getChar());
  const walletBalance = response.body

  if (shouldHandleResponse(response, charAgg.getChar(), 'Wallet')) {
    // fetch from db
    if (charAgg.getChar().walletBalance !== walletBalance) {
      charAgg.setFields({
        walletBalance
      })
      await charAgg.save();
      logger.success(`${charAgg.getChar().charName} - Wallet`)
    } else {
      logger.info(`${charAgg.getChar().charName} - Wallet - No new data`);
    }
  }
}

export default characterWalletHydration;
