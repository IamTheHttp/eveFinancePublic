import {HydrationPayload} from "./hydrateAll";
import {shouldHandleResponse} from "../../dataSources/ESI/ESINetworkDriver/shouldHandleResponse";
import {logger} from "../../utils/logger/logger";
import {CharacterModel} from "../../domains/characters/models/CharacterModel";


async function characterRolesHydration({charAgg, esiNetworkDriver}: HydrationPayload): Promise<CharacterModel> {
  if (!charAgg.getChar().charID) {
    logger.error('No charID found when loading hydrating charAgg.getChar() roles')
    return;
  }

  const response = await esiNetworkDriver.getCharacterRoles(charAgg.getChar());

  if (shouldHandleResponse(response,charAgg.getChar(), 'Character Roles')) {
    const rolesData = response.body;
    const hasRoles = rolesData && rolesData.roles && rolesData.roles.length > 0;

    if (hasRoles) {
      const canQueryCorpWallet = rolesData.roles.indexOf('Director') > -1 || rolesData.roles.indexOf('Accountant') > -1 || rolesData.roles.indexOf('Junior_Accountant') > -1;
      const isDirector = rolesData.roles.indexOf('Director') > -1;

      if (canQueryCorpWallet !== charAgg.getChar().canQueryCorpWallet || isDirector === true) {
        charAgg.setFields({
          canQueryCorpWallet,
          isDirector
        });

        await charAgg.save();
        logger.success(`${charAgg.getChar().charName} - Character Roles - (Corp wallet access: ${canQueryCorpWallet})`);
      } else {
        logger.info(`${charAgg.getChar().charName} - Character Roles - No new data`);
      }
    } else {
      logger.error(`${charAgg.getChar().charName} - No roles found for user.`);
    }
  } else {

  }

  return charAgg.getChar();
}

export default characterRolesHydration;
