import {ESICache} from "./ESICache";
import {esiHttpRequest} from "./esiHttpRequest";
import {IESICharacterPublicData} from "./ESIInterfaces/IESICharacterPublicData";
import {IESITransactionEntry} from "./ESIInterfaces/IESITransactionEntry";
import {IESIJournalEntry} from "./ESIInterfaces/IESIJournalEntry";
import {IESIMarketOrder} from "./ESIInterfaces/IESIMarketOrder";
import {IESIAsset} from "./ESIInterfaces/IESIAsset";
import {IESICharacterRoles} from "./ESIInterfaces/IESICharacterRoles";
import {IESICorpWallet} from "./ESIInterfaces/IESICorpWallet";
import {IESIBlueprint} from "./ESIInterfaces/IESIBlueprint";
import {IESIIndustryJob} from "./ESIInterfaces/IESIIndustryJob";
import {IESICorpInformation} from "./ESIInterfaces/IESICorpInformation";
import {CharacterDocument} from "../../../domains/characters/documents/CharacterDocument";
import {CharacterModel} from "../../../domains/characters/models/CharacterModel";
import {logger} from "../../../utils/logger/logger";

export interface IParsedResponse<T> {
  cache: boolean;
  error: string;
  body: T & { error? : string};
  totalPages?: number;
}

type NetworkResponse<T> = Promise<IParsedResponse<T>>;


class ESINetworkDriver {
  private cacheLayer: ESICache;

  constructor(cacheLayer: ESICache) {
    this.cacheLayer = cacheLayer;
  }

