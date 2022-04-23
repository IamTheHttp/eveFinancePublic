import {ICharacterDataFromAccessToken} from "../../../dataSources/ESI/SSO/interfaces/ICharacterDataFromAccessToken";

export function isCharacterData(input: any): input is ICharacterDataFromAccessToken {
  return input.CharacterID && input.CharacterName;
}