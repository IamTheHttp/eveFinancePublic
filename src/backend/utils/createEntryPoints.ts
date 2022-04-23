import glob from 'glob';
import {Express} from "express";
import {IDALs} from "../dataSources/DAL/getAllDAL";
import {ESINetworkDriver} from "../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {logger} from "./logger/logger";

function createEntryPoints(app:Express, DALs: IDALs, esiNetworkDriver: ESINetworkDriver ) {

  glob.sync('**/*.api.ts', { cwd:process.cwd() }).map((file) => {
    const reqModule = require(`${process.cwd()}/${file}`);

    if (reqModule && typeof reqModule.default === 'function') {
      reqModule.default(app, esiNetworkDriver);
      logger.success(`Connecting entrypoint - ${file}`);
    } else {
      logger.bold(`Found a non endpoint file ${file}`);
    }
  })


  glob.sync('**/endpoints/**/*.ts', { cwd:process.cwd() }).map((file) => {
    const reqModule = require(`${process.cwd()}/${file}`);

    if (reqModule && typeof reqModule.default === 'function') {
      reqModule.default(app, esiNetworkDriver);
      logger.success(`Connecting entrypoint - ${file}`);
    } else {
      logger.bold(`Found a non endpoint file ${file}`);
    }
  })
}

export default createEntryPoints;

