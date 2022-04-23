import {exec} from "child_process";
import {logger} from "../../utils/logger/logger";
import {secureConfig} from "../../../config/secureConfig";

function dbBackup(path: string) {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const newdate = `${year}-${month}-${day}`;

  exec(`mongodump --out=${path}/${newdate}`, (err, data) => {
    if (err) {
      logger.error(err);
      logger.info(data);
      logger.error('Database Backed up');
    } else {
      logger.info(data);
      logger.success('Database Backed up');

      exec('aws cloudwatch put-metric-data --metric-name dbBackup --namespace health --value 1 --region us-west-2', (err, data) => {
        if (err) {
          logger.error(err);
          logger.info(data);
          logger.error('AWS Database Backup notification');
        } else {
          logger.info(data);
          logger.success('AWS Database Backup notification');
        }
      });
    }
  });
}

function runDbBackup(path = '/var/lib/evefinance/backups/db') {
  const dayInMS = 1000 * 60 * 60 * 24;
  setInterval(() => {
    dbBackup(path);
  }, secureConfig.DB_BACKUP_DAYS_INTERVAL * dayInMS)
}

export {runDbBackup}