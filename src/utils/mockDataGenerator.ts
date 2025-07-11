export interface MockUser {
  user_id: string;
  email: string;
  signup_date: string;
  plan: 'free' | 'premium' | 'enterprise';
  country: string;
  age: number;
}

export interface MockEvent {
  event_id: string;
  user_id: string;
  event_name: string;
  timestamp: string;
  properties: {
    page?: string;
    button?: string;
    value?: number;
    category?: string;
  };
}

export const generateMockUsers = (count: number = 100): MockUser[] => {
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR'];
  const plans = ['free', 'premium', 'enterprise'] as const;
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  
  return Array.from({ length: count }, (_, i) => ({
    user_id: `user_${i + 1}`,
    email: `user${i + 1}@${domains[Math.floor(Math.random() * domains.length)]}`,
    signup_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    plan: plans[Math.floor(Math.random() * plans.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    age: Math.floor(Math.random() * 50) + 18
  }));
};

export const generateMockEvents = (userIds: string[], count: number = 500): MockEvent[] => {
  const eventTypes = [
    'page_view',
    'button_click',
    'form_submit',
    'purchase',
    'signup',
    'login',
    'logout',
    'search'
  ];
  
  const pages = ['/home', '/dashboard', '/settings', '/profile', '/pricing', '/help'];
  const buttons = ['cta_button', 'nav_link', 'submit_button', 'cancel_button'];
  const categories = ['navigation', 'conversion', 'engagement', 'retention'];
  
  return Array.from({ length: count }, (_, i) => ({
    event_id: `event_${i + 1}`,
    user_id: userIds[Math.floor(Math.random() * userIds.length)],
    event_name: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    properties: {
      page: Math.random() > 0.5 ? pages[Math.floor(Math.random() * pages.length)] : undefined,
      button: Math.random() > 0.7 ? buttons[Math.floor(Math.random() * buttons.length)] : undefined,
      value: Math.random() > 0.8 ? Math.floor(Math.random() * 1000) : undefined,
      category: categories[Math.floor(Math.random() * categories.length)]
    }
  }));
};

export const generateMockSalesData = (count: number = 200) => {
  const products = ['Pro Plan', 'Enterprise Plan', 'Add-on Package', 'Consulting'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  
  return Array.from({ length: count }, (_, i) => ({
    sale_id: `sale_${i + 1}`,
    customer_name: `Customer ${i + 1}`,
    product: products[Math.floor(Math.random() * products.length)],
    amount: Math.floor(Math.random() * 10000) + 100,
    sale_date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    region: regions[Math.floor(Math.random() * regions.length)],
    sales_rep: `Rep ${Math.floor(Math.random() * 10) + 1}`
  }));
};

export const generateMockCSVContent = () => {
  const salesData = generateMockSalesData(50);
  const headers = ['sale_id', 'customer_name', 'product', 'amount', 'sale_date', 'region', 'sales_rep'];
  const csvRows = [headers.join(',')];
  
  salesData.forEach(sale => {
    csvRows.push([
      sale.sale_id,
      `"${sale.customer_name}"`,
      `"${sale.product}"`,
      sale.amount,
      sale.sale_date,
      `"${sale.region}"`,
      `"${sale.sales_rep}"`
    ].join(','));
  });
  
  return csvRows.join('\n');
};

export const generateMockAnalysisResults = () => {
  return {
    summary: {
      totalInsights: 15,
      keyFindings: 8,
      dataQuality: 92,
      completionTime: new Date().toISOString()
    },
    insights: [
      {
        type: 'trend',
        title: 'User Engagement Increasing',
        description: 'User engagement has increased by 23% over the last month',
        confidence: 0.89,
        impact: 'high'
      },
      {
        type: 'pattern',
        title: 'Peak Usage Hours Identified', 
        description: 'Most active usage occurs between 2-4 PM EST',
        confidence: 0.95,
        impact: 'medium'
      },
      {
        type: 'anomaly',
        title: 'Unusual Activity Spike',
        description: 'Detected 45% increase in activity on weekends',
        confidence: 0.76,
        impact: 'medium'
      }
    ],
    recommendations: [
      {
        title: 'Optimize Peak Hours',
        description: 'Consider scaling resources during 2-4 PM EST to handle increased load',
        priority: 'high',
        estimatedImpact: 'Reduce response time by 15%'
      },
      {
        title: 'Weekend Strategy',
        description: 'Investigate weekend activity spike and adjust content strategy',
        priority: 'medium',
        estimatedImpact: 'Potential 10% increase in weekend conversions'
      }
    ],
    visualizations: [
      {
        type: 'line_chart',
        title: 'User Engagement Trend',
        data: generateMockUsers(10).map((user, i) => ({
          date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100) + 50
        }))
      }
    ]
  };
};
