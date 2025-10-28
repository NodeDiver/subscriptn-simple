/**
 * Logging Utility
 *
 * Environment-aware logging that suppresses debug logs in production
 * while always showing errors. Provides structured logging for better
 * debugging and monitoring.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  /**
   * Format log message with context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }

    return `${prefix} ${message}`;
  }

  /**
   * Debug-level logs (development only)
   * Use for detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info-level logs (all environments)
   * Use for general informational messages
   */
  info(message: string, context?: LogContext): void {
    if (!this.isTest) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  /**
   * Warning-level logs (all environments)
   * Use for potentially harmful situations
   */
  warn(message: string, context?: LogContext): void {
    if (!this.isTest) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Error-level logs (all environments)
   * Always logged, use for error conditions
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
    };

    // Add error details if provided
    if (error instanceof Error) {
      errorContext.error = {
        message: error.message,
        name: error.name,
        ...(this.isDevelopment && { stack: error.stack }),
      };
    } else if (error) {
      errorContext.error = error;
    }

    console.error(this.formatMessage('error', message, errorContext));
  }

  /**
   * Log API request (development only)
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.debug(`API Request: ${method} ${path}`, context);
  }

  /**
   * Log API response (development only)
   */
  apiResponse(method: string, path: string, status: number, duration?: number): void {
    const context: LogContext = { status };
    if (duration !== undefined) {
      context.duration = `${duration}ms`;
    }
    this.debug(`API Response: ${method} ${path}`, context);
  }

  /**
   * Log database query (development only)
   */
  dbQuery(operation: string, model: string, duration?: number): void {
    const context: LogContext = { operation, model };
    if (duration !== undefined) {
      context.duration = `${duration}ms`;
    }
    this.debug('Database Query', context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogLevel, LogContext };
