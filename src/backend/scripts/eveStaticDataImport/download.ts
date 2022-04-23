import {IncomingMessage} from "http";
import * as fs from 'fs';
import * as http from 'https';
import {logger} from "../../utils/logger/logger";

export interface httpOptions {
  protocol?: string
  hostname: string
  path:string
}


function download(httpOptions: httpOptions, dest: string) {
  return new Promise((resolve, reject) => {

    const file = fs.createWriteStream(dest);

    logger.info('System - DOWNLOAD - Download started');
    const request = http.get({
      protocol: httpOptions.protocol || 'https:',
      hostname: httpOptions.hostname,
      path: httpOptions.path,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
      }
    }, (response: IncomingMessage) => {
      let bytesDownloaded = 0;


      let totalBytes: number = +response.headers['content-length'];

      response.on("data", function (chunk) {
        bytesDownloaded += chunk.length;
        logger.info(bytesDownloaded / totalBytes);
      });
      response.pipe(file);

      response.on('close', () => {
        if (response.statusCode === 403) {
          reject('Forbidden');
        } else {
          logger.info('System - DOWNLOAD - Download complete');
          resolve();
        }
      })
    });

    request.on('error', function (e) { // Handle errors
      logger.error(e);
      logger.error('Error');
      reject();
    });
  });
}


export {download}
