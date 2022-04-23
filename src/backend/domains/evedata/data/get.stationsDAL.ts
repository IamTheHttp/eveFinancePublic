import {connectMongo} from "../../../mongoConnect";
import {StationsDAL} from "./StationsDAL";

async function getStationsDAL(): Promise<StationsDAL> {
  if (getStationsDAL.res) {
    return getStationsDAL.res;
  }

  const {db} = await connectMongo();
  const stationsDAL = new StationsDAL(db);

  await stationsDAL.createIndex({solarSystemID: 1}, false);
  await stationsDAL.createIndex({stationID: 1}, false);


  getStationsDAL.res = stationsDAL;
  return stationsDAL;
}

namespace getStationsDAL {
  export var res: StationsDAL | undefined;
}

export {getStationsDAL};