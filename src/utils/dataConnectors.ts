import { ParsedData, DataColumn } from './dataParser';

export type DataSourceType = 'sample_web_analytics' | 'sample_customer_behavior' | 'csv_upload';

export interface DataSourceConfig {
  apiKey?: string;
  username?: string;
  password?: string;
  databaseUrl?: string;
  bucketName?: string;
}

export interface DataSourceMetadata {
  name: string;
  description: string;
  columns: Array<{ name: string; type: 'string' | 'number' | 'date'; samples: any[] }>;
  estimatedRows: number;
  refreshRate: string;
  lastUpdated: string;
}

const SAMPLE_EVENTS = ['page_view', 'click', 'add_to_cart', 'purchase', 'search', 'form_submit'];

export const generateSampleWebAnalyticsData = (): ParsedData => {
  const rows = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 1000; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + Math.floor(i / 10));
    
    rows.push({
      id: i + 1,
      user_id: `user_${Math.floor(Math.random() * 200) + 1}`,
      event_name: SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)],
      timestamp: date.toISOString(),
      value: Math.floor(Math.random() * 100) + 1
    });
  }

  return {
    columns: [
      { name: 'id', type: 'number', samples: [1, 2, 3, 4, 5] },
      { name: 'user_id', type: 'string', samples: ['user_1', 'user_2', 'user_3'] },
      { name: 'event_name', type: 'string', samples: SAMPLE_EVENTS.slice(0, 3) },
      { name: 'timestamp', type: 'date', samples: ['2024-01-01T00:00:00.000Z'] },
      { name: 'value', type: 'number', samples: [50, 75, 30, 90, 15] }
    ],
    rows,
    rowCount: rows.length,
    fileSize: JSON.stringify(rows).length,
    summary: {
      totalRows: rows.length,
      totalColumns: 5,
      possibleUserIdColumns: ['user_id'],
      possibleEventColumns: ['event_name'],
      possibleTimestampColumns: ['timestamp']
    }
  };
};

export const generateCustomerBehaviorData = (): ParsedData => {
  const rows = [];
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'];
  const platforms = ['web', 'mobile', 'tablet'];
  const eventTypes = ['purchase', 'view', 'click', 'signup', 'logout'];
  
  for (let i = 0; i < 800; i++) {
    const date = new Date('2024-01-01');
    date.setHours(date.getHours() + Math.floor(i / 20));
    
    rows.push({
      user_id: `customer_${Math.floor(Math.random() * 150) + 1}`,
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      event_time: date.toISOString(),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      country: countries[Math.floor(Math.random() * countries.length)]
    });
  }

  return {
    columns: [
      { name: 'user_id', type: 'string', samples: ['customer_1', 'customer_2'] },
      { name: 'event_type', type: 'string', samples: eventTypes.slice(0, 3) },
      { name: 'event_time', type: 'date', samples: ['2024-01-01T00:00:00.000Z'] },
      { name: 'platform', type: 'string', samples: platforms },
      { name: 'country', type: 'string', samples: countries.slice(0, 3) }
    ],
    rows,
    rowCount: rows.length,
    fileSize: JSON.stringify(rows).length,
    summary: {
      totalRows: rows.length,
      totalColumns: 5,
      possibleUserIdColumns: ['user_id'],
      possibleEventColumns: ['event_type'],
      possibleTimestampColumns: ['event_time']
    }
  };
};

export const connectToDataSource = async (source: DataSourceType, config: DataSourceConfig): Promise<ParsedData> => {
  console.log('Connecting to data source:', source, config);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (source) {
    case 'sample_web_analytics':
      return generateSampleWebAnalyticsData();
    case 'sample_customer_behavior':
      return generateCustomerBehaviorData();
    case 'csv_upload':
      throw new Error('CSV upload should be handled through file upload');
    default:
      throw new Error(`Unsupported data source: ${source}`);
  }
};

export const validateDataConnection = async (source: DataSourceType, config: DataSourceConfig): Promise<boolean> => {
  try {
    await connectToDataSource(source, config);
    return true;
  } catch (error) {
    console.error('Data connection validation failed:', error);
    return false;
  }
};

export const getDataSourceMetadata = (source: DataSourceType): DataSourceMetadata => {
  const baseMetadata = {
    name: '',
    description: '',
    columns: [] as Array<{ name: string; type: 'string' | 'number' | 'date'; samples: any[] }>,
    estimatedRows: 0,
    refreshRate: '1 hour',
    lastUpdated: new Date().toISOString()
  };

  switch (source) {
    case 'sample_web_analytics':
      return {
        ...baseMetadata,
        name: 'Sample Web Analytics',
        description: 'Sample web analytics data with user interactions',
        columns: [
          { name: 'user_id', type: 'string', samples: ['user_1', 'user_2'] },
          { name: 'event_name', type: 'string', samples: ['page_view', 'click'] },
          { name: 'timestamp', type: 'date', samples: ['2024-01-01T00:00:00Z'] },
          { name: 'value', type: 'number', samples: [1, 5, 10] },
          { name: 'session_id', type: 'string', samples: ['session_1', 'session_2'] }
        ],
        estimatedRows: 1000
      };
    case 'sample_customer_behavior':
      return {
        ...baseMetadata,
        name: 'Sample Customer Behavior',
        description: 'Customer behavior and interaction patterns',
        columns: [
          { name: 'customer_id', type: 'string', samples: ['cust_1', 'cust_2'] },
          { name: 'action', type: 'string', samples: ['purchase', 'browse'] },
          { name: 'timestamp', type: 'date', samples: ['2024-01-01T00:00:00Z'] }
        ],
        estimatedRows: 800
      };
    default:
      return baseMetadata;
  }
};
