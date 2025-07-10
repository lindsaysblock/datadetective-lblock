
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleUserChange = (newUser: any) => {
    setUser(newUser);
  };

  return { user, loading, handleUserChange };
};
