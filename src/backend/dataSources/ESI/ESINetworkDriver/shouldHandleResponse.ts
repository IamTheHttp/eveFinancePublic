import {IParsedResponse} from "./ESINetworkDriver";
import {logger} from "../../../utils/logger/logger";
import {CharacterDocument} from "../../../domains/characters/documents/CharacterDocument";

function shouldHandleResponse(response: IParsedResponse<unknown>, character: CharacterDocument, responseName: string) {
  if (response.cache) {
    logger.info(`${character.charName} - ${responseName} - Cache hit - Nothing to update`);
    return false;
  }

  // http level error
  if (response.error) {
    logger.error(`${character.charName} - ${responseName} ${response.error}`);
    if (response.error.includes('token is expired')) {
      throw {
        tokenErrorCode: 1,
        message: response.error
      }
    }

    if (response.error.includes('corporation')) {
      throw {
        tokenErrorCode: 2,
        message: response.error
      }
    }

    return false;
  }

  if (Array.isArray(response.body) && response.body.length === 0) {
    logger.info(`${character.charName} - ${responseName} - Nothing to update`);
    return false;
  }

// response level error, i.e page not found
  if (response.body && response.body.error) {
    logger.error(`${character.charName} - ${responseName} ${response.body.error}`);
    return false;
  }

  return true;
}

export {shouldHandleResponse};