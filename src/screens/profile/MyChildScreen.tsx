/**
 * My Child Screen
 * Screen for parents to view their child's information
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getChildrenByParentId, createChild, deleteChild } from '../../services/database/childService';
import { Child } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName, getChildAge, formatDate } from '../../utils/helpers';
import { isRequired, isValidDate } from '../../utils/validation';
import './MyChildScreen.css';

export const MyChildScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleAddChild = async () => {
    if (!user || !validate()) {
      return;
    }

    setSaving(true);
    try {
      const birthDate = new Date(dateOfBirth);
      await createChild({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: birthDate,
        parentIds: [user.id], // Legg til foreldre automatisk
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
      setShowAddForm(false);
      // Reload children
      await loadChildren();
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke legge til barn'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    const confirmMessage = t('child.deleteChildConfirm', { name: childName });
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteChild(childId);
      window.alert(t('common.success') + ': Barn slettet');
      await loadChildren();
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke slette barn'));
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.background, padding: Spacing.md, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: FontSizes.md, color: colors.text }}>
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (children.length === 0 && !showAddForm) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.background, padding: Spacing.md }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={titleStyle}>
            {t('child.myChild')}
          </h1>
          <Card style={{ textAlign: 'center', padding: Spacing.xl }}>
            <p style={{ fontSize: FontSizes.md, color: colors.textSecondary, marginBottom: Spacing.md }}>
              {t('overview.noChildrenFound') || 'Ingen barn funnet'}
            </p>
            <Button
              title={t('child.addChild') || 'Legg til barn'}
              onPress={() => setShowAddForm(true)}
              style={{ marginTop: Spacing.sm }}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="my-child-screen">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg }}>
          <h1 style={titleStyle}>
            {t('child.myChild')}
          </h1>
          {!showAddForm && (
            <Button
              title={t('child.addChild')}
              onPress={() => setShowAddForm(true)}
              variant="outline"
            />
          )}
        </div>

        {showAddForm && (
          <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.primary}` }}>
            <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
              {t('child.addNewChild')}
            </h2>
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
              type="date"
              error={errors.dateOfBirth}
            />
            <Input
              label={t('child.allergies')}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="F.eks. Nøtter, melk"
            />
            <Input
              label={t('child.notes')}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholder="F.eks. Liker å tegne og leke utendørs"
            />
            <div style={{ display: 'flex', gap: Spacing.sm, marginTop: Spacing.sm }}>
              <Button
                title={t('common.save')}
                onPress={handleAddChild}
                loading={saving}
                style={{ flex: 1 }}
              />
              <Button
                title={t('common.cancel')}
                onPress={() => {
                  setShowAddForm(false);
                  setFirstName('');
                  setLastName('');
                  setDateOfBirth('');
                  setAllergies('');
                  setNotes('');
                  setErrors({});
                }}
                variant="outline"
                style={{ flex: 1 }}
              />
            </div>
          </Card>
        )}

        {children.map(child => (
          <Card key={child.id} style={{ marginBottom: Spacing.md }}>
            {child.photoUrl && (
              <img
                src={child.photoUrl}
                alt={getChildFullName(child)}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: Spacing.md,
                  display: 'block',
                  margin: '0 auto ' + Spacing.md + ' auto',
                  objectFit: 'cover',
                }}
              />
            )}
            <h2 style={{ fontSize: FontSizes.xl, fontWeight: 700, marginBottom: Spacing.md, textAlign: 'center', lineHeight: FontSizes.xl * 1.3, letterSpacing: -0.3, color: colors.text, margin: '0 0 ' + Spacing.md + ' 0' }}>
              {getChildFullName(child)}
            </h2>
            <div style={{ display: 'flex', marginBottom: Spacing.md, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <span style={{ fontSize: FontSizes.md, fontWeight: 600, marginRight: Spacing.xs, minWidth: 120, lineHeight: FontSizes.md * 1.5, color: colors.textSecondary }}>
                {t('child.dateOfBirth')}:
              </span>
              <span style={{ fontSize: FontSizes.md, flex: 1, lineHeight: FontSizes.md * 1.5, color: colors.text }}>
                {formatDate(child.dateOfBirth)} ({getChildAge(child.dateOfBirth)} {t('child.yearsOld')})
              </span>
            </div>
            {child.allergies && (
              <div style={{ display: 'flex', marginBottom: Spacing.md, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <span style={{ fontSize: FontSizes.md, fontWeight: 600, marginRight: Spacing.xs, minWidth: 120, lineHeight: FontSizes.md * 1.5, color: colors.textSecondary }}>
                  {t('child.allergies')}:
                </span>
                <span style={{ fontSize: FontSizes.md, flex: 1, lineHeight: FontSizes.md * 1.5, color: colors.text }}>
                  {child.allergies}
                </span>
              </div>
            )}
            {child.notes && (
              <div style={{ display: 'flex', marginBottom: Spacing.md, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <span style={{ fontSize: FontSizes.md, fontWeight: 600, marginRight: Spacing.xs, minWidth: 120, lineHeight: FontSizes.md * 1.5, color: colors.textSecondary }}>
                  {t('child.notes')}:
                </span>
                <span style={{ fontSize: FontSizes.md, flex: 1, lineHeight: FontSizes.md * 1.5, color: colors.text }}>
                  {child.notes}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: Spacing.md }}>
              <Button
                title={t('child.deleteChild')}
                onPress={() => handleDeleteChild(child.id, getChildFullName(child))}
                variant="outline"
                style={{
                  borderColor: colors.error,
                  backgroundColor: `${colors.error}10`,
                }}
                textStyle={{ color: colors.error }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
