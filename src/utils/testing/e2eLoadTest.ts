import { LoadTestingSystem } from './loadTesting';
import { UnitTestingSystem } from '../unitTesting';
import { QATestSuites } from '../qa/qaTestSuites';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private unitTestingSystem = new UnitTestingSystem();
  private qaTestSuites = new QATestSuites();
}
