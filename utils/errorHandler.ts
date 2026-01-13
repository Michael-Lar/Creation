export enum ErrorCategory {
  NETWORK = 'network',
  VIDEO = 'video',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

export interface ErrorInfo {
  category: ErrorCategory;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Type guard to check if a value is an Error instance
 */
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Safely extract error message from unknown value
 */
function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error && isString(error.message)) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Safely extract Error instance from unknown value
 */
function getErrorInstance(error: unknown): Error | undefined {
  if (isError(error)) {
    return error;
  }
  if (isString(error)) {
    return new Error(error);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = isString(error.message) ? error.message : 'An unknown error occurred';
    return new Error(message);
  }
  return undefined;
}

/**
 * Centralized error handler for logging and categorization
 */
export class ErrorHandler {
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private static logError(info: ErrorInfo): string {
    const errorId = this.generateErrorId();
    const logData = {
      errorId,
      ...info,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logData);
    }
    // In production, errors are silently handled
    // Consider integrating an error tracking service like Sentry

    return errorId;
  }

  static handleError(
    error: Error | unknown,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context?: Record<string, unknown>
  ): string {
    const errorInfo: ErrorInfo = {
      category,
      message: getErrorMessage(error),
      error: getErrorInstance(error),
      context,
      timestamp: new Date().toISOString(),
    };

    return this.logError(errorInfo);
  }

  static handleNetworkError(error: Error, context?: Record<string, unknown>): string {
    return this.handleError(error, ErrorCategory.NETWORK, {
      ...context,
      type: 'network_error',
    });
  }

  static handleVideoError(error: Error, videoIndex?: number): string {
    return this.handleError(error, ErrorCategory.VIDEO, {
      videoIndex,
      type: 'video_error',
    });
  }

  /**
   * Handle validation warnings (non-critical issues)
   * These are logged but don't break the application flow
   */
  static handleValidationWarning(message: string, context?: Record<string, unknown>): string {
    return this.handleError(
      new Error(message),
      ErrorCategory.VALIDATION,
      {
        ...context,
        type: 'validation_warning',
        severity: 'warning',
      }
    );
  }

  /**
   * Handle scroll-related errors
   */
  static handleScrollError(error: Error | unknown, context?: Record<string, unknown>): string {
    return this.handleError(error, ErrorCategory.UNKNOWN, {
      ...context,
      type: 'scroll_error',
    });
  }
}