  getCharacterAssets(character:CharacterDocument, page: number): NetworkResponse<IESIAsset[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/assets/?page=${page}`,
      method: 'GET',
      breakCache: page > 1
    });
  }

  getCorporationAssets(character:CharacterDocument, page: number): NetworkResponse<IESIAsset[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/assets/?page=${page}`,
      method: 'GET',
      breakCache: page > 1
    });
  }

  getCorporationBlueprints(character:CharacterDocument, page: number): NetworkResponse<IESIBlueprint[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/blueprints/?page=${page}`,
      method: 'GET',
      breakCache: page > 1
    });
  }

  getCharacterOrders(character:CharacterDocument): NetworkResponse<IESIMarketOrder[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/orders/`,
      method: 'GET',
    });
  }

  getCorporationOrders(character:CharacterDocument): NetworkResponse<unknown> {
    return this.request(character.sso.accessToken, {
      path: `/corporations/${character.corporationID}/orders/`,
      method: 'GET'
    });
  }

  getPublicDataByCharID(charID: number, accessToken: string): NetworkResponse<IESICharacterPublicData> {
    return this.request(accessToken, {
      path: `/latest/characters/${charID}/`,
      method: 'GET',
    });
  }

  getPublicData(character:CharacterDocument): NetworkResponse<IESICharacterPublicData> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/`,
      method: 'GET',
    });
  }

  getCorpHistory(character:CharacterDocument): NetworkResponse<unknown> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/corporationhistory/`,
      method: 'GET',
    });
  }

  getCorporationInformation(character:CharacterDocument): NetworkResponse<IESICorpInformation> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}`,
      method: 'GET',
    });
  }

  getCharacterRoles(character:CharacterDocument): NetworkResponse<IESICharacterRoles> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/roles`,
      method: 'GET',
    });
  }

  getRegionOrders(regionID: number): NetworkResponse<unknown> {
    return this.request('', {
      path: `/latest/markets/${regionID}/orders/`,
      method: 'GET',
    });
  }

  getPlayerStructures(character:CharacterDocument): NetworkResponse<number[]>
  getPlayerStructures(character:CharacterDocument, structureID: string): NetworkResponse<unknown | number[]>
  getPlayerStructures(character:CharacterDocument, structureID: string = ''): NetworkResponse<unknown | number[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/universe/structures/${structureID}`,
      method: 'GET',
    });
  }

  getCharacterBalance(character:CharacterDocument): NetworkResponse<number> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/wallet/`,
      method: 'GET'
    });
  }

  getCharacterIndustryJobs(character:CharacterDocument): NetworkResponse<unknown> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/industry/jobs/`,
      method: 'GET'
    });
  }

  getCorporationBalance(character:CharacterDocument): NetworkResponse<IESICorpWallet> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/wallets/`,
      method: 'GET'
    });
  }

  getCorporationIndustryJobs(character:CharacterDocument, page: number): NetworkResponse<IESIIndustryJob[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/industry/jobs/?include_completed=true&page=${page}`,
      method: 'GET',
      breakCache: page > 1
    });
  }

  getCorporationJournal(walletID: number, character:CharacterDocument, page: number): NetworkResponse<IESIJournalEntry> {
    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/wallets/${walletID}/journal/?page=${page}`,
      method: 'GET',
      breakCache: page > 1
    });
  }

  getCorporationTransactions(walletID: number, character:CharacterDocument, fromID: number = 0): NetworkResponse<IESITransactionEntry[]> {
    const query = fromID ? `?from_id=${fromID}` : '';

    return this.request(character.sso.accessToken, {
      path: `/latest/corporations/${character.corporationID}/wallets/${walletID}/transactions/${query}`,
      method: 'GET'
    });
  }

  getJournal(character:CharacterDocument): NetworkResponse<IESIJournalEntry[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/wallet/journal/`,
      method: 'GET'
    });
  }

  getTransactions(character:CharacterModel): NetworkResponse<IESITransactionEntry[]> {
    return this.request(character.sso.accessToken, {
      path: `/latest/characters/${character.charID}/wallet/transactions/`,
      method: 'GET'
    });
  }


  async request<T>(accessToken: string, requestOptions: { method: string, path: string, breakCache?:boolean }) {
    return new Promise<IParsedResponse<T>>(async (resolve, reject) => {
      const cacheKey = `${requestOptions.method}:${requestOptions.path}`;
      let cacheRecord;

      // Provide a dummmy cacheRecord to break the cache
      if (requestOptions.breakCache) {
        cacheRecord = {
          expires: '',
          etag: ''
        }
      } else {
        cacheRecord = await this.cacheLayer.findRecord(cacheKey);
      }

      // Check expiration
      if (cacheRecord && cacheRecord.expires) {
        const CACHE_EXPIRATION = new Date(cacheRecord.expires).getTime();
        const NOW = new Date().getTime();

        if (CACHE_EXPIRATION > NOW) {
          logger.info(`System - Cache key found for ${cacheKey}`);
          logger.info(`System - Cache expiration is ${CACHE_EXPIRATION}`);
          logger.info(`System - Cache current time  ${NOW}`);
          logger.info(`System - ETAG Cache hit, no request sent`);
          resolve({
            cache: true,
            error: '',
            body: null
          });
        } else {
          logger.info(`System - Expired cache key found for ${cacheKey}`);
          logger.info(`System - Cache expiration is ${CACHE_EXPIRATION}`);
          logger.info(`System - Cache current time  ${NOW}`);
        }
      }

      const response = await esiHttpRequest(accessToken, requestOptions, cacheRecord);
      const {body, headers, status} = response;

      // Only store responses with a valid etag
      if (headers.etag) {
        await this.cacheLayer.addRecord(cacheKey, {
          etag: headers.etag,
          expires: headers.expires
        });
      }

      if (status === 304) {
        logger.info(`System - 304 response for ${cacheKey} `);
        resolve({
          cache: true,
          error: '',
          body: null
        });
      } else if (status === 200) {
        try {
          const totalPages = +headers['x-pages']
          resolve({
            cache: false,
            error: '',
            body: JSON.parse(body) as T,
            totalPages
          });
        } catch (e) {
          resolve({
            cache: false,
            error: 'could not parse body',
            body: body as any
          });
        }
      } else {
        let error = 'Unknown server error';
        try {
          error = JSON.parse(body).error
        } catch(e) {
          if (typeof body === 'string') {
            error = body;
          }
        }

        resolve({
          cache: false,
          error: error,
          body: body as any
        });
      }
    });
  }
}

export {ESINetworkDriver}