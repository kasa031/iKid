/**
 * Send Email Screen
 * Screen for staff to send emails to parents
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllChildren, getChildrenByParentId } from '../../services/database/childService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { sendEmail } from '../../utils/messaging';
import { isValidEmail } from '../../utils/validation';
import { getChildFullName } from '../../utils/helpers';

export const SendEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadChildren();
  }, [user]);

  const loadChildren = async () => {
    try {
      const childrenData = await getAllChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const handleSendEmail = async () => {
    const newErrors: Record<string, string> = {};

    if (!selectedChildId) {
      newErrors.child = 'Velg et barn';
    }

    if (!subject.trim()) {
      newErrors.subject = t('messages.subject') + ' er påkrevd';
    }

    if (!message.trim()) {
      newErrors.message = t('messages.message') + ' er påkrevd';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Get parent email from child
    const child = children.find((c) => c.id === selectedChildId);
    if (!child || child.parentIds.length === 0) {
      Alert.alert(t('common.error'), 'Ingen foreldre funnet for dette barnet');
      return;
    }

    // Get parent email from user document
    try {
      const firstParentId = child.parentIds[0];
      const parentDoc = await getDoc(doc(db, 'users', firstParentId));
      if (!parentDoc.exists()) {
        Alert.alert(t('common.error'), 'Foreldre ikke funnet');
        return;
      }
      const parentData = parentDoc.data();
      const parentEmail = parentData.email;

      if (!isValidEmail(parentEmail)) {
        Alert.alert(t('common.error'), 'Ugyldig e-postadresse');
        return;
      }

      await sendEmail(parentEmail, subject, message);
      Alert.alert(t('common.success'), 'E-post åpnet');
      setSubject('');
      setMessage('');
      setSelectedChildId(null);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke sende e-post');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('messages.sendEmail')}
        </Text>

        <View style={styles.childSelection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('child.children')}
          </Text>
          {children.map((child) => (
            <Card
              key={child.id}
              style={[
                styles.childCard,
                selectedChildId === child.id && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => setSelectedChildId(child.id)}
            >
              <Text style={[styles.childName, { color: colors.text }]}>
                {getChildFullName(child)}
              </Text>
            </Card>
          ))}
        </View>

        <Input
          label={t('messages.subject')}
          value={subject}
          onChangeText={setSubject}
          error={errors.subject}
        />

        <Input
          label={t('messages.message')}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          error={errors.message}
        />

        <Button
          title={t('messages.send')}
          onPress={handleSendEmail}
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
  childSelection: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  childCard: {
    marginBottom: Spacing.sm,
  },
  childName: {
    fontSize: FontSizes.md,
  },
  button: {
    marginTop: Spacing.md,
  },
});

