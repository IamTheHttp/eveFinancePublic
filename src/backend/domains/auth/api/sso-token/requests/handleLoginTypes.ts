import {registration} from "./registration";
import {loginWithDeletedChar} from "./loginWithDeletedChar";
import {corpAccessRequest} from "./corpAccessRequest";
import {logger} from "../../../../../utils/logger/logger";
import {IGetLoginCharResponse} from "../getCharacterAgg";
import {JWTResponse} from "../../../../../dataSources/ESI/SSO/interfaces/IJWTResponse";
import {LicensesDAL} from "../../../../licenses/data/LicensesDAL";

export interface IHandleLoginTypesInput {
  loginRequestCharacterData: IGetLoginCharResponse;
  JWTData: JWTResponse;
  licDAL: LicensesDAL;
}

export async function handleLoginTypes(handleLoginTypesInput: IHandleLoginTypesInput) {
  const {
    loginRequestCharacterData,
    JWTData,
    licDAL
  } = handleLoginTypesInput;


  const {
    charAgg,
    isCharAdmin,
    isCharDeleted,
    isCharPremium,
    isCorpAccessRequest,
    isLinkCharacterRequest,
    isRegistrationRequest,
  } = loginRequestCharacterData;





  switch (true) {
    case isRegistrationRequest: {
      await registration({
        licDAL,
        charAgg,
        JWTData: JWTData
      });
      break;
    }

    // Existing user, but it's deleted!
    // - Reset to trial
    case isCharDeleted: {
      await loginWithDeletedChar({
        licDAL,
        charAgg,
        JWTData: JWTData
      });
      break;
    }

    case isCorpAccessRequest: {
      await corpAccessRequest({
        licDAL,
        charAgg,
        JWTData: JWTData
      });
      break;
    }

    case isCharAdmin: {
      logger.info(`${charAgg.getChar().charName} - Log in with an admin account`);
      break;
    }
    // Existing user, and it's not deleted
    case isCharPremium: {
      logger.info(`${charAgg.getChar().charName} - Log in with a premium account`);
      break;
    }
  }

  // Reset the failed refresh token attempts since this is a new registration
  charAgg.setFields({
    failedRefreshTokenAttempts: 0
  });

  await charAgg.save();
}