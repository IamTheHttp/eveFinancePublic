import {isAdminPath} from "../../utils/isAdminPath";
import {Express} from "express";
import {isPublicPath} from "../../utils/isPublicPath";
import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {refreshCharacterAccessToken} from "./refreshCharacterAccessToken";
import {isAuthPath} from "../../utils/isAuthPath";
import {ServerError} from "../../ServerError";
import {isSecurePath} from "../../utils/isSecurePath";
import {createCharAgg} from "../../domains/characters/aggregates/createCharAgg";
import {createLicenseAggregate} from "../../domains/licenses/aggregates/createLicenseAggregate";


async function ensureAuth(app: Express, DALs: IDALs) {

  app.use(async (req, res, next) => {
    const requestedPath = req.originalUrl.split('?')[0];

    if (isPublicPath(requestedPath)) {
      // No questions needed, no character data needed
      return next();
    }

    // If it's not a public path, and no character is found, this is invalid
    // This happens when a user has a session in the browser but no character in DB

    const charAgg = await createCharAgg(req.session.charID);

    // A user came with a sessionID(logged in), but we can't find his character
    if (!charAgg.getChar().charID) {
      return res.send({
        data: {},
        errorID: ServerError.ERR_CHAR_LOGGED_OUT,
        error: 'Not logged in'
      });
    }

    const refreshTokenResponse = await refreshCharacterAccessToken(charAgg);

    await charAgg.reload();
    const character = charAgg.getChar();
    charAgg.setLastSeen();
    await charAgg.save();

    if (!character.isAccessTokenStale()) {
      res.locals.character = character;
      res.locals.charAgg = charAgg;

      // Admins always pass anywhere forever.
      if (res.locals.character.status === 'admin') {
        return next();
      }

      // Handle unauthorized requests
      // If secure path, but user is does not have license
      // This is used to verify all API requests
      const licAgg = await createLicenseAggregate(character.licenseID);

      // Trial users can log in for free
      // TODO modify this once we want trial to be a limited trial (LIMITED_TRIAL)
      if (character.status !== 'trial') {
        const isLicenseExpired = character.licenseExpirationDate < new Date();

        if (isAuthPath(requestedPath) && isLicenseExpired) {
          return res.send({
            data: {},
            errorID: ServerError.ERR_NO_LICENSE,
            error: 'No license found for character'
          });
        }
      }



      const isMaxCharsExceeded = character.linkedCharacters.length + 1 > licAgg.getLicense().maxCharacters;
      if (isAuthPath(requestedPath) && isMaxCharsExceeded) {
        return res.send({
          data: {},
          errorID: ServerError.ERR_NO_LICENSE,
          error: 'Max characters exceeded'
        });
      }

      // Handle unauthorized requests
      // If admin path, but user is not admin, redirect
      if (isAdminPath(requestedPath) && res.locals.character.status !== 'admin') {
        return res.send({
          oops: 'no admin :(...'
        });
      }

      if (isSecurePath(requestedPath)) {
        return next();
      }

      if (isAuthPath(requestedPath)) {
        return next();
      }
    } else {
      return res.send({
        data: {},
        errorID: ServerError.ERR_AUTH_TOKEN,
        error: `${refreshTokenResponse.error} - ${refreshTokenResponse.errorDescription}`
      });
    }
  });
}

export default ensureAuth;
