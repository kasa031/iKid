/**
 * Add Child Screen
 * Screen for administrators to add new child profiles
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { createChild } from '../../services/database/childService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isRequired, isValidDate } from '../../utils/validation';
import './AddChildScreen.css';

export const AddChildScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isRequired(firstName)) {
      newErrors.firstName = t('child.firstName') + ' er påkrevd';
    }

    if (!isRequired(lastName)) {
      newErrors.lastName = t('child.lastName') + ' er påkrevd';
    }

    if (!isRequired(dateOfBirth)) {
      newErrors.dateOfBirth = t('child.dateOfBirth') + ' er påkrevd';
    } else if (!isValidDate(dateOfBirth)) {
      newErrors.dateOfBirth = 'Ugyldig dato';
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
      const birthDate = new Date(dateOfBirth);
      await createChild({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: birthDate,
        parentIds: [], // Will be linked later
        allergies: allergies.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      window.alert(t('common.success') + ': Barn lagt til');
      // Reset form
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setAllergies('');
      setNotes('');
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke legge til barn'));
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
    <div style={containerStyle} className="add-child-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('admin.addChild')}
        </h1>

        <Input
          label={t('child.firstName')}
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
        />

        <Input
          label={t('child.lastName')}
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
        />

        <Input
          label={t('child.dateOfBirth')}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          error={errors.dateOfBirth}
        />

        <Input
          label={t('child.allergies')}
          value={allergies}
          onChangeText={setAllergies}
          multiline
          numberOfLines={2}
        />

        <Input
          label={t('child.notes')}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
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
