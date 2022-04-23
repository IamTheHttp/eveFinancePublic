import {runHealthCheck} from "./scripts/healthcheck/runHealthCheck";

declare module 'express-session' {
  interface SessionData {
    charID: number;
  }
}

import createExpressApp from "./server/createExpressApp";
import getDALConnections, {IDALs} from "./dataSources/DAL/getAllDAL";
import {publicConfig, getInternalBackendURL} from "../config/publicConfig";
import {secureConfig} from "../config/secureConfig";
import {ESINetworkDriver} from "./dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {ESICache} from "./dataSources/ESI/ESINetworkDriver/ESICache";
import {initializeHydration} from "./hydration/initializeHydration";
import {runDbBackup} from "./scripts/dbBackup/runDbBackup";
import {connectMongo} from "./mongoConnect";
import {logger} from "./utils/logger/logger";

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED PROMISE REJECTION');

  // @ts-ignore
  const message = err && err.message ? err.message : 'no specific message';

  logger.error(JSON.stringify({err, message}));
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION');
  logger.error(JSON.stringify(err));
});

// App layer, everything is joined together here...
// We need a call the domain layer to perform business logic
async function runApp() {
  // Ensures that subsequent requests are memoized and are no longer a promise
  await connectMongo();

  // Get DB connections to various
  const DALs = await getDALConnections();

  // Set up esiNetworkDriver
  const esiNetworkDriver = new ESINetworkDriver(new ESICache(DALs.esiCacheDAL));

  setInterval(async () => {
    await initializeHydration(DALs, esiNetworkDriver);
  }, secureConfig.ESI_DATA_REFRESH_INTERVAL_MIN * 60 * 1000);

  let app = await createExpressApp(DALs, esiNetworkDriver);

  app.listen(publicConfig.INTERNAL_BACKEND_PORT, () => console.info(`App listening at ${getInternalBackendURL()}`));
  if (process.env.HYDRATE_ON_START != '0' ) {
    await initializeHydration(DALs, esiNetworkDriver);
  }

  if (secureConfig.ENABLE_AWS_CLOUDWATCH) {
    runHealthCheck()
  }

  runDbBackup(secureConfig.DB_BACKUP_BASE_PATH);
}


runApp();
