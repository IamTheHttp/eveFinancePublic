import {CharacterDocument} from "../../domains/characters/documents/CharacterDocument";

export function getTestCharacter(charID = 1234): CharacterDocument {
  return {
    registrationDate: new Date(),
    lastFailedHydration: new Date(),
    lastSuccessfulHydration: new Date(),
    gaveCorporationPermission: false,
    creditBalance: 0,
    lastSeen: new Date(),
    trialUsed: false,
    createdDate: new Date(),
    failedRefreshTokenAttempts: 0,
    canQueryCorpWallet: true,
    charID: charID,
    licenseID: null,
    licenseExpirationDate: new Date(),
    isDirector: false,
    corporationName: '',
    walletBalance: 0,
    corporationID: 0,
    charName: "Tester Character",
    totalCorporationBalance: 0,
    corporationBalanceByDivision: [],
    sso: {accessToken: "", accessTokenExpiration: undefined, refreshToken: ""},
    status: 'premium',
    linkedCharacters: [],
    stockStations: [{
      "stationID": 666,
      "solarSystemID": 666,
      "stationName": "Hell in space!",
      "isPlayerOwned": true
    }
    ]
  }
}