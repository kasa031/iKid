/**
 * Check-in Screen
 * Screen for checking in children
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  getAllChildren,
  getChildrenByParentId,
  getChildById,
} from '../../services/database/childService';
import { checkInChild } from '../../services/database/checkInOutService';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName } from '../../utils/helpers';
import './CheckInScreen.css';

export const CheckInScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChildren();
  }, [user]);

  const loadChildren = async () => {
    try {
      let childrenData: Child[] = [];
      if (user?.role === UserRole.PARENT) {
        childrenData = await getChildrenByParentId(user.id);
      } else {
        childrenData = await getAllChildren();
      }
      setChildren(childrenData);
      // Auto-select if only one child (for parents)
      if (childrenData.length === 1 && user?.role === UserRole.PARENT) {
        setSelectedChildId(childrenData[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedChildId || !user) {
      alert('Velg et barn');
      return;
    }

    // Validation: Check if child is already checked in
    try {
      const child = await getChildById(selectedChildId);
      if (child) {
        const status = (child as any).status;
        if (status === 'checked_in') {
          alert('Barnet er allerede krysset inn');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking child status:', error);
    }

    setLoading(true);
    try {
      await checkInChild(selectedChildId, user.id, notes);
      alert(t('child.checkIn') + ' vellykket');
      setNotes('');
      // Refresh children list
      await loadChildren();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke krysse inn');
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
      <h1 style={titleStyle}>{t('child.checkIn')}</h1>

      {user?.role === UserRole.STAFF && (
        <div style={{ marginBottom: Spacing.md }}>
          <p style={labelStyle}>{t('child.children')}</p>
          {children.map(child => (
            <Card
              key={child.id}
              onPress={() => setSelectedChildId(child.id)}
              style={{
                marginBottom: Spacing.sm,
                ...(selectedChildId === child.id && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                  borderStyle: 'solid',
                }),
              }}
            >
              <p
                style={{
                  fontSize: FontSizes.md,
                  color: colors.text,
                  margin: 0,
                }}
              >
                {getChildFullName(child)}
              </p>
            </Card>
          ))}
        </div>
      )}

      {selectedChildId && (
        <>
          <Input
            label={t('child.notes')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('child.notes')}
            multiline
            numberOfLines={3}
          />

          <Button
            title={t('child.checkIn')}
            onPress={handleCheckIn}
            loading={loading}
            style={{ marginTop: Spacing.md, width: '100%' }}
          />
        </>
      )}
    </div>
  );
};
