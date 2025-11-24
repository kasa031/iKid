/**
 * Add Staff Screen
 * Screen for administrators to add new staff members
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
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
import './AddStaffScreen.css';

export const AddStaffScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
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
      newErrors.password = 'Passord må være minst 12 tegn med stor/liten bokstav, tall og spesialtegn';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passord matcher ikke';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await register(
        email.trim(),
        password,
        name.trim(),
        UserRole.STAFF,
        phone.trim() || undefined
      );
      window.alert(t('common.success') + ': Ansatt lagt til');
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke legge til ansatt'));
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
    overflowY: 'auto',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 800,
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
  };

  return (
    <div style={containerStyle} className="add-staff-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('admin.addStaff')}
        </h1>

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
          placeholder="ansatt@example.com"
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
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: Spacing.md, width: '100%' }}
        />
      </div>
    </div>
  );
};
