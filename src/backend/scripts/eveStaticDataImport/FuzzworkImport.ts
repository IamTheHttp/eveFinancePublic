import {httpOptions} from "./download";
import {execP} from "./execP";
import {download} from "./download";
import {unzip} from "./unzip";
import {logger} from "../../utils/logger/logger";

class FuzzworkImport {
  displayName: string;
  src: httpOptions;
  localZip: string;
  unzipName : string;
  constructor() {
    this.localZip = './.zippedFile';
    this.unzipName = 'unzippedFile.csv';
  }

  async download() {
    return download(this.src, this.localZip);
  }

  async normalizeToJSON() {

  }

  async unzip() {
    return unzip(this.localZip, this.unzipName)
  }

  async cleanup() {
    logger.info('System - Cleanup - Start');
    await execP('rm -rf ./unzipped');
    await execP(`rm -f ${this.localZip}`);
    logger.info('System - Cleanup - Done');
  }
}

export {FuzzworkImport}
