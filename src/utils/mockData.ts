
/**
 * Mock Data Generator
 * Generates sample datasets for testing and development
 */

/** Mock data generation constants */
const MOCK_DATA_CONSTANTS = {
  DEFAULT_ROWS: 100,
  MAX_USERS: 50,
  TIMEFRAME_DAYS: 30,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  EVENTS: ['page_view', 'click', 'purchase', 'signup', 'login', 'logout'],
  PRODUCTS: ['Product A', 'Product B', 'Product C', 'Product D'],
  CHANNELS: ['organic', 'paid', 'email', 'social'],
  DEVICE_TYPES: ['mobile', 'desktop'],
  COUNTRIES: ['US', 'UK', 'CA'],
  AGE_GROUPS: ['18-34', '35-54']
} as const;
/** Mock data row interface */
export interface MockDataRow {
  [key: string]: string | number | boolean;
}

/**
 * Generates a mock dataset with configurable complexity
 * Creates realistic sample data for testing analytics features
 */
export const generateMockDataset = (
  numRows: number = MOCK_DATA_CONSTANTS.DEFAULT_ROWS, 
  complexity: number = 1
): MockDataRow[] => {
  const mockData: MockDataRow[] = [];
  
  const userIds = Array.from({ length: Math.min(numRows, MOCK_DATA_CONSTANTS.MAX_USERS) }, (_, i) => `user_${i + 1}`);
  const events = MOCK_DATA_CONSTANTS.EVENTS;
  const products = MOCK_DATA_CONSTANTS.PRODUCTS;
  const channels = MOCK_DATA_CONSTANTS.CHANNELS;
  
  for (let i = 0; i < numRows; i++) {
    const baseRow: MockDataRow = {
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      event_name: events[Math.floor(Math.random() * events.length)],
      timestamp: new Date(Date.now() - Math.random() * MOCK_DATA_CONSTANTS.TIMEFRAME_DAYS * MOCK_DATA_CONSTANTS.MILLISECONDS_PER_DAY).toISOString(),
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
