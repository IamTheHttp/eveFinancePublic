import {WriteStream} from "fs";
import * as fs from "fs";
import {secureConfig} from "../../../config/secureConfig";
type loggable = string | number | { toString:() => string};

class Logger {
  private LOG_STREAM: WriteStream;
  private LOG_FILE_PATH: string;
  private MIN_LOG_LEVEl: number;

  // Colors
  private DEBUG_COLOR = '\x1b[36m%s\x1b[0m'; // cyan
  private ERROR_COLOR = '\x1b[31m%s\x1b[0m'; // red
  private SUCCESS_COLOR = '\x1b[32m%s\x1b[0m';
  private INFO_COLOR = '\x1b[37m%s\x1b[0m';
  private BOLD_COLOR = '\x1b[36m%s\x1b[89m\x1b[0m';
  private RAISE_COLOR = '\x1b[33m%s\x1b[89m\x1b[0m';

  private DEBUG = 0;
  private INFO = 1;
  private WARN = 2; // You should act upon this to prevent errors
  private RAISE = 3; // Something unexpected, but still manageable happened
  private ERROR = 4; // Input that cannot be handled was accessed

  constructor(minLogLevel?: number) {
    this.MIN_LOG_LEVEl = minLogLevel || this.INFO;
    this.rotateLogFile();
  }

  private getUpdatedLogFilePath() {
    const FULL_DATE = new Date().toISOString().split('T')[0];
    return `${secureConfig.LOG_ROOT_PATH}/${FULL_DATE}.log`;
  }

  private setLogStream(path:string) {
    this.LOG_STREAM = fs.createWriteStream(this.LOG_FILE_PATH, {flags:'a'})
  }

  shouldRotateLogs() {
    return this.LOG_FILE_PATH !== this.getUpdatedLogFilePath();
  }

  rotateLogFile() {
    this.LOG_FILE_PATH = this.getUpdatedLogFilePath();
    fs.mkdirSync(secureConfig.LOG_ROOT_PATH, {recursive:true});
    this.setLogStream(this.LOG_FILE_PATH);
  }

  private writeToLogFile(msg: string) {
    this.LOG_STREAM.write(msg);
  }

  private writeToConsole(color: string, msg: string) {
    console.log(color, msg);
  }

  genericLog(data : {color: string, msg: loggable, level: number, topic: string}) {
    if (this.shouldRotateLogs()) {
      this.LOG_STREAM.end();
      this.rotateLogFile();
    }

    const [date, time] = (new Date().toISOString()).split('T');
    const MSG = data.msg.toString();
    const TOPIC = data.topic;
    const COLOR = data.color;
    const LEVEL = data.level;

    const FULL_MESSAGE = `${time} - |${TOPIC.toUpperCase().padEnd(10, ' ')}| - ${MSG}`;

    const LOG_JSON_DATA = {
      time,
      topic: TOPIC.toUpperCase(),
      message: MSG
    }

    if (this.MIN_LOG_LEVEl <= LEVEL) {
      this.writeToLogFile(`${JSON.stringify(LOG_JSON_DATA)}\n`);
      this.writeToConsole(COLOR, FULL_MESSAGE);
    }
  }

  /**
   * @param topic
   * @param level LOGGER.DEBUG, LOGGER.ERROR etc.
   * @param msg
   */
  logTopic(level: number, topic: string, msg: loggable) {
    this.genericLog({level, topic, msg, color: this.INFO_COLOR});
  }

  log(str: loggable) {
    this.genericLog({msg:str, topic: 'log', level: this.INFO, color: this.INFO_COLOR});
  }

  info(str: loggable) {
    this.genericLog({msg:str, topic: 'info', level: this.INFO, color: this.INFO_COLOR});
  }

  bold(str: loggable) {
    this.genericLog({msg:str, topic: 'bold', level: this.INFO, color: this.BOLD_COLOR});
  }

  raise(str: loggable) {
    this.genericLog({msg:str, topic: 'raise', level: this.RAISE, color: this.RAISE_COLOR});
  }

  success(str: loggable) {
    this.genericLog({msg: `${str}`, topic: 'success', level: this.INFO, color: this.SUCCESS_COLOR});
  }

  error(str: loggable) {
    this.genericLog({msg: `${str}`, topic: 'error', level: this.ERROR, color: this.ERROR_COLOR});
  }

  debug(str: loggable) {
    if (process.env.DEBUG) {
      this.genericLog({msg: `${str}`, topic: 'debug', level: this.DEBUG, color: this.DEBUG_COLOR});
    }
  }
}

const logger = new Logger();

export {logger}