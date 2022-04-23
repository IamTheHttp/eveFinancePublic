import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {HydrationPayload} from "../character/hydrateAll";


async function corpBalanceHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const response = await esiNetworkDriver.getCorporationBalance(charAgg.getChar());

  if (shouldHandleResponse(response, charAgg.getChar(), 'Corporation Wallet')) {
    const walletBalances = response.body;

    const totalCorpWallet = walletBalances.reduce((prev, current) => {
      return prev += current.balance;
    }, 0);


    charAgg.setFields({
      totalCorporationBalance: totalCorpWallet,
      corporationBalanceByDivision: walletBalances
    })

    await charAgg.save();

    logger.success(`${charAgg.getChar().charName} - Corporation - Balance`);
  }
}

export default corpBalanceHydration;
