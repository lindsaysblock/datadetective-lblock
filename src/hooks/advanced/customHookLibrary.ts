/**
 * Advanced Custom Hook Library
 * Comprehensive collection of optimized, reusable hooks
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

// Performance-optimized form hook
export const useOptimizedForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationTimeoutRef = useRef(null);

  // Memoized validation function
  const validateField = useCallback((field, value) => {
    const rule = validationRules[field];
    if (!rule) return null;
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${field} is required`;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${field} format is invalid`;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${field} must not exceed ${rule.maxLength} characters`;
    }
    
    return null;
  }, [validationRules]);

  // Debounced field validation
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear timeout for previous validation
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Debounced validation
    validationTimeoutRef.current = setTimeout(() => {
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }, 300);
  }, [touched, validateField]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [formData, validateField]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error) && 
           Object.keys(validationRules).every(field => 
             !validationRules[field].required || formData[field]
           );
  }, [errors, validationRules, formData]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    setIsSubmitting,
    reset
  };
};

// High-performance API hook with caching
interface ApiOptions {
  cache?: boolean;
  cacheMaxAge?: number;
  immediate?: boolean;
  [key: string]: any;
}

export const useOptimizedApi = (url: string, options: ApiOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const lastFetchRef = useRef(null);

  const cacheKey = useMemo(() => {
    return JSON.stringify({ url, ...options });
  }, [url, options]);

  const fetchData = useCallback(async (customUrl = url, customOptions = {}) => {
    const requestKey = JSON.stringify({ url: customUrl, ...customOptions });
    
    // Check cache first
    if (cacheRef.current.has(requestKey) && options.cache !== false) {
      const cachedData = cacheRef.current.get(requestKey);
      const cacheAge = Date.now() - cachedData.timestamp;
      const maxAge = options.cacheMaxAge || 300000; // 5 minutes default
      
      if (cacheAge < maxAge) {
        setData(cachedData.data);
        setError(null);
        return cachedData.data;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchRef.current = Date.now();
    
    setLoading(true);
    setError(null);

    try {
      const { cache, cacheMaxAge, immediate, ...fetchOptions } = { ...options, ...customOptions };
      const response = await fetch(customUrl, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      if (options.cache !== false) {
        cacheRef.current.set(requestKey, {
          data: result,
          timestamp: Date.now()
        });
      }
      
      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('API call error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, options]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  useEffect(() => {
    if (url && options.immediate !== false) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, url]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
    clearCache
  };
};

// Advanced local storage hook with sync
interface LocalStorageOptions {
  debounceMs?: number;
  syncAcrossTabs?: boolean;
}

export const useAdvancedLocalStorage = (key: string, defaultValue: any, options: LocalStorageOptions = {}) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const [error, setError] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const setStoredValue = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      // Debounced storage write
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          setError(null);
        } catch (storageError) {
          setError(storageError.message);
          console.error(`Error setting localStorage key "${key}":`, storageError);
        }
      }, options.debounceMs || 300);
      
    } catch (error) {
      setError(error.message);
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value, options.debounceMs]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(defaultValue);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Sync across tabs
  useEffect(() => {
    if (!options.syncAcrossTabs) return;

    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue);
          setError(null);
        } catch (error) {
          setError(error.message);
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, options.syncAcrossTabs]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return [value, setStoredValue, removeValue, error];
};

// Memory-optimized debounce hook
export const useOptimizedDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Advanced async operation hook
interface AsyncOperationOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useAsyncOperation = () => {
  const [operations, setOperations] = useState(new Map());
  const { toast } = useToast();

  const execute = useCallback(async (operationId: string, asyncFunction: () => Promise<any>, options: AsyncOperationOptions = {}) => {
    const operation = {
      id: operationId,
      loading: true,
      error: null,
      data: null,
      startTime: Date.now()
    };

    setOperations(prev => new Map(prev).set(operationId, operation));

    try {
      const result = await asyncFunction();
      
      const completedOperation = {
        ...operation,
        loading: false,
        data: result,
        duration: Date.now() - operation.startTime
      };

      setOperations(prev => new Map(prev).set(operationId, completedOperation));

      if (options.showSuccessToast) {
        toast({
          title: "Operation Completed",
          description: `${operationId} completed successfully in ${completedOperation.duration}ms`
        });
      }

      return result;
    } catch (error) {
      const failedOperation = {
        ...operation,
        loading: false,
        error: error.message,
        duration: Date.now() - operation.startTime
      };

      setOperations(prev => new Map(prev).set(operationId, failedOperation));

      if (options.showErrorToast !== false) {
        toast({
          title: "Operation Failed",
          description: error.message,
          variant: "destructive"
        });
      }

      throw error;
    }
  }, [toast]);

  const getOperation = useCallback((operationId) => {
    return operations.get(operationId);
  }, [operations]);

  const clearOperation = useCallback((operationId) => {
    setOperations(prev => {
      const newMap = new Map(prev);
      newMap.delete(operationId);
      return newMap;
    });
  }, []);

  const clearAllOperations = useCallback(() => {
    setOperations(new Map());
  }, []);

  return {
    execute,
    getOperation,
    clearOperation,
    clearAllOperations,
    operations: Array.from(operations.values())
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName, threshold = 1000) => {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef(Date.now());
  const lastRenderTimeRef = useRef(Date.now());
  const renderTimesRef = useRef([]);

  useEffect(() => {
    renderCountRef.current++;
    const now = Date.now();
    const renderTime = now - lastRenderTimeRef.current;
    
    renderTimesRef.current.push(renderTime);
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current.shift(); // Keep only last 100 render times
    }

    if (renderTime > threshold) {
      console.warn(`Performance warning: ${componentName} render took ${renderTime}ms`);
    }

    lastRenderTimeRef.current = now;
  });

  const getMetrics = useCallback(() => {
    const now = Date.now();
    const uptime = now - mountTimeRef.current;
    const averageRenderTime = renderTimesRef.current.length > 0 
      ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length 
      : 0;

    return {
      renderCount: renderCountRef.current,
      uptime,
      averageRenderTime,
      lastRenderTime: renderTimesRef.current[renderTimesRef.current.length - 1] || 0,
      isPerformant: averageRenderTime <= threshold
    };
  }, [threshold]);

  return { getMetrics };
};

// Window size hook with debouncing
export const useOptimizedWindowSize = (debounceMs = 100) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const debouncedSetSize = useOptimizedDebounce(windowSize, debounceMs);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return debouncedSetSize;
};

// Intersection observer hook
interface IntersectionOptions extends IntersectionObserverInit {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = (ref: React.RefObject<Element>, options: IntersectionOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
};