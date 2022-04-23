import {secureConfig, characterScopes, corporationScopes} from "../../../../config/secureConfig";
import {publicConfig} from "../../../../config/publicConfig";

const queryString = require('querystring');

function buildCorporationSSOURL() {
  let queryParams = {
    response_type: 'code',
    redirect_uri: publicConfig.SSO_REDIRECT_URL,
    client_id: secureConfig.API_CLIENT,
    scope: [...characterScopes, ...corporationScopes].join(' '),
    state: 'corporation-access'
  };

  let query = queryString.encode(queryParams);

  return `${publicConfig.EVE_SSO_URL}/?${query}`;
}

export {buildCorporationSSOURL};
