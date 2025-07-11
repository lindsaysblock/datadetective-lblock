
import { ParsedData } from '../../dataParser';
import { AnalysisResult } from '../types';

export class ProductAnalyzer {
  private rows: Record<string, any>[];

  constructor(data: ParsedData) {
    this.rows = data.rows;
  }

  analyze(): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Top products by views
    const viewCounts = this.rows
      .filter(row => row.action === 'view' && row.product_name)
      .reduce((acc, row) => {
        acc[row.product_name] = (acc[row.product_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topViews = Object.entries(viewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, views]) => ({ name: product, value: views }));

    results.push({
      id: 'top-viewed-products',
      title: 'Top 5 Most Viewed Products',
      description: 'Products with highest view counts',
      value: viewCounts,
      chartType: 'bar',
      chartData: topViews,
      insight: `Most viewed: ${topViews[0]?.name} with ${topViews[0]?.value} views`,
      confidence: 'high'
    });

    // Top products by purchases
    const purchaseCounts = this.rows
      .filter(row => row.action === 'purchase' && row.product_name)
      .reduce((acc, row) => {
        acc[row.product_name] = (acc[row.product_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topPurchases = Object.entries(purchaseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, purchases]) => ({ name: product, value: purchases }));

    results.push({
      id: 'top-purchased-products',
      title: 'Top 5 Most Purchased Products',
      description: 'Products with highest purchase counts',
      value: purchaseCounts,
      chartType: 'bar',
      chartData: topPurchases,
      insight: `Most purchased: ${topPurchases[0]?.name} with ${topPurchases[0]?.value} purchases`,
      confidence: 'high'
    });

    // Top products by profit
    const profitByProduct = this.rows
      .filter(row => row.action === 'purchase' && row.product_name && row.total_order_value && row.cost && row.quantity)
      .reduce((acc, row) => {
        const profit = Number(row.total_order_value) - (Number(row.cost) * Number(row.quantity));
        acc[row.product_name] = (acc[row.product_name] || 0) + profit;
        return acc;
      }, {} as Record<string, number>);

    const topProfits = Object.entries(profitByProduct)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, profit]) => ({ name: product, value: Math.round(profit) }));

    results.push({
      id: 'top-profit-products',
      title: 'Top 5 Most Profitable Products',
      description: 'Products generating highest total profit',
      value: profitByProduct,
      chartType: 'bar',
      chartData: topProfits,
      insight: `Most profitable: ${topProfits[0]?.name} with $${topProfits[0]?.value} profit`,
      confidence: 'high'
    });

    return results;
  }
}
