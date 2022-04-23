import {IDALs} from "../../dataSources/DAL/getAllDAL";
import {commonPreTestDbSetup} from "../utils/commonPreTestDbSetup";
import {CharacterDocument} from "../../domains/characters/documents/CharacterDocument";


const TYPE_IDS = {
  TESSERACT_CAPACITOR_UNIT: 11554,
  SUPER_CONDUCTORS: 9838,
  CAP_RECHARGER_I: 1195
}

// Testing for 10 units of cap recharger II
const KNOWN_NEEDED_ITEMS_FOR_CAP_RECHARGER_II = [
  {
    id: 1195, // cap recharger I
    neededPerItem: 1
  },
  {
    id: 11482, // RAM energy tech
    neededPerItem: 1
  },
  {
    id: 11399, // Morphite
    neededPerItem: 3
  },
  {
    id: 11539, // Nanoelectrical Microprocessor
    neededPerItem: 1
  },
  {
    id: 11554, // Tesseract Capacitor Unit
    neededPerItem: 1
  },
  {
    id: 9838, // Superconductors
    neededPerItem: 5
  },
]

describe('Test the QuotasDAL', () => {
  let DALs: IDALs;
  let testCharacter:CharacterDocument
  beforeEach(async () => {
    const dbReady = await commonPreTestDbSetup();
    DALs = dbReady.DALs;
    testCharacter = dbReady.testCharacter;

    await dbReady.DALs.quotasDAL.upsert({
      apiCharID: testCharacter.charID,
      amount: 10,
      typeID: 2032,
      createdDate: new Date(),
      completionDate: null,
      isOpen: true
    });

  }, 400000)

  it('Calculates missing materials based on home station', async () => {
    const quotas = await DALs.quotasDAL.getProductionQuotas(testCharacter);

    // Add stock of THIS character
    const MAIN_LOCATION_ID = Date.now() + Math.random();
    await DALs.assetsDAL.upsert({
      item_id: MAIN_LOCATION_ID,
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: 666,
      type_id: TYPE_IDS.TESSERACT_CAPACITOR_UNIT, // Tesseract capacitor unit
      quantity: 10 // we have a lot of stock!
    });

    // Add stock of THIS character in a container
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(),
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: MAIN_LOCATION_ID,
      type_id: TYPE_IDS.TESSERACT_CAPACITOR_UNIT, // Tesseract capacitor unit
      quantity: 20 // we have a lot of stock!
    });

    // Add stock of THIS character, in some far away station
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(),
      is_singleton: false,
      apiCharID: testCharacter.charID,
      location_id: 666 * 111,
      type_id: TYPE_IDS.TESSERACT_CAPACITOR_UNIT, // Tesseract capacitor unit
      quantity: 1000 // we have a lot of stock!
    });

    // Add stock of linked character
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(),
      is_singleton: false,
      apiCharID: testCharacter.linkedCharacters[0],
      location_id: 666,
      type_id: TYPE_IDS.TESSERACT_CAPACITOR_UNIT ,
      quantity: 100 // we have a lot of stock!
    });

    // Add stock of linked character
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(),
      is_singleton: false,
      apiCharID: testCharacter.linkedCharacters[0],
      location_id: 666,
      type_id: TYPE_IDS.SUPER_CONDUCTORS ,
      quantity: 100000 // we have a lot of stock!
    });

    // Add stock of linked character in a far away station
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(),
      is_singleton: false,
      apiCharID: testCharacter.linkedCharacters[0],
      location_id: 666 * 231,
      type_id: TYPE_IDS.SUPER_CONDUCTORS ,
      quantity: 555 // we have a lot of stock!
    });

    // Add stock of some other unknown character
    await DALs.assetsDAL.upsert({
      item_id: Date.now() + Math.random(), // Has to be unique!
      is_singleton: false,
      apiCharID: testCharacter.charID * 111, // something random
      location_id: 666,
      type_id: TYPE_IDS.CAP_RECHARGER_I,
      quantity: 100000 // we have a lot of stock!
    });

    const materialsNeeded = await DALs.quotasDAL.getMaterialsForQuotas(testCharacter);

    materialsNeeded.forEach((neededItem) => {
      const dbItemNeededForCapI = KNOWN_NEEDED_ITEMS_FOR_CAP_RECHARGER_II.find((e) => {
        return e.id === neededItem._id
      });

      if (neededItem._id === TYPE_IDS.SUPER_CONDUCTORS) {
        expect(neededItem.quantityInAssets).toBe(100000);
      }

      if (neededItem._id === TYPE_IDS.TESSERACT_CAPACITOR_UNIT) {
        expect(neededItem.quantityInAssets).toBe(130); // 10 + 20 + 100
      }

      if (neededItem._id === TYPE_IDS.CAP_RECHARGER_I) {
        expect(neededItem.quantityInAssets).toBe(0); // All stock is in some other unknown character
      }

      expect(dbItemNeededForCapI.neededPerItem * quotas[0].amount).toBe(neededItem.neededForAllQuotas);
    });
  });

  // TODO Uncomment
  // it('Calculates available BPC runs', async () => {
  //   const quotas = await DALs.quotasDAL.getProductionQuotas(testCharacter);
  //
  //   await DALs.blueprintsDAL.upsert({
  //     "item_id" : 1035372032953.0,
  //     "apiCharID" : 91335790,
  //     "apiCorpID" : 98235357,
  //     "location_flag" : "CorpSAG2",
  //     "location_id" : 1035096151104.0,
  //     "material_efficiency" : 3,
  //     "quantity" : -2,
  //     "runs" : 2,
  //     "time_efficiency" : 2,
  //     "type_id" : 2032
  //   });
  //
  //   console.log(quotas);
  // });

  afterAll(async () => {

  });
})