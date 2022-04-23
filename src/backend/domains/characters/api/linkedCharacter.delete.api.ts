import {Express} from "express";
import {CharacterAggregate} from "../aggregates/CharacterAggregate";
import {createCharAgg} from "../aggregates/createCharAgg";
import {getLicensesDAL} from "../../licenses/data/getLicensesDAL";

async function deleteLinkedCharacter(app: Express) {
  app.post('/secure/deleteLinkedCharacter', async (req, res) => {
    const licDAL = await getLicensesDAL();
    const charAgg:CharacterAggregate = res.locals.charAgg;

    if (charAgg.getChar().charID) {
      charAgg.unlinkCharacter(req.body.charID)
      await charAgg.save();
    }

    const prevLinkedCharAgg = await createCharAgg(req.body.charID)



    const licAgg = await licDAL.getTrialLicense();

    prevLinkedCharAgg.setLicense(licAgg.getLicense());
    prevLinkedCharAgg.setFields({
      status: 'trial'
    });

    await prevLinkedCharAgg.save();

    res.send({
      data: 'OK'
    });
  });
}

export default deleteLinkedCharacter;
