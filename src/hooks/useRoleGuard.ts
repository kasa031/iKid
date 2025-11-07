/**
 * Role Guard Hook
 * Hook for protecting routes based on user role
 */

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/**
 * Hook to guard a route based on user role
 * Redirects to login if user doesn't have required role
 */
export const useRoleGuard = (requiredRole?: UserRole | UserRole[]) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigation.navigate('Login' as never);
      return;
    }

    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to overview
        navigation.navigate('Main' as never, { screen: 'Overview' } as never);
      }
    }
  }, [user, loading, requiredRole, navigation]);
};

