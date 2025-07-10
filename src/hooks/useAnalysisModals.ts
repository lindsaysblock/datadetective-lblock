
import { useState } from 'react';

export const useAnalysisModals = () => {
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [showVisualsModal, setShowVisualsModal] = useState(false);

  const openQuestionsModal = () => setShowQuestionsModal(true);
  const closeQuestionsModal = () => setShowQuestionsModal(false);
  
  const openRecommendationsModal = () => setShowRecommendationsModal(true);
  const closeRecommendationsModal = () => setShowRecommendationsModal(false);
  
  const openVisualsModal = () => setShowVisualsModal(true);
  const closeVisualsModal = () => setShowVisualsModal(false);

  return {
    modals: {
      showQuestionsModal,
      showRecommendationsModal,
      showVisualsModal
    },
    actions: {
      openQuestionsModal,
      closeQuestionsModal,
      openRecommendationsModal,
      closeRecommendationsModal,
      openVisualsModal,
      closeVisualsModal
    }
  };
};
