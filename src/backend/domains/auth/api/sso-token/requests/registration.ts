import {logger} from "../../../../../utils/logger/logger";
import {ILoginRequestPayload} from "./ILoginRequestPayload";



export async function registration(registrationPayload: ILoginRequestPayload) {
  const {licDAL, charAgg, JWTData} = registrationPayload;

  logger.info(`${charAgg.getChar().charName} - new registration`);


  // Get the trial license of the system
  const licAgg = await licDAL.getTrialLicense();

  // If no trial license was found, create default license
  if (!licAgg.getLicense().name) {
    licAgg.setDefaultTrialValues();
    await licAgg.save();
  }

  logger.info(`${charAgg.getChar().charName} - Setting trial license to new registration`);
  charAgg.setTrialLicense(licAgg.getLicense());
  charAgg.setSSOConfigFromJWT(JWTData);

  charAgg.setFields({
    registrationDate: new Date(),
    creditBalance: 0, // Empty balance upon registration
    gaveCorporationPermission: false,
  })
}