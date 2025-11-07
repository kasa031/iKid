/**
 * Settings Screen
 * Screen for user settings and preferences
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { SupportedLanguage } from '../../types';
import { changePassword } from '../../services/auth/authService';
import { updateUser } from '../../services/database/userService';
import { isValidPassword, isValidPhone } from '../../utils/validation';
import { useNavigation } from '@react-navigation/native';

export const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user, signOut, refreshUser } = useAuth();
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [savingUserInfo, setSavingUserInfo] = useState(false);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await setThemeMode(theme);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), 'Alle felt må fylles ut');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert(t('common.error'), 'Passord må være minst 8 tegn');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), 'Nye passord matcher ikke');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert(t('common.success'), t('auth.changePassword') + ' vellykket');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke endre passord');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!user) return;

    if (!userName.trim()) {
      Alert.alert(t('common.error'), 'Navn er påkrevd');
      return;
    }

    if (userPhone && !isValidPhone(userPhone)) {
      Alert.alert(t('common.error'), 'Ugyldig telefonnummer');
      return;
    }

    setSavingUserInfo(true);
    try {
      await updateUser(user.id, {
        name: userName.trim(),
        phone: userPhone.trim() || undefined,
      });
      await refreshUser();
      Alert.alert(t('common.success'), t('settings.updateUserInfo') + ' vellykket');
      setEditingUserInfo(false);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke oppdatere brukerinformasjon');
    } finally {
      setSavingUserInfo(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('auth.logout'),
      'Er du sikker på at du vil logge ut?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('settings.title')}
        </Text>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.language')}
          </Text>
          <View style={styles.options}>
            <Button
              title="Norsk"
              onPress={() => handleLanguageChange('no')}
              variant={i18n.language === 'no' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
            <Button
              title="English"
              onPress={() => handleLanguageChange('en')}
              variant={i18n.language === 'en' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
            <Button
              title="Polski"
              onPress={() => handleLanguageChange('pl')}
              variant={i18n.language === 'pl' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.theme')}
          </Text>
          <View style={styles.options}>
            <Button
              title={t('settings.light')}
              onPress={() => handleThemeChange('light')}
              variant={themeMode === 'light' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
            <Button
              title={t('settings.dark')}
              onPress={() => handleThemeChange('dark')}
              variant={themeMode === 'dark' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
            <Button
              title={t('settings.system')}
              onPress={() => handleThemeChange('system')}
              variant={themeMode === 'system' ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings.userInfo')}
          </Text>
          {!editingUserInfo ? (
            <>
              <Text style={[styles.infoText, { color: colors.text }]}>
                {t('settings.name')}: {user?.name}
              </Text>
              {user?.phone && (
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {t('settings.phone')}: {user.phone}
                </Text>
              )}
              <Text style={[styles.infoText, { color: colors.text }]}>
                E-post: {user?.email}
              </Text>
              <Button
                title={t('settings.updateUserInfo')}
                onPress={() => {
                  setEditingUserInfo(true);
                  setUserName(user?.name || '');
                  setUserPhone(user?.phone || '');
                }}
                variant="outline"
                style={styles.editButton}
              />
            </>
          ) : (
            <>
              <Input
                label={t('settings.name')}
                value={userName}
                onChangeText={setUserName}
              />
              <Input
                label={t('settings.phone')}
                value={userPhone}
                onChangeText={setUserPhone}
                keyboardType="phone-pad"
              />
              <View style={styles.buttonRow}>
                <Button
                  title={t('common.save')}
                  onPress={handleUpdateUserInfo}
                  loading={savingUserInfo}
                  style={styles.button}
                />
                <Button
                  title={t('common.cancel')}
                  onPress={() => {
                    setEditingUserInfo(false);
                    setUserName(user?.name || '');
                    setUserPhone(user?.phone || '');
                  }}
                  variant="outline"
                  style={styles.button}
                />
              </View>
            </>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('auth.changePassword')}
          </Text>
          {!showPasswordChange ? (
            <Button
              title={t('auth.changePassword')}
              onPress={() => setShowPasswordChange(true)}
              variant="outline"
            />
          ) : (
            <>
              <Input
                label={t('auth.currentPassword')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <Input
                label={t('auth.newPassword')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <Input
                label={t('auth.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <View style={styles.buttonRow}>
                <Button
                  title={t('common.save')}
                  onPress={handleChangePassword}
                  loading={changingPassword}
                  style={styles.button}
                />
                <Button
                  title={t('common.cancel')}
                  onPress={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  variant="outline"
                  style={styles.button}
                />
              </View>
            </>
          )}
        </Card>

        <Button
          title={t('auth.logout')}
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
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
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: -0.2, // Tighter spacing for headings
    lineHeight: FontSizes.lg * 1.3, // Improved line height
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: 100,
    marginRight: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
  infoText: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },
  editButton: {
    marginTop: Spacing.sm,
  },
});

