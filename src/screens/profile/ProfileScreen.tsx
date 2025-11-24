/**
 * Profile Screen
 * Screen for users to view their profile information
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { updateUser } from '../../services/database/userService';
import { isValidPhone } from '../../utils/validation';
import './ProfileScreen.css';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, refreshUser } = useAuth();
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [savingUserInfo, setSavingUserInfo] = useState(false);

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
    <div style={containerStyle} className="profile-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('settings.myProfile') || 'Min profil'}
        </h1>

        <Card style={{ marginBottom: Spacing.md, borderLeft: `4px solid ${colors.primary}` }}>
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
              <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.xs, color: colors.text }}>
                Rolle: {user?.role === 'parent' ? 'Forelder' : user?.role === 'staff' ? 'Ansatt' : 'Administrator'}
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
      </div>
    </div>
  );
};

