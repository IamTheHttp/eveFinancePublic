import {IDALs} from "../../../dataSources/DAL/getAllDAL";
import {commonPreTestDbSetup} from "../../utils/commonPreTestDbSetup";
import {createCharAgg} from "../../../domains/characters/aggregates/createCharAgg";
import {createLicenseAggregate} from "../../../domains/licenses/aggregates/createLicenseAggregate";
import {getLicenseLogsDAL} from "../../../domains/characters/data/getLicenseLogsDAL";


describe('Test the Character entity', () => {
  let DALs: IDALs;

  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;
  });


  it.only('Creates a licenseLog from purchase', async () => {
    const licLogDAL = await getLicenseLogsDAL();

    // Create a character
    const charAgg = await createCharAgg({
      charID: 666
    });
    // Create a license
    const licAgg = await (await createLicenseAggregate()).setDefaultTrialValues().save();

    // Set license of the character
    charAgg.setLicense(licAgg.getLicense());

    // Ensure licenseLog is empty
    const logsBefore = await licLogDAL.getAllData();
    expect(logsBefore.length).toBe(0);
    expect(charAgg.getLicPurchaseToLog()).not.toBe(null);

    // Save
    await charAgg.save();

    // Ensure licenseLog is full
    const logsAfter = await licLogDAL.getAllData();
    expect(logsAfter.length).toBe(1);
    expect(charAgg.getLicPurchaseToLog()).toBe(null);

    // Set another license
    charAgg.setLicense(licAgg.getLicense());
    await charAgg.save();

    const logsAfter2nd = await licLogDAL.getAllData();
    expect(logsAfter2nd.length).toBe(2);
    expect(charAgg.getLicPurchaseToLog()).toBe(null);
  });
})