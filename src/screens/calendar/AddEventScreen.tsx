/**
 * Add Event Screen
 * Screen for staff to add calendar events
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { createEvent } from '../../services/database/calendarService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isRequired } from '../../utils/validation';

export const AddEventScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [eventType, setEventType] = useState<
    'parent_meeting' | 'field_trip' | 'other'
  >('other');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isRequired(title)) {
      newErrors.title = t('calendar.titleRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) {
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        eventType,
        createdBy: user.id,
      });
      window.alert(t('common.success') + ': ' + t('calendar.addSuccess'));
      navigate('/calendar');
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || t('calendar.addError')));
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: Spacing.md,
    backgroundColor: colors.background,
    minHeight: '100vh',
    overflowY: 'auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
    margin: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    fontWeight: 600,
    marginBottom: Spacing.sm,
    color: colors.text,
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{t('calendar.addEvent')}</h1>

      <Input
        label={t('calendar.titleLabel')}
        value={title}
        onChangeText={setTitle}
        error={errors.title}
      />

      <Input
        label={t('calendar.description')}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <div style={{ marginBottom: Spacing.md }}>
        <Input
          label={t('calendar.dateTime')}
          type="datetime-local"
          value={date.toISOString().slice(0, 16)}
          onChangeText={value => {
            if (value) {
              setDate(new Date(value));
            }
          }}
        />
      </div>

      <div style={{ marginBottom: Spacing.md }}>
        <p style={labelStyle}>{t('calendar.eventType')}:</p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: Spacing.sm,
            flexWrap: 'wrap',
          }}
        >
          <Button
            title={t('calendar.parentMeeting')}
            onPress={() => setEventType('parent_meeting')}
            variant={eventType === 'parent_meeting' ? 'primary' : 'outline'}
            style={{ flex: 1, minWidth: 120 }}
          />
          <Button
            title={t('calendar.fieldTrip')}
            onPress={() => setEventType('field_trip')}
            variant={eventType === 'field_trip' ? 'primary' : 'outline'}
            style={{ flex: 1, minWidth: 120 }}
          />
          <Button
            title={t('calendar.other')}
            onPress={() => setEventType('other')}
            variant={eventType === 'other' ? 'primary' : 'outline'}
            style={{ flex: 1, minWidth: 120 }}
          />
        </div>
      </div>

      <Button
        title={t('common.save')}
        onPress={handleSave}
        loading={loading}
        style={{ marginTop: Spacing.md, width: '100%' }}
      />
    </div>
  );
};
