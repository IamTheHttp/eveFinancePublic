import {logger} from "../utils/logger/logger";

describe('New logger tests', () => {
  it('Logs with the new logger', () => {
    logger.log('Hello');
    logger.info('Hello');
    logger.error('Hello');
    logger.success('Hello');
  });
});