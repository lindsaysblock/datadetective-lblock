
export interface DataObservation {
  id: string;
  type: 'pattern' | 'anomaly' | 'correlation' | 'trend' | 'segment_insight';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  businessImpact: 'high' | 'medium' | 'low';
  dataPoints: string[];
  actionableInsight: string;
  recommendedQuestions: string[];
  visualizationType: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap';
}

export interface QuestionRecommendation {
  question: string;
  rationale: string;
  expectedInsights: string[];
  businessValue: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredData: string[];
}

export const generateAIObservations = (
  query: string,
  datasetType: 'behavioral' | 'transactional' | 'survey' | 'mixed'
): DataObservation[] => {
  const observations: DataObservation[] = [];
  
  // Pattern Recognition Observations
  observations.push({
    id: 'pattern_001',
    type: 'pattern',
    title: 'Peak Activity Hours Identified',
    description: 'User activity shows consistent peaks between 9-11 AM and 2-4 PM, with 40% higher engagement during these windows.',
    confidence: 'high',
    businessImpact: 'medium',
    dataPoints: ['hourly_activity', 'engagement_score', 'session_duration'],
    actionableInsight: 'Schedule important communications, feature releases, and marketing campaigns during peak activity hours for maximum impact.',
    recommendedQuestions: [
      'What content performs best during peak hours?',
      'How do conversion rates vary by time of day?',
      'Are peak hours consistent across user segments?'
    ],
    visualizationType: 'line'
  });
  
  // Anomaly Detection
  observations.push({
    id: 'anomaly_001',
    type: 'anomaly',
    title: 'Unusual Churn Spike in Power Users',
    description: 'Power users show a 25% increase in churn risk indicators over the past 2 weeks, despite historically low churn rates.',
    confidence: 'high',
    businessImpact: 'high',
    dataPoints: ['churn_risk', 'user_segment', 'last_activity_date', 'engagement_score'],
    actionableInsight: 'Immediately investigate what changed for power users - recent feature updates, pricing changes, or competitor actions.',
    recommendedQuestions: [
      'What features did churning power users stop using?',
      'Are there specific cohorts within power users showing higher churn?',
      'What was the last interaction before churn signals appeared?'
    ],
    visualizationType: 'bar'
  });
  
  // Correlation Insights
  observations.push({
    id: 'correlation_001',
    type: 'correlation',
    title: 'Strong Link Between Feature Usage and Retention',
    description: 'Users who engage with 3+ core features within their first week show 78% higher retention at 30 days.',
    confidence: 'high',
    businessImpact: 'high',
    dataPoints: ['feature_usage', 'retention_rate', 'first_week_activity', 'user_onboarding'],
    actionableInsight: 'Optimize onboarding to guide new users toward using at least 3 core features within their first week.',
    recommendedQuestions: [
      'Which specific feature combinations drive the highest retention?',
      'How can we better guide users to discover core features?',
      'What barriers prevent users from reaching the 3-feature threshold?'
    ],
    visualizationType: 'scatter'
  });
  
  // Trend Analysis
  if (query.toLowerCase().includes('trend') || query.toLowerCase().includes('time')) {
    observations.push({
      id: 'trend_001',
      type: 'trend',
      title: 'Mobile Usage Accelerating',
      description: 'Mobile device usage has grown 34% over the past quarter, now accounting for 68% of all sessions.',
      confidence: 'high',
      businessImpact: 'medium',
      dataPoints: ['device_type', 'session_count', 'quarterly_growth'],
      actionableInsight: 'Prioritize mobile experience optimization and consider mobile-first feature development.',
      recommendedQuestions: [
        'How does mobile user behavior differ from desktop users?',
        'Are mobile conversion rates keeping pace with usage growth?',
        'What mobile-specific features would add the most value?'
      ],
      visualizationType: 'line'
    });
  }
  
  // Segmentation Insights
  if (query.toLowerCase().includes('segment') || query.toLowerCase().includes('group')) {
    observations.push({
      id: 'segment_001',
      type: 'segment_insight',
      title: 'Distinct Behavioral Patterns by Acquisition Channel',
      description: 'Users from organic search show 2.3x longer session duration but 40% lower immediate conversion compared to paid channels.',
      confidence: 'medium',
      businessImpact: 'medium',
      dataPoints: ['acquisition_channel', 'session_duration', 'conversion_rate', 'user_behavior'],
      actionableInsight: 'Tailor content strategy by channel - focus on nurturing organic users while optimizing paid channel conversion funnels.',
      recommendedQuestions: [
        'What content keeps organic users engaged longer?',
        'How can we improve immediate conversion for organic traffic?',
        'What drives the behavior differences between channels?'
      ],
      visualizationType: 'bar'
    });
  }
  
  return observations;
};

