import {ServerError} from "./ServerError";
import {CharacterDocument} from "./domains/characters/documents/CharacterDocument";
import {CharacterModel} from "./domains/characters/models/CharacterModel";
import {License} from "./domains/licenses/entities/License";

export interface IServerValidationResult {
  isError: boolean;
  errorID: number;
  error: string;
};


class ServerValidations {
  static validateFields(obj: Record<string, any>, fields: string[], validator: (a:any) => boolean): IServerValidationResult {
    if (typeof obj !== 'object') {
      const err = ServerError.createError(ServerError.ERR_WRONG_INPUT);

      return {
        isError: true,
        ...err
      }
    }

    const isValid = fields.reduce((wasLastOneValid, current) => {
      return wasLastOneValid && validator(obj[current]);
    }, true);

    if (isValid) {
      return {
        isError: false,
        error: '',
        errorID: ServerError.OK
      }
    } else {
      const err = ServerError.createError(ServerError.ERR_FIELD_VALIDATION);
      return {
        isError: true,
        ...err
      }
    }
  }

  static validateFieldsGreaterThan(min: number, obj: Record<string, any>, fields: string[]) {
    return this.validateFields(obj, fields, (el) => {
      return typeof el === 'number' && el > min;
    });
  }

  static validateFieldsStringLength(max: number, obj: Record<string, any>, fields: string[]) {
    return this.validateFields(obj, fields, (el) => {
      return typeof el === 'string' && el.length < max;
    });
  }

  static isCharacterDeleted(character: CharacterDocument) {
    // res.locals.character.status === 'deleted'
    if (character.status === 'deleted') {
      return ServerError.createError(ServerError.ERR_CHAR_IS_DELETED);
    } else {
      return {
        isError: false,
        error: '',
        errorID: ServerError.OK
      }
    }
  }

  static isCharacterLinked(character: CharacterDocument) {
    // res.locals.character.status === 'deleted'
    if (character.status === 'linked') {
      return ServerError.createError(ServerError.ERR_CHAR_IS_LINKED);
    } else {
      return {
        isError: false,
        error: '',
        errorID: ServerError.OK
      }
    }
  }



  static isCharacterCountExceeded(character: CharacterModel, license: License) {
    // Linked characters + the main character > max allowed characters
    if (character.linkedCharacters.length + 1 > license.maxCharacters) {
      return ServerError.createError(ServerError.ERR_MAX_CHAR_EXCEEDED);
    } else {
      return {
        isError: false,
        error: '',
        errorID: ServerError.OK
      }
    }
  }
}

export {ServerValidations};

