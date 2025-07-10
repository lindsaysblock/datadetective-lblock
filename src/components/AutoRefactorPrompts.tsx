
import React, { useEffect, useState } from 'react';

interface RefactoringMessage {
  message: string;
  label: string;
}

const AutoRefactorPrompts: React.FC = () => {
  const [refactoringMessages, setRefactoringMessages] = useState<RefactoringMessage[]>([]);

  useEffect(() => {
    const handleRefactoringPrompts = (event: CustomEvent<{ messages: RefactoringMessage[] }>) => {
      const { messages } = event.detail;
      setRefactoringMessages(messages);
      
      // Auto-clear after 30 seconds to avoid UI clutter
      setTimeout(() => {
        setRefactoringMessages([]);
      }, 30000);
    };

    window.addEventListener('qa-refactoring-prompts', handleRefactoringPrompts as EventListener);

    return () => {
      window.removeEventListener('qa-refactoring-prompts', handleRefactoringPrompts as EventListener);
    };
  }, []);

  if (refactoringMessages.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {refactoringMessages.map((refactoringMessage, index) => (
        <div 
          key={index}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-1">
                🔧 Auto-Refactoring Suggestion
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                QA analysis detected a file that could benefit from refactoring
              </p>
              <button 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Simulate clicking a refactoring action by dispatching a custom message event
                  const messageEvent = new CustomEvent('lovable-message', {
                    detail: { message: refactoringMessage.message }
                  });
                  window.dispatchEvent(messageEvent);
                  
                  // Remove this specific message
                  setRefactoringMessages(prev => prev.filter((_, i) => i !== index));
                }}
              >
                {refactoringMessage.label}
              </button>
            </div>
            <button 
              onClick={() => setRefactoringMessages(prev => prev.filter((_, i) => i !== index))}
              className="text-blue-400 hover:text-blue-600 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoRefactorPrompts;
