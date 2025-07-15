
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const useAuthGuard = ({ requireAuth = false, redirectTo }: UseAuthGuardOptions = {}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate(redirectTo || ROUTES.AUTH, { replace: true });
    } else if (!requireAuth && user && redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, requireAuth, redirectTo, navigate]);

  return { user, loading };
};
