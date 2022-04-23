import * as fs from "fs";

export function readLogFile(logFilePath: string, msgFilter: string, statuses: string[]) {
  const logFileContent = fs.readFileSync(logFilePath, 'utf-8');

  return logFileContent.split('\n').map(((logLine) => {
    try {
      // just see if it can be parsed
      JSON.parse(logLine);

      return logLine;
    } catch (e) {
      // old log lines, we ignore these
      return false;
    }
  })).filter(logLine => {
    // filter empty lines
    return !!logLine;
  }).filter((logLine: string) => {
    // filter statuses
    if (statuses.length) {
      const parsedLogLine = JSON.parse(logLine);
      return statuses.includes(parsedLogLine.topic.toLowerCase())
    } else {
      return true;
    }

  }).filter((logLine: string) => {
    // filter by message
    if (msgFilter) {
      const parsedLogLine = JSON.parse(logLine);
      return parsedLogLine.message.toLowerCase().includes(msgFilter.toLowerCase());
    } else {
      return true;
    }
  });
}