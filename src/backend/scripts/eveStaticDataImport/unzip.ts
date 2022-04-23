import {File} from "decompress";
import {logger} from "../../utils/logger/logger";

const decompress = require("decompress");
const decompressBzip2 = require('decompress-bzip2');
const path = require("path");

function unzip(pathToUnzip: string, unzippedFileName: string) {
  logger.info('System - UNZIP - Unzip started');
  return new Promise(async (resolve, reject) => {
    try {
      const files = await decompress(pathToUnzip, 'unzipped', {
        plugins: [
          decompressBzip2({
            path: unzippedFileName,
            mode: 777
          })
        ],
        filter: (file: File) => {
          return path.extname(file.path) !== ".exe"
        }
      });

      logger.info('System - UNZIP - Unzip complete');
      resolve(files);
    } catch (error) {
      reject(error);
    }
  }).catch((e) => {
    logger.error(e);
  });
}


export {unzip};
