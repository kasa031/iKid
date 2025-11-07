/**
 * Login Screen
 * Screen for user authentication
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { signIn } from '../../services/auth/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isValidEmail } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { refreshUser } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t('auth.email') + ' er påkrevd';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Ugyldig e-postadresse';
    }

    if (!password.trim()) {
      newErrors.password = t('auth.password') + ' er påkrevd';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      await refreshUser();
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Logo size="large" />
          <Text style={[styles.title, { color: colors.text, fontWeight: '700' }]}>
            {t('common.welcome')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: FontSizes.md }]}>
            {t('auth.login')}
          </Text>

          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.password')}
            secureTextEntry
            error={errors.password}
          />

          <ForgotPasswordLink />

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <Button
            title={t('auth.register')}
            onPress={() => {
              (navigation as any).navigate('Register');
            }}
            variant="outline"
            style={styles.registerButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5, // Tighter spacing for large text
    lineHeight: FontSizes.xxxl * 1.2, // Improved line height
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    lineHeight: FontSizes.md * 1.5, // Improved line height for readability
  },
  button: {
    marginTop: Spacing.md,
  },
  registerButton: {
    marginTop: Spacing.sm,
  },
});

