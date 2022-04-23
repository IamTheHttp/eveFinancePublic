import {IVerifiedSSOData} from "../interfaces/IVerifiedSSOData";
import {isCharacterData} from "./isCharacterData";
import {ESINetworkDriver} from "../../../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {CharacterAggregate} from "../../characters/aggregates/CharacterAggregate";
import {createCharAgg} from "../../characters/aggregates/createCharAgg";

/**
 * Handle several character update steps when a new login happens
 * - Get public Data
 * - Set corpID
 * - Set CharName
 * @param esiNetworkDriver
 * @param verifiedSSOData
 */
export async function getUpdatedCharacter(esiNetworkDriver: ESINetworkDriver, verifiedSSOData: IVerifiedSSOData): Promise<CharacterAggregate> {
  // Try to fetch character from the database
  if (!isCharacterData(verifiedSSOData.data)) {
    return null
  }

  const charAgg = await createCharAgg(verifiedSSOData.data.CharacterID);
  const charID = charAgg.getChar().charID;

  // Calculate corporationID
  const publicDataRequest = await esiNetworkDriver.getPublicDataByCharID(charID, verifiedSSOData.JWTData.access_token);
  const publicData = publicDataRequest.body;

  let corpID = 0;

  if (publicDataRequest.cache || publicDataRequest.error) {
    // TODO this is business logic that should be in the aggregate
    corpID = charAgg.getChar().corporationID || 0;
  } else {
    corpID = publicData.corporation_id;
  }

  charAgg.setFields({
    corporationID: corpID,
    charName: verifiedSSOData.data.CharacterName,
    charID: verifiedSSOData.data.CharacterID
  });

  return charAgg;
}