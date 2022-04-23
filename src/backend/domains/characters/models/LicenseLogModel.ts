import {LicenseLogDocument} from "../documents/LicenseLogDocument";

// TODO This should be DATA-only, without read/write capabilities
// TODO This should preferebly be an interface like ILicenseLogData
// TODO LicenseLogData (This class) is actually composite of some Character info as well as the LicenseLogDocument
class LicenseLogModel extends LicenseLogDocument {
  constructor(licenseLogDocument?: Partial<LicenseLogDocument>) {
    super();

    if (licenseLogDocument) {
      this.setFields(licenseLogDocument);
    }
  }

  setFields(licLog: Partial<LicenseLogDocument>) {
    Object.assign(this, licLog);
  }

  // TODO This class/method is used by the CharactersDAL to save the LicLog, this method should be removed and all saving should be through the DAL
  async save(licLog: LicenseLogModel) {
    const storedID = await this.save(licLog);
  }
}

export {LicenseLogModel};