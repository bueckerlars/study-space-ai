import serverConfig from '../config/serverConfig';

// Define log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class LoggerService {
  private level: LogLevel;
  
  constructor() {
    // Get log level from serverConfig, default to INFO if not set
    const configuredLevel = serverConfig.logLevel.toUpperCase();
    this.level = this.getLogLevelFromString(configuredLevel);
    
    this.info(`Logger initialized with level: ${LogLevel[this.level]}`);
  }
  
  private getLogLevelFromString(level: string): LogLevel {
    switch(level.toUpperCase()) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }
  
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }
  
  error(message: string): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message));
    }
  }
  
  warn(message: string): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message));
    }
  }
  
  info(message: string): void {
    if (this.level >= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message));
    }
  }
  
  debug(message: string): void {
    if (this.level >= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }
}

// Create singleton instance
export const logger = new LoggerService();

export default logger;
