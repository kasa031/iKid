/**
 * Link Parent Screen
 * Screen for administrators to link parents to children
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import {
  getAllChildren,
  getChildById,
  updateChild,
} from '../../services/database/childService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName } from '../../utils/helpers';
import { isValidEmail } from '../../utils/validation';
import './LinkParentScreen.css';

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
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', parentEmail.trim().toLowerCase())
      );
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        throw new Error('Foreldre ikke funnet');
      }

      const parentDoc = usersSnapshot.docs[0];
      const parentId = parentDoc.id;

      const child = await getChildById(selectedChildId);
      if (!child) {
        throw new Error('Barn ikke funnet');
      }

      // Add parent to child's parentIds if not already present
      const updatedParentIds = [...child.parentIds];
      if (!updatedParentIds.includes(parentId)) {
        updatedParentIds.push(parentId);
        await updateChild(selectedChildId, {
          parentIds: updatedParentIds,
        });
        window.alert(t('common.success') + ': Foreldre knyttet til barn');
        setParentEmail('');
        setSelectedChildId(null);
      } else {
        window.alert(t('common.error') + ': Foreldre er allerede knyttet til dette barnet');
      }
    } catch (error: any) {
      setError(error.message || 'Kunne ikke knytte foreldre');
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
    <div style={containerStyle} className="link-parent-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('admin.linkParent')}
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
          style={{ marginTop: Spacing.md, width: '100%' }}
        />
      </div>
    </div>
  );
};
