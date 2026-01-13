'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorHandler, ErrorCategory } from '@/utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  // Optional props (fallback, sectionName) default to undefined via TypeScript
  // No defaultProps needed as they're handled by TypeScript's optional properties

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = ErrorHandler.handleError(
      error,
      ErrorCategory.UNKNOWN,
      {
        section: this.props.sectionName,
        componentStack: errorInfo.componentStack,
      }
    );

    this.setState({ errorId });
    // ErrorHandler already logs errors in development mode, no need for console.error
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center bg-cream px-6 py-12">
          <div className="text-center max-w-md space-y-6">
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 font-light mb-2">
              {this.props.sectionName 
                ? `An error occurred in the ${this.props.sectionName} section.`
                : "We're sorry, but something unexpected happened."}
            </p>
            {this.state.errorId && (
              <p className="text-xs text-gray-500 font-light">
                Error ID: {this.state.errorId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-bronze hover:bg-bronze-dark text-charcoal font-light uppercase tracking-wider rounded-sm transition-all duration-300"
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-light uppercase tracking-wider rounded-sm transition-all duration-300"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-light uppercase tracking-wider rounded-sm transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

