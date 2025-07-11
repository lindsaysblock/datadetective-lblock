
import { useState } from 'react';

export const useProjectDialogs = () => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState('');

  return {
    showProjectDialog,
    showRecoveryDialog,
    lastSaved,
    setShowProjectDialog,
    setShowRecoveryDialog,
    setLastSaved
  };
};
