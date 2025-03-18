import { createClient } from '@supabase/supabase-js'

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

class Logger {
  private static instance: Logger;
  private logLevel: number;

  private constructor() {
    this.logLevel = LOG_LEVELS.DEBUG; // Set default log level
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  public debug(message: string, data?: any) {
    if (this.logLevel <= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  public info(message: string, data?: any) {
    if (this.logLevel <= LOG_LEVELS.INFO) {
      console.info(this.formatMessage('INFO', message, data));
    }
  }

  public warn(message: string, data?: any) {
    if (this.logLevel <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  public error(message: string, error?: any) {
    if (this.logLevel <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, error));
      if (error?.stack) {
        console.error(error.stack);
      }
    }
  }

  public setLogLevel(level: keyof typeof LOG_LEVELS) {
    this.logLevel = LOG_LEVELS[level];
  }
}

export const logger = Logger.getInstance();
