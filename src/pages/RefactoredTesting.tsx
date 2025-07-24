import RefactoredE2ERunner from '@/components/testing/RefactoredE2ERunner';

export default function RefactoredTesting() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Refactored E2E Testing Suite
          </h1>
          <p className="text-xl text-muted-foreground">
            Optimized testing with refactoring analysis
          </p>
        </div>
        <RefactoredE2ERunner />
      </div>
    </div>
  );
}