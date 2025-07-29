import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileService } from '@/services/userProfileService';
import { useToast } from '@/hooks/use-toast';
import OnboardingFlow from '@/components/OnboardingFlow';

interface SmartGuidedTourProps {
  showOnboarding: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const SmartGuidedTour: React.FC<SmartGuidedTourProps> = ({
  showOnboarding,
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (user) {
      try {
        await UserProfileService.markTourCompleted(user.id);
      } catch (error) {
        console.error('Failed to save tour completion:', error);
        // Don't block the UI if saving fails
      }
    }
    onComplete();
  };

  const handleSkip = async () => {
    if (user) {
      try {
        await UserProfileService.markTourCompleted(user.id);
      } catch (error) {
        console.error('Failed to save tour completion:', error);
        // Don't block the UI if saving fails
      }
    }
    onSkip();
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
};