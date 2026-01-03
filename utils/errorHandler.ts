export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  VIDEO = 'video',
  FORM = 'form',
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
 * Centralized error handler for logging and categorization
 */
export class ErrorHandler {
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static logError(info: ErrorInfo): string {
    const errorId = this.generateErrorId();
    const logData = {
      errorId,
      ...info,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', logData);
    } else {
      // In production, you would send this to an error tracking service
      // Example: Sentry.captureException(error, { extra: logData });
      console.error('Error logged:', logData);
    }

    return errorId;
  }

  static handleError(
    error: Error | unknown,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context?: Record<string, unknown>
  ): string {
    const errorInfo: ErrorInfo = {
      category,
      message: error instanceof Error ? error.message : String(error),
      error: error instanceof Error ? error : undefined,
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

  static handleValidationError(error: Error, field?: string): string {
    return this.handleError(error, ErrorCategory.VALIDATION, {
      field,
      type: 'validation_error',
    });
  }

  static handleVideoError(error: Error, videoIndex?: number): string {
    return this.handleError(error, ErrorCategory.VIDEO, {
      videoIndex,
      type: 'video_error',
    });
  }

  static handleFormError(error: Error, formData?: Record<string, unknown>): string {
    return this.handleError(error, ErrorCategory.FORM, {
      formData: formData ? { ...formData, sensitive: true } : undefined,
      type: 'form_error',
    });
  }
}

