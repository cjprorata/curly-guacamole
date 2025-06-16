// src/utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

class Logger {
  constructor() {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.metadata()
      ),
      defaultMeta: {
        service: 'gist-replicator',
        version: process.env.npm_package_version || '1.0.0'
      },
      transports: [
        // Console logging for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // File logging for production
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: path.join('logs', 'combined.log'),
          maxsize: 5242880,
          maxFiles: 10,
        })
      ],
      // Handle uncaught exceptions and unhandled promise rejections
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.join('logs', 'exceptions.log')
        })
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: path.join('logs', 'rejections.log')
        })
      ]
    });
  }

  // Create correlation ID for request tracking
  createCorrelationId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  logRequest(correlationId, url, options = {}) {
    this.logger.info('Starting website replication request', {
      correlationId,
      url,
      options,
      timestamp: new Date().toISOString()
    });
  }

  logError(correlationId, error, context = {}) {
    this.logger.error('Replication error occurred', {
      correlationId,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }

  logProgress(correlationId, stage, details = {}) {
    this.logger.info('Replication progress update', {
      correlationId,
      stage,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new Logger();