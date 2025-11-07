/**
 * App Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OverviewScreen } from '../screens/OverviewScreen';
import { CheckInScreen } from '../screens/checkin/CheckInScreen';
import { CheckOutScreen } from '../screens/checkin/CheckOutScreen';
import { MyChildScreen } from '../screens/profile/MyChildScreen';
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { LogsScreen } from '../screens/logs/LogsScreen';
import { SendEmailScreen } from '../screens/messaging/SendEmailScreen';
import { AddChildScreen } from '../screens/admin/AddChildScreen';
import { AddEventScreen } from '../screens/calendar/AddEventScreen';
import { ChildProfileScreen } from '../screens/profile/ChildProfileScreen';
import { LinkParentScreen } from '../screens/admin/LinkParentScreen';
import { AddStaffScreen } from '../screens/admin/AddStaffScreen';
import { ChangeRoleScreen } from '../screens/admin/ChangeRoleScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Main tab navigator for authenticated users
 */
const MainTabs: React.FC = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: 'Oversikt' }}
      />
      {user?.role === UserRole.PARENT ? (
        <Tab.Screen
          name="MyChild"
          component={MyChildScreen}
          options={{ title: 'Mitt barn' }}
        />
      ) : (
        <>
          <Tab.Screen
            name="CheckIn"
            component={CheckInScreen}
            options={{ title: 'Kryss inn' }}
          />
          <Tab.Screen
            name="CheckOut"
            component={CheckOutScreen}
            options={{ title: 'Kryss ut' }}
          />
          <Tab.Screen
            name="Logs"
            component={LogsScreen}
            options={{ title: 'Logger' }}
          />
        </>
      )}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Kalender' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Innstillinger' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root navigator
 * Handles authentication flow
 */
export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading screen
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="SendEmail"
            component={SendEmailScreen}
            options={{ headerShown: true, title: 'Send e-post' }}
          />
          <Stack.Screen
            name="AddChild"
            component={AddChildScreen}
            options={{ headerShown: true, title: 'Legg til barn' }}
          />
          <Stack.Screen
            name="AddEvent"
            component={AddEventScreen}
            options={{ headerShown: true, title: 'Legg til hendelse' }}
          />
          <Stack.Screen
            name="ChildProfile"
            component={ChildProfileScreen}
            options={{ headerShown: true, title: 'Barn-profil' }}
          />
          <Stack.Screen
            name="LinkParent"
            component={LinkParentScreen}
            options={{ headerShown: true, title: 'Knytt foreldre' }}
          />
          <Stack.Screen
            name="AddStaff"
            component={AddStaffScreen}
            options={{ headerShown: true, title: 'Legg til ansatt' }}
          />
          <Stack.Screen
            name="ChangeRole"
            component={ChangeRoleScreen}
            options={{ headerShown: true, title: 'Endre rolle' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: true, title: 'Glemt passord' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: true, title: 'Registrer' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
