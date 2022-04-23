import {IncomingMessage} from "http";
import {exec} from "child_process";
import {logger} from "../../utils/logger/logger";
const http = require('https');

function check() {
  http.get('https://eveapi.patrickt.me:8080/secure/getCharacterInfo', (res: IncomingMessage) => {
    if (res.statusCode < 400) {
      exec('aws cloudwatch put-metric-data --metric-name ping --namespace health --value 1 --region us-west-2', (err, data) => {
        if (err) {
          logger.error(err);
          logger.error(data);
          logger.error('AWS cloudwatch ping failed for HeartBeat');
        } else {
          logger.info(data);
          logger.success('AWS cloudwatch ping succeeded for HeartBeat');
        }
      });
    } else {
      logger.error('Could not send heartbeat check')
    }
  });
}


function runHealthCheck(seconds = 300) {
  setInterval(() => {
    check();
  }, seconds * 1000);
}

export {runHealthCheck}