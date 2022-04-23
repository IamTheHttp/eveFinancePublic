import {Express} from "express";
import {IStructureOrStation} from "../../evedata/interfaces/IStructureOrStation";
import {getCharactersDAL} from "../../characters/data/getCharactersDAL";

async function stockStations(app: Express) {
  const charactersDAL = await getCharactersDAL();
  app.post('/auth/stockStations', async (req, res) => {
    const {charID} = res.locals.character;

    // TODO Move to aggregate
    const characters = await charactersDAL.getWhere({
      charID: charID
    });
    const character = characters[0];

    const station: IStructureOrStation = req.body.station;

    if (station) {
      character.stockStations = character.stockStations || [];
      const hasStation = character.stockStations.find((st) => {
        return st.stationID === station.stationID
      });

      if (!hasStation) {
        character.stockStations.push(station);
      }

      await charactersDAL.upsert(character);
    }

    res.send({});
  });

  app.delete('/auth/stockStations', async (req, res) => {
    const {charID} = res.locals.character;

    // TODO is this redundant? are we doing this in the bootup phase?
    const characters = await charactersDAL.getWhere({
      charID: charID
    });
    const character = characters[0];

    const stationToDelete: IStructureOrStation = req.body.station;

    if (stationToDelete) {
      character.stockStations = character.stockStations || [];

      character.stockStations = character.stockStations.filter((st) => {
        return st.stationID !== stationToDelete.stationID;
      });

      await charactersDAL.upsert(character);
    }

    res.send({});
  });
}

export default stockStations;
