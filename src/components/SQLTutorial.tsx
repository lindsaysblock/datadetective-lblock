
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play, BookOpen, CheckCircle, Target } from 'lucide-react';

interface SQLTutorialProps {
  onQueryGenerated: (query: string) => void;
}

interface TutorialStep {
  id: number;
  title: string;
  concept: string;
  explanation: string;
  example: string;
  query: string;
  tips: string[];
  challenge?: string;
}

const SQLTutorial: React.FC<SQLTutorialProps> = ({ onQueryGenerated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Introduction to SELECT",
      concept: "Basic Data Retrieval",
      explanation: "The SELECT statement is used to retrieve data from a database. It's the most common SQL operation you'll use.",
      example: "Think of SELECT like asking 'Show me...' from your data.",
      query: "SELECT * FROM customers;",
      tips: [
        "* means 'all columns' - use it when you want to see everything",
        "Always end SQL statements with a semicolon (;)",
        "SQL keywords like SELECT are case-insensitive, but conventionally written in UPPERCASE"
      ]
    },
    {
      id: 2,
      title: "Choosing Specific Columns",
      concept: "Column Selection",
      explanation: "Instead of selecting all columns (*), you can choose specific ones. This makes queries faster and results cleaner.",
      example: "Like asking 'Show me only the names and emails' instead of 'Show me everything'.",
      query: "SELECT name, email FROM customers;",
      tips: [
        "List column names separated by commas",
        "Order matters - columns appear in the order you list them",
        "Selecting fewer columns improves performance"
      ]
    },
    {
      id: 3,
      title: "Filtering with WHERE",
      concept: "Data Filtering",
      explanation: "WHERE clauses filter your results to show only rows that meet certain conditions.",
      example: "Like asking 'Show me customers, but only those from New York'.",
      query: "SELECT name, email FROM customers WHERE city = 'New York';",
      tips: [
        "Use quotes for text values: 'New York'",
        "No quotes for numbers: age = 25",
        "Common operators: =, !=, >, <, >=, <="
      ]
    },
    {
      id: 4,
      title: "Multiple Conditions",
      concept: "AND & OR Logic",
      explanation: "Use AND when all conditions must be true, OR when any condition can be true.",
      example: "AND = 'Show customers from NY AND over 25'. OR = 'Show customers from NY OR CA'.",
      query: "SELECT name, email FROM customers WHERE city = 'New York' AND age > 25;",
      tips: [
        "AND requires ALL conditions to be true",
        "OR requires ANY condition to be true",
        "Use parentheses for complex logic: (A OR B) AND C"
      ]
    },
    {
      id: 5,
      title: "Sorting Results",
      concept: "ORDER BY",
      explanation: "ORDER BY sorts your results. Use ASC for ascending (A-Z, 1-9) or DESC for descending (Z-A, 9-1).",
      example: "Like organizing a list alphabetically or by date.",
      query: "SELECT name, email FROM customers ORDER BY name ASC;",
      tips: [
        "ASC = ascending (default if not specified)",
        "DESC = descending",
        "Can sort by multiple columns: ORDER BY name, age DESC"
      ]
    },
    {
      id: 6,
      title: "Limiting Results",
      concept: "LIMIT",
      explanation: "LIMIT controls how many rows are returned. Useful for large datasets or testing queries.",
      example: "Like saying 'Show me the first 10 customers' instead of all thousands.",
      query: "SELECT name, email FROM customers ORDER BY name LIMIT 10;",
      tips: [
        "Always use ORDER BY with LIMIT for consistent results",
        "Great for testing queries on large tables",
        "Use for pagination in applications"
      ]
    },
    {
      id: 7,
      title: "Joining Tables",
      concept: "INNER JOIN",
      explanation: "JOINs combine data from multiple tables based on relationships between them.",
      example: "Like matching customers with their orders using a customer ID.",
      query: "SELECT customers.name, orders.total FROM customers JOIN orders ON customers.id = orders.customer_id;",
      tips: [
        "Use table.column notation to avoid ambiguity",
        "ON clause specifies how tables are related",
        "INNER JOIN only shows rows that match in both tables"
      ],
      challenge: "This connects customer information with their order data!"
    },
    {
      id: 8,
      title: "Grouping and Counting",
      concept: "GROUP BY & COUNT",
      explanation: "GROUP BY groups rows with the same values, often used with aggregate functions like COUNT.",
      example: "Like counting how many orders each customer has made.",
      query: "SELECT customers.name, COUNT(orders.id) as order_count FROM customers JOIN orders ON customers.id = orders.customer_id GROUP BY customers.id, customers.name;",
      tips: [
        "All non-aggregate columns must be in GROUP BY",
        "Common functions: COUNT, SUM, AVG, MAX, MIN",
        "Use aliases (as order_count) for cleaner column names"
      ]
    }
  ];

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTryQuery = () => {
    onQueryGenerated(currentTutorialStep.query);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-semibold">SQL Learning Path</h3>
              <Badge variant="outline">
                Step {currentStep + 1} of {tutorialSteps.length}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {completedSteps.length}/{tutorialSteps.length} completed
            </div>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <div className="flex gap-2 flex-wrap">
            {tutorialSteps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : completedSteps.includes(index) ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleStepSelect(index)}
                className="relative"
              >
                {completedSteps.includes(index) && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-500" />
                )}
                {step.id}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Step Content */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold">{currentTutorialStep.title}</h2>
              <Badge>{currentTutorialStep.concept}</Badge>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentTutorialStep.explanation}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Think of it this way:</h4>
            <p className="text-blue-700">{currentTutorialStep.example}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Example Query:</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              {currentTutorialStep.query}
            </div>
            <Button 
              onClick={handleTryQuery}
              className="mt-3 flex items-center gap-2"
              variant="outline"
            >
              <Play className="w-4 h-4" />
              Try This Query
            </Button>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Key Tips:</h4>
            <ul className="space-y-2">
              {currentTutorialStep.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {currentTutorialStep.challenge && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Challenge:</h4>
              <p className="text-green-700">{currentTutorialStep.challenge}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === tutorialSteps.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SQLTutorial;
