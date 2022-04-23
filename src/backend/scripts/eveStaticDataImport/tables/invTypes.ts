import {connectMongo} from "../../../mongoConnect";
import {execP} from "../execP";
import {FuzzworkImport} from "../FuzzworkImport";
import {logger} from "../../../utils/logger/logger";

class InvTypes extends FuzzworkImport {
  constructor() {
    super()
    this.displayName = 'INV_TYPES';
    this.localZip = './.zippedFile';
    this.unzipName = 'unzippedFile.csv';
    this.src = {
      hostname: 'www.fuzzwork.co.uk',
      path: '/dump/latest/invTypes.csv.bz2'
    }
  }

  async mongoImport(dbName: string, tableName = '__invTypes') {
    console.log(dbName);
    logger.info('System - DB Import - Start');
    const {client} = await connectMongo(dbName);

    const cmd = `mongoimport --mode=upsert --upsertFields=typeID --db=${dbName} --collection=${tableName} --type=csv --headerline --file=./unzipped/${this.unzipName}`;
    console.info(`! ${cmd}`);
    await execP(cmd);

    logger.info('System - DB Import - Done');
    await client.close();
  }
}


export {InvTypes}


