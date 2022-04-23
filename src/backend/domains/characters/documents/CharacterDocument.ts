import {IStructureOrStation} from "../../evedata/interfaces/IStructureOrStation";
import {IESICorpWallet} from "../../../dataSources/ESI/ESINetworkDriver/ESIInterfaces/IESICorpWallet";
import mongodb from "mongodb";
export type ICharacterStatus = 'deleted' | 'admin' | 'trial' | 'premium' | 'linked' | 'new';
export type ISSO = { accessToken: string; accessTokenExpiration: Date; refreshToken: string };

function createDefaultFields() {
  return {
    canQueryCorpWallet: false,
    charID: 0,
    charName: '',
    corporationBalanceByDivision: [],
    corporationID: 0,
    corporationName: '',
    createdDate: new Date(),
    failedRefreshTokenAttempts: 0,
    isDirector: false,
    licenseExpirationDate: new Date(),
    licenseID: null,
    linkedCharacters: [],
    sso: {},
    status: 'new',
    stockStations: [],
    totalCorporationBalance: 0,
    trialUsed: false,
    walletBalance: 0,
    creditBalance: 0,
    gaveCorporationPermission: false,
  } as CharacterDocument
}


class CharacterDocument {
  lastFailedHydration: Date;
  lastSuccessfulHydration: Date;
  registrationDate: Date;
  lastSeen: Date;
  canQueryCorpWallet: boolean;
  charID: number;
  charName: string;
  corporationBalanceByDivision: IESICorpWallet;
  corporationID: number;
  corporationName: string;
  createdDate: Date;
  failedRefreshTokenAttempts: number;
  isDirector: boolean;
  licenseExpirationDate: Date;
  licenseID: mongodb.ObjectID;
  linkedCharacters: any[];
  sso: ISSO;
  status: ICharacterStatus;
  stockStations: IStructureOrStation[];
  totalCorporationBalance: number;
  trialUsed: boolean;
  walletBalance: number;
  creditBalance: number; // system ISK credit to buy licenses
  // User provided permission to query his corporation)
  // This field is updated to the linkedCharacters when saved
  gaveCorporationPermission: boolean;

  constructor(charData?: Partial<CharacterDocument>) {
    Object.assign(this, createDefaultFields(), charData || {});

    return this;
  }
}

export {CharacterDocument}