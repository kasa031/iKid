/**
 * Check-in Screen
 * Screen for checking in children
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getAllChildren, getChildrenByParentId, getChildById } from '../../services/database/childService';
import { checkInChild } from '../../services/database/checkInOutService';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName } from '../../utils/helpers';

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
      Alert.alert(t('common.error'), 'Velg et barn');
      return;
    }

    // Validation: Check if child is already checked in
    try {
      const child = await getChildById(selectedChildId);
      if (child) {
        const status = (child as any).status;
        if (status === 'checked_in') {
          Alert.alert(
            t('common.error'),
            'Barnet er allerede krysset inn'
          );
          return;
        }
      }
    } catch (error) {
      console.error('Error checking child status:', error);
    }

    setLoading(true);
    try {
      await checkInChild(selectedChildId, user.id, notes);
      Alert.alert(t('common.success'), t('child.checkIn') + ' vellykket');
      setNotes('');
      // Refresh children list
      await loadChildren();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke krysse inn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('child.checkIn')}
        </Text>

        {user?.role === UserRole.STAFF && (
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
              style={styles.button}
            />
          </>
        )}
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
    letterSpacing: -0.3, // Tighter spacing for large headings
    lineHeight: FontSizes.xxl * 1.2, // Improved line height
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

