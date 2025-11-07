/**
 * Forgot Password Screen
 * Screen for password reset
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { resetPassword } from '../../services/auth/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isValidEmail } from '../../utils/validation';

export const ForgotPasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError(t('auth.email') + ' er påkrevd');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Ugyldig e-postadresse');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword(email.trim());
      Alert.alert(
        t('common.success'),
        'E-post for tilbakestilling av passord er sendt'
      );
      setEmail('');
    } catch (error: any) {
      setError(error.message || 'Kunne ikke sende e-post');
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
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.resetPassword')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Skriv inn din e-postadresse for å motta en lenke for tilbakestilling av passord
          </Text>

          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            title={t('auth.resetPassword')}
            onPress={handleResetPassword}
            loading={loading}
            style={styles.button}
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
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.md,
  },
});

