import {LicenseDocument} from "../data/LicenseDocument";

class License extends LicenseDocument {
  constructor(licenseData?:Partial<LicenseDocument>) {
    super();
    if (licenseData) {
      Object.assign(this, licenseData);
    }
  }

  /**
   * Returns a new expiration date for someone who wants to use this license
   */
  getNewExpirationDate():Date {
    if (this.durationInDays) {
      const d = new Date();
      d.setDate(d.getDate() + this.durationInDays);
      return d;
    } else {
      // Someone tried to getExpirationDate without durationInDays being properly set
      // TODO something went wrong, do we log this somewhere?
      return new Date();
    }
  }
}

export {License}