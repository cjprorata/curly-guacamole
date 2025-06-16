// src/core/ErrorHandler.js
const logger = require('../utils/logger');

class ReplicationError extends Error {
  constructor(message, type, context = {}, originalError = null) {
    super(message);
    this.name = 'ReplicationError';
    this.type = type;
    this.context = context;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.retryable = this.determineRetryable(type);
  }

  determineRetryable(type) {
    const retryableTypes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'SERVER_ERROR',
      'RATE_LIMIT_ERROR',
      'TEMPORARY_FAILURE'
    ];
    return retryableTypes.includes(type);
  }
}

class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      maxRetries: options.maxRetries || 3,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 30000,
      enableCircuitBreaker: options.enableCircuitBreaker || true,
      alertThreshold: options.alertThreshold || 10,
      ...options
    };

    this.errorCounts = new Map();
    this.circuitBreakers = new Map();
    this.recentErrors = [];
  }

  async handleError(error, correlationId, context = {}) {
    const errorInfo = this.categorizeError(error, context);

    // Log the error with full context
    logger.logError(correlationId, error, {
      ...context,
      errorType: errorInfo.type,
      errorCategory: errorInfo.category,
      retryable: errorInfo.retryable,
      severity: errorInfo.severity
    });

    // Update error statistics
    this.updateErrorStats(errorInfo);

    // Check if we should trigger alerts
    await this.checkAlertThresholds(errorInfo, correlationId);

    // Return structured error information
    return {
      ...errorInfo,
      correlationId,
      shouldRetry: errorInfo.retryable && !this.isCircuitOpen(context.operation),
      nextRetryDelay: this.calculateRetryDelay(context.attempt || 1)
    };
  }

  categorizeError(error, context = {}) {
    let type, category, severity, retryable = false;

    // HTTP Errors
    if (error.response && error.response.status) {
      const status = error.response.status;
      if (status >= 400 && status < 500) {
        // Client errors
        switch (status) {
          case 400:
            type = 'BAD_REQUEST';
            category = 'CLIENT_ERROR';
            severity = 'MEDIUM';
            retryable = false;
            break;
          case 401:
            type = 'UNAUTHORIZED';
            category = 'AUTH_ERROR';
            severity = 'HIGH';
            retryable = false;
            break;
          case 403:
            type = 'FORBIDDEN';
            category = 'AUTH_ERROR';
            severity = 'HIGH';
            retryable = false;
            break;
          case 404:
            type = 'NOT_FOUND';
            category = 'CLIENT_ERROR';
            severity = 'MEDIUM';
            retryable = false;
            break;
          case 429:
            type = 'RATE_LIMIT_ERROR';
            category = 'RATE_LIMIT';
            severity = 'MEDIUM';
            retryable = true;
            break;
          default:
            type = 'CLIENT_ERROR';
            category = 'CLIENT_ERROR';
            severity = 'MEDIUM';
            retryable = false;
        }
      } else if (status >= 500) {
        // Server errors
        type = 'SERVER_ERROR';
        category = 'SERVER_ERROR';
        severity = 'HIGH';
        retryable = true;
      }
    }
    // Network Errors
    else if (error.code) {
      switch (error.code) {
        case 'ECONNRESET':
        case 'ECONNREFUSED':
        case 'ENOTFOUND':
        case 'ETIMEDOUT':
          type = 'NETWORK_ERROR';
          category = 'NETWORK';
          severity = 'MEDIUM';
          retryable = true;
          break;
        case 'ECONNABORTED':
          type = 'TIMEOUT_ERROR';
          category = 'TIMEOUT';
          severity = 'MEDIUM';
          retryable = true;
          break;
        default:
          type = 'UNKNOWN_NETWORK_ERROR';
          category = 'NETWORK';
          severity = 'MEDIUM';
          retryable = true;
      }
    }
    // Puppeteer/Browser Errors
    else if (error.message) {
      const message = error.message.toLowerCase();
      if (message.includes('timeout') || message.includes('timed out')) {
        type = 'TIMEOUT_ERROR';
        category = 'TIMEOUT';
        severity = 'MEDIUM';
        retryable = true;
      } else if (message.includes('navigation') || message.includes('frame')) {
        type = 'NAVIGATION_ERROR';
        category = 'BROWSER';
        severity = 'MEDIUM';
        retryable = true;
      } else if (message.includes('protocol') || message.includes('connection')) {
        type = 'PROTOCOL_ERROR';
        category = 'BROWSER';
        severity = 'HIGH';
        retryable = true;
      } else if (message.includes('selector') || message.includes('element')) {
        type = 'ELEMENT_ERROR';
        category = 'PARSING';
        severity = 'LOW';
        retryable = false;
      } else {
        type = 'UNKNOWN_BROWSER_ERROR';
        category = 'BROWSER';
        severity = 'MEDIUM';
        retryable = false;
      }
    }
    // Parsing Errors
    else if (error instanceof SyntaxError) {
      type = 'PARSING_ERROR';
      category = 'PARSING';
      severity = 'LOW';
      retryable = false;
    }
    // Default
    else {
      type = 'UNKNOWN_ERROR';
      category = 'UNKNOWN';
      severity = 'MEDIUM';
      retryable = false;
    }

    return {
      type,
      category,
      severity,
      retryable,
      message: error.message,
      stack: error.stack,
      originalError: error
    };
  }

  async retryOperation(operation, correlationId, context = {}) {
    const maxRetries = context.maxRetries || this.options.maxRetries;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        // Check circuit breaker
        if (this.isCircuitOpen(context.operationName)) {
          throw new ReplicationError(
            'Circuit breaker is open for this operation',
            'CIRCUIT_BREAKER_OPEN',
            { operationName: context.operationName }
          );
        }

        logger.logProgress(correlationId, 'retry_attempt', {
          operation: context.operationName || 'unknown',
          attempt,
          maxRetries: maxRetries + 1
        });

        const result = await operation(attempt);

        // Success - reset circuit breaker
        this.recordSuccess(context.operationName);

        if (attempt > 1) {
          logger.logProgress(correlationId, 'retry_success', {
            operation: context.operationName || 'unknown',
            successfulAttempt: attempt,
            totalAttempts: attempt
          });
        }

        return result;
      } catch (error) {
        lastError = error;

        const errorInfo = await this.handleError(error, correlationId, {
          ...context,
          attempt,
          operation: context.operationName
        });

        // Record failure for circuit breaker
        this.recordFailure(context.operationName);

        // If this is the last attempt or error is not retryable, throw
        if (attempt >= maxRetries + 1 || !errorInfo.retryable) {
          throw new ReplicationError(
            `Operation failed after ${attempt} attempts: ${error.message}`,
            'MAX_RETRIES_EXCEEDED',
            {
              ...context,
              finalAttempt: attempt,
              maxRetries: maxRetries + 1
            },
            error
          );
        }

        // Wait before retry with exponential backoff
        const delay = this.calculateRetryDelay(attempt);
        logger.logProgress(correlationId, 'retry_delay', {
          operation: context.operationName || 'unknown',
          attempt,
          delay,
          nextAttempt: attempt + 1
        });

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  calculateRetryDelay(attempt) {
    // Exponential backoff with jitter
    const baseDelay = this.options.baseDelay;
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), this.options.maxDelay);
    
    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() - 0.5);
    return Math.max(0, delay + jitter);
  }

  updateErrorStats(errorInfo) {
    const key = `${errorInfo.type}_${errorInfo.category}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    // Keep recent errors for pattern analysis
    this.recentErrors.push({
      ...errorInfo,
      timestamp: Date.now()
    });

    // Keep only last 100 errors
    if (this.recentErrors.length > 100) {
      this.recentErrors = this.recentErrors.slice(-100);
    }
  }

  async checkAlertThresholds(errorInfo, correlationId) {
    const recentCount = this.getRecentErrorCount(errorInfo.type, 5 * 60 * 1000); // Last 5 minutes

    if (recentCount >= this.options.alertThreshold) {
      await this.sendAlert({
        type: 'ERROR_THRESHOLD_EXCEEDED',
        errorType: errorInfo.type,
        count: recentCount,
        timeframe: '5 minutes',
        correlationId
      });
    }
  }

  getRecentErrorCount(errorType, timeframeMs) {
    const cutoff = Date.now() - timeframeMs;
    return this.recentErrors.filter(error =>
      error.type === errorType && error.timestamp > cutoff
    ).length;
  }

  // Circuit Breaker Implementation
  recordSuccess(operationName) {
    if (!operationName) return;

    const breaker = this.getCircuitBreaker(operationName);
    breaker.failures = 0;
    breaker.lastFailureTime = null;

    if (breaker.state === 'HALF_OPEN') {
      breaker.state = 'CLOSED';
      logger.logProgress('system', 'circuit_breaker_closed', {
        operation: operationName
      });
    }
  }

  recordFailure(operationName) {
    if (!operationName) return;

    const breaker = this.getCircuitBreaker(operationName);
    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= breaker.threshold && breaker.state === 'CLOSED') {
      breaker.state = 'OPEN';
      breaker.openTime = Date.now();
      logger.logProgress('system', 'circuit_breaker_opened', {
        operation: operationName,
        failures: breaker.failures
      });
    }
  }

  isCircuitOpen(operationName) {
    if (!operationName || !this.options.enableCircuitBreaker) return false;

    const breaker = this.getCircuitBreaker(operationName);

    if (breaker.state === 'CLOSED') {
      return false;
    }

    if (breaker.state === 'OPEN') {
      const timeSinceOpen = Date.now() - breaker.openTime;
      if (timeSinceOpen >= breaker.timeout) {
        breaker.state = 'HALF_OPEN';
        logger.logProgress('system', 'circuit_breaker_half_open', {
          operation: operationName
        });
        return false;
      }
      return true;
    }

    // HALF_OPEN state
    return false;
  }

  getCircuitBreaker(operationName) {
    if (!this.circuitBreakers.has(operationName)) {
      this.circuitBreakers.set(operationName, {
        state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
        failures: 0,
        threshold: 5,
        timeout: 60000, // 1 minute
        lastFailureTime: null,
        openTime: null
      });
    }
    return this.circuitBreakers.get(operationName);
  }

  async sendAlert(alertData) {
    try {
      logger.logProgress('system', 'alert_triggered', alertData);
      
      // Here you would integrate with your alerting system
      // For now, just log the alert
      console.log('🚨 ALERT:', alertData);
    } catch (error) {
      logger.logError('system', error, {
        stage: 'alert_sending',
        alertData
      });
    }
  }

  getErrorStatistics() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    const lastDay = now - (24 * 60 * 60 * 1000);

    const recentErrors = this.recentErrors.filter(error => error.timestamp > lastHour);
    const dailyErrors = this.recentErrors.filter(error => error.timestamp > lastDay);

    return {
      totalErrorTypes: this.errorCounts.size,
      errorsLastHour: recentErrors.length,
      errorsLastDay: dailyErrors.length,
      errorCounts: Object.fromEntries(this.errorCounts),
      circuitBreakerStates: Object.fromEntries(
        Array.from(this.circuitBreakers.entries()).map(([name, breaker]) => [
          name,
          { state: breaker.state, failures: breaker.failures }
        ])
      )
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export both the class and the custom error
module.exports = { ErrorHandler, ReplicationError };