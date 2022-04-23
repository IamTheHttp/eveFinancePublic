import {CharacterDocument} from "../documents/CharacterDocument";
import {CharacterAggregate} from "./CharacterAggregate";

async function createCharAgg(charID?: number): Promise<CharacterAggregate>;
async function createCharAgg(charData?: Partial<CharacterDocument>): Promise<CharacterAggregate>;
async function createCharAgg(charIDorData?: any): Promise<CharacterAggregate> {
  const charAgg = new CharacterAggregate();

  if(typeof charIDorData === 'number') {
    await charAgg.getByID(charIDorData);
  }

  if(typeof charIDorData === 'object') {
    await charAgg.setFields(charIDorData);
  }

  return charAgg;
}

export {createCharAgg}