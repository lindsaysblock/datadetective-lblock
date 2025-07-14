
import { ParsedDataFile } from '@/types/data';

export type DatasetType = 'ecommerce' | 'behavioral' | 'financial' | 'mixed';

export interface TestScenario {
  name: string;
  question: string;
  data: ParsedDataFile;
}

export const generateTestDataset = (type: DatasetType, rowCount: number = 1000): ParsedDataFile => {
  const baseData = {
    id: `test-${type}-${Date.now()}`,
    name: `test-${type}-data.csv`,
    filename: `test-${type}-data.csv`,
    rowCount,
    columns: [] as string[],
    rows: [] as any[]
  };

  switch (type) {
    case 'ecommerce':
      baseData.columns = ['user_id', 'product_id', 'category', 'price', 'quantity', 'timestamp'];
      for (let i = 0; i < rowCount; i++) {
        baseData.rows.push({
          user_id: `user_${Math.floor(Math.random() * 10000)}`,
          product_id: `prod_${Math.floor(Math.random() * 1000)}`,
          category: ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)],
          price: Math.floor(Math.random() * 500) + 10,
          quantity: Math.floor(Math.random() * 5) + 1,
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      break;

    case 'behavioral':
      baseData.columns = ['user_id', 'event_type', 'page', 'session_id', 'timestamp'];
      for (let i = 0; i < rowCount; i++) {
        baseData.rows.push({
          user_id: `user_${Math.floor(Math.random() * 5000)}`,
          event_type: ['click', 'view', 'scroll', 'hover'][Math.floor(Math.random() * 4)],
          page: ['home', 'product', 'checkout', 'profile'][Math.floor(Math.random() * 4)],
          session_id: `session_${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      break;

    case 'financial':
      baseData.columns = ['account_id', 'transaction_type', 'amount', 'currency', 'timestamp'];
      for (let i = 0; i < rowCount; i++) {
        baseData.rows.push({
          account_id: `acc_${Math.floor(Math.random() * 1000)}`,
          transaction_type: ['debit', 'credit', 'transfer'][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 10000) + 1,
          currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
          timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      break;

    case 'mixed':
      baseData.columns = ['id', 'name', 'value', 'category', 'date'];
      for (let i = 0; i < rowCount; i++) {
        baseData.rows.push({
          id: i + 1,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      break;
  }

  return baseData;
};

export const runAnalysisSimulationTest = async (): Promise<TestScenario[]> => {
  console.log('🔧 Generating test scenarios for analysis simulation...');
  
  const scenarios: TestScenario[] = [
    {
      name: 'E-commerce Sales Analysis',
      question: 'What are the top-selling product categories and their revenue trends?',
      data: generateTestDataset('ecommerce', 500)
    },
    {
      name: 'User Behavior Patterns',
      question: 'How do users navigate through different pages and what are the most common user journeys?',
      data: generateTestDataset('behavioral', 300)
    },
    {
      name: 'Financial Transaction Analysis',
      question: 'What are the transaction patterns and potential fraud indicators?',
      data: generateTestDataset('financial', 400)
    },
    {
      name: 'Mixed Data Insights',
      question: 'What are the key patterns and correlations in this dataset?',
      data: generateTestDataset('mixed', 250)
    }
  ];
  
  console.log(`✅ Generated ${scenarios.length} test scenarios`);
  return scenarios;
};
