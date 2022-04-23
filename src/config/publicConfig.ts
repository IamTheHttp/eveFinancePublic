interface IPublicConfig {
  INTERNAL_BACKEND_PORT : number,
  PUBLIC_BACKEND_PORT: number;
  BACKEND_BASE_URL : string,
  SSO_REDIRECT_URL : string,
  FRONTEND_PORT: number,
  FRONTEND_BASE_URL: string;
  EVE_SSO_URL: string;
  ITEM_TYPE_SEARCH_CACHE_DURATION_MIN: number;
  ITEM_SEARCH_DEBOUNCE_MS: number;
  ISSUE_TRACKER_URL: string;
}

interface PublicConfigEnvs {
  production: IPublicConfig,
  development : IPublicConfig,
  test: IPublicConfig
}

const publicConfigEnvs: PublicConfigEnvs = {
  production: {
    INTERNAL_BACKEND_PORT : 8080,
    PUBLIC_BACKEND_PORT: 0,// no port for production
    BACKEND_BASE_URL : 'https://eveapi.patrickt.me',
    SSO_REDIRECT_URL : 'https://eveapi.patrickt.me/public/sso-token',
    FRONTEND_PORT: 0,
    FRONTEND_BASE_URL: 'https://eve.patrickt.me',
    EVE_SSO_URL: 'https://login.eveonline.com/v2/oauth/authorize',
    ITEM_TYPE_SEARCH_CACHE_DURATION_MIN: 30,
    ITEM_SEARCH_DEBOUNCE_MS: 250,
    ISSUE_TRACKER_URL: 'https://github.com/IamTheHttp/issues-evefinance'
  },
  development: {
    INTERNAL_BACKEND_PORT : 8080,
    PUBLIC_BACKEND_PORT: 8080,
    BACKEND_BASE_URL : 'http://localhost',
    SSO_REDIRECT_URL : 'http://localhost:8080/public/sso-token',
    FRONTEND_PORT: 8000,
    FRONTEND_BASE_URL: 'http://localhost',
    EVE_SSO_URL: 'https://login.eveonline.com/v2/oauth/authorize',
    ITEM_TYPE_SEARCH_CACHE_DURATION_MIN: 30,
    ITEM_SEARCH_DEBOUNCE_MS: 250,
    ISSUE_TRACKER_URL: 'https://github.com/IamTheHttp/issues-evefinance'
  },
  test: {
    INTERNAL_BACKEND_PORT : 8080,
    PUBLIC_BACKEND_PORT: 8080,
    BACKEND_BASE_URL : 'http://localhost',
    SSO_REDIRECT_URL : 'http://localhost:8080/public/sso-token',
    FRONTEND_PORT: 8000,
    FRONTEND_BASE_URL: 'http://localhost',
    EVE_SSO_URL: 'https://login.eveonline.com/v2/oauth/authorize',
    ITEM_TYPE_SEARCH_CACHE_DURATION_MIN: 30,
    ITEM_SEARCH_DEBOUNCE_MS: 250,
    ISSUE_TRACKER_URL: 'https://github.com/IamTheHttp/issues-evefinance'
  }
}




// @ts-ignore
export const publicConfig: IPublicConfig = publicConfigEnvs[process.env.NODE_ENV] || publicConfigEnvs.production;

export function getFrontendURL() {
  return [publicConfig.FRONTEND_BASE_URL, publicConfig.FRONTEND_PORT].filter(a => a).join(':');
}

// Public facing backend URL, for example eveapi.patrickt.me:80, we then need to remove the 80 for gzip compression to work
export function getBackendURL() {
  return [publicConfig.BACKEND_BASE_URL, publicConfig.PUBLIC_BACKEND_PORT].filter(a => a).join(':');
}

// Internal facing backend URL, for the service to run
export function getInternalBackendURL() {
  return [publicConfig.BACKEND_BASE_URL, publicConfig.INTERNAL_BACKEND_PORT].filter(a => a).join(':');
}