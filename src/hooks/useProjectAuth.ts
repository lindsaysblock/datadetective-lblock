
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useProjectAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { 
    user, 
    signIn, 
    signUp, 
    isLoading: authLoading, 
    showSignInModal, 
    setShowSignInModal 
  } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Reset form on success
      setEmail('');
      setPassword('');
    } catch (error) {
      // Error handling is already done in useAuth
      console.error('Sign in failed:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // Reset form on success
      setEmail('');
      setPassword('');
    } catch (error) {
      // Error handling is already done in useAuth
      console.error('Sign up failed:', error);
    }
  };

  return {
    user,
    showSignInModal,
    authLoading,
    email,
    password,
    setShowSignInModal,
    setEmail,
    setPassword,
    handleSignIn,
    handleSignUp
  };
};
