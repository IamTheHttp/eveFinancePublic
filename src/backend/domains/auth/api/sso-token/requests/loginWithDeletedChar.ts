import {logger} from "../../../../../utils/logger/logger";
import {ILoginRequestPayload} from "./ILoginRequestPayload";

export async function loginWithDeletedChar(payload: ILoginRequestPayload) {
  const {charAgg, licDAL} = payload;

  logger.info(`${charAgg.getChar().charName} - Character login with isDeleted status`);
  const currentExpirationDate = charAgg.getChar().licenseExpirationDate;

  const licAgg = await licDAL.getTrialLicense();

  charAgg.setLicense(licAgg.getLicense());
  charAgg.setFields({
    status: 'trial',
    licenseExpirationDate: currentExpirationDate,
  });
}