export const generateRecommendedQuestions = (
  currentQuery: string,
  observations: DataObservation[],
  datasetType: 'behavioral' | 'transactional' | 'survey' | 'mixed'
): QuestionRecommendation[] => {
  const recommendations: QuestionRecommendation[] = [];
  
  // Drill-down questions based on current insights
  recommendations.push({
    question: "What are the key differences in behavior between our highest-value and lowest-value user segments?",
    rationale: "Understanding behavioral patterns that drive value helps optimize acquisition and retention strategies.",
    expectedInsights: [
      "Feature usage patterns that correlate with high lifetime value",
      "Onboarding paths that lead to better outcomes",
      "Early indicators of user value potential"
    ],
    businessValue: "Can improve customer acquisition cost efficiency by 25-40% and increase average LTV",
    difficulty: 'intermediate',
    requiredData: ['user_segments', 'ltv', 'behavioral_events', 'feature_usage']
  });
  
  recommendations.push({
    question: "Which user actions in the first 7 days best predict long-term retention?",
    rationale: "Early behavior prediction allows for proactive intervention to improve retention rates.",
    expectedInsights: [
      "Critical milestones users must reach for retention",
      "Early warning signs of potential churn",
      "Optimal onboarding sequence timing"
    ],
    businessValue: "Could reduce churn by 15-30% through better early intervention strategies",
    difficulty: 'advanced',
    requiredData: ['user_onboarding', 'retention_cohorts', 'early_actions', 'churn_data']
  });
  
  recommendations.push({
    question: "How does user engagement vary by day of week and time of day, and what drives these patterns?",
    rationale: "Temporal patterns reveal optimal timing for feature releases, communications, and support availability.",
    expectedInsights: [
      "Peak engagement windows for maximum impact",
      "User timezone and behavior correlations",
      "Content performance by timing"
    ],
    businessValue: "Can increase campaign effectiveness by 20-35% through optimal timing",
    difficulty: 'beginner',
    requiredData: ['temporal_activity', 'engagement_metrics', 'user_timezones']
  });
  
  if (datasetType === 'behavioral') {
    recommendations.push({
      question: "What feature combinations create the stickiest user experiences?",
      rationale: "Understanding feature synergies helps prioritize development and guides users toward higher-value workflows.",
      expectedInsights: [
        "Feature usage sequences that increase retention",
        "Cross-feature adoption patterns",
        "Features that act as retention anchors"
      ],
      businessValue: "Could guide product roadmap decisions worth millions in development resources",
      difficulty: 'advanced',
      requiredData: ['feature_usage', 'user_workflows', 'retention_data', 'feature_adoption']
    });
  }
  
  recommendations.push({
    question: "Are there hidden user segments with distinct needs that we're not addressing?",
    rationale: "Uncovering micro-segments can reveal new product opportunities and reduce one-size-fits-all assumptions.",
    expectedInsights: [
      "Behavioral clusters not captured in current segmentation",
      "Unmet needs within existing user base",
      "Opportunities for personalization"
    ],
    businessValue: "Could unlock 10-25% additional revenue through better product-market fit",
    difficulty: 'intermediate',
    requiredData: ['behavioral_events', 'user_attributes', 'usage_patterns', 'satisfaction_data']
  });
  
  return recommendations;
};

export const generateContextualObservations = (
  query: string,
  businessContext?: string
): DataObservation[] => {
  const observations: DataObservation[] = [];
  
  // Context-aware observations based on the specific question
  if (query.toLowerCase().includes('churn') || query.toLowerCase().includes('retention')) {
    observations.push({
      id: 'context_churn_001',
      type: 'pattern',
      title: 'Churn Warning Signs Detected',
      description: 'Users showing churn risk exhibit decreased feature usage 14 days before churning, particularly in core workflow features.',
      confidence: 'high',
      businessImpact: 'high',
      dataPoints: ['feature_usage_decline', 'session_frequency', 'support_tickets'],
      actionableInsight: 'Implement proactive outreach when users show 50% decrease in core feature usage over 7-day period.',
      recommendedQuestions: [
        'What intervention strategies work best for at-risk users?',
        'Are there seasonal patterns in churn behavior?',
        'How effective is our current retention messaging?'
      ],
      visualizationType: 'line'
    });
  }
  
  if (query.toLowerCase().includes('conversion') || query.toLowerCase().includes('funnel')) {
    observations.push({
      id: 'context_conversion_001',
      type: 'pattern',
      title: 'Conversion Funnel Bottleneck Identified',
      description: 'Significant drop-off (45%) occurs at the feature setup stage, with mobile users 2x more likely to abandon.',
      confidence: 'high',
      businessImpact: 'high',
      dataPoints: ['funnel_steps', 'device_type', 'completion_rates'],
      actionableInsight: 'Simplify mobile feature setup flow and add progress indicators to reduce abandonment.',
      recommendedQuestions: [
        'What specific setup steps cause the most friction?',
        'How can we better guide users through initial setup?',
        'Are there demographic patterns in setup completion?'
      ],
      visualizationType: 'bar'
    });
  }
  
  return observations;
};
