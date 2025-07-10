
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OAuthButtonsProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const OAuthButtons = ({ loading, setLoading }: OAuthButtonsProps) => {
  return (
    <div className="space-y-3">
      <div className="text-center text-sm text-gray-500 py-4">
        OAuth sign-in temporarily disabled. Please use email authentication below.
      </div>
    </div>
  );
};
