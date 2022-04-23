interface ICharacterDataFromAccessToken {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: 'EVE';
}

export {ICharacterDataFromAccessToken}