import {connectMongo} from "../../../mongoConnect";
import {CharactersDAL} from "./CharactersDAL";

async function getCharactersDAL(): Promise<CharactersDAL> {
  if (getCharactersDAL.res) {
    return getCharactersDAL.res;
  }
  const {db} = await connectMongo();
  const charactersDAL = new CharactersDAL(db);

  await charactersDAL.setup({
    uniqueKeys: ['charID']
  });

  getCharactersDAL.res = charactersDAL;
  return charactersDAL;
}

namespace getCharactersDAL {
  export var res: CharactersDAL | undefined;
}

export {getCharactersDAL};