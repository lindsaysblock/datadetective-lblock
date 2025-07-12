
import { DataColumn, ParsedData } from '../dataParser';

export const createTestDataColumn = (name: string, type: 'string' | 'number' | 'date' | 'boolean', samples: any[] = []): DataColumn => {
  return {
    name,
    type,
    samples: samples.length > 0 ? samples : getDefaultSamples(type)
  };
};

const getDefaultSamples = (type: 'string' | 'number' | 'date' | 'boolean'): any[] => {
  switch (type) {
    case 'string':
      return ['sample1', 'sample2', 'sample3'];
    case 'number':
      return [1, 2, 3];
    case 'date':
      return ['2024-01-01', '2024-01-02', '2024-01-03'];
    case 'boolean':
      return [true, false, true];
    default:
      return [];
  }
};

export const createTestParsedData = (overrides: Partial<ParsedData> = {}): ParsedData => {
  return {
    columns: [
      createTestDataColumn('id', 'number', [1, 2, 3]),
      createTestDataColumn('name', 'string', ['Alice', 'Bob', 'Charlie']),
      createTestDataColumn('active', 'boolean', [true, false, true])
    ],
    rows: [
      { id: 1, name: 'Alice', active: true },
      { id: 2, name: 'Bob', active: false },
      { id: 3, name: 'Charlie', active: true }
    ],
    rowCount: 3,
    fileSize: 1024,
    summary: {
      totalRows: 3,
      totalColumns: 3,
      possibleUserIdColumns: ['id'],
      possibleEventColumns: [],
      possibleTimestampColumns: []
    },
    ...overrides
  };
};

export const createLargeTestDataset = (rows: number = 10000): ParsedData => {
  const data = [];
  const columns = [
    createTestDataColumn('id', 'number'),
    createTestDataColumn('name', 'string'),
    createTestDataColumn('value', 'number'),
    createTestDataColumn('timestamp', 'date'),
    createTestDataColumn('active', 'boolean')
  ];

  for (let i = 0; i < rows; i++) {
    data.push({
      id: i,
      name: `User_${i}`,
      value: Math.random() * 1000,
      timestamp: new Date(2024, 0, 1 + (i % 365)).toISOString(),
      active: i % 2 === 0
    });
  }

  return {
    columns,
    rows: data,
    rowCount: rows,
    fileSize: rows * 100, // Approximate file size
    summary: {
      totalRows: rows,
      totalColumns: 5,
      possibleUserIdColumns: ['id'],
      possibleEventColumns: [],
      possibleTimestampColumns: ['timestamp']
    }
  };
};

export const createMalformedTestData = (): any => {
  return {
    columns: null,
    rows: undefined,
    rowCount: 'invalid',
    fileSize: -1,
    summary: {}
  };
};

export const createEmptyTestData = (): ParsedData => {
  return {
    columns: [],
    rows: [],
    rowCount: 0,
    fileSize: 0,
    summary: {
      totalRows: 0,
      totalColumns: 0,
      possibleUserIdColumns: [],
      possibleEventColumns: [],
      possibleTimestampColumns: []
    }
  };
};

export const createUnicodeTestData = (): ParsedData => {
  return {
    columns: [
      createTestDataColumn('名前', 'string', ['田中太郎', '佐藤花子', 'Smith']),
      createTestDataColumn('価格', 'number', [1000, 2500, 750]),
      createTestDataColumn('説明', 'string', ['これはテスト', 'Another test', '测试数据'])
    ],
    rows: [
      { '名前': '田中太郎', '価格': 1000, '説明': 'これはテスト' },
      { '名前': '佐藤花子', '価格': 2500, '説明': 'Another test' },
      { '名前': 'Smith', '価格': 750, '説明': '测试数据' }
    ],
    rowCount: 3,
    fileSize: 512,
    summary: {
      totalRows: 3,
      totalColumns: 3,
      possibleUserIdColumns: [],
      possibleEventColumns: [],
      possibleTimestampColumns: []
    }
  };
};
