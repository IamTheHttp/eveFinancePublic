import {logger} from "../../../../../utils/logger/logger";
import {createCharAgg} from "../../../../characters/aggregates/createCharAgg";
import {CharacterAggregate} from "../../../../characters/aggregates/CharacterAggregate";


export interface ILinkCharacter {
  sessionCharID: number,
  charToLink: CharacterAggregate
}

export async function linkCharacter(payload: ILinkCharacter) {
  const {sessionCharID, charToLink} = payload;
  const CHAR_ID = charToLink.getChar().charID;



  const masterCharAgg = await createCharAgg(sessionCharID);
  const isCharacterLinked = masterCharAgg.isCharacterLinked(CHAR_ID);

  logger.info(`${masterCharAgg.getChar().charName} / ${charToLink.getChar().charName}  - login is a link character request`);

  if (!isCharacterLinked) {
    logger.info(`${masterCharAgg.getChar().charName} / ${charToLink.getChar().charName} - Character is not linked - linking!`);
    masterCharAgg.linkCharacters(CHAR_ID);
    charToLink.setFields({status: 'linked'});

    await masterCharAgg.save();
    await charToLink.save();
  }
}