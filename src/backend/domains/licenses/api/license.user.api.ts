import {Express} from "express";
import {ServerError} from "../../../ServerError";
import {CharacterModel} from "../../characters/models/CharacterModel";
import {SystemResponse} from "../../../../sharedInterfaces/ApiSystemInteraces";
import {IUserLicensePostResponse} from "./interfaces/IUserLicensePostResponse";
import {LicenseLogModel} from "../../characters/models/LicenseLogModel";
import {getLicensesDAL} from "../data/getLicensesDAL";
import {getLicenseLogsDAL} from "../../characters/data/getLicenseLogsDAL";
import {createLicenseAggregate} from "../aggregates/createLicenseAggregate";
import {LicenseLogsDAL} from "../../characters/data/LicenseLogsDAL";
import {CharacterAggregate} from "../../characters/aggregates/CharacterAggregate";

async function licenseUserAPI(app: Express) {
  const licenseLogsDAL = await getLicenseLogsDAL();
  /**
   * User endpoint for purchasing a new license
   */
  app.post('/secure/license', async (req, res: SystemResponse<IUserLicensePostResponse>) => {
    const charAgg = res.locals.charAgg as CharacterAggregate;
    // Create a license
    const MILLION = 1000000;
    const licenseID = req.body.licenseID;
    const licAgg = await createLicenseAggregate(licenseID)


    // Can we buy this license?
    if (charAgg.getChar().creditBalance < licAgg.getLicense().priceInMillions * MILLION) {
      // Can't buy it
      // TODO respond with a proper error
      res.send({
        error: 'insufficient funds',
        data: {
          priceInMillions: 0,
          licenseExpirationDate: null
        },
        errorID: -1,
      });
    } else {
      // TODO this is a potential risk to rapid clicks
      // Reduce funds
      charAgg.getChar().creditBalance -= licAgg.getLicense().priceInMillions * MILLION;
      // Set license
      charAgg.setLicense(licAgg.getLicense());

      // Log the purchase
      const licLog = new LicenseLogsDAL();
      charAgg.setFields({trialUsed: true});

      await charAgg.save();

      res.send({
        data: {
          priceInMillions: licAgg.getLicense().priceInMillions,
          licenseExpirationDate: charAgg.getChar().licenseExpirationDate.toISOString(),
        },
        errorID: ServerError.OK,
      });
    }
  });
}

export default licenseUserAPI;
