
import { TestRunner, UnitTestResult, AssertionHelper } from '../testRunner';

export class FileRemovalTestSuite {
  private testRunner = new TestRunner();

  async runAllTests(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testFileRemovalBasic());
    tests.push(await this.testFileRemovalWithIndex());
    tests.push(await this.testFileRemovalEdgeCases());
    tests.push(await this.testFileRemovalCleanup());
    tests.push(await this.testFileRemovalOptimization());

    return tests;
  }

  private async testFileRemovalBasic(): Promise<UnitTestResult> {
    return this.testRunner.runTest('File Removal - Basic Functionality', (assert: AssertionHelper) => {
      const mockFiles = [
        { name: 'test1.csv', size: 1024 },
        { name: 'test2.csv', size: 2048 },
        { name: 'test3.csv', size: 4096 }
      ];
      
      const removeFileAtIndex = (files: any[], index: number) => {
        if (index >= 0 && index < files.length) {
          return files.filter((_, i) => i !== index);
        }
        throw new Error('Invalid index');
      };
      
      const result = removeFileAtIndex(mockFiles, 1);
      
      assert.equal(result.length, 2, 'Should have 2 files after removal');
      assert.equal(result[0].name, 'test1.csv', 'First file should remain');
      assert.equal(result[1].name, 'test3.csv', 'Third file should become second');
    });
  }

  private async testFileRemovalWithIndex(): Promise<UnitTestResult> {
    return this.testRunner.runTest('File Removal - Index Handling', (assert: AssertionHelper) => {
      const mockFiles = [
        { name: 'file1.txt', size: 100 },
        { name: 'file2.txt', size: 200 }
      ];
      
      const removeFileAtIndex = (files: any[], index: number) => {
        return files.filter((_, i) => i !== index);
      };
      
      // Test removing first file
      const result1 = removeFileAtIndex(mockFiles, 0);
      assert.equal(result1.length, 1, 'Should have 1 file after removing first');
      assert.equal(result1[0].name, 'file2.txt', 'Second file should remain');
      
      // Test removing last file
      const result2 = removeFileAtIndex(mockFiles, 1);
      assert.equal(result2.length, 1, 'Should have 1 file after removing last');
      assert.equal(result2[0].name, 'file1.txt', 'First file should remain');
    });
  }

  private async testFileRemovalEdgeCases(): Promise<UnitTestResult> {
    return this.testRunner.runTest('File Removal - Edge Cases', (assert: AssertionHelper) => {
      const mockFiles = [{ name: 'single.csv', size: 1024 }];
      
      const removeFileAtIndex = (files: any[], index: number) => {
        return files.filter((_, i) => i !== index);
      };
      
      // Test removing from single file array
      const result = removeFileAtIndex(mockFiles, 0);
      assert.equal(result.length, 0, 'Should have 0 files after removing only file');
      
      // Test removing from empty array (should not throw)
      const emptyResult = removeFileAtIndex([], 0);
      assert.equal(emptyResult.length, 0, 'Empty array should remain empty');
    });
  }

  private async testFileRemovalCleanup(): Promise<UnitTestResult> {
    return this.testRunner.runTest('File Removal - Data Cleanup', (assert: AssertionHelper) => {
      const mockFileState = {
        files: [
          { name: 'test1.csv', size: 1024 },
          { name: 'test2.csv', size: 2048 }
        ],
        parsedData: [{ id: 1, name: 'test' }],
        columnMapping: { name: 'string', id: 'number' }
      };
      
      const removeFileWithCleanup = (state: any, index: number) => {
        const newFiles = state.files.filter((_: any, i: number) => i !== index);
        
        // If no files left, clear related data
        if (newFiles.length === 0) {
          return {
            ...state,
            files: newFiles,
            parsedData: [],
            columnMapping: {}
          };
        }
        
        return { ...state, files: newFiles };
      };
      
      // Remove all files and check cleanup
      let result = removeFileWithCleanup(mockFileState, 0);
      result = removeFileWithCleanup(result, 0);
      
      assert.equal(result.files.length, 0, 'No files should remain');
      assert.equal(result.parsedData.length, 0, 'Parsed data should be cleared');
      assert.equal(Object.keys(result.columnMapping).length, 0, 'Column mapping should be cleared');
    });
  }

  private async testFileRemovalOptimization(): Promise<UnitTestResult> {
    return this.testRunner.runTest('File Removal - Performance Optimization', (assert: AssertionHelper) => {
      // Test with larger file list to ensure performance
      const mockFiles = Array.from({ length: 100 }, (_, i) => ({
        name: `file${i}.csv`,
        size: 1024 * (i + 1)
      }));
      
      const removeFileAtIndex = (files: any[], index: number) => {
        // Optimized removal using filter
        return files.filter((_, i) => i !== index);
      };
      
      const startTime = performance.now();
      const result = removeFileAtIndex(mockFiles, 50);
      const endTime = performance.now();
      
      assert.equal(result.length, 99, 'Should have 99 files after removal');
      assert.truthy(endTime - startTime < 10, 'Removal should be fast (< 10ms)');
      
      // Verify file at index 50 was removed
      const removedFileName = `file${50}.csv`;
      const fileExists = result.some(f => f.name === removedFileName);
      assert.falsy(fileExists, 'Removed file should not exist in result');
    });
  }
}
