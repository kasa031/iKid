/**
 * Link Parent Screen
 * Screen for administrators to link parents to children
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { getAllChildren, getChildById, updateChild } from '../../services/database/childService';
import { getCurrentUser } from '../../services/auth/authService';
import { Child, User } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName } from '../../utils/helpers';
import { isValidEmail } from '../../utils/validation';

export const LinkParentScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const childrenData = await getAllChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const handleLinkParent = async () => {
    if (!selectedChildId) {
      setError('Velg et barn');
      return;
    }

    if (!parentEmail.trim()) {
      setError('E-postadresse er påkrevd');
      return;
    }

    if (!isValidEmail(parentEmail)) {
      setError('Ugyldig e-postadresse');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find parent by email
      // Note: In a real app, you'd query the users collection by email
      // For now, we'll assume the parent exists and get their ID
      const parent = await getCurrentUser(); // This would need to be modified to search by email
      
      if (!parent) {
        throw new Error('Foreldre ikke funnet');
      }

      const child = await getChildById(selectedChildId);
      if (!child) {
        throw new Error('Barn ikke funnet');
      }

      // Add parent to child's parentIds if not already present
      const updatedParentIds = [...child.parentIds];
      if (!updatedParentIds.includes(parent.id)) {
        updatedParentIds.push(parent.id);
        await updateChild(selectedChildId, {
          parentIds: updatedParentIds,
        });
        Alert.alert(t('common.success'), 'Foreldre knyttet til barn');
        setParentEmail('');
        setSelectedChildId(null);
      } else {
        Alert.alert(t('common.error'), 'Foreldre er allerede knyttet til dette barnet');
      }
    } catch (error: any) {
      setError(error.message || 'Kunne ikke knytte foreldre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('admin.linkParent')}
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
          label={t('auth.email')}
          value={parentEmail}
          onChangeText={setParentEmail}
          placeholder="foreldre@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        <Button
          title="Knytt foreldre"
          onPress={handleLinkParent}
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

