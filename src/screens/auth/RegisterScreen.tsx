/**
 * Register Screen
 * Screen for user registration
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/auth/authService';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import {
  isValidEmail,
  isValidPassword,
  isRequired,
} from '../../utils/validation';
import './RegisterScreen.css';

export const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState<UserRole>(UserRole.PARENT); // Role is fixed to PARENT for now
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
    const isValid = validate();
    
    if (!isValid) {
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
      // Refresh user data and navigate to home
      await refreshUser();
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Kunne ikke registrere');
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
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.md, // Redusert fra xl til md
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 1.2, // Mer kompakt line-height
    color: colors.text,
    margin: 0,
  };

  return (
    <div style={containerStyle} className="register-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>{t('auth.register')}</h1>

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
          style={{ marginTop: Spacing.sm, width: '100%' }} // Redusert fra md til sm
        />
      </div>
    </div>
  );
};
