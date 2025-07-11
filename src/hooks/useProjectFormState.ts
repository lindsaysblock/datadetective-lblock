
import { useState } from 'react';

export const useProjectFormState = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetForm = () => {
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFile(null);
    setParsedData(null);
    setCurrentProjectName('');
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    file,
    parsedData,
    currentProjectName,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFile,
    setParsedData,
    setCurrentProjectName,
    nextStep,
    prevStep,
    resetForm
  };
};
