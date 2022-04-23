import {Express} from "express";
import {SystemResponse} from "../../../../sharedInterfaces/ApiSystemInteraces";
import * as fs from 'fs';
import * as path from 'path';
import {readLogFile} from "../utils/readLogFile";
import {getSortedLogFiles} from "../utils/getSortedLogFiles";




async function logsAPI(app: Express) {
  app.post('/admin/logs', async (req, res: SystemResponse<any>) => {
    const logsPath = path.resolve(`${__dirname}/../../../../../logs`);
    const sortedLogs = getSortedLogFiles(logsPath);

    const requestedLogFile = req.body.logFilePath;
    const messageFilter = req.body.messageFilter;
    const statuses = req.body.statuses;


    const DEFAULT_LOG_FILE = sortedLogs[0];

    const LOG_FILE_TO_READ = requestedLogFile || DEFAULT_LOG_FILE;

    const logLines = readLogFile(sortedLogs.find((file) => {return file === LOG_FILE_TO_READ}), messageFilter, statuses );

    res.send({
      errorID: 0,
      data: {
        logFiles: sortedLogs,
        logLines: logLines
      }
    });
  })
}

export default logsAPI;








