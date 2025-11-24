/**
 * Child Profile Screen
 * Screen for staff to view and edit child profiles
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  getChildById,
  updateChild,
} from '../../services/database/childService';
import { uploadImage } from '../../services/storage/imageService';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName, getChildAge, formatDate } from '../../utils/helpers';
import { isRequired, isValidDate } from '../../utils/validation';

export const ChildProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { childId } = useParams<{ childId: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadChild();
  }, [childId]);

  const loadChild = async () => {
    if (!childId) return;
    try {
      const childData = await getChildById(childId);
      if (childData) {
        setChild(childData);
        setFirstName(childData.firstName);
        setLastName(childData.lastName);
        setDateOfBirth(childData.dateOfBirth.toISOString().split('T')[0]);
        setAllergies(childData.allergies || '');
        setNotes(childData.notes || '');
      }
    } catch (error) {
      console.error('Error loading child:', error);
      alert('Kunne ikke laste barn-data');
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

  const handleSave = async () => {
    if (!validate() || !child || !childId) {
      return;
    }

    setSaving(true);
    try {
      await updateChild(childId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: new Date(dateOfBirth),
        allergies: allergies.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      alert('Barn-data oppdatert');
      setEditing(false);
      await loadChild();
    } catch (error: any) {
      alert(error.message || 'Kunne ikke oppdatere barn-data');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0 || !childId) {
        return;
      }

      const file = target.files[0];
      setUploadingImage(true);
      try {
        const imagePath = `children/${childId}/photo.jpg`;
        const photoUrl = await uploadImage(file, imagePath);
        await updateChild(childId, { photoUrl });
        alert('Bilde opplastet');
        await loadChild();
      } catch (error: any) {
        alert(error.message || 'Kunne ikke laste opp bilde');
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  };

  const containerStyle: React.CSSProperties = {
    padding: Spacing.md,
    backgroundColor: colors.background,
    minHeight: '100vh',
    overflowY: 'auto',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <p
          style={{
            fontSize: FontSizes.md,
            textAlign: 'center',
            marginTop: Spacing.xl,
            color: colors.text,
          }}
        >
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (!child) {
    return (
      <div style={containerStyle}>
        <p
          style={{
            fontSize: FontSizes.md,
            textAlign: 'center',
            marginTop: Spacing.xl,
            color: colors.error,
          }}
        >
          Barn ikke funnet
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ padding: Spacing.md }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.lg,
          }}
        >
          <h1
            style={{
              fontSize: FontSizes.xxl,
              fontWeight: 700,
              flex: 1,
              letterSpacing: -0.3,
              lineHeight: FontSizes.xxl * 1.2,
              color: colors.text,
              margin: 0,
            }}
          >
            {getChildFullName(child)}
          </h1>
          {!editing && user?.role !== 'parent' && (
            <Button
              title={t('common.edit')}
              onPress={() => setEditing(true)}
              variant="outline"
              style={{ marginLeft: Spacing.md }}
            />
          )}
        </div>

        {editing ? (
          <>
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
              placeholder="YYYY-MM-DD"
              error={errors.dateOfBirth}
            />

            <Input
              label={t('child.allergies')}
              value={allergies}
              onChangeText={setAllergies}
              multiline
              numberOfLines={2}
            />

            <Input
              label={t('child.notes')}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: Spacing.sm,
                marginTop: Spacing.md,
              }}
            >
              <Button
                title={t('common.save')}
                onPress={handleSave}
                loading={saving}
                style={{ flex: 1 }}
              />
              <Button
                title={t('common.cancel')}
                onPress={() => {
                  setEditing(false);
                  loadChild();
                }}
                variant="outline"
                style={{ flex: 1 }}
              />
            </div>
          </>
        ) : (
          <Card>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: Spacing.md,
              }}
            >
              {child.photoUrl ? (
                <img
                  src={child.photoUrl}
                  alt={getChildFullName(child)}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    marginBottom: Spacing.sm,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.surface,
                    marginBottom: Spacing.sm,
                  }}
                >
                  <p
                    style={{
                      fontSize: FontSizes.sm,
                      color: colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    {t('child.photo')}
                  </p>
                </div>
              )}
              {user?.role !== 'parent' && (
                <Button
                  title={child.photoUrl ? 'Endre bilde' : 'Last opp bilde'}
                  onPress={handlePickImage}
                  variant="outline"
                  loading={uploadingImage}
                  style={{ marginTop: Spacing.xs }}
                />
              )}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: Spacing.sm,
                flexWrap: 'wrap',
              }}
            >
              <p
                style={{
                  fontSize: FontSizes.md,
                  fontWeight: 600,
                  marginRight: Spacing.xs,
                  color: colors.textSecondary,
                  margin: 0,
                }}
              >
                {t('child.dateOfBirth')}:
              </p>
              <p
                style={{
                  fontSize: FontSizes.md,
                  flex: 1,
                  color: colors.text,
                  margin: 0,
                }}
              >
                {formatDate(child.dateOfBirth)} (
                {getChildAge(child.dateOfBirth)} år)
              </p>
            </div>
            {child.allergies && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: Spacing.sm,
                  flexWrap: 'wrap',
                }}
              >
                <p
                  style={{
                    fontSize: FontSizes.md,
                    fontWeight: 600,
                    marginRight: Spacing.xs,
                    color: colors.textSecondary,
                    margin: 0,
                  }}
                >
                  {t('child.allergies')}:
                </p>
                <p
                  style={{
                    fontSize: FontSizes.md,
                    flex: 1,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {child.allergies}
                </p>
              </div>
            )}
            {child.notes && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: Spacing.sm,
                  flexWrap: 'wrap',
                }}
              >
                <p
                  style={{
                    fontSize: FontSizes.md,
                    fontWeight: 600,
                    marginRight: Spacing.xs,
                    color: colors.textSecondary,
                    margin: 0,
                  }}
                >
                  {t('child.notes')}:
                </p>
                <p
                  style={{
                    fontSize: FontSizes.md,
                    flex: 1,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {child.notes}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
