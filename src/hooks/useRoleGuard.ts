/**
 * Role Guard Hook
 * Hook for protecting routes based on user role
 * Note: This hook is deprecated. Use RoleProtectedRoute in AppRouter instead.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/**
 * Hook to guard a route based on user role
 * Redirects to login if user doesn't have required role
 * @deprecated Use RoleProtectedRoute component in AppRouter instead
 */
export const useRoleGuard = (requiredRole?: UserRole | UserRole[]) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to overview
        navigate('/');
      }
    }
  }, [user, loading, requiredRole, navigate]);
};
