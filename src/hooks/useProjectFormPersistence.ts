
import { useCallback, useMemo } from 'react';

const STORAGE_KEY = 'dataDetective_projectForm';
const STORAGE_VERSION = '2.0';

interface StoredFormData {
  version: string;
  timestamp: number;
  researchQuestion: string;
  additionalContext: string;
  parsedData: any[];
  currentStep: number;
  files: Array<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
}

export const useProjectFormPersistence = () => {
  const saveFormData = useCallback((data: any) => {
    try {
      const storageData: StoredFormData = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        researchQuestion: data.researchQuestion || '',
        additionalContext: data.additionalContext || '',
        parsedData: data.parsedData || [],
        currentStep: data.currentStep || 1,
        files: (data.files || []).map((file: File) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }))
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      console.log('📝 Form data saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save form data:', error);
    }
  }, []);

  const getFormData = useCallback((): Partial<StoredFormData> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return {};
      }
      
      const data = JSON.parse(stored) as StoredFormData;
      
      // Check version compatibility
      if (data.version !== STORAGE_VERSION) {
        console.warn('⚠️ Stored data version mismatch, clearing');
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }
      
      // Check if data is too old (7 days)
      const age = Date.now() - data.timestamp;
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (age > maxAge) {
        console.warn('⚠️ Stored data too old, clearing');
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }
      
      console.log('📖 Form data loaded from localStorage');
      return data;
    } catch (error) {
      console.error('❌ Failed to load form data:', error);
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  }, []);

  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Form data cleared from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear form data:', error);
    }
  }, []);

  const hasStoredData = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      
      const data = JSON.parse(stored) as StoredFormData;
      
      // Check version and age
      if (data.version !== STORAGE_VERSION) return false;
      
      const age = Date.now() - data.timestamp;
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      
      if (age > maxAge) return false;
      
      // Check if there's meaningful data
      return !!(data.researchQuestion || data.additionalContext || data.parsedData?.length > 0);
    } catch (error) {
      console.error('❌ Failed to check stored data:', error);
      return false;
    }
  }, []);

  const getStorageStats = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored) as StoredFormData;
      const size = new Blob([stored]).size;
      const age = Date.now() - data.timestamp;
      
      return {
        size,
        age,
        ageHours: Math.floor(age / (1000 * 60 * 60)),
        version: data.version,
        hasResearchQuestion: !!data.researchQuestion,
        hasData: data.parsedData?.length > 0,
        currentStep: data.currentStep
      };
    } catch {
      return null;
    }
  }, []);

  return {
    saveFormData,
    getFormData,
    clearFormData,
    hasStoredData,
    getStorageStats
  };
};
