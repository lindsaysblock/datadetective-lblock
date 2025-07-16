
/**
 * Product Analyzer Utility
 * Refactored to meet coding standards with proper constants and error handling
 */

import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

interface ProductMetrics {
  name: string;
  value: number;
}

interface ProductProfitData {
  productName: string;
  totalProfit: number;
  purchaseCount: number;
  averageProfit: number;
}

export class ProductAnalyzer {
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
      // Top viewed products
      const topViewedProducts = this.analyzeTopViewedProducts();
      if (topViewedProducts) {
        results.push(topViewedProducts);
      }

      // Top purchased products
      const topPurchasedProducts = this.analyzeTopPurchasedProducts();
      if (topPurchasedProducts) {
        results.push(topPurchasedProducts);
      }

      // Most profitable products
      const mostProfitableProducts = this.analyzeMostProfitableProducts();
      if (mostProfitableProducts) {
        results.push(mostProfitableProducts);
      }

    } catch (error) {
      if (this.enableLogging) {
        console.error('ProductAnalyzer error:', error);
      }
      results.push(this.createErrorResult(error));
    }

    return results;
  }

  private analyzeTopViewedProducts(): AnalysisResult | null {
    const viewCounts = this.calculateProductViews();
    
    if (Object.keys(viewCounts).length === 0) {
      return null;
    }

    const topViews = this.formatTopProducts(viewCounts, 5);
    const topProduct = topViews[0];

    return {
      id: 'top-viewed-products',
      title: 'Top 5 Most Viewed Products',
      description: 'Products with highest view counts',
      value: viewCounts,
      chartType: 'bar',
      chartData: topViews,
      insight: topProduct 
        ? `Most viewed: ${topProduct.name} with ${topProduct.value} views`
        : 'Product view analysis completed',
      confidence: 'high'
    };
  }

  private analyzeTopPurchasedProducts(): AnalysisResult | null {
    const purchaseCounts = this.calculateProductPurchases();
    
    if (Object.keys(purchaseCounts).length === 0) {
      return null;
    }

    const topPurchases = this.formatTopProducts(purchaseCounts, 5);
    const topProduct = topPurchases[0];

    return {
      id: 'top-purchased-products',
      title: 'Top 5 Most Purchased Products',
      description: 'Products with highest purchase counts',
      value: purchaseCounts,
      chartType: 'bar',
      chartData: topPurchases,
      insight: topProduct 
        ? `Most purchased: ${topProduct.name} with ${topProduct.value} purchases`
        : 'Product purchase analysis completed',
      confidence: 'high'
    };
  }

  private analyzeMostProfitableProducts(): AnalysisResult | null {
    const profitData = this.calculateProductProfits();
    
    if (profitData.length === 0) {
      return null;
    }

    const topProfits = profitData
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 5)
      .map(product => ({
        name: product.productName,
        value: Math.round(product.totalProfit)
      }));

    const topProduct = topProfits[0];

    return {
      id: 'top-profit-products',
      title: 'Top 5 Most Profitable Products',
      description: 'Products generating highest total profit',
      value: profitData,
      chartType: 'bar',
      chartData: topProfits,
      insight: topProduct 
        ? `Most profitable: ${topProduct.name} with $${topProduct.value} profit`
        : 'Product profitability analysis completed',
      confidence: 'high'
    };
  }

  private calculateProductViews(): Record<string, number> {
    const viewCounts: Record<string, number> = {};
    
    this.rows
      .filter(row => this.isViewEvent(row) && this.hasProductName(row))
      .forEach(row => {
        const productName = this.extractProductName(row);
        if (productName) {
          viewCounts[productName] = (viewCounts[productName] || 0) + 1;
        }
      });

    return viewCounts;
  }

  private calculateProductPurchases(): Record<string, number> {
    const purchaseCounts: Record<string, number> = {};
    
    this.rows
      .filter(row => this.isPurchaseEvent(row) && this.hasProductName(row))
      .forEach(row => {
        const productName = this.extractProductName(row);
        if (productName) {
          purchaseCounts[productName] = (purchaseCounts[productName] || 0) + 1;
        }
      });

    return purchaseCounts;
  }

  private calculateProductProfits(): ProductProfitData[] {
    const profitData: Record<string, ProductProfitData> = {};
    
    this.rows
      .filter(row => 
        this.isPurchaseEvent(row) && 
        this.hasProductName(row) && 
        this.hasFinancialData(row)
      )
      .forEach(row => {
        const productName = this.extractProductName(row);
        const profit = this.calculateRowProfit(row);
        
        if (productName && profit !== null) {
          if (!profitData[productName]) {
            profitData[productName] = {
              productName,
              totalProfit: 0,
              purchaseCount: 0,
              averageProfit: 0
            };
          }
          
          profitData[productName].totalProfit += profit;
          profitData[productName].purchaseCount += 1;
          profitData[productName].averageProfit = 
            profitData[productName].totalProfit / profitData[productName].purchaseCount;
        }
      });

    return Object.values(profitData);
  }

  private formatTopProducts(productCounts: Record<string, number>, limit: number): ProductMetrics[] {
    return Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([product, count]) => ({ name: product, value: count }));
  }

  private calculateRowProfit(row: Record<string, unknown>): number | null {
    const orderValue = this.extractNumericValue(row, ['total_order_value', 'revenue', 'price', 'amount']);
    const cost = this.extractNumericValue(row, ['cost', 'cost_price', 'wholesale_price']);
    const quantity = this.extractNumericValue(row, ['quantity', 'qty', 'count']) || 1;
    
    if (orderValue !== null && cost !== null) {
      return orderValue - (cost * quantity);
    }
    
    return null;
  }

  private isViewEvent(row: Record<string, unknown>): boolean {
    const action = this.extractActionValue(row);
    return action?.toLowerCase() === 'view';
  }

  private isPurchaseEvent(row: Record<string, unknown>): boolean {
    const action = this.extractActionValue(row);
    return action?.toLowerCase() === 'purchase';
  }

  private hasProductName(row: Record<string, unknown>): boolean {
    return this.extractProductName(row) !== null;
  }

  private hasFinancialData(row: Record<string, unknown>): boolean {
    const orderValue = this.extractNumericValue(row, ['total_order_value', 'revenue', 'price']);
    const cost = this.extractNumericValue(row, ['cost', 'cost_price']);
    return orderValue !== null && cost !== null;
  }

  private extractProductName(row: Record<string, unknown>): string | null {
    const productFields = ['product_name', 'product', 'item_name', 'item', 'name'];
    
    for (const field of productFields) {
      const value = row[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        return value.trim();
      }
    }
    
    return null;
  }

  private extractActionValue(row: Record<string, unknown>): string | null {
    const actionFields = ['action', 'event', 'event_name', 'activity'];
    
    for (const field of actionFields) {
      const value = row[field];
      if (value && typeof value === 'string') {
        return value;
      }
    }
    
    return null;
  }

  private extractNumericValue(row: Record<string, unknown>, fields: string[]): number | null {
    for (const field of fields) {
      const value = row[field];
      if (value !== null && value !== undefined) {
        const numValue = Number(value);
        if (!isNaN(numValue) && isFinite(numValue)) {
          return numValue;
        }
      }
    }
    
    return null;
  }

  private createEmptyDataResults(): AnalysisResult[] {
    return [{
      id: 'product-no-data',
      title: 'No Product Data',
      description: 'No product data available for analysis',
      value: 0,
      insight: 'No product information available for analysis',
      confidence: 'low'
    }];
  }

  private createErrorResult(error: unknown): AnalysisResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      id: 'product-analysis-error',
      title: 'Product Analysis Error',
      description: 'Error occurred during product analysis',
      value: 0,
      insight: `Product analysis failed: ${errorMessage}`,
      confidence: 'low'
    };
  }
}
