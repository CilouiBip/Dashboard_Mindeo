import { LOG_CONFIG } from './config';

class Logger {
  private static instance: Logger;
  private logBuffer: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, service: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${service}: ${message}${dataStr}`;
  }

  private log(level: string, service: string, message: string, data?: any) {
    const formattedMessage = this.formatMessage(level, service, message, data);
    
    if (LOG_CONFIG.ENABLE_CONSOLE_LOGS) {
      switch (level) {
        case 'ERROR':
          console.error(formattedMessage);
          break;
        case 'WARN':
          console.warn(formattedMessage);
          break;
        case 'INFO':
          console.info(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }

    if (LOG_CONFIG.ENABLE_FILE_LOGS) {
      this.logBuffer.push(formattedMessage);
    }
  }

  debug(service: string, message: string, data?: any) {
    if (LOG_CONFIG.LOG_LEVEL === 'debug') {
      this.log('DEBUG', service, message, data);
    }
  }

  info(service: string, message: string, data?: any) {
    if (['debug', 'info'].includes(LOG_CONFIG.LOG_LEVEL)) {
      this.log('INFO', service, message, data);
    }
  }

  warn(service: string, message: string, data?: any) {
    if (['debug', 'info', 'warn'].includes(LOG_CONFIG.LOG_LEVEL)) {
      this.log('WARN', service, message, data);
    }
  }

  error(service: string, message: string, data?: any) {
    this.log('ERROR', service, message, data);
  }

  getLogBuffer(): string[] {
    return this.logBuffer;
  }

  clearLogBuffer() {
    this.logBuffer = [];
  }
}

export const logger = Logger.getInstance();
