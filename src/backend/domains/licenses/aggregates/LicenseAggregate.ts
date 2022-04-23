import {LicenseDocument} from "../data/LicenseDocument";
import {License} from "../entities/License";
import {LicensesDAL} from "../data/LicensesDAL";
import {IServerValidationResult, ServerValidations} from "../../../ServerValidations";
import {ServerError} from "../../../ServerError";

class LicenseAggregate {
  private readonly license: License;

  constructor(private dal?: LicensesDAL) {
    this.dal = dal || new LicensesDAL();
    this.license = new License();
  }

  getLicense() {
    return this.license;
  }

  setDefaultTrialValues() {
    this.setFields({
      durationInDays: 5,
      includeCorporations: false,
      isTrial: true,
      maxCharacters: 1,
      name: 'Trial License',
      priceInMillions: 500
    });
    return this;
  }

  // TODO this should be out of the aggregate and probably in some service
  validate(): IServerValidationResult {
    const validationLength = ServerValidations.validateFieldsGreaterThan(0,this.license, ['durationInDays', 'maxCharacters', 'priceInMillions']);

    if (validationLength.isError) {
      return validationLength;
    }


    const validateFieldsExist = ServerValidations.validateFields(this.license, ['includeCorporations', 'isTrial', 'name'], (val) => {
      return typeof val !== 'undefined';
    });

    if (validateFieldsExist.isError) {
      return validateFieldsExist;
    }

    return {
      isError: false,
      errorID: ServerError.OK,
      error: ''
    }
  }

  setFields(licenseData: Partial<LicenseDocument>) {
    Object.assign(this.license, licenseData);
  }

  async save() {
    const res = await this.dal.insert(this.license);
    this.license._id = res.insertedId;
    return this;
  }
}

export {LicenseAggregate}