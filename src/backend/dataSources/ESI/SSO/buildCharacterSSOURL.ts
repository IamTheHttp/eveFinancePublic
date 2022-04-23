import {secureConfig, characterScopes, corporationScopes} from "../../../../config/secureConfig";
import {publicConfig} from "../../../../config/publicConfig";
import {CharacterDocument} from "../../../domains/characters/documents/CharacterDocument";

const queryString = require('querystring');


function buildCharacterSSOURL(character?:CharacterDocument) {
  const includeCorpScopes = character && character.gaveCorporationPermission

  const allScopes = [...characterScopes, ...corporationScopes].join(' ');
  const charOnlyScopes = characterScopes.join(' ');

  let queryParams = {
    response_type: 'code',
    redirect_uri: publicConfig.SSO_REDIRECT_URL,
    client_id: secureConfig.API_CLIENT,
    scope: includeCorpScopes ?  allScopes : charOnlyScopes,
    state: character ? 'link-character-request' : '0'
  };

  let query = queryString.encode(queryParams);

  return `${publicConfig.EVE_SSO_URL}/?${query}`;
}

export {buildCharacterSSOURL};
