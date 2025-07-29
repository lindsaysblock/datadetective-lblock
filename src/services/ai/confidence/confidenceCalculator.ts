import { AIProviderType, AIResponse } from '@/types/aiProvider';
import { AnalysisContext } from '@/services/intelligentQAService';
import { DataInsights } from '@/services/ai/analysis/dataAnalyzer';

export interface ConfidenceFactors {
  providerReliability: number;
  dataQuality: number;
  responseDepth: number;
  contextRelevance: number;
  analysisComplexity: number;
}

export class ConfidenceCalculator {
  static calculate(
    response: AIResponse, 
    context: AnalysisContext, 
    dataInsights: DataInsights,
    providerType: AIProviderType
  ): number {
    const factors = this.calculateFactors(response, context, dataInsights, providerType);
    
    // Weighted average of confidence factors
    const weights = {
      providerReliability: 0.25,
      dataQuality: 0.30,
      responseDepth: 0.20,
      contextRelevance: 0.15,
      analysisComplexity: 0.10
    };
    
    const weightedScore = 
      factors.providerReliability * weights.providerReliability +
      factors.dataQuality * weights.dataQuality +
      factors.responseDepth * weights.responseDepth +
      factors.contextRelevance * weights.contextRelevance +
      factors.analysisComplexity * weights.analysisComplexity;
    
    return Math.min(Math.max(weightedScore, 0.1), 0.98); // Clamp between 0.1 and 0.98
  }

  private static calculateFactors(
    response: AIResponse,
    context: AnalysisContext,
    dataInsights: DataInsights,
    providerType: AIProviderType
  ): ConfidenceFactors {
    return {
      providerReliability: this.getProviderReliability(providerType),
      dataQuality: this.assessDataQuality(dataInsights),
      responseDepth: this.assessResponseDepth(response),
      contextRelevance: this.assessContextRelevance(context, response),
      analysisComplexity: this.assessAnalysisComplexity(context, dataInsights)
    };
  }

  private static getProviderReliability(providerType: AIProviderType): number {
    switch (providerType) {
      case 'claude':
        return 0.85; // High reliability for reasoning tasks
      case 'openai':
        return 0.80; // Good general reliability
      case 'perplexity':
        return 0.75; // Good for real-time data, slightly less consistent for pure analysis
      default:
        return 0.70;
    }
  }

  private static assessDataQuality(dataInsights: DataInsights): number {
    const { dataQuality } = dataInsights;
    
    // Weighted average of data quality metrics
    const qualityScore = 
      dataQuality.completeness * 0.35 +
      dataQuality.consistency * 0.25 +
      dataQuality.validity * 0.25 +
      dataQuality.uniqueness * 0.15;
    
    // Boost confidence for larger datasets
    let sizeBonus = 0;
    if (dataInsights.rowCount > 1000) sizeBonus = 0.1;
    else if (dataInsights.rowCount > 100) sizeBonus = 0.05;
    
    // Boost confidence for more columns (richer data)
    let complexityBonus = 0;
    if (dataInsights.columnCount > 10) complexityBonus = 0.05;
    else if (dataInsights.columnCount > 5) complexityBonus = 0.02;
    
    return Math.min(qualityScore + sizeBonus + complexityBonus, 1.0);
  }

