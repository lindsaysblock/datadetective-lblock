
import { useAuth } from '@/hooks/useAuth';

export const useAuthState = () => {
  const { user, isLoading: loading } = useAuth();

  const handleUserChange = (newUser: any) => {
    // This is handled by the main useAuth hook through Supabase auth state changes
    console.log('User change handled by useAuth hook:', newUser?.email);
  };

  return { user, loading, handleUserChange };
};
