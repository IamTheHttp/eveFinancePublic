import {Express} from "express";
import {ServerError} from "../../../ServerError";
import {getCharactersDAL} from "../data/getCharactersDAL";

async function getCharacters(app: Express) {
  const charactersDAL = await getCharactersDAL();
  app.get('/admin/characters', async (req, res) => {
    // TODO can this be secured?
    let characters = await charactersDAL.getAllCharacters();

    res.send({
      data: characters.map((char) => {
        return char.json();
      }),
      errorID: ServerError.OK,
    })
  });
}

export default getCharacters;
