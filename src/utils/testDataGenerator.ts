
import { ParsedDataFile } from '@/types/data';

export interface TestDataRow {
  [key: string]: string | number | Date;
}

export const generateTestDataset = (
  type: 'ecommerce' | 'behavioral' | 'financial' | 'mixed' = 'ecommerce',
  rowCount: number = 1000
): ParsedDataFile => {
  console.log(`🧪 Generating ${type} test dataset with ${rowCount} rows for analysis testing`);
  
  switch (type) {
    case 'ecommerce':
      return generateEcommerceData(rowCount);
    case 'behavioral':
      return generateBehavioralData(rowCount);
    case 'financial':
      return generateFinancialData(rowCount);
    case 'mixed':
      return generateMixedData(rowCount);
    default:
      return generateEcommerceData(rowCount);
  }
};

const generateEcommerceData = (rowCount: number): ParsedDataFile => {
  const products = ['Laptop Pro', 'Smartphone X', 'Tablet Air', 'Smart Watch', 'Headphones', 'Camera DSLR', 'Gaming Console', 'Smart TV'];
  const categories = ['Electronics', 'Computing', 'Mobile', 'Audio', 'Gaming', 'Home'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const channels = ['Online', 'Retail Store', 'Mobile App', 'Partner'];
  
  const rows: TestDataRow[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let i = 0; i < rowCount; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    
    const orderDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = Math.floor(Math.random() * 2000) + 50;
    const totalRevenue = quantity * unitPrice;
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0;
    const finalAmount = totalRevenue * (1 - discount / 100);
    
    rows.push({
      order_id: `ORD-${String(i + 1).padStart(6, '0')}`,
      customer_id: `CUST-${Math.floor(Math.random() * 5000) + 1}`,
      product_name: product,
      category: category,
      quantity: quantity,
      unit_price: unitPrice,
      total_revenue: totalRevenue,
      discount_percent: discount,
      final_amount: Math.round(finalAmount),
      order_date: orderDate.toISOString().split('T')[0],
      region: region,
      sales_channel: channel,
      customer_segment: Math.random() > 0.6 ? 'Premium' : Math.random() > 0.3 ? 'Standard' : 'Basic'
    });
  }
  
  return {
    id: 'test-ecommerce-data',
    name: 'Test E-commerce Dataset',
    rows,
    columns: [
      'order_id', 'customer_id', 'product_name', 'category', 'quantity', 
      'unit_price', 'total_revenue', 'discount_percent', 'final_amount', 
      'order_date', 'region', 'sales_channel', 'customer_segment'
    ],
    rowCount: rows.length,
    preview: rows.slice(0, 5)
  };
};

const generateBehavioralData = (rowCount: number): ParsedDataFile => {
  const events = ['page_view', 'button_click', 'form_submit', 'video_play', 'download', 'search', 'login', 'logout'];
  const pages = ['/home', '/products', '/about', '/contact', '/checkout', '/profile', '/dashboard', '/help'];
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  
  const rows: TestDataRow[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const sessionDuration = Math.floor(Math.random() * 3600); // 0-60 minutes in seconds
    
    rows.push({
      event_id: `EVT-${String(i + 1).padStart(8, '0')}`,
      user_id: `USER-${Math.floor(Math.random() * 10000) + 1}`,
      session_id: `SESS-${Math.floor(Math.random() * 50000) + 1}`,
      event_type: events[Math.floor(Math.random() * events.length)],
      page_url: pages[Math.floor(Math.random() * pages.length)],
      timestamp: timestamp.toISOString(),
      device_type: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      session_duration: sessionDuration,
      engagement_score: Math.floor(Math.random() * 100) + 1,
      conversion: Math.random() > 0.85 ? 1 : 0,
      revenue_impact: Math.random() > 0.9 ? Math.floor(Math.random() * 500) + 10 : 0
    });
  }
  
  return {
    id: 'test-behavioral-data',
    name: 'Test Behavioral Analytics Dataset',
    rows,
    columns: [
      'event_id', 'user_id', 'session_id', 'event_type', 'page_url',
      'timestamp', 'device_type', 'browser', 'session_duration', 
      'engagement_score', 'conversion', 'revenue_impact'
    ],
    rowCount: rows.length,
    preview: rows.slice(0, 5)
  };
};

const generateFinancialData = (rowCount: number): ParsedDataFile => {
  const transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'];
  const categories = ['groceries', 'utilities', 'entertainment', 'transport', 'healthcare', 'education'];
  const merchants = ['Amazon', 'Walmart', 'Starbucks', 'Shell', 'Target', 'Apple', 'Netflix', 'Uber'];
  
  const rows: TestDataRow[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let i = 0; i < rowCount; i++) {
    const transactionDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const amount = Math.floor(Math.random() * 2000) + 1;
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    rows.push({
      transaction_id: `TXN-${String(i + 1).padStart(10, '0')}`,
      account_id: `ACC-${Math.floor(Math.random() * 1000) + 1}`,
      transaction_date: transactionDate.toISOString().split('T')[0],
      transaction_type: type,
      amount: type === 'withdrawal' || type === 'payment' ? -amount : amount,
      category: categories[Math.floor(Math.random() * categories.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      balance_after: Math.floor(Math.random() * 50000) + 1000,
      is_recurring: Math.random() > 0.8 ? 1 : 0,
      risk_score: Math.floor(Math.random() * 100) + 1
    });
  }
  
  return {
    id: 'test-financial-data',
    name: 'Test Financial Transactions Dataset',
    rows,
    columns: [
      'transaction_id', 'account_id', 'transaction_date', 'transaction_type',
      'amount', 'category', 'merchant', 'balance_after', 'is_recurring', 'risk_score'
    ],
    rowCount: rows.length,
    preview: rows.slice(0, 5)
  };
};

const generateMixedData = (rowCount: number): ParsedDataFile => {
  const rows: TestDataRow[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  for (let i = 0; i < rowCount; i++) {
    const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    rows.push({
      id: i + 1,
      name: `Record ${i + 1}`,
      value_a: Math.floor(Math.random() * 1000) + 1,
      value_b: Math.random() * 100,
      category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 100) + 1,
      percentage: Math.random(),
      created_date: timestamp.toISOString().split('T')[0],
      is_premium: Math.random() > 0.7 ? 1 : 0
    });
  }
  
  return {
    id: 'test-mixed-data',
    name: 'Test Mixed Dataset',
    rows,
    columns: ['id', 'name', 'value_a', 'value_b', 'category', 'status', 'score', 'percentage', 'created_date', 'is_premium'],
    rowCount: rows.length,
    preview: rows.slice(0, 5)
  };
};

export const runAnalysisSimulationTest = async () => {
  console.log('🧪 Running Analysis Simulation Test...');
  
  const testScenarios = [
    {
      name: 'E-commerce Revenue Analysis',
      data: generateTestDataset('ecommerce', 500),
      question: 'What are the revenue trends and top-performing products?'
    },
    {
      name: 'User Behavior Analysis',
      data: generateTestDataset('behavioral', 1000),
      question: 'How do users engage with our platform and what drives conversions?'
    },
    {
      name: 'Financial Transaction Analysis',
      data: generateTestDataset('financial', 750),
      question: 'What are the spending patterns and risk indicators?'
    }
  ];
  
  return testScenarios;
};
