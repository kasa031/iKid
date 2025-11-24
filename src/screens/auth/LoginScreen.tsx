/**
 * Login Screen
 * Screen for user authentication
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import './LoginScreen.css';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

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
      navigate('/');
    } catch (error: any) {
      alert(error.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: Spacing.lg,
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xs, // Redusert ytterligere for mer kompakt design
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxxl,
    fontWeight: 700,
    marginBottom: 2, // Redusert ytterligere
    marginTop: Spacing.xs, // Legg til liten margin-top
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 1.2, // Mer kompakt line-height
    color: colors.text,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm, // Redusert ytterligere
    marginTop: 2, // Redusert margin-top
    textAlign: 'center',
    lineHeight: 1.3, // Mer kompakt line-height
    color: colors.textSecondary,
  };

  return (
    <div style={containerStyle} className="login-screen">
      <div style={contentStyle}>
        <Logo size="large" />
        <h1 style={titleStyle}>{t('common.welcome')}</h1>
        <p style={subtitleStyle}>{t('auth.login')}</p>

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
          style={{ marginTop: Spacing.sm, width: '100%' }} // Redusert fra md til sm
        />

        <Button
          title={t('auth.register')}
          onPress={() => navigate('/register')}
          variant="outline"
          style={{ marginTop: Spacing.xs, width: '100%' }} // Redusert fra sm til xs
        />
      </div>
    </div>
  );
};