  private static assessResponseDepth(response: AIResponse): number {
    const content = response.content;
    const contentLength = content.length;
    
    let depthScore = 0.5; // Base score
    
    // Length indicates thoroughness
    if (contentLength > 1500) depthScore += 0.2;
    else if (contentLength > 800) depthScore += 0.1;
    else if (contentLength < 200) depthScore -= 0.2;
    
    // Check for structured analysis indicators
    const structureIndicators = [
      /\d+\./g, // Numbered lists
      /•|·|-/g, // Bullet points
      /\*\*.*?\*\*/g, // Bold text (markdown)
      /analysis|insight|recommendation|conclusion/gi,
      /data shows|indicates|suggests/gi,
      /statistical|correlation|trend|pattern/gi
    ];
    
    let structureScore = 0;
    structureIndicators.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        structureScore += Math.min(matches.length * 0.02, 0.1);
      }
    });
    
    // Check for specific data analysis terms
    const analysisTerms = [
      'mean', 'median', 'average', 'percentage', 'ratio', 'correlation',
      'trend', 'pattern', 'distribution', 'outlier', 'variance', 'standard deviation'
    ];
    
    const analysisTermCount = analysisTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).length;
    
    const analysisBonus = Math.min(analysisTermCount * 0.03, 0.15);
    
    return Math.min(depthScore + structureScore + analysisBonus, 1.0);
  }

  private static assessContextRelevance(context: AnalysisContext, response: AIResponse): number {
    const question = context.question.toLowerCase();
    const answer = response.content.toLowerCase();
    
    // Extract key terms from the question
    const questionWords = question
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['what', 'when', 'where', 'how', 'why', 'does', 'can', 'will', 'would', 'should'].includes(word));
    
    if (questionWords.length === 0) return 0.6; // Default if no meaningful words
    
    // Check how many question terms appear in the answer
    const relevantTerms = questionWords.filter(word => answer.includes(word));
    const relevanceRatio = relevantTerms.length / questionWords.length;
    
    // Base relevance score
    let relevanceScore = 0.4 + (relevanceRatio * 0.4);
    
    // Boost for question-specific analysis
    if (question.includes('trend') && answer.includes('trend')) relevanceScore += 0.1;
    if (question.includes('compare') && (answer.includes('compar') || answer.includes('versus'))) relevanceScore += 0.1;
    if (question.includes('predict') && (answer.includes('predict') || answer.includes('forecast'))) relevanceScore += 0.1;
    if (question.includes('why') && (answer.includes('because') || answer.includes('due to'))) relevanceScore += 0.1;
    
    return Math.min(relevanceScore, 1.0);
  }

  private static assessAnalysisComplexity(context: AnalysisContext, dataInsights: DataInsights): number {
    let complexityScore = 0.5; // Base complexity
    
    // Data complexity factors
    if (dataInsights.columnCount > 20) complexityScore += 0.2;
    else if (dataInsights.columnCount > 10) complexityScore += 0.1;
    
    if (dataInsights.rowCount > 10000) complexityScore += 0.15;
    else if (dataInsights.rowCount > 1000) complexityScore += 0.1;
    
    // Multiple data sources increase complexity
    if (context.dataSource === 'mixed') complexityScore += 0.1;
    
    // Question complexity indicators
    const question = context.question.toLowerCase();
    const complexTerms = [
      'correlation', 'regression', 'predict', 'forecast', 'segment',
      'cluster', 'classify', 'optimize', 'recommend', 'strategy'
    ];
    
    const complexTermCount = complexTerms.filter(term => question.includes(term)).length;
    complexityScore += complexTermCount * 0.05;
    
    // Multiple file types suggest complex integration
    if (context.fileTypes.length > 1) complexityScore += 0.05;
    
    // Advanced analysis patterns in data
    const advancedPatterns = dataInsights.patterns.filter(pattern =>
      pattern.includes('correlation') ||
      pattern.includes('outlier') ||
      pattern.includes('skewed') ||
      pattern.includes('time-series')
    ).length;
    
    complexityScore += advancedPatterns * 0.03;
    
    return Math.min(complexityScore, 1.0);
  }

  static getConfidenceDescription(confidence: number): string {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Good';
    if (confidence >= 0.6) return 'Moderate';
    if (confidence >= 0.5) return 'Fair';
    return 'Low';
  }

  static getConfidenceRecommendations(confidence: number, factors: ConfidenceFactors): string[] {
    const recommendations: string[] = [];
    
    if (factors.dataQuality < 0.7) {
      recommendations.push('Consider cleaning the data to improve completeness and consistency');
    }
    
    if (factors.responseDepth < 0.6) {
      recommendations.push('Try rephrasing the question to be more specific for deeper analysis');
    }
    
    if (factors.contextRelevance < 0.6) {
      recommendations.push('Ensure the question directly relates to the available data columns');
    }
    
    if (factors.analysisComplexity > 0.8 && confidence < 0.8) {
      recommendations.push('Complex analysis detected - consider breaking down into simpler questions');
    }
    
    if (confidence < 0.6) {
      recommendations.push('Low confidence - verify results with additional analysis or data sources');
    }
    
    return recommendations;
  }
}