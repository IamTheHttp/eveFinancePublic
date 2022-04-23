import {CacheRecord} from "./ESICache";
import http from "https";
import {IncomingMessage} from "http";
import {logger} from "../../../utils/logger/logger";

interface ESIHeaders {
  etag: string;
  expires: string;
  'last-modified': string;
  'x-pages' : string;
}

interface ESIRequestResponse {
  body: string,
  headers: ESIHeaders,
  status: number
}

function esiHttpRequest(accessToken: string, requestOptions: { method: string, path: string }, cacheRecord: CacheRecord): Promise<ESIRequestResponse> {
  const ETAG = cacheRecord && cacheRecord.etag ? cacheRecord.etag : '';
  logger.info(`System - Request for ${requestOptions.method}: ${requestOptions.path} with ETAG ${ETAG}`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'esi.evetech.net',
      protocol: 'https:',
      port: 443,
      path: requestOptions.path,
      method: requestOptions.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'If-None-Match': ETAG
      }
    };

    const httpReq = http.request(options, (httpRes: IncomingMessage) => {
      let data = '';
      httpRes.on('data', (d) => {
        data += d;
      });

      httpRes.on('end', () => {
        resolve({
          status: httpRes.statusCode,
          body: data,
          headers: httpRes.headers as unknown as ESIHeaders
        });
      });
    });

    httpReq.on('error', (error: Error) => {
      resolve({
        status: 400,
        body: JSON.stringify({
          error: error.message
        }),
        headers: null
      });
    });

    httpReq.end();
  });
}


export {esiHttpRequest};
