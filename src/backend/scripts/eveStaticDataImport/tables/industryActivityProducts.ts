import {connectMongo} from "../../../mongoConnect";
import {execP} from "../execP";
import {FuzzworkImport} from "../FuzzworkImport";
import {logger} from "../../../utils/logger/logger";

class IndustryActivityProducts extends FuzzworkImport {
  constructor() {
    super()
    this.displayName = 'IndustryActivityProducts'; // <-- Change this
    this.src = {
      hostname: 'www.fuzzwork.co.uk',
      path: '/dump/latest/industryActivityProducts.csv.bz2' // <-- Change this
    };
  }

  async mongoImport(dbName: string, tableName = '__industryActivityProducts') { // <-- Change this
    logger.info('System - DB Import - Start');
    const {client} = await connectMongo(dbName);

    await execP(`mongoimport --drop --db=${dbName} --collection=${tableName} --type=csv --headerline --file=./unzipped/${this.unzipName}`);

    logger.info('System - DB Import - Done');
    await client.close();
  }
}


export {IndustryActivityProducts}


