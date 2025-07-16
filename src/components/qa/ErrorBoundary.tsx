
/**
 * Error Boundary Component
 * Catches and displays React errors with recovery options
 * Refactored for consistency and maintainability
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SPACING, ICON_SIZES } from '@/constants/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={`max-w-2xl mx-auto mt-${SPACING.LG}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-${SPACING.SM} text-destructive`}>
              <AlertTriangle className={`w-${ICON_SIZES.MD} h-${ICON_SIZES.MD}`} />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className={`space-y-${SPACING.MD}`}>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {this.state.error && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className={`mt-${SPACING.SM} text-xs bg-muted p-${SPACING.SM} rounded overflow-auto`}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <Button onClick={this.handleReset} className="w-full">
              <RefreshCw className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} mr-${SPACING.SM}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
