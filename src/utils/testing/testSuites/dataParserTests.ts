
import { TestSuite } from '../types';
import { CSVParserTestSuite } from './csvParserTests';
import { JSONParserTestSuite } from './jsonParserTests';

export class DataParserTestSuite {
  private csvParserSuite = new CSVParserTestSuite();
  private jsonParserSuite = new JSONParserTestSuite();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    
    // Run sub-suites and combine results
    const csvSuite = await this.csvParserSuite.run();
    const jsonSuite = await this.jsonParserSuite.run();
    
    const allTests = [...csvSuite.tests, ...jsonSuite.tests];

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Data Parser Tests',
      tests: allTests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
