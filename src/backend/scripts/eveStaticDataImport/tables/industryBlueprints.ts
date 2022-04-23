import {connectMongo} from "../../../mongoConnect";
import {execP} from "../execP";
import {FuzzworkImport} from "../FuzzworkImport";
import {logger} from "../../../utils/logger/logger";

class IndustryBlueprints extends FuzzworkImport {
  constructor() {
    super()
    this.displayName = 'IndustryBlueprints'; // <-- Change this
    this.src = {
      hostname: 'www.fuzzwork.co.uk',
      path: '/dump/latest/industryBlueprints.csv.bz2' // <-- Change this
    };
  }

  async mongoImport(dbName: string, tableName = '__industryBlueprints') { // <-- Change this
    logger.info('System - DB Import - Start');
    const {client} = await connectMongo(dbName);

    await execP(`mongoimport --mode=upsert --upsertFields=typeID --db=${dbName} --collection=${tableName} --type=csv --headerline --file=./unzipped/${this.unzipName}`);

    logger.info('System - DB Import - Done');
    await client.close();
  }
}


export {IndustryBlueprints}


