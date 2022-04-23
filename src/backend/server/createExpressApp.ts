// Express imports
import express from "express";
import cookieParser from 'cookie-parser';
import session from 'express-session';

// database
import createEntryPoints from "../utils/createEntryPoints";
import sessionMiddleware from "./middlewares/session";
import ensureAuth from "./middlewares/ensureAuth";
import {IDALs} from "../dataSources/DAL/getAllDAL";
import {getFrontendURL} from "../../config/publicConfig";
import {ESINetworkDriver} from "../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
// Setup server and middlewares
const app = express();


// App layer, everything is joined together here...
// We need a call the domain layer to perform business logic
async function createExpressApp(DALs: IDALs, esiNetworkDriver: ESINetworkDriver) {
  // Add headers
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', getFrontendURL());

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Cookie');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if ('OPTIONS' === req.method) {
      //respond with 200
      res.send(200);
    } else {
      //move on
      next();
    }
  });

  app.use(express.json());
  sessionMiddleware(app);
  app.use(cookieParser());

  await ensureAuth(app, DALs);
  createEntryPoints(app, DALs, esiNetworkDriver);
  return app;
}

export default createExpressApp;
