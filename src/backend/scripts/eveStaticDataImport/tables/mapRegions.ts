import {connectMongo} from "../../../mongoConnect";
import {execP} from "../execP";
import {FuzzworkImport} from "../FuzzworkImport";
import {logger} from "../../../utils/logger/logger";

class MapRegions extends FuzzworkImport {
  constructor() {
    super()
    this.displayName = 'MapRegions';
    this.localZip = './.zippedFile';
    this.unzipName = 'unzippedFile.csv';
    this.src = {
      hostname: 'www.fuzzwork.co.uk',
      path: '/dump/latest/mapRegions.csv.bz2'
    };
  }

  async mongoImport(dbName: string, tableName = '__mapRegions') {
    logger.info('System - DB Import - Start');
    const {client} = await connectMongo(dbName);

    await execP(`mongoimport --drop --db=${dbName} --collection=${tableName} --type=csv --headerline --file=./unzipped/${this.unzipName}`);

    logger.info('System - DB Import - Done');
    await client.close();
  }
}


export {MapRegions}


