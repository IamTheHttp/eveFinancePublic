import http from "https";
import {IncomingMessage} from "http";

function esiCall<T>(accessToken:string, requestOptions: {method: string, path:string}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const options = {
      hostname: 'esi.evetech.net',
      protocol: 'https:',
      port: 443,
      path: requestOptions.path,
      method: requestOptions.method,
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
          reject(data);
        }
      });
    });

    httpReq.on('error', (error: Error) => {
      console.error(error);
    });

    httpReq.end();
  });
}

export default esiCall;
