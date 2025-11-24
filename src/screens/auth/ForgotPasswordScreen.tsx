/**
 * Forgot Password Screen
 * Screen for password reset
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { resetPassword } from '../../services/auth/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isValidEmail } from '../../utils/validation';
import './ForgotPasswordScreen.css';

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
      alert('E-post for tilbakestilling av passord er sendt');
      setEmail('');
    } catch (error: any) {
      setError(error.message || 'Kunne ikke sende e-post');
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
    gap: Spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
    margin: 0,
  };

  return (
    <div style={containerStyle} className="forgot-password-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>{t('auth.resetPassword')}</h1>
        <p style={subtitleStyle}>
          Skriv inn din e-postadresse for å motta en lenke for tilbakestilling
          av passord
        </p>

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
          style={{ marginTop: Spacing.md, width: '100%' }}
        />
      </div>
    </div>
  );
};
