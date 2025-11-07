/**
 * Change Role Screen
 * Screen for administrators to change user roles
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
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

export const ChangeRoleScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => {
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
      Alert.alert(t('common.error'), 'Skriv inn e-postadresse');
      return;
    }

    if (!isValidEmail(searchEmail)) {
      Alert.alert(t('common.error'), 'Ugyldig e-postadresse');
      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === searchEmail.toLowerCase().trim());
    if (user) {
      setSelectedUser(user);
    } else {
      Alert.alert(t('common.error'), 'Bruker ikke funnet');
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
      Alert.alert(t('common.success'), 'Rolle endret');
      await loadUsers();
      setSelectedUser(null);
      setSearchEmail('');
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Kunne ikke endre rolle');
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('admin.changeRole')}
        </Text>

        <View style={styles.searchContainer}>
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
            style={styles.searchButton}
          />
        </View>

        {selectedUser && (
          <Card style={styles.userCard}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {selectedUser.name}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {selectedUser.email}
            </Text>
            <Text style={[styles.currentRole, { color: colors.text }]}>
              Nåværende rolle: {getRoleText(selectedUser.role)}
            </Text>

            <View style={styles.roleButtons}>
              {Object.values(UserRole).map((role) => (
                <Button
                  key={role}
                  title={getRoleText(role)}
                  onPress={() => handleChangeRole(role)}
                  variant={selectedUser.role === role ? 'primary' : 'outline'}
                  disabled={selectedUser.role === role || changingRole}
                  style={styles.roleButton}
                />
              ))}
            </View>
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
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchButton: {
    marginTop: Spacing.sm,
  },
  userCard: {
    marginTop: Spacing.md,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
    lineHeight: FontSizes.lg * 1.3,
  },
  userEmail: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },
  currentRole: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleButton: {
    flex: 1,
    minWidth: 100,
  },
});

