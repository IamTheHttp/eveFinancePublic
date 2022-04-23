import {IDALs} from "../../../dataSources/DAL/getAllDAL";
import {commonPreTestDbSetup} from "../../utils/commonPreTestDbSetup";
import {CharacterModel} from "../../../domains/characters/models/CharacterModel";
import {createCharAgg} from "../../../domains/characters/aggregates/createCharAgg";
import {LicensesDAL} from "../../../domains/licenses/data/LicensesDAL";

describe('Test the Character entity', () => {
  let testChar: CharacterModel;
  let DALs: IDALs;

  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;
  });


  it ('Tests Collection.getActiveCharacters takes into account dates correctly', async () => {
    const charAgg = await createCharAgg();
    const knownChars = await charAgg.getActiveCharacters();
    const baseCharCount = knownChars.length;

    // Get the trial license of the system
    const licDAL = new LicensesDAL()
    const trialLicAgg = await licDAL.getTrialLicense();


    // If no trial license was found, create default license
    if (!trialLicAgg.getLicense().name) {
      trialLicAgg.setDefaultTrialValues();
      await trialLicAgg.save();
    }


    charAgg.setLicense(trialLicAgg.getLicense());
    charAgg.setFields({charID: 999999, charName: 'foo'});
    await charAgg.save();

    let chars = await charAgg.getActiveCharacters();
    expect(chars.length).toBe(baseCharCount + 1);


    // Assume character is out of license for 4 days, it should still be considered 'active'
    const dateStillActive = new Date();
    dateStillActive.setDate(dateStillActive.getDate() - 4)

    charAgg.setFields({licenseExpirationDate: dateStillActive});
    // save
    await charAgg.save();
    // check
    chars = await charAgg.getActiveCharacters();

    expect(chars.length).toBe(baseCharCount + 1);

    // Assume character is out of license for 6 days, it should not be active
    const dateExpired = new Date();
    dateExpired.setDate(dateExpired.getDate() - 6);
    charAgg.setFields({licenseExpirationDate: dateExpired});

    // save
    await charAgg.save();
    // check
    chars = await charAgg.getActiveCharacters();

    // Initially, this should've been baseCharCount due to filtering out of characters that their license is expired
    // However, this is now ignored
    // TODO LIMITED_TRIAL
    expect(chars.length).toBe(baseCharCount + 1);
  });
})