import {Express, Request} from "express";
import {ServerError} from "../../../ServerError";
import {ILicensePostRequestData} from "./interfaces/ILicensePostRequestData";
import {SystemResponse} from "../../../../sharedInterfaces/ApiSystemInteraces";
import {sendValidationResponse} from "../../../sendValidationResponse";
import {IDataSavedSuccessResponse} from "../../../server/IDataSavedSuccessResponse";
import {ILicensesGetResponse} from "./interfaces/ILicensesGetResponse";
import {IDataDeletedSuccessResponse} from "../../../server/IDataDeletedSuccessResponse";
import {LicenseLogModel} from "../../characters/models/LicenseLogModel";
import {getLicensesDAL} from "../data/getLicensesDAL";
import {getLicenseLogsDAL} from "../../characters/data/getLicenseLogsDAL";
import {LicensesDAL} from "../data/LicensesDAL";
import {createLicenseAggregate} from "../aggregates/createLicenseAggregate";
import {LicenseLogsDAL} from "../../characters/data/LicenseLogsDAL";

async function licensesAPI(app: Express) {
  const licDAL = await getLicensesDAL();
  const licenseLogsDAL = await getLicenseLogsDAL();

  app.get('/public/licenses', async (req, res: SystemResponse<ILicensesGetResponse>) => {

    req.res.send({
      data: await licDAL.getAllData(),
      errorID: ServerError.OK,
    });
  });

  /**
   * Admin endpoint for creating a new license in the system
   */
  app.post('/admin/licenses', async (req: Request<{}, {}, ILicensePostRequestData>, res: SystemResponse<IDataSavedSuccessResponse>) => {
    const licAgg = await createLicenseAggregate(req.body);
    const licDAL = new LicensesDAL();
    const validationResponse = licAgg.validate();

    if (validationResponse.isError) {
      return sendValidationResponse(res,validationResponse);
    }

    if (licAgg.getLicense().isTrial) {
      await licDAL.clearIsTrial();
    }

    await licAgg.save();

    res.send({
      data: {
        saved: true
      },
      errorID: ServerError.OK,
    });
  });

  app.get('/admin/licenseLogs', async (req, res) => {
    const licenseLogsDAL = await getLicenseLogsDAL();

    const data = await licenseLogsDAL.getAllLogs({limit: 50});
    const jsonReadyData = data.map((v) => v.toJSON())

    res.send({
      data: jsonReadyData,
      errorID: ServerError.OK,
    });
  });

  app.delete('/admin/licenses/:licenseID', async (req, res: SystemResponse<IDataDeletedSuccessResponse>) => {
    // TODO - What do we do when we delete a license that's active?
    //      - What happens to users who have this license?
    const licDAL = new LicensesDAL();

    const result = await licDAL.deleteByID(req.params.licenseID);

    res.send({
      data: {
        deleted: result.deletedCount > 0
      },
      errorID: ServerError.OK,
    });
  });
}

export default licensesAPI;
