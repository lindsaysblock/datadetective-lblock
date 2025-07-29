/**
 * Mock QA Test Failures for Testing Expansion
 * Generates test failures with detailed error information for testing the expansion functionality
 */

import { QATestResult } from './types';

export const generateMockFailedTests = (): QATestResult[] => {
  return [
    {
      testName: 'Component Rendering Test',
      status: 'fail',
      message: 'Component failed to render properly due to undefined props',
      error: 'TypeError: Cannot read property \'data\' of undefined',
      stackTrace: `TypeError: Cannot read property 'data' of undefined
    at ComponentName.render (ComponentName.tsx:45:12)
    at ReactDOMComponent.mountComponent (ReactDOM.js:1234:23)
    at Object.mountComponent (ReactMount.js:987:45)`,
      suggestions: [
        'Check if data prop is being passed correctly',
        'Add default props or prop validation',
        'Verify parent component is providing required data'
      ],
      fixSuggestions: [
        'Add propTypes validation to catch missing props',
        'Implement default props: ComponentName.defaultProps = { data: {} }',
        'Add conditional rendering: {data && <div>{data.value}</div>}',
        'Use optional chaining: data?.value instead of data.value'
      ],
      optimizations: [
        'Consider using TypeScript for better prop type safety',
        'Implement error boundaries to catch rendering errors',
        'Add loading states while data is being fetched'
      ],
      fullDetails: 'This component rendering test failed because the component expected a data prop but received undefined. This is a common issue when parent components load data asynchronously but child components try to access the data immediately. The error occurred in the render method when trying to access properties of the undefined data object.',
      category: 'component',
      performance: 0
    },
    {
      testName: 'API Integration Test',
      status: 'fail',
      message: 'API endpoint returned 500 Internal Server Error',
      error: 'Network Error: Request failed with status code 500',
      stackTrace: `Error: Request failed with status code 500
    at createError (createError.js:16:15)
    at settle (settle.js:17:12)
    at XMLHttpRequest.handleLoad (xhr.js:62:7)`,
      suggestions: [
        'Check if the API endpoint is functioning correctly',
        'Verify the request payload format',
        'Check for authentication issues'
      ],
      fixSuggestions: [
        'Verify API server is running and accessible',
        'Check API logs for specific error details',
        'Validate request parameters and headers',
        'Implement proper error handling with retry logic'
      ],
      optimizations: [
        'Add timeout handling for API requests',
        'Implement exponential backoff for retries',
        'Cache successful responses to reduce API calls',
        'Add request/response interceptors for better error handling'
      ],
      fullDetails: 'The API integration test failed due to a server-side error (HTTP 500). This indicates an issue with the backend service rather than the frontend code. The error occurred when making a request to fetch user data. Server-side debugging is required to identify the root cause of the internal server error.',
      category: 'api',
      performance: 5000
    },
    {
      testName: 'Data Validation Test',
      status: 'fail',
      message: 'Invalid data format detected in user input',
      error: 'ValidationError: Expected number but received string',
      suggestions: [
        'Add input validation before processing',
        'Sanitize user input data',
        'Implement proper type checking'
      ],
      fixSuggestions: [
        'Add form validation using a validation library like Yup or Joi',
        'Implement client-side type conversion: parseInt(value, 10)',
        'Add server-side validation as backup',
        'Use TypeScript interfaces to define expected data structure'
      ],
      optimizations: [
        'Implement real-time validation feedback',
        'Add input masks for formatted data entry',
        'Use controlled components for better data management'
      ],
      fullDetails: 'Data validation failed because the system expected a numeric value but received a string. This commonly happens when form inputs are not properly converted from strings to numbers before processing. The validation system caught this type mismatch before it could cause runtime errors.',
      category: 'validation',
      performance: 150
    },
    {
      testName: 'Memory Usage Test',
      status: 'warning',
      message: 'Memory usage is above recommended threshold',
      optimizations: [
        'Implement component memoization with React.memo',
        'Use useCallback and useMemo for expensive operations',
        'Clean up event listeners and subscriptions',
        'Consider code splitting for large components'
      ],
      suggestions: [
        'Monitor memory usage during development',
        'Profile components for memory leaks',
        'Optimize image loading and caching'
      ],
      fullDetails: 'Memory usage test detected higher than optimal memory consumption. While not critical, this could impact performance on lower-end devices. The application is using approximately 150MB of heap memory, which is above the recommended 100MB threshold for smooth performance.',
      category: 'performance',
      performance: 850
    }
  ];
};