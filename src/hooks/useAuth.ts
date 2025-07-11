
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock sign in for now
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      setShowSignInModal(false);
      
      toast({
        title: "Signed In Successfully",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      return mockUser;
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(() => {
    setUser(null);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock sign up for now
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      setShowSignInModal(false);
      
      toast({
        title: "Account Created",
        description: `Welcome, ${mockUser.name}!`,
      });
      
      return mockUser;
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    user,
    signIn,
    signOut,
    signUp,
    isLoading,
    showSignInModal,
    setShowSignInModal
  };
};
