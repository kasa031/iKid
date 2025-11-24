/**
 * Settings Screen
 * Screen for user settings and preferences
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { SupportedLanguage } from '../../types';
import { changePassword } from '../../services/auth/authService';
import { updateUser, deleteUser } from '../../services/database/userService';
import { auth } from '../../services/firebase/config';
import { isValidPassword, isValidPhone } from '../../utils/validation';
import './SettingsScreen.css';

export const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user, signOut, refreshUser } = useAuth();
  // const navigate = useNavigate(); // Not used yet
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
      window.alert(t('common.error') + ': Alle felt må fylles ut');
      return;
    }

    if (!isValidPassword(newPassword)) {
      window.alert(t('common.error') + ': Passord må være minst 12 tegn med stor/liten bokstav, tall og spesialtegn');
      return;
    }

    if (newPassword !== confirmPassword) {
      window.alert(t('common.error') + ': Nye passord matcher ikke');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      window.alert(t('common.success') + ': ' + t('auth.changePassword') + ' vellykket');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke endre passord'));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!user) return;

    if (!userName.trim()) {
      window.alert(t('common.error') + ': Navn er påkrevd');
      return;
    }

    if (userPhone && !isValidPhone(userPhone)) {
      window.alert(t('common.error') + ': Ugyldig telefonnummer');
      return;
    }

    setSavingUserInfo(true);
    try {
      await updateUser(user.id, {
        name: userName.trim(),
        phone: userPhone.trim() || undefined,
      });
      await refreshUser();
      window.alert(t('common.success') + ': ' + t('settings.updateUserInfo') + ' vellykket');
      setEditingUserInfo(false);
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke oppdatere brukerinformasjon'));
    } finally {
      setSavingUserInfo(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Er du sikker på at du vil logge ut?')) {
      await signOut();
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    const confirmMessage = 'Er du sikker på at du vil slette kontoen din? Dette vil slette all data og kan ikke angres.';
    if (window.confirm(confirmMessage)) {
      try {
        // Slett brukerdata fra Firestore
        await deleteUser(user.id);

        // Slett bruker fra Firebase Authentication
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          await firebaseUser.delete();
        }

        // Logg ut
        await signOut();

        window.alert(t('common.success') + ': Kontoen din er slettet');
      } catch (error: any) {
        window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke slette konto'));
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
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
    <div style={containerStyle} className="settings-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('settings.myProfile') || 'Min profil'}
        </h1>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.primary}` }}>
          <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
            {t('settings.language')}
          </h2>
          <p style={{ fontSize: FontSizes.sm, marginBottom: Spacing.md, color: colors.textSecondary }}>
            {t('settings.languageDescription') || 'Velg språk for appen'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
            <Button
              title="🇳🇴 Norsk"
              onPress={() => handleLanguageChange('no')}
              variant={i18n.language === 'no' ? 'primary' : 'outline'}
              style={{ flex: 1, minWidth: 120 }}
            />
            <Button
              title="🇬🇧 English"
              onPress={() => handleLanguageChange('en')}
              variant={i18n.language === 'en' ? 'primary' : 'outline'}
              style={{ flex: 1, minWidth: 120 }}
            />
          </div>
        </Card>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.secondary}` }}>
          <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
            {t('settings.theme')}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
            <Button
              title={t('settings.light')}
              onPress={() => handleThemeChange('light')}
              variant={themeMode === 'light' ? 'primary' : 'outline'}
              style={{ flex: 1, minWidth: 100 }}
            />
            <Button
              title={t('settings.dark')}
              onPress={() => handleThemeChange('dark')}
              variant={themeMode === 'dark' ? 'primary' : 'outline'}
              style={{ flex: 1, minWidth: 100 }}
            />
            <Button
              title={t('settings.system')}
              onPress={() => handleThemeChange('system')}
              variant={themeMode === 'system' ? 'primary' : 'outline'}
              style={{ flex: 1, minWidth: 100 }}
            />
          </div>
        </Card>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.success}` }}>
          <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
            {t('settings.userInfo')}
          </h2>
          {!editingUserInfo ? (
            <>
              <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.xs, color: colors.text }}>
                {t('settings.name')}: {user?.name}
              </p>
              {user?.phone && (
                <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.xs, color: colors.text }}>
                  {t('settings.phone')}: {user.phone}
                </p>
              )}
              <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.xs, color: colors.text }}>
                E-post: {user?.email}
              </p>
              <Button
                title={t('settings.updateUserInfo')}
                onPress={() => {
                  setEditingUserInfo(true);
                  setUserName(user?.name || '');
                  setUserPhone(user?.phone || '');
                }}
                variant="outline"
                style={{ marginTop: Spacing.sm }}
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
              <div style={{ display: 'flex', gap: Spacing.sm }}>
                <Button
                  title={t('common.save')}
                  onPress={handleUpdateUserInfo}
                  loading={savingUserInfo}
                  style={{ flex: 1 }}
                />
                <Button
                  title={t('common.cancel')}
                  onPress={() => {
                    setEditingUserInfo(false);
                    setUserName(user?.name || '');
                    setUserPhone(user?.phone || '');
                  }}
                  variant="outline"
                  style={{ flex: 1 }}
                />
              </div>
            </>
          )}
        </Card>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.warning}` }}>
          <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
            {t('auth.changePassword')}
          </h2>
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
              <div style={{ display: 'flex', gap: Spacing.sm }}>
                <Button
                  title={t('common.save')}
                  onPress={handleChangePassword}
                  loading={changingPassword}
                  style={{ flex: 1 }}
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
                  style={{ flex: 1 }}
                />
              </div>
            </>
          )}
        </Card>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.error}` }}>
          <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.md, color: colors.text }}>
            {t('settings.dangerZone')}
          </h2>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="outline"
            style={{ marginTop: Spacing.sm, width: '100%' }}
          />
          <Button
            title={t('settings.deleteUser') || 'Slett konto'}
            onPress={handleDeleteUser}
            variant="outline"
            style={{
              marginTop: Spacing.sm,
              width: '100%',
              borderColor: colors.error,
              backgroundColor: `${colors.error}10`,
            }}
            textStyle={{ color: colors.error }}
          />
        </Card>
      </div>
    </div>
  );
};
