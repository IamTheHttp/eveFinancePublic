import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {HydrationPayload} from "../character/hydrateAll";


async function corporationInformationHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const response = await esiNetworkDriver.getCorporationInformation(charAgg.getChar());

  if (shouldHandleResponse(response,charAgg.getChar(), 'Corporation Information')) {
    const corporationInformation = response.body;

    // Is this corporation name new?
    if (charAgg.getChar().corporationName !== corporationInformation.name) {
      charAgg.setFields({
        corporationName: corporationInformation.name
      })

      await charAgg.save();
      logger.success(`${charAgg.getChar().charName} - Corporation Information - Update corporation name`);
    } else {
      logger.info(`${charAgg.getChar().charName} - Corporation Information - No new data`);
    }
  }
}

export {corporationInformationHydration};
