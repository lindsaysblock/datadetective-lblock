/**
 * Quality-enhanced Vite configuration
 * Integrates code quality checks into the build process
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { BuildTimeValidator } from './src/utils/qa/buildTimeValidator';

// Custom plugin for code quality validation
const codeQualityPlugin = () => {
  return {
    name: 'code-quality-validator',
    buildStart: async () => {
      console.log('🔍 Running code quality validation...');
      
      const violations = await BuildTimeValidator.validateProject();
      const report = BuildTimeValidator.generateReport(violations);
      
      console.log(report);
      
      // In strict mode, fail the build if violations are found
      if (process.env.NODE_ENV === 'production' && violations.length > 0) {
        throw new Error(`Build failed: ${violations.length} code quality violations found. Run auto-refactoring to fix.`);
      }
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    codeQualityPlugin()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Filter out specific warnings that don't affect functionality
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
    }
  }
});