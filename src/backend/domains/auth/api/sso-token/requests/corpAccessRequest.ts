import {logger} from "../../../../../utils/logger/logger";
import {ILoginRequestPayload} from "./ILoginRequestPayload";

export async function corpAccessRequest(payload: ILoginRequestPayload) {
  const {charAgg, JWTData} = payload;

  logger.info(`${charAgg.getChar().charName} - Corporation access request - giving corporation access`);
  // TODO this belongs inside the charAgg?
  charAgg.setSSOConfigFromJWT(JWTData);
  charAgg.setFields({gaveCorporationPermission: true});
}