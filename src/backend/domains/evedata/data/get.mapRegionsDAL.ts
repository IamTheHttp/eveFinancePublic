import {connectMongo} from "../../../mongoConnect";
import {MapRegionsDAL} from "./MapRegionsDAL";

async function getMapRegionsDAL(): Promise<MapRegionsDAL> {
  if (getMapRegionsDAL.res) {
    return getMapRegionsDAL.res;
  }

  const {db} = await connectMongo();
  const mapRegionsDAL = new MapRegionsDAL(db);

  await mapRegionsDAL.setup({
    uniqueKeys: ['regionID']
  });

  getMapRegionsDAL.res = mapRegionsDAL;
  return mapRegionsDAL;
}

namespace getMapRegionsDAL {
  export var res: MapRegionsDAL | undefined;
}

export {getMapRegionsDAL};