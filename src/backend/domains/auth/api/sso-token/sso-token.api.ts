import {Express, Request, Response} from "express";
import {getFrontendURL} from "../../../../../config/publicConfig";
import {ESINetworkDriver} from "../../../../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {hydrateAll} from "../../../../hydration/character/hydrateAll";
import {logger} from "../../../../utils/logger/logger";
import {getVerifiedDataFromSSORequest} from "../../util/getVerifiedDataFromSSORequest";
import {isCharacterData} from "../../util/isCharacterData";
import {getLicensesDAL} from "../../../licenses/data/getLicensesDAL";
import {getLoginCharAgg} from "./getCharacterAgg";
import {handleLoginTypes} from "./requests/handleLoginTypes";
import {linkCharacter} from "./requests/linkCharacter";
import {refreshCharacterAccessToken} from "../../../../server/middlewares/refreshCharacterAccessToken";

/**
 * @param app
 * @param esiNetworkDriver
 */
async function ssoToken(app: Express, esiNetworkDriver: ESINetworkDriver) {
  const licDAL = await getLicensesDAL();

  app.get('/public/sso-token', async (req: Request, res: Response) => {
    const verificationData = await getVerifiedDataFromSSORequest(req, res);

    if (!isCharacterData(verificationData.data)) {
      logger.error('System - No character data found after login');
      return;
    }

    /*
     * Get loginRequestCharacterData to perform logins
     */
    const loginRequestCharacterData = await getLoginCharAgg({
      esiNetworkDriver,
      verificationData,
      loginType: req.query.state.toString(),
      sessionCharID: req.session.charID
    });


    /*
     * Handle various logins, such as registration, loginWithDeletedChar, etc.
     */
    await handleLoginTypes({
      loginRequestCharacterData,
      JWTData: verificationData.JWTData,
      licDAL
    });

    const {
      charAgg,
      isCorpAccessRequest,
      isLinkCharacterRequest
    } = loginRequestCharacterData;

    const CHAR_ID = charAgg.getChar().charID;

    /*
     * Once we handled the login of the various types, the login itself can be with a linked character
     * If it's a linkCharacterRequest, we try to link it
     */
    if (isLinkCharacterRequest && req.session.charID !== CHAR_ID) {
      await linkCharacter({
        sessionCharID: req.session.charID,
        charToLink: charAgg
      });
    }



    // In certain situations, we do not touch the character SSO
    // For example, if it's an existing character, we already have the SSO data stored.
    // Refresh tokens are allegedly forever, but what if they're no longer valid for some reason?

    // This means the existing SSO data is NOT valid, and NOT good!
    // We need to store the new SSO data.
    // If this is false-ish, store the new information, and reset corporation access
    // Verify token validity
    // @ts-ignore


    const refreshStatus = await refreshCharacterAccessToken(charAgg);

    if (refreshStatus.isError) {
      logger.error(`${charAgg.getChar().charName} - Login error, Invalid refresh token found(missing or invalid), storing a new refresh token`!);
      charAgg.setSSOConfigFromJWT(verificationData.JWTData);

      await charAgg.save();
    } else {
      logger.raise(`${charAgg.getChar().charName} - Successfully reused existing refresh token`);
    }

    // Hydrate this character, we don't wait for it to finish for the user to redirect
    hydrateAll(charAgg,true,  esiNetworkDriver);

    // In case of regular login/register (not isLinkCharacterRequest or isCorpAccessRequest)
    // we set the session of the CHAR_ID (to log in)
    // For linked characters, we want to keep the user logged in with his previous session charID
    if (!isLinkCharacterRequest && !isCorpAccessRequest) {
      logger.info(`${charAgg.getChar().charName} - Logging in the character - setting session`);
      req.session.charID = CHAR_ID;
    }

    // When we give corp access, we're coming from the account page, we need to return there!
    if (isCorpAccessRequest) {
      res.redirect(`${getFrontendURL()}/account`);
    } else {
      res.redirect(getFrontendURL());
    }
  });
}

export default ssoToken;
