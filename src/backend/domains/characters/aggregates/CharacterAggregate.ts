import {CharactersDAL} from "../data/CharactersDAL";
import {CharacterModel} from "../models/CharacterModel";
import {CharacterDocument, ISSO} from "../documents/CharacterDocument";
import {License} from "../../licenses/entities/License";
import {JWTResponse} from "../../../dataSources/ESI/SSO/interfaces/IJWTResponse";
import {createCharAgg} from "./createCharAgg";
import {LicenseLogModel} from "../models/LicenseLogModel";

class CharacterAggregate {
  private characterModel: CharacterModel;
  // The recent licence purchase we need to log, could be null
  private licPurchaseToLog: LicenseLogModel;

  // TODO An aggregate shouldn't save itself, remove all DAL references...
  constructor(private dal?: CharactersDAL) {
    this.dal = dal || new CharactersDAL();
    this.characterModel = new CharacterModel();
    this.licPurchaseToLog = null;
  }

  json() {
    return {
      characterData: this.characterModel.json()
    }
  }

  getLicPurchaseToLog(): LicenseLogModel { return this.licPurchaseToLog; }
  getChar(): CharacterModel { return this.characterModel; }

  setFields(fields: Partial<CharacterDocument>):this {
    Object.assign(this.characterModel, fields);
    return this;
  }

  async updateLinkedCharactersLicense(character: CharacterModel) {
    return await this.dal.getTable().updateMany({
      charID: { $in: character.linkedCharacters || [] }
    }, {
      $set: {
        licenseExpirationDate: character.licenseExpirationDate,
        licenseID: character.licenseID,
        status: 'linked',
        trialUsed: character.trialUsed
      }
    });
  }

  linkCharacters(charID: number) {
    this.characterModel.linkedCharacters.push(charID);
  }

  unlinkCharacter(charID: number) {
    this.characterModel.linkedCharacters = this.characterModel.linkedCharacters.map((id) => {
      return charID === id ? 0 : id;
    }).filter(a => a);
  }


  isCharacterLinked(charID: number) {
    return this.characterModel.linkedCharacters.indexOf(charID) !== -1;
  }

  setTrialLicense(lic:License) {
    return this.setLicense(lic, 'Setting trial license to new registration')
  }

  setLastSeen() {
    return this.characterModel.setLastSeen(new Date());
  }

  setLicense(lic:License, message = 'Purchased license by user') {
    this.characterModel.setLicense(lic);
    // Create a new purchase log for the user...

    // Log the purchase
    this.licPurchaseToLog = new LicenseLogModel({
      ISKPaid: lic.isTrial ? 0 :  lic.priceInMillions, // TODO any other non trial login will register the price(like admin)
      characterID: this.characterModel.charID,
      date: new Date(),
      licenseName: lic.name,
      licenseID: lic._id,
      message
    });

    return this;
  }

  setSSOConfig(sso: ISSO) {
    this.characterModel.setSSOConfig(sso);
    return this;
  }

  setSSOConfigFromJWT(JWTData: JWTResponse | null) {
    this.characterModel.setSSOConfigFromJWT(JWTData);
    return this;
  }

  async reload() {
    return this.getByID(this.characterModel.charID);
  }

  // TODO does this really belong on the aggregate?
  async getActiveCharacters(): Promise<CharacterAggregate[]> {
    const charactersData = await this.dal.getActiveCharacters();

    const promises = [];
    for (let i = 0; i < charactersData.length; i++) {
      promises.push(createCharAgg(charactersData[i]));
    }

    return Promise.all(promises);
  }

  async getByID(charID: number): Promise<this> {
    if (charID) {
      const data = await this.dal.getByID(charID);
      this.characterModel = new CharacterModel(data);
      return this;
    } else {
      this.characterModel = new CharacterModel();
      return this;
    }
  }

  async save() {
    const charToSave = this.characterModel;
    // Only if we have a charID, else there's no point to save it
    if (charToSave.charID) {
      // If this character has linked characters, we need to update their licenses!
      // TODO Move this to the DAL layer (updateLinkedCharactersLicense);
      await this.updateLinkedCharactersLicense(charToSave);

      const resp = await this.dal.save(this);
      // TODO we're very optimistic that the above save worked.
      this.licPurchaseToLog = null;
      return resp;
    }
  }
}

export {CharacterAggregate}