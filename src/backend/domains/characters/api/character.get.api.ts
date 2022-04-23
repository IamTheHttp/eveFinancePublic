import {Express} from "express";
import {ServerValidations} from "../../../ServerValidations";
import {CharacterAggregate} from "../aggregates/CharacterAggregate";
import {createLicenseAggregate} from "../../licenses/aggregates/createLicenseAggregate";

async function getCharacterInfo(app: Express) {

  app.get('/secure/getCharacterInfo', async (req, res) => {
    // TODO if the trial is over, and has no license, we should fail here.
    // Should be cached to prevent abuse ?
    const charAgg: CharacterAggregate = res.locals.charAgg;


    const isDeletedValidation = ServerValidations.isCharacterDeleted(charAgg.getChar());
    const isCharacterLinked = ServerValidations.isCharacterLinked(charAgg.getChar());



    // Mark character's license as used
    if (charAgg.getChar().isLicenseExpired() && charAgg.getChar().trialUsed === false) {
      charAgg.setFields({
        trialUsed: true
      });
      await charAgg.save();
    }

    // TODO why do we need this?
    if (isDeletedValidation.errorID) {
      return res.send({
        data: {
          LOGIN_ERROR: 'Cannot login with a deleted character'
        },
        errorID: isDeletedValidation.errorID,
        error: isDeletedValidation.error
      });
    }

    // Linked characters can't log in
    if (isCharacterLinked.errorID) {
      return res.send({
        data: {
          LOGIN_ERROR: 'Cannot login with a linked character - Please login with your main account'
        },
        errorID: isCharacterLinked.errorID,
        error: isCharacterLinked.error
      });
    }


    const licAgg = await createLicenseAggregate(charAgg.getChar().licenseID)

    const {
      charName,
      charID,
      walletBalance,
      totalCorporationBalance,
      corporationBalanceByDivision,
      linkedCharacters,
      linkedCharactersData,
      stockStations,
      corporationName,
      status,
      creditBalance,
      licenseExpirationDate,
      gaveCorporationPermission
    } = res.locals.character;

    // ensure it's in the response
    let balanceByDivision = corporationBalanceByDivision || [];

    res.send({
      data: {
        LIC_MAX_CHAR: status === 'admin' ? 999 : licAgg.getLicense().maxCharacters,
        licenseExpirationDate,
        charName,
        status,
        charID,
        walletBalance,
        creditBalance,
        totalCorporationBalance,
        corporationBalanceByDivision: balanceByDivision,
        linkedCharacters, // array of IDs
        linkedCharactersData, // data on linkedCharacters
        stockStations,
        corporationName,
        gaveCorporationPermission
      }
    });
  });
}

export default getCharacterInfo;
