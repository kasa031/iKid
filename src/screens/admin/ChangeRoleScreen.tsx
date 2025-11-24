/**
 * Change Role Screen
 * Screen for administrators to change user roles
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { User, UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { isValidEmail } from '../../utils/validation';
import './ChangeRoleScreen.css';

export const ChangeRoleScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role as UserRole,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      window.alert(t('common.error') + ': Skriv inn e-postadresse');
      return;
    }

    if (!isValidEmail(searchEmail)) {
      window.alert(t('common.error') + ': Ugyldig e-postadresse');
      return;
    }

    const user = users.find(
      u => u.email.toLowerCase() === searchEmail.toLowerCase().trim()
    );
    if (user) {
      setSelectedUser(user);
    } else {
      window.alert(t('common.error') + ': Bruker ikke funnet');
      setSelectedUser(null);
    }
  };

  const handleChangeRole = async (newRole: UserRole) => {
    if (!selectedUser) {
      return;
    }

    setChangingRole(true);
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        role: newRole,
        updatedAt: new Date(),
      });
      window.alert(t('common.success') + ': Rolle endret');
      await loadUsers();
      setSelectedUser(null);
      setSearchEmail('');
    } catch (error: any) {
      window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke endre rolle'));
    } finally {
      setChangingRole(false);
    }
  };

  const getRoleText = (role: UserRole): string => {
    switch (role) {
      case UserRole.PARENT:
        return 'Foreldre';
      case UserRole.STAFF:
        return 'Ansatt';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'Ukjent';
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
    <div style={containerStyle} className="change-role-screen">
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          {t('admin.changeRole')}
        </h1>

        <div style={{ marginBottom: Spacing.md }}>
          <Input
            label={t('auth.email')}
            value={searchEmail}
            onChangeText={setSearchEmail}
            placeholder="bruker@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={t('common.search')}
            onPress={handleSearch}
            style={{ marginTop: Spacing.sm, width: '100%' }}
          />
        </div>

        {selectedUser && (
          <Card style={{ marginTop: Spacing.md }}>
            <h2 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.xs, letterSpacing: -0.2, lineHeight: FontSizes.lg * 1.3, color: colors.text, margin: '0 0 ' + Spacing.xs + ' 0' }}>
              {selectedUser.name}
            </h2>
            <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.xs, color: colors.textSecondary, margin: '0 0 ' + Spacing.xs + ' 0' }}>
              {selectedUser.email}
            </p>
            <p style={{ fontSize: FontSizes.md, fontWeight: 600, marginBottom: Spacing.md, color: colors.text, margin: '0 0 ' + Spacing.md + ' 0' }}>
              Nåværende rolle: {getRoleText(selectedUser.role)}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.sm }}>
              {Object.values(UserRole).map(role => (
                <Button
                  key={role}
                  title={getRoleText(role)}
                  onPress={() => handleChangeRole(role)}
                  variant={selectedUser.role === role ? 'primary' : 'outline'}
                  disabled={selectedUser.role === role || changingRole}
                  style={{ flex: 1, minWidth: 100 }}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
