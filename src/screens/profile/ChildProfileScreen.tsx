/**
 * Child Profile Screen
 * Screen for staff to view and edit child profiles
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getChildById, updateChild } from '../../services/database/childService';
import { uploadImage } from '../../services/storage/imageService';
import { Child } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildFullName, getChildAge, formatDate } from '../../utils/helpers';
import { isRequired, isValidDate } from '../../utils/validation';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

interface ChildProfileScreenProps {
  route: {
    params: {
      childId: string;
    };
  };
}

export const ChildProfileScreen: React.FC<ChildProfileScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { childId } = route.params;
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
      Alert.alert(t('common.error'), 'Kunne ikke laste barn-data');
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
    if (!validate() || !child) {
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
      Alert.alert(t('common.success'), 'Barn-data oppdatert');
      setEditing(false);
      await loadChild();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke oppdatere barn-data');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || !response.assets || response.assets.length === 0) {
        return;
      }

      const asset = response.assets[0];
      if (!asset.uri) {
        return;
      }

      setUploadingImage(true);
      try {
        const imagePath = `children/${childId}/photo.jpg`;
        const photoUrl = await uploadImage(asset.uri, imagePath);
        await updateChild(childId, { photoUrl });
        Alert.alert(t('common.success'), 'Bilde opplastet');
        await loadChild();
      } catch (error: any) {
        Alert.alert(t('common.error'), error.message || 'Kunne ikke laste opp bilde');
      } finally {
        setUploadingImage(false);
      }
    });
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

  if (!child) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Barn ikke funnet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {getChildFullName(child)}
          </Text>
          {!editing && user?.role !== 'parent' && (
            <Button
              title={t('common.edit')}
              onPress={() => setEditing(true)}
              variant="outline"
              style={styles.editButton}
            />
          )}
        </View>

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

            <View style={styles.buttonRow}>
              <Button
                title={t('common.save')}
                onPress={handleSave}
                loading={saving}
                style={styles.button}
              />
              <Button
                title={t('common.cancel')}
                onPress={() => {
                  setEditing(false);
                  loadChild();
                }}
                variant="outline"
                style={styles.button}
              />
            </View>
          </>
        ) : (
          <Card>
            <View style={styles.photoContainer}>
              {child.photoUrl ? (
                <Image source={{ uri: child.photoUrl }} style={styles.photo} />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.photoPlaceholderText, { color: colors.textSecondary }]}>
                    {t('child.photo')}
                  </Text>
                </View>
              )}
              {user?.role !== 'parent' && (
                <Button
                  title={child.photoUrl ? 'Endre bilde' : 'Last opp bilde'}
                  onPress={handlePickImage}
                  variant="outline"
                  loading={uploadingImage}
                  style={styles.photoButton}
                />
              )}
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    flex: 1,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  editButton: {
    marginLeft: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  value: {
    fontSize: FontSizes.md,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  button: {
    flex: 1,
  },
  loadingText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: Spacing.sm,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  photoPlaceholderText: {
    fontSize: FontSizes.sm,
  },
  photoButton: {
    marginTop: Spacing.xs,
  },
});

