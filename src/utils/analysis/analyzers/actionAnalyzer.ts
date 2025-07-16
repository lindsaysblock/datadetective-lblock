
/**
 * Action Analyzer Utility
 * Refactored to meet coding standards with proper constants and error handling
 */

import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

interface ActionBreakdownData {
  name: string;
  value: number;
  percentage: string;
}

interface UserAuthenticationData {
  loggedIn: number;
  anonymous: number;
}

export class ActionAnalyzer {
  private readonly rows: Record<string, unknown>[];
  private readonly enableLogging: boolean;

  constructor(data: ParsedData, enableLogging = true) {
    this.rows = data.rows || [];
    this.enableLogging = enableLogging;
  }

  analyze(): AnalysisResult[] {
    if (this.rows.length === 0) {
      return this.createEmptyDataResults();
    }

    const results: AnalysisResult[] = [];
    
    try {
      // Action type distribution analysis
      const actionDistribution = this.analyzeActionDistribution();
      if (actionDistribution) {
        results.push(actionDistribution);
      }

      // User authentication analysis
      const authenticationAnalysis = this.analyzeUserAuthentication();
      if (authenticationAnalysis) {
        results.push(authenticationAnalysis);
      }

    } catch (error) {
      if (this.enableLogging) {
        console.error('ActionAnalyzer error:', error);
      }
      results.push(this.createErrorResult(error));
    }

    return results;
  }

  private analyzeActionDistribution(): AnalysisResult | null {
    const actionCounts = this.calculateActionCounts();
    
    if (Object.keys(actionCounts).length === 0) {
      return null;
    }

    const actionData = this.formatActionData(actionCounts);
    const mostCommonAction = actionData[0];

    return {
      id: 'action-breakdown',
      title: 'Action Type Distribution',
      description: 'Breakdown of user actions by type',
      value: actionCounts,
      chartType: 'pie',
      chartData: actionData,
      insight: mostCommonAction 
        ? `Most common action: ${mostCommonAction.name} (${mostCommonAction.percentage}%)`
        : 'Action distribution analysis completed',
      confidence: 'high'
    };
  }

  private analyzeUserAuthentication(): AnalysisResult | null {
    const authData = this.calculateAuthenticationData();
    
    if (authData.loggedIn === 0 && authData.anonymous === 0) {
      return null;
    }

    const totalEvents = authData.loggedIn + authData.anonymous;
    const PERCENTAGE_PRECISION = 1;
    const loggedInPercentage = totalEvents > 0 
      ? ((authData.loggedIn / totalEvents) * 100).toFixed(PERCENTAGE_PRECISION)
      : '0.0';

    const chartData = [
      { 
        name: 'Logged-in', 
        value: authData.loggedIn, 
        percentage: loggedInPercentage 
      },
      { 
        name: 'Anonymous', 
        value: authData.anonymous, 
        percentage: ((authData.anonymous / totalEvents) * 100).toFixed(PERCENTAGE_PRECISION) 
      }
    ];

    return {
      id: 'user-authentication',
      title: 'User Authentication Status',
      description: 'Logged-in vs anonymous user events',
      value: authData,
      chartType: 'pie',
      chartData,
      insight: `${loggedInPercentage}% of events from authenticated users`,
      confidence: 'high'
    };
  }

  private calculateActionCounts(): Record<string, number> {
    const actionCounts: Record<string, number> = {};
    
    this.rows.forEach(row => {
      const action = this.extractActionValue(row);
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    });

    return actionCounts;
  }

  private calculateAuthenticationData(): UserAuthenticationData {
    let loggedInCount = 0;
    let anonymousCount = 0;

    this.rows.forEach(row => {
      const userId = row.user_id;
      const isLoggedIn = userId && userId !== 'unknown' && userId !== '' && userId !== null;
      
      if (isLoggedIn) {
        loggedInCount++;
      } else {
        anonymousCount++;
      }
    });

    return {
      loggedIn: loggedInCount,
      anonymous: anonymousCount
    };
  }

  private formatActionData(actionCounts: Record<string, number>): ActionBreakdownData[] {
    const totalActions = Object.values(actionCounts).reduce((sum, count) => sum + count, 0);
    const PERCENTAGE_PRECISION = 1;
    
    return Object.entries(actionCounts)
      .map(([action, count]) => ({
        name: action,
        value: count,
        percentage: totalActions > 0 ? ((count / totalActions) * 100).toFixed(PERCENTAGE_PRECISION) : '0.0'
      }))
      .sort((a, b) => b.value - a.value);
  }

  private extractActionValue(row: Record<string, unknown>): string {
    // Try common action field names
    const actionFields = ['action', 'event', 'event_name', 'activity', 'event_type'];
    
    for (const field of actionFields) {
      const value = row[field];
      if (value && typeof value === 'string') {
        return value;
      }
    }
    
    return 'unknown';
  }

  private createEmptyDataResults(): AnalysisResult[] {
    return [{
      id: 'action-no-data',
      title: 'No Action Data',
      description: 'No action data available for analysis',
      value: 0,
      insight: 'No rows available for action analysis',
      confidence: 'low'
    }];
  }

  private createErrorResult(error: unknown): AnalysisResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      id: 'action-analysis-error',
      title: 'Action Analysis Error',
      description: 'Error occurred during action analysis',
      value: 0,
      insight: `Action analysis failed: ${errorMessage}`,
      confidence: 'low'
    };
  }
}
