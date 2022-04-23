import {Express} from "express";
import {CharacterModel} from "../models/CharacterModel";
import {getCharactersDAL} from "../data/getCharactersDAL";

async function deleteCharacter(app: Express) {
  const charactersDAL = await getCharactersDAL();
  app.delete('/secure/deleteCharacter', async (req, res) => {
    const char = res.locals.character as CharacterModel;

    const charsToDelete = [...char.linkedCharacters, char.charID];

    const dbRes = await charactersDAL.getTable().updateMany({
      charID: {$in: charsToDelete}
    }, {
      $set: {
        status: 'deleted',
        linkedCharacters: []
      }
    }, {
      upsert: true
    });

    // Clear session of user
    res.status(200);
    res.send({});
  });
}

export default deleteCharacter;
