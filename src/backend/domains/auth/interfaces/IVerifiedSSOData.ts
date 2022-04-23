import {ICharacterDataFromAccessToken} from "../../../dataSources/ESI/SSO/interfaces/ICharacterDataFromAccessToken";
import {JWTResponse} from "../../../dataSources/ESI/SSO/interfaces/IJWTResponse";

export interface IVerifiedSSOData {
  data: ICharacterDataFromAccessToken | {},
  isError: boolean,
  JWTData: JWTResponse
}