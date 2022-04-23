import {ILicenseLogData} from "../../../../frontend/views/Admin/components/LicenseLogsView/LicenseLogsView";

class LicenseLogAggregate {
  private readonly licenseLogData: ILicenseLogData

  constructor(licenseLogData: ILicenseLogData) {
    this.licenseLogData = licenseLogData;
  }

  getLicenseLogData(): ILicenseLogData {
    const v = this;
    return this.licenseLogData;
  }

  toJSON(): ILicenseLogData {
    return this.getLicenseLogData();
  }
}

export {LicenseLogAggregate}