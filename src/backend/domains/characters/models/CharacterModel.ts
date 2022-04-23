import {JWTResponse} from "../../../dataSources/ESI/SSO/interfaces/IJWTResponse";
import {License} from "../../licenses/entities/License";
import {CharacterDocument, ISSO} from "../documents/CharacterDocument";
import {addDays} from "../../../__TESTS__/utils/addDays";
import {logger} from "../../../utils/logger/logger";


/**
 * Models contain business logic around the documents
 * An aggregate contains a Model within it for various operations.
 */
class CharacterModel extends CharacterDocument {
  constructor(characterFields?: Partial<CharacterDocument>) {
    super();
    // Defaults
    if (characterFields) {
      characterFields.registrationDate = characterFields.registrationDate || new Date();
      characterFields.lastSeen = characterFields.lastSeen || new Date();
      characterFields.stockStations = characterFields.stockStations || [];
      characterFields.linkedCharacters = characterFields.linkedCharacters || [];
      characterFields.createdDate = characterFields.createdDate || new Date();
      characterFields.creditBalance = characterFields.creditBalance || 0;
      characterFields.failedRefreshTokenAttempts = characterFields.failedRefreshTokenAttempts || 0;
      characterFields.corporationName = characterFields.corporationName || 'Unknown corporation';
      characterFields.gaveCorporationPermission = characterFields.gaveCorporationPermission || false;

      Object.keys(characterFields).forEach((key: string) => {
        if (characterFields.hasOwnProperty(key)) {
          if (key === 'licenseExpirationDate') {
            this[key] = new Date(characterFields[key]);
          } else {
            // @ts-ignore
            this[key] = characterFields[key];
          }
        }
      });
    }
  }

  isLicenseExpired() {
    return this.licenseExpirationDate < new Date();
  }

  setLicense(license: License) {
    if (!license || !license._id) {
      logger.error(`${this.charName}:${this.charID} - Tried to save a license without a licenseID for character`);
      return false;
    }

    // User already has a license
    if (this.licenseID) {
      // Is it the same license? is it not trial?
      if (this.licenseID.toString() === license._id.toString() && !license.isTrial) {
        // Is this license already expired?
        if (new Date() > this.licenseExpirationDate) {
          // Replace licenses
          this.licenseExpirationDate = addDays(new Date(), license.durationInDays);
        } else {
          // Extend licenses
          this.licenseExpirationDate = addDays(new Date(this.licenseExpirationDate), license.durationInDays);
        }
      } else {
        // The added license is different than what the user has
        // if the new license we try to add is not a trial
        if (!license.isTrial) {
          this.status = 'premium';
          this.licenseID = license._id;
          this.licenseExpirationDate = license.getNewExpirationDate();
          // Not the same license, so we need to replace the existing one, assuming the new one is not trial.
        }
      }
    } else {
      // User has no license set
      this.licenseID = license._id;
      this.licenseExpirationDate = license.getNewExpirationDate();
      // Ensure correct user status
      if (license.isTrial) {
        this.status = 'trial'
      } else {
        this.status = 'premium';
      }
    }

    return this;
  }

  isAccessTokenStale(): boolean {
    return new Date() >= new Date(this.sso.accessTokenExpiration || Date.now());
  }

  setLastSeen(datetime: Date) {
    this.lastSeen = datetime;
  }


  setSSOConfig(ssoConfig: ISSO) {
    this.sso = ssoConfig;
  }

  setSSOConfigFromJWT(JWTData: JWTResponse | null) {
    if (JWTData === null) {
      this.setSSOConfig({
        accessTokenExpiration: null,
        accessToken: null,
        refreshToken: null
      });
    } else {
      this.setSSOConfig({
        accessTokenExpiration: new Date(Date.now() + (1000 * JWTData.expires_in)),
        accessToken: JWTData.access_token,
        refreshToken: JWTData.refresh_token
      });
    }

    return this;
  }

  json() {
    try {
      return JSON.parse(JSON.stringify(this));
    } catch(e) {
      logger.error(`${__filename} - ${e}`);
      return {};
    }
  }
}

export {CharacterModel};