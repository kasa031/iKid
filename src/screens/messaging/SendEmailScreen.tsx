/**
 * Send Email Screen
 * Screen for staff to send emails to parents
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllChildren } from '../../services/database/childService';
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
import './SendEmailScreen.css';

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
    const child = children.find(c => c.id === selectedChildId);
    if (!child || child.parentIds.length === 0) {
      window.alert(t('common.error') + ': Ingen foreldre funnet for dette barnet');
      return;
    }

    // Get parent email from user document
    try {
      const firstParentId = child.parentIds[0];
      const parentDoc = await getDoc(doc(db, 'users', firstParentId));
      if (!parentDoc.exists()) {
        window.alert(t('common.error') + ': Foreldre ikke funnet');
        return;
      }
      const parentData = parentDoc.data();
      const parentEmail = parentData.email;

      if (!isValidEmail(parentEmail)) {
        window.alert(t('common.error') + ': Ugyldig e-postadresse');
        return;
      }

      await sendEmail(parentEmail, subject, message);
      window.alert(t('common.success') + ': E-post åpnet');
      setSubject('');
      setMessage('');
      setSelectedChildId(null);
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke sende e-post'));
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
    <div style={containerStyle} className="send-email-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('messages.sendEmail')}
        </h1>

        <div style={{ marginBottom: Spacing.md }}>
          <label style={{ fontSize: FontSizes.md, fontWeight: 600, marginBottom: Spacing.sm, color: colors.text, display: 'block' }}>
            {t('child.children')}
          </label>
          {children.map(child => (
            <Card
              key={child.id}
              style={{
                marginBottom: Spacing.sm,
                cursor: 'pointer',
                ...(selectedChildId === child.id && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                  borderStyle: 'solid',
                }),
              }}
              onPress={() => setSelectedChildId(child.id)}
            >
              <p style={{ fontSize: FontSizes.md, color: colors.text, margin: 0 }}>
                {getChildFullName(child)}
              </p>
            </Card>
          ))}
        </div>

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
          style={{ marginTop: Spacing.md, width: '100%' }}
        />
      </div>
    </div>
  );
};
