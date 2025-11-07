/**
 * Register Screen
 * Screen for user registration
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { register } from '../../services/auth/authService';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isValidEmail, isValidPassword, isRequired } from '../../utils/validation';

export const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PARENT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isRequired(name)) {
      newErrors.name = 'Navn er påkrevd';
    }

    if (!isRequired(email)) {
      newErrors.email = t('auth.email') + ' er påkrevd';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Ugyldig e-postadresse';
    }

    if (!isRequired(password)) {
      newErrors.password = t('auth.password') + ' er påkrevd';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Passord må være minst 8 tegn';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passord matcher ikke';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register(
        email.trim(),
        password,
        name.trim(),
        role,
        phone.trim() || undefined
      );
      Alert.alert(t('common.success'), 'Registrering vellykket');
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke registrere');
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
            {t('auth.register')}
          </Text>

          <Input
            label="Navn"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

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
            secureTextEntry
            error={errors.password}
          />

          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Input
            label={t('settings.phone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title={t('auth.register')}
            onPress={handleRegister}
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
    marginBottom: Spacing.xl,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  button: {
    marginTop: Spacing.md,
  },
});

