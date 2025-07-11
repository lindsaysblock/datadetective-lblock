
import { useState } from 'react';

export const useAnalysisModals = () => {
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [showVisualsModal, setShowVisualsModal] = useState(false);

  const actions = {
    openQuestionsModal: () => setShowQuestionsModal(true),
    closeQuestionsModal: () => setShowQuestionsModal(false),
    openRecommendationsModal: () => setShowRecommendationsModal(true),
    closeRecommendationsModal: () => setShowRecommendationsModal(false),
    openVisualsModal: () => setShowVisualsModal(true),
    closeVisualsModal: () => setShowVisualsModal(false),
  };

  const modals = {
    showQuestionsModal,
    showRecommendationsModal,
    showVisualsModal,
  };

  return { modals, actions };
};
