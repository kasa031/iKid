/**
 * My Child Screen
 * Screen for parents to view their child's information
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getChildrenByParentId } from '../../services/database/childService';
import { Child } from '../../types';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName, getChildAge, formatDate } from '../../utils/helpers';

export const MyChildScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, [user]);

  const loadChildren = async () => {
    if (!user) return;
    try {
      const childrenData = await getChildrenByParentId(user.id);
      setChildren(childrenData);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (children.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Ingen barn funnet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('child.myChild')}
        </Text>

        {children.map((child) => (
          <Card key={child.id} style={styles.childCard}>
            {child.photoUrl && (
              <Image source={{ uri: child.photoUrl }} style={styles.photo} />
            )}
            <Text style={[styles.childName, { color: colors.text }]}>
              {getChildFullName(child)}
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {t('child.dateOfBirth')}:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatDate(child.dateOfBirth)} ({getChildAge(child.dateOfBirth)} år)
              </Text>
            </View>
            {child.allergies && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {t('child.allergies')}:
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {child.allergies}
                </Text>
              </View>
            )}
            {child.notes && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {t('child.notes')}:
                </Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {child.notes}
                </Text>
              </View>
            )}
          </Card>
        ))}
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
  childCard: {
    marginBottom: Spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  childName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
    lineHeight: FontSizes.xl * 1.3, // Improved line height
    letterSpacing: -0.3, // Tighter spacing for large text
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginRight: Spacing.xs,
    minWidth: 120, // Consistent label width for alignment
    lineHeight: FontSizes.md * 1.5, // Improved line height
  },
  value: {
    fontSize: FontSizes.md,
    flex: 1,
    lineHeight: FontSizes.md * 1.5, // Improved line height for readability
  },
  loadingText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

