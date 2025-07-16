/**
 * ESLint Configuration for Standards Enforcement
 * Enhanced configuration to enforce all coding standards
 */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "unused-imports", "react-hooks"],
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  rules: {
    // File Structure & Complexity
    "max-lines": ["error", { max: 220, skipBlankLines: true, skipComments: true }],
    "complexity": ["error", 5],
    "max-depth": ["error", 3],
    "max-nested-callbacks": ["error", 3],
    
    // Code Quality
    "@typescript-eslint/no-unused-vars": ["error"],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ],
    
    // Magic Numbers & Constants
    "no-magic-numbers": [
      "warn", 
      { 
        "ignore": [0, 1, -1], 
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true,
        "detectObjects": false
      }
    ],
    
    // React Specific
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off", // Using TypeScript
    "react/react-in-jsx-scope": "off", // React 17+
    
    // TypeScript Specific
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",
    
    // Code Style
    "prefer-const": "error",
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
    
    // Early Returns & Structure
    "consistent-return": "error",
    "no-else-return": "error",
    "no-unnecessary-condition": "off", // Can be too strict
    
    // Performance
    "no-await-in-loop": "warn",
    "prefer-promise-reject-errors": "error"
  },
  settings: {
    react: { version: "detect" }
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  }
};