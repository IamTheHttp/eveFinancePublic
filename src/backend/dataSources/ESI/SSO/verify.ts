import {IncomingMessage} from "http";
import http from 'https';
import {ICharacterDataFromAccessToken} from "./interfaces/ICharacterDataFromAccessToken";


function verify(accessToken: string): Promise<ICharacterDataFromAccessToken> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'login.eveonline.com',
      protocol: 'https:',
      port: 443,
      path: '/oauth/verify',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
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
          reject(e);
        }
      });
    });

    httpReq.on('error', (error: Error) => {
      console.error(error);
    });

    httpReq.end();
  });
}


export default verify;
