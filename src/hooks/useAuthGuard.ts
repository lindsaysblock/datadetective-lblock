
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface AuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const useAuthGuard = (options: AuthGuardOptions = {}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    redirectTo = '/auth',
    requireAuth = true,
    allowedRoles = []
  } = options;

  useEffect(() => {
    if (isLoading) return;

    // Check if auth is required and user is not authenticated
    if (requireAuth && !user) {
      console.log('🔒 Auth required, redirecting to:', redirectTo);
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check if user has required roles (if specified)
    if (user && allowedRoles.length > 0) {
      // This would need to be implemented based on your role system
      console.log('👤 User roles check needed for:', allowedRoles);
    }

    // If user is authenticated and on auth page, redirect to main app
    if (user && location.pathname === '/auth') {
      console.log('✅ User authenticated, redirecting to main app');
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate, location, redirectTo, requireAuth, allowedRoles]);

  return {
    isAuthenticated: !!user,
    isLoading,
    user
  };
};
