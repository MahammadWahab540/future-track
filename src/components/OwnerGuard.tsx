import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import LoadingScreen from '@/pages/LoadingScreen';

interface OwnerGuardProps {
  children: ReactNode;
}

export const OwnerGuard = ({ children }: OwnerGuardProps) => {
  const { userRole, loading } = useUserRole();

  if (loading) {
    return <LoadingScreen />;
  }

  if (userRole !== 'owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};