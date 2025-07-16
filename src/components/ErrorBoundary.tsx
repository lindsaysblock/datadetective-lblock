/**
 * Enhanced Error Boundary Component
 * Refactored with proper error handling and Data Detective branding
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { SPACING, TEXT_SIZES } from '@/constants/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg border-red-200">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-${SPACING.MD}`}>
                <AlertTriangle className={`w-${SPACING.XL} h-${SPACING.XL} text-white`} />
              </div>
              <CardTitle className={`${TEXT_SIZES.SUBHEADING} text-red-600`}>
                🚨 Investigation Interrupted
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700">
                Our data detective encountered an unexpected error during the investigation.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    Error Details (Development)
                  </summary>
                  <div className={`mt-${SPACING.SM} p-${SPACING.SM} bg-gray-100 rounded text-xs font-mono overflow-auto max-h-32`}>
                    <div className="text-red-600 font-medium">{this.state.error.name}: {this.state.error.message}</div>
                    <div className="text-gray-600 mt-2">{this.state.error.stack}</div>
                  </div>
                </details>
              )}
              
              <div className={`flex flex-col sm:flex-row gap-${SPACING.SM} pt-${SPACING.MD}`}>
                <Button 
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <RefreshCw className={`w-${SPACING.MD} h-${SPACING.MD}`} />
                  Retry Investigation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className={`w-${SPACING.MD} h-${SPACING.MD}`} />
                  Return to HQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;