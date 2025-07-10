
import { useState } from 'react';

export const usePrivacyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    dataType: 'upload' | 'connection';
    sourceName?: string;
  }>({ dataType: 'upload' });

  const showModal = (
    action: () => void, 
    dataType: 'upload' | 'connection', 
    sourceName?: string
  ) => {
    setPendingAction(() => action);
    setModalConfig({ dataType, sourceName });
    setIsOpen(true);
  };

  const handleAccept = () => {
    if (pendingAction) {
      pendingAction();
    }
    setIsOpen(false);
    setPendingAction(null);
  };

  const handleDecline = () => {
    setIsOpen(false);
    setPendingAction(null);
  };

  return {
    isOpen,
    modalConfig,
    showModal,
    handleAccept,
    handleDecline
  };
};
