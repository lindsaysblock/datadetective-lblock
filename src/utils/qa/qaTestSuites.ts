
import { ComponentTestSuite } from './testSuites/componentTestSuite';
import { SystemTestSuite } from './testSuites/systemTestSuite';
import { DataHandlingTestSuite } from './testSuites/dataHandlingTestSuite';
import { PerformanceTestSuite } from './testSuites/performanceTestSuite';
import { SecurityTestSuite } from './testSuites/securityTestSuite';
import { AccessibilityTestSuite } from './testSuites/accessibilityTestSuite';
import { UtilityTestSuite } from './testSuites/utilityTestSuite';
import { AnalysisComponentTestSuite } from './testSuites/analysisComponentTestSuite';
import { FormPersistenceTestSuite } from './testSuites/formPersistenceTestSuite';
import { SystemHealthTestSuite } from './testSuites/systemHealthTestSuite';

export const qaTestSuites = {
  component: ComponentTestSuite,
  system: SystemTestSuite,
  dataHandling: DataHandlingTestSuite,
  performance: PerformanceTestSuite,
  security: SecurityTestSuite,
  accessibility: AccessibilityTestSuite,
  utility: UtilityTestSuite,
  analysisComponent: AnalysisComponentTestSuite,
  formPersistence: FormPersistenceTestSuite,
  systemHealth: SystemHealthTestSuite,
};
