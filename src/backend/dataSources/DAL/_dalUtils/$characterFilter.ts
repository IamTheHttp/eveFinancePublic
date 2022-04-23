/**
 * @description This function sets up the OR condition for DB filters for security
 * @param character
 */
import {CharacterDocument} from "../../../domains/characters/documents/CharacterDocument";

export function $characterFilter(character: CharacterDocument) {
  const linkedCharacters = character.linkedCharacters || [];
  return [
    {apiCharID: character.charID},
    {apiCorpID: character.corporationID},
    ...linkedCharacters.map((linkedCharID) => {
      return {apiCharID: linkedCharID}
    })
  ]
}
