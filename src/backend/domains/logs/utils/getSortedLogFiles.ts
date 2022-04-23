import fs from "fs";

export function getSortedLogFiles(logsPath: string) {
  const data = fs.readdirSync(logsPath);

  const sortedLogFiles = data.filter((fileName) => {
    const stats = fs.statSync(`${logsPath}/${fileName}`);

    if (stats.isFile()) {
      return true;
    } else {
      return false;
    }
  }).sort().reverse().map((fileName) => {
    return `${logsPath}/${fileName}`
  });

  return sortedLogFiles;
}