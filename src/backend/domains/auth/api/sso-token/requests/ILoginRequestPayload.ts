import {LicensesDAL} from "../../../../licenses/data/LicensesDAL";
import {CharacterAggregate} from "../../../../characters/aggregates/CharacterAggregate";
import {JWTResponse} from "../../../../../dataSources/ESI/SSO/interfaces/IJWTResponse";

export interface ILoginRequestPayload {
  licDAL: LicensesDAL,
  charAgg: CharacterAggregate,
  JWTData: JWTResponse
}