import {connectMongo} from "../../../mongoConnect";
import {MapSolarSystemsDAL} from "./MapSolarSystemsDAL";

async function getMapSolarSystemsDAL(): Promise<MapSolarSystemsDAL> {
  if (getMapSolarSystemsDAL.res) {
    return getMapSolarSystemsDAL.res;
  }

  const {db} = await connectMongo();
  const mapSolarSystemsDAL = new MapSolarSystemsDAL(db);

  getMapSolarSystemsDAL.res = mapSolarSystemsDAL;
  return mapSolarSystemsDAL;
}

namespace getMapSolarSystemsDAL {
  export var res: MapSolarSystemsDAL | undefined;
}

export {getMapSolarSystemsDAL};