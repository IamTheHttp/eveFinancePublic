import {IDALs} from "../../../dataSources/DAL/getAllDAL";
import {commonPreTestDbSetup} from "../../utils/commonPreTestDbSetup";
import {CharacterModel} from "../../../domains/characters/models/CharacterModel";
import {CharacterDocument} from "../../../domains/characters/documents/CharacterDocument";
import {addDays} from "../../utils/addDays";
import {createCharAgg} from "../../../domains/characters/aggregates/createCharAgg";
import {createLicenseAggregate} from "../../../domains/licenses/aggregates/createLicenseAggregate";


function diffWithinTolerance(date1: Date, date2: Date, toleranceInMs: number) {
  return Math.abs(date1.getTime() - date2.getTime()) < toleranceInMs;
}

function getLicExpTime(char: CharacterModel) {
  return char.licenseExpirationDate.getTime();
}


describe('Test the Character entity', () => {
  let testChar: CharacterDocument;
  let DALs: IDALs;


  beforeAll(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;

    testChar = dbReady.testCharacter;
  });


  it ('Creates, saves and loads a character', async () => {
    const charAgg1 = await createCharAgg({charID: 999999, charName: 'foo'});
    const charAgg2 = await createCharAgg({charID: 111111, charName: 'bar'});

    charAgg1.setFields({charID: 999999, charName: 'foo'});
    await charAgg1.save();

    charAgg2.setFields({charID: 111111, charName: 'bar'})
    await charAgg2.save();


    const charAgg1FromDB = await createCharAgg(charAgg1.getChar().charID);
    const charAgg2FromDB = await createCharAgg(charAgg2.getChar().charID);

    expect(charAgg1FromDB.getChar().charName).toBe('foo');
    expect(charAgg2FromDB.getChar().charName).toBe('bar');
  });

  it ('Extends a license of a character with an expired license', async () => {
    const licAgg = await createLicenseAggregate();

    const char1 = new CharacterModel();
    const char2 = new CharacterModel();

    // Create a new license
    licAgg.setDefaultTrialValues()
    licAgg.setFields({isTrial: false});

    await licAgg.save();

    char1.setLicense(licAgg.getLicense());
    expect(char1.licenseID).toBeTruthy();
    char2.setLicense(licAgg.getLicense());

    // We expect that both characters have the same expiration date
    expect(diffWithinTolerance(char1.licenseExpirationDate, char2.licenseExpirationDate, 10) ).toBeTruthy();

    char1.licenseExpirationDate = addDays(new Date(), -365);

    // We now expect that `char1` has previous date
    expect(getLicExpTime(char1)).toBeLessThan(getLicExpTime(char2));

    // re-apply the license, since the character has an old license, it should be treated as a new character
    // Roughly, give or take a few milliseconds
    char1.setLicense(licAgg.getLicense());
    expect(diffWithinTolerance(char1.licenseExpirationDate, char2.licenseExpirationDate, 10) ).toBeTruthy();
  });

  it ('Extends a license of a character with an active license', async () => {
    // const char1 = new Character();
    const licAgg = await createLicenseAggregate();
    const char1 = new CharacterModel();

    // Create a new license
    licAgg.setDefaultTrialValues()
    licAgg.setFields({isTrial: false});
    await licAgg.save();


    // Extend once, assume the end date is based on the license
    const firstExpectedDate = addDays(new Date(), licAgg.getLicense().durationInDays)
    // Extend Second time, assume the end date is based on the licenseExpirationDate
    const secondExpectedDate = addDays(new Date(firstExpectedDate), licAgg.getLicense().durationInDays);

    expect(secondExpectedDate.getTime()).toBeGreaterThan(firstExpectedDate.getTime());

    // First time adding license, we should match the firstExpectedDate
    char1.setLicense(licAgg.getLicense());
    expect(diffWithinTolerance(char1.licenseExpirationDate, firstExpectedDate, 10) ).toBeTruthy();
    expect(char1.licenseID).toBeTruthy();

    // Second time adding license, we should match the firstExpectedDate
    char1.setLicense(licAgg.getLicense());
    expect(diffWithinTolerance(char1.licenseExpirationDate, secondExpectedDate, 10) ).toBeTruthy();
  });

  it ('Ensures a user can replace his license', async () => {
    // const char1 = new Character();
    const licAgg1 = await createLicenseAggregate();
    const licAgg2 = await createLicenseAggregate();
    const char1 = new CharacterModel();

    // Create a new license
    licAgg1.setDefaultTrialValues()
    licAgg1.setFields({isTrial: false});
    await licAgg1.save();

    // Create a new license
    licAgg2.setDefaultTrialValues()
    licAgg2.setFields({isTrial: false});
    await licAgg2.save();


    // Extend once, assume the end date is based on the license
    const firstExpectedDate = addDays(new Date(), licAgg1.getLicense().durationInDays)
    // Extend Second time, assume the end date is based on the licenseExpirationDate
    const secondExpectedDate = addDays(new Date(), licAgg2.getLicense().durationInDays);

    // First time adding license, we should match the firstExpectedDate
    char1.setLicense(licAgg1.getLicense());
    const LIC_ID_1 = char1.licenseID;
    expect(diffWithinTolerance(char1.licenseExpirationDate, firstExpectedDate, 10) ).toBeTruthy();
    expect(char1.licenseID).toBeTruthy();
    //
    // // Second time adding license, we should match the firstExpectedDate
    char1.setLicense(licAgg2.getLicense());
    const LIC_ID_2 = char1.licenseID;
    expect(diffWithinTolerance(char1.licenseExpirationDate, secondExpectedDate, 10) ).toBeTruthy();

    // Confirm we replaced the license and not extend it
    expect(secondExpectedDate.getTime()).toEqual(firstExpectedDate.getTime());
    expect(LIC_ID_1).not.toEqual(LIC_ID_2);
  });
})