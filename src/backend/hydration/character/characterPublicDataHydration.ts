import {HydrationPayload} from "./hydrateAll";
import {logger} from "../../utils/logger/logger";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";


async function characterPublicDataHydration({charAgg, esiNetworkDriver}: HydrationPayload) {
  const response = await esiNetworkDriver.getPublicData(charAgg.getChar());

  if(shouldHandleResponse(response, charAgg.getChar(), "Public Data")) {
    const publicCharacterData = response.body;
    const resHasCorpID = publicCharacterData.corporation_id;

    //extend
    if (resHasCorpID && charAgg.getChar().corporationID !== publicCharacterData.corporation_id) {

      // re save
      charAgg.setFields({
        corporationID:publicCharacterData.corporation_id
      });

      await charAgg.save();
      logger.success(`${charAgg.getChar().charName} - Public Data - Updated corporationID`);
    } else {
      logger.info(`${charAgg.getChar().charName} - Public Data - No new data`);
    }
  }
}
export default characterPublicDataHydration;
