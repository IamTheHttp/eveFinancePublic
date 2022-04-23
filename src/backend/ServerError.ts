interface IErrStructure {
  errorID: number;
  error: string;
}

class ServerError {
  // 0 - OK
  static OK = 0;

  // 100x - Bad user input / Validation
  static ERR_FIELD_VALIDATION = 100;
  static ERR_WRONG_INPUT = 101;

  // 200x - Server errors
  static ERR_DATABASE_INSERTION = 200;

  // 900x - User status errors
  static ERR_CHAR_IS_DELETED = 900;
  static ERR_CHAR_NO_PERMISSION = 901;
  static ERR_AUTH_TOKEN = 902;
  static ERR_NO_LICENSE = 903;
  static ERR_MAX_CHAR_EXCEEDED = 904;
  static ERR_CHAR_IS_LINKED = 905;
  static ERR_CHAR_LOGGED_OUT = 906;

  static errMap = new Map<number, IErrStructure>([
    ServerError.createErrorForKey(ServerError.ERR_FIELD_VALIDATION, 'Could not validate input'),
    ServerError.createErrorForKey(ServerError.ERR_WRONG_INPUT, 'Invalid user input, please check your request'),
    ServerError.createErrorForKey(ServerError.ERR_DATABASE_INSERTION, 'Something went wrong'),
    ServerError.createErrorForKey(ServerError.ERR_CHAR_IS_DELETED, 'Your character is deleted'),
    ServerError.createErrorForKey(ServerError.ERR_CHAR_NO_PERMISSION, 'Oops'),
    ServerError.createErrorForKey(ServerError.ERR_AUTH_TOKEN, 'Auth token error - please login again'),
    ServerError.createErrorForKey(ServerError.ERR_NO_LICENSE, 'No active license found'),
    ServerError.createErrorForKey(ServerError.ERR_MAX_CHAR_EXCEEDED, 'Max characters exceeded'),
    ServerError.createErrorForKey(ServerError.ERR_CHAR_IS_LINKED, 'Character is linked'),
    ServerError.createErrorForKey(ServerError.ERR_CHAR_LOGGED_OUT, 'Character is not logged in'),
  ]);

  static createErrorForKey(key: number, tmpl: string): [number, IErrStructure] {
    return [key, {
      errorID: key,
      error: tmpl
    }]
  }

  // TODO Allow individual errors to replace parts of the string template
  // TODO things like 'Missing fields - %s'
  static createError(errID: number, ...strs: string[]): IErrStructure {
    return ServerError.errMap.get(errID);
  }
}

export {ServerError};