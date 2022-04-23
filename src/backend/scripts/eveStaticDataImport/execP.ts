import child_process from "child_process";
import {logger} from "../../utils/logger/logger";

/**
 * Wrap exec with a Promise
 * @param cmd
 */
async function execP(cmd: string) {
  return await new Promise((resolve, reject) => {
    const proc = child_process.exec(cmd,   (err, stdout, stderr) => {
      if (err) {
        logger.error(err);
        logger.info(stderr);
        reject(err);
      } else {
        if (stderr || stdout) {
          logger.info(stderr);
          logger.info(stdout);
        }
        resolve(stdout)
      }
    });

    proc.stdout.on("data", (data) => {
      logger.info(data.toString());
    });

    proc.stderr.on("data", (err) => {
      logger.info(err.toString());
    });
  });
}

export {execP};
