import {startImport} from "./startImport";
const args = process.argv.slice(2);
const options = {
  dbName: ''
}

args.forEach((option: string) => {
  if (option.indexOf('--db=') === 0) {
    options.dbName = option.replace('--db=', '');
  }
});


startImport(options.dbName);