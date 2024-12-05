/**
 * - Log levels (DEBUG, INFO, WARN, ERROR)
 * - Console and optional remote logging
 * - Configurable log formatting
 * - Environment-based logging
 */
class Logger {
  // Log levels
  static LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  /**
   * Constructor for Logger
   * @param {Object} [options={}] - Configuration options for the logger
   * @param {number} [options.level=LEVELS.INFO] - Minimum log level to display
   * @param {boolean} [options.timestamp=true] - Whether to include timestamp
   * @param {Function} [options.remoteLogger] - Optional remote logging function
   * @param {string} [options.context] - Optional context/module name
   */
  constructor(options = {}) {
    this.level = options.level ?? Logger.LEVELS.INFO;
    this.timestamp = options.timestamp ?? true;
    this.remoteLogger = options.remoteLogger;
    this.context = options.context;
    this.timings = {};
  }

  /**
   * Determine log level based on NODE_ENV
   * @returns {number} Appropriate log level
   * @static
   */
  static getLevelByEnvironment() {
    const env = process.env.REACT_APP_NODE_ENV;
    console.log('ENV: ', env);

    switch (env) {
      case 'production':
        return this.LEVELS.WARN; // Only warnings and errors in production
      case 'development':
        return this.LEVELS.DEBUG; // Verbose logging in development
      case 'test':
        return this.LEVELS.ERROR; // Minimal logging during testing
      default:
        return this.LEVELS.INFO; // Default to info level
    }
  }

  /**
   * Generate a formatted log message
   * @param {string} level - Log level
   * @param {Array} args - Arguments to log
   * @returns {string} Formatted log message
   * @private
   */
  _formatMessage(level, ...args) {
    const timestampStr = this.timestamp ? `[${new Date().toISOString()}] ` : '';
    const contextStr = this.context ? `[${this.context}] ` : '';
    return `${timestampStr}${contextStr}${level.toUpperCase()}: ${args.map(this._serializeArg).join(' ')}`;
  }

  /**
   * Serialize arguments to ensure they can be logged
   * @param {*} arg - Argument to serialize
   * @returns {string} Serialized argument
   * @private
   */
  _serializeArg(arg) {
    if (arg === undefined) return 'undefined';
    if (arg === null) return 'null';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }

  /**
   * Check if a log should be processed based on current log level
   * @param {number} logLevel - Level of the log message
   * @returns {boolean} Whether the log should be processed
   * @private
   */
  _shouldLog(logLevel) {
    return logLevel >= this.level;
  }

  /**
   * Log a debug message
   * @param {...*} args - Arguments to log
   */
  debug(...args) {
    if (this._shouldLog(Logger.LEVELS.DEBUG)) {
      const message = this._formatMessage('debug', ...args);
      console.debug(message);
      this._sendRemoteLog('DEBUG', message);
    }
  }

  /**
   * Log an info message
   * @param {...*} args - Arguments to log
   */
  info(...args) {
    if (this._shouldLog(Logger.LEVELS.INFO)) {
      const message = this._formatMessage('info', ...args);
      console.log(message);
      this._sendRemoteLog('INFO', message);
    }
  }

  /**
   * Log a warning message
   * @param {...*} args - Arguments to log
   */
  warn(...args) {
    if (this._shouldLog(Logger.LEVELS.WARN)) {
      const message = this._formatMessage('warn', ...args);
      console.warn(message);
      this._sendRemoteLog('WARN', message);
    }
  }

  /**
   * Log an error message
   * @param {...*} args - Arguments to log
   */
  error(...args) {
    if (this._shouldLog(Logger.LEVELS.ERROR)) {
      const message = this._formatMessage('error', ...args);
      console.error(message);
      this._sendRemoteLog('ERROR', message);
    }
  }

  /**
   * Send log to remote logging service
   * @param {string} level - Log level
   * @param {string} message - Formatted log message
   * @private
   */
  _sendRemoteLog(level, message) {
    if (this.remoteLogger && typeof this.remoteLogger === 'function') {
      try {
        this.remoteLogger({ level, message });
      } catch (err) {
        // Silently fail to prevent logging failures from breaking app
        console.error('Remote logging failed', err);
      }
    }
  }

  /**
   * Create a child logger with a specific context
   * @param {string} context - Context/module name
   * @returns {Logger} A new Logger instance with the specified context
   */
  createChildLogger(context) {
    return new Logger({
      level: this.level,
      timestamp: this.timestamp,
      remoteLogger: this.remoteLogger,
      context: context,
    });
  }

  time(label) {
    if (this._shouldLog(Logger.LEVELS.DEBUG)) {
      // Start a new timer
      this.timings[label] = { start: Date.now() };
      this.debug(`Started timer: ${label}`);
    }
  }

  timeEnd(label) {
    if (this.timings[label]) {
      const duration = Date.now() - this.timings[label].start;
      this.info(`Timer "${label}" ended. Duration: ${duration}ms`);
      delete this.timings[label];
    } else {
      this.warn(`No timer found with label: ${label}`);
    }
  }
}

function createLogger(options = {}) {
  return new Logger(options);
}

export { Logger, createLogger };
