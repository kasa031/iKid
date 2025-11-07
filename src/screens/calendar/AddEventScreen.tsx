/**
 * Add Event Screen
 * Screen for staff to add calendar events
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createEvent } from '../../services/database/calendarService';
import { CalendarEvent } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isRequired } from '../../utils/validation';

export const AddEventScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [eventType, setEventType] = useState<'parent_meeting' | 'field_trip' | 'other'>('other');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isRequired(title)) {
      newErrors.title = 'Tittel er påkrevd';
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
      Alert.alert(t('common.success'), 'Hendelse lagt til');
      // Navigation will be handled by parent
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke legge til hendelse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('calendar.addEvent')}
        </Text>

        <Input
          label="Tittel"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label={t('calendar.description') || 'Beskrivelse'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Dato og tid:
          </Text>
          <Button
            title={date.toLocaleString('no-NO')}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.typeContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Type hendelse:
          </Text>
          <View style={styles.typeButtons}>
            <Button
              title={t('calendar.parentMeeting')}
              onPress={() => setEventType('parent_meeting')}
              variant={eventType === 'parent_meeting' ? 'primary' : 'outline'}
              style={styles.typeButton}
            />
            <Button
              title={t('calendar.fieldTrip')}
              onPress={() => setEventType('field_trip')}
              variant={eventType === 'field_trip' ? 'primary' : 'outline'}
              style={styles.typeButton}
            />
            <Button
              title={t('calendar.other')}
              onPress={() => setEventType('other')}
              variant={eventType === 'other' ? 'primary' : 'outline'}
              style={styles.typeButton}
            />
          </View>
        </View>

        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  dateContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  typeContainer: {
    marginBottom: Spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  typeButton: {
    flex: 1,
  },
  button: {
    marginTop: Spacing.md,
  },
});

