
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmailAuthTabs } from './EmailAuthTabs';
import DataDetectiveLogo from '../DataDetectiveLogo';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSignIn: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  open,
  onOpenChange,
  email,
  password,
  loading,
  setEmail,
  setPassword,
  onSignIn,
  onSignUp
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <DataDetectiveLogo size="sm" />
          </div>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sign In Required
          </DialogTitle>
          <DialogDescription>
            Please sign in to continue with your analysis
          </DialogDescription>
        </DialogHeader>
        
        <EmailAuthTabs
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
        />
      </DialogContent>
    </Dialog>
  );
};
