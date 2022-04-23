import {getUpdatedCharacter} from "../../util/getUpdatedCharacter";
import {ESINetworkDriver} from "../../../../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {IVerifiedSSOData} from "../../interfaces/IVerifiedSSOData";
import {CharacterAggregate} from "../../../characters/aggregates/CharacterAggregate";



export interface IGetLoginCharAggInput {
  esiNetworkDriver: ESINetworkDriver,
  verificationData: IVerifiedSSOData,
  loginType: string,  // query state
  sessionCharID: number
}

export interface IGetLoginCharResponse {
  isRegistrationRequest: boolean;
  isCharDeleted: boolean;
  isCharAdmin: boolean;
  isCharPremium: boolean;
  isLinkCharacterRequest: boolean;
  isCorpAccessRequest: boolean;
  charAgg: CharacterAggregate
}

export async function getLoginCharAgg(getLoginCharAggInput: IGetLoginCharAggInput): Promise<IGetLoginCharResponse> {
  const {
    esiNetworkDriver,
    verificationData,
    loginType,  // query.state (corporation-access, link-character-request or nothing
    sessionCharID
  } = getLoginCharAggInput

  const charAgg = await getUpdatedCharacter(esiNetworkDriver, verificationData);
  const CHAR_STATUS = charAgg.getChar().status;

  return {
    charAgg,
    isRegistrationRequest: CHAR_STATUS === 'new',
    isCharDeleted: CHAR_STATUS === 'deleted',
    isCharAdmin: CHAR_STATUS === 'admin',
    isCharPremium: CHAR_STATUS === 'premium',
    isLinkCharacterRequest: !!(loginType === 'link-character-request' && sessionCharID),
    isCorpAccessRequest: !!(loginType === 'corporation-access' && sessionCharID)
  }
}