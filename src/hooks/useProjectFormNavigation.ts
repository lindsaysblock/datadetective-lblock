/**
 * Project Form Navigation Hook
 * Manages form step navigation
 */

import { useCallback } from 'react';

export const useProjectFormNavigation = (formData: any, updateFormData: (updates: any) => void) => {
  const nextStep = useCallback(() => {
    updateFormData({ step: formData.step + 1 });
  }, [formData.step, updateFormData]);

  const prevStep = useCallback(() => {
    updateFormData({ step: Math.max(1, formData.step - 1) });
  }, [formData.step, updateFormData]);

  const goToStep = useCallback((step: number) => {
    updateFormData({ step });
  }, [updateFormData]);

  return {
    nextStep,
    prevStep,
    goToStep
  };
};