
import { useState } from 'react';

export const useProjectDialogs = () => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryDialogDismissed, setRecoveryDialogDismissed] = useState(false);
  const [lastSaved, setLastSaved] = useState('');

  return {
    showProjectDialog,
    showRecoveryDialog,
    recoveryDialogDismissed,
    lastSaved,
    setShowProjectDialog,
    setShowRecoveryDialog,
    setRecoveryDialogDismissed,
    setLastSaved
  };
};
