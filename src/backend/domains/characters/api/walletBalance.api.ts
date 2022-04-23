import {Express} from "express";
import {ServerError} from "../../../ServerError";
import {CharacterDocument} from "../documents/CharacterDocument";
import {getCharactersDAL} from "../data/getCharactersDAL";

async function getWalletBalance(app: Express) {
  const charactersDAL = await getCharactersDAL();
  app.get('/auth/walletBalance', async (req, res) => {

    let linkedCharacters:CharacterDocument[] = [];

    if (res.locals.character.linkedCharacters.length) {
      linkedCharacters = <CharacterDocument[]> await charactersDAL.getWhere({
        $or: res.locals.character.linkedCharacters.map((linkedCharID: string) => {
          return {charID: linkedCharID}
        })
      });
    }

    const characters = [res.locals.character, ...linkedCharacters]

    interface ICorpWallet {
      corpID: number;
      division: number;
      walletBalance: number;
    }

    interface ICharacterWallet {
      name:string;
      walletBalance:number;
    }


    let charWallets:ICharacterWallet[] = [];
    let corpWallets: ICorpWallet[] = [];


    let corpsFound:number[] = [];

    let total = 0;
    characters.forEach((char) => {
      if (char.canQueryCorpWallet && corpsFound.indexOf(char.corporationID) === -1) {
        corpsFound.push(char.corporationID);
        let corp = {
          corpID: char.corporationID,
          corpName: char.corporationName,
          division:1, // TODO, support more than master
          walletBalance: Math.round(char.totalCorporationBalance || 0)
        };

        total += corp.walletBalance;
        corpWallets.push(corp);
      }
    });

    characters.forEach((char) => {
      total += char.walletBalance;
      charWallets.push({
        name: char.charName,
        walletBalance: Math.round(char.walletBalance)
      })
    });

    res.send({
      data: {
        charWallets,
        corpWallets,
        total: Math.round(total)
      },
      errorID: ServerError.OK,
    })
  });
}

export default getWalletBalance;
