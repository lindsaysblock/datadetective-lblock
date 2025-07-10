
export interface MockDataRow {
  [key: string]: string | number | boolean;
}

export const generateMockDataset = (numRows: number = 100, complexity: number = 1): MockDataRow[] => {
  const mockData: MockDataRow[] = [];
  
  const userIds = Array.from({ length: Math.min(numRows, 50) }, (_, i) => `user_${i + 1}`);
  const events = ['page_view', 'click', 'purchase', 'signup', 'login', 'logout'];
  const products = ['Product A', 'Product B', 'Product C', 'Product D'];
  const channels = ['organic', 'paid', 'email', 'social'];
  
  for (let i = 0; i < numRows; i++) {
    const baseRow: MockDataRow = {
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      event_name: events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      revenue: Math.round(Math.random() * 1000 * 100) / 100,
      session_id: `session_${Math.floor(Math.random() * 1000)}`,
    };
    
    if (complexity >= 2) {
      baseRow.product_name = products[Math.floor(Math.random() * products.length)];
      baseRow.channel = channels[Math.floor(Math.random() * channels.length)];
      baseRow.device_type = Math.random() > 0.5 ? 'mobile' : 'desktop';
    }
    
    if (complexity >= 3) {
      baseRow.country = Math.random() > 0.7 ? 'US' : Math.random() > 0.5 ? 'UK' : 'CA';
      baseRow.age_group = Math.random() > 0.5 ? '18-34' : '35-54';
      baseRow.is_premium = Math.random() > 0.8;
    }
    
    mockData.push(baseRow);
  }
  
  return mockData;
};
