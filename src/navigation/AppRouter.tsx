/**
 * App Router
 * Main navigation structure using React Router
 * Uses lazy loading for better performance
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LoadingScreen } from '../components/common/LoadingScreen';

import { Layout } from './Layout';

// Lazy load auth screens
const LoginScreen = lazy(() => import('../screens/auth/LoginScreen').then(m => ({ default: m.LoginScreen })));
const RegisterScreen = lazy(() => import('../screens/auth/RegisterScreen').then(m => ({ default: m.RegisterScreen })));
const ForgotPasswordScreen = lazy(() => import('../screens/auth/ForgotPasswordScreen').then(m => ({ default: m.ForgotPasswordScreen })));

// Lazy load main screens
const OverviewScreen = lazy(() => import('../screens/OverviewScreen').then(m => ({ default: m.OverviewScreen })));
const MyChildScreen = lazy(() => import('../screens/profile/MyChildScreen').then(m => ({ default: m.MyChildScreen })));
const CheckInScreen = lazy(() => import('../screens/checkin/CheckInScreen').then(m => ({ default: m.CheckInScreen })));
const CheckOutScreen = lazy(() => import('../screens/checkin/CheckOutScreen').then(m => ({ default: m.CheckOutScreen })));
const LogsScreen = lazy(() => import('../screens/logs/LogsScreen').then(m => ({ default: m.LogsScreen })));
const CalendarScreen = lazy(() => import('../screens/calendar/CalendarScreen').then(m => ({ default: m.CalendarScreen })));
const SettingsScreen = lazy(() => import('../screens/settings/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const ProfileScreen = lazy(() => import('../screens/profile/ProfileScreen').then(m => ({ default: m.ProfileScreen })));

// Lazy load admin screens
const AddChildScreen = lazy(() => import('../screens/admin/AddChildScreen').then(m => ({ default: m.AddChildScreen })));
const AddStaffScreen = lazy(() => import('../screens/admin/AddStaffScreen').then(m => ({ default: m.AddStaffScreen })));
const ChangeRoleScreen = lazy(() => import('../screens/admin/ChangeRoleScreen').then(m => ({ default: m.ChangeRoleScreen })));
const LinkParentScreen = lazy(() => import('../screens/admin/LinkParentScreen').then(m => ({ default: m.LinkParentScreen })));
const AddTestDataScreen = lazy(() => import('../screens/admin/AddTestDataScreen').then(m => ({ default: m.AddTestDataScreen })));

// Lazy load other screens
const SendEmailScreen = lazy(() => import('../screens/messaging/SendEmailScreen').then(m => ({ default: m.SendEmailScreen })));
const AddEventScreen = lazy(() => import('../screens/calendar/AddEventScreen').then(m => ({ default: m.AddEventScreen })));
const ChildProfileScreen = lazy(() => import('../screens/profile/ChildProfileScreen').then(m => ({ default: m.ChildProfileScreen })));

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Show loading screen while auth state is being determined
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Role-based Protected Route
 * Only allows access for specific roles
 */
const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Show loading screen while auth state is being determined
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * Main App Router
 */
export const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!user ? <LoginScreen /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterScreen /> : <Navigate to="/" replace />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPasswordScreen /> : <Navigate to="/" replace />}
        />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewScreen />} />

        {/* Parent routes */}
        <Route
          path="my-child"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.PARENT]}>
              <MyChildScreen />
            </RoleProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="checkin"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
              <CheckInScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
              <CheckOutScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="logs"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
              <LogsScreen />
            </RoleProtectedRoute>
          }
        />

        {/* Common routes */}
        <Route path="calendar" element={<CalendarScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="settings" element={<SettingsScreen />} />

        {/* Admin routes */}
        <Route
          path="admin/add-child"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AddChildScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/add-staff"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AddStaffScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/change-role"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <ChangeRoleScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/link-parent"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <LinkParentScreen />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admin/add-test-data"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AddTestDataScreen />
            </RoleProtectedRoute>
          }
        />

        {/* Other routes */}
        <Route path="send-email" element={<SendEmailScreen />} />
        <Route path="calendar/add-event" element={<AddEventScreen />} />
        <Route
          path="child/:childId"
          element={
            <RoleProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
              <ChildProfileScreen />
            </RoleProtectedRoute>
          }
        />
      </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
