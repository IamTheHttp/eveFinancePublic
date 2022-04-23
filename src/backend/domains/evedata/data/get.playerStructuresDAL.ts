import {connectMongo} from "../../../mongoConnect";
import {PlayerStructuresDAL} from "./PlayerStructuresDAL";

async function getPlayerStructuresDAL(): Promise<PlayerStructuresDAL> {
  if (getPlayerStructuresDAL.res) {
    return getPlayerStructuresDAL.res;
  }

  const {db} = await connectMongo();
  const playerStructuresDAL = new PlayerStructuresDAL(db);

  await playerStructuresDAL.createIndex({structureID: 1}, true);



  getPlayerStructuresDAL.res = playerStructuresDAL;
  return playerStructuresDAL;
}

namespace getPlayerStructuresDAL {
  export var res: PlayerStructuresDAL | undefined;
}

export {getPlayerStructuresDAL};