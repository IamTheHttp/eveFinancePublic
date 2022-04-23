interface ISecureConfig {
  ESI_DATA_REFRESH_INTERVAL_MIN: number, // How often we poll ESI for new data
  MONGO_URI : string,
  DB_BACKUP_DAYS_INTERVAL: number;
  DB_BACKUP_BASE_PATH: string;
  DB_NAME: string;
  API_SECRET: string;
  API_CLIENT: string;
  LOG_ROOT_PATH: string;
  MIN_LOG_LEVEL: number;
  ENABLE_AWS_CLOUDWATCH: boolean;
}


interface EveSecureConfigEnvs {
  production: ISecureConfig,
  development : ISecureConfig,
  test : ISecureConfig
}

const secureConfigEnvs: EveSecureConfigEnvs = {
  production: {
    ESI_DATA_REFRESH_INTERVAL_MIN: 15, // How often we poll ESI for new data
    MONGO_URI : "mongodb://localhost:27017",
    DB_BACKUP_DAYS_INTERVAL: 1,
    DB_BACKUP_BASE_PATH: '/var/lib/evefinance/backups/db',
    DB_NAME: 'eveonline',
    API_SECRET: 'YOUR_APPLICATION_API_SECRET', // Update here, or refactor this code to use an ENV variable
    API_CLIENT: 'YOUR_APPLICATION_API_CLIENT', // Update here, or refactor this code to use an ENV variable
    LOG_ROOT_PATH: './logs',
    MIN_LOG_LEVEL: 1, // info,
    ENABLE_AWS_CLOUDWATCH: true
  },
  development: {
    ESI_DATA_REFRESH_INTERVAL_MIN: 10, // How often we poll ESI for new data
    MONGO_URI : "mongodb://localhost:27017",
    DB_BACKUP_DAYS_INTERVAL: 10,
    DB_BACKUP_BASE_PATH: './dump',
    DB_NAME: 'eveonline',
    API_SECRET: 'YOUR_APPLICATION_API_SECRET', // Update here, or refactor this code to use an ENV variable
    API_CLIENT: 'YOUR_APPLICATION_API_CLIENT', // Update here, or refactor this code to use an ENV variable
    LOG_ROOT_PATH: './logs',
    MIN_LOG_LEVEL: 1, // info
    ENABLE_AWS_CLOUDWATCH: false
  },
  test: {
    ESI_DATA_REFRESH_INTERVAL_MIN: 10, // How often we poll ESI for new data
    MONGO_URI : "mongodb://localhost:27017",
    DB_BACKUP_DAYS_INTERVAL: 10,
    DB_BACKUP_BASE_PATH: './dump',
    DB_NAME: 'TEST_DB',
    API_SECRET: 'YOUR_APPLICATION_API_SECRET', // Update here, or refactor this code to use an ENV variable
    API_CLIENT: 'YOUR_APPLICATION_API_CLIENT', // Update here, or refactor this code to use an ENV variable
    LOG_ROOT_PATH: './logs/test',
    MIN_LOG_LEVEL: 0,  // debug
    ENABLE_AWS_CLOUDWATCH: false
  }
}


//
// @ts-ignore
export const secureConfig: ISecureConfig = secureConfigEnvs[process.env.NODE_ENV] || secureConfigEnvs.production;

export const characterScopes = [
  'publicData',
  'esi-characterstats.read.v1',
  'esi-ui.write_waypoint.v1',
  'esi-skills.read_skills.v1',
  'esi-universe.read_structures.v1',
  'esi-wallet.read_character_wallet.v1',
  'esi-assets.read_assets.v1',
  'esi-characters.read_blueprints.v1',
  'esi-markets.structure_markets.v1',
  'esi-markets.read_character_orders.v1',
  'esi-industry.read_character_jobs.v1',
  'esi-corporations.read_container_logs.v1'
];


export const corporationScopes = [
  'esi-wallet.read_corporation_wallets.v1',
  'esi-wallet.read_corporation_wallet.v1',
  'esi-assets.read_corporation_assets.v1',
  'esi-characters.read_corporation_roles.v1',
  'esi-markets.read_corporation_orders.v1',
  'esi-industry.read_corporation_jobs.v1',
  'esi-corporations.read_divisions.v1',
  'esi-corporations.read_blueprints.v1',
  'esi-corporations.read_standings.v1',
  'esi-corporations.read_starbases.v1',
  'esi-corporations.read_facilities.v1',
  'esi-corporations.read_medals.v1',
  'esi-corporations.read_fw_stats.v1',
  'esi-corporations.read_container_logs.v1'
];

