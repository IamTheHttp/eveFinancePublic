import {IncomingMessage} from "http";
import {secureConfig} from "../../../../config/secureConfig";
import http from 'https';
import {logger} from "../../../utils/logger/logger";

function refreshAccessTokenRequest(refreshToken:string, charName?: string) {
  return new Promise((resolve, reject) => {
    let buff = Buffer.from(`${secureConfig.API_CLIENT}:${secureConfig.API_SECRET}`);
    let base64Authorization = buff.toString(`base64`);

    const options = {
      hostname: 'login.eveonline.com',
      protocol:'https:',
      port: 443,
      path: '/v2/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64Authorization}`
      }
    };

    let httpReq = http.request(options, (httpRes: IncomingMessage) => {
      let data = '';
      httpRes.on('data', (d) => {
        data += d;
      });

      httpRes.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(data);
        }
      });
    });

    httpReq.on('error', (error: Error) => {
      logger.error(`${charName} - ${error}`);
    });

    httpReq.write(`grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`);
    httpReq.end();
  });
}





export {refreshAccessTokenRequest};
