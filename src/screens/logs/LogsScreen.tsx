/**
 * Logs Screen
 * Displays check-in/check-out logs
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllLogs, getChildLogs } from '../../services/database/checkInOutService';
import { CheckInOutLog } from '../../types';
import { LogItem } from '../../components/logs/LogItem';
import { Button } from '../../components/common/Button';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildById } from '../../services/database/childService';
import { exportLogsToCSV } from '../../utils/exportLogs';

export const LogsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [logs, setLogs] = useState<CheckInOutLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<CheckInOutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | 'check_in' | 'check_out'>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, actionFilter, dateFilter]);

  const loadLogs = async () => {
    try {
      const logsData = await getAllLogs();
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = async () => {
    let filtered = [...logs];

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp);
        return (
          logDate.getDate() === filterDate.getDate() &&
          logDate.getMonth() === filterDate.getMonth() &&
          logDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Filter by search query (child name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filteredWithNames = await Promise.all(
        filtered.map(async (log) => {
          const child = await getChildById(log.childId);
          if (child) {
            const childName = `${child.firstName} ${child.lastName}`.toLowerCase();
            return childName.includes(query) ? log : null;
          }
          return null;
        })
      );
      filtered = filteredWithNames.filter((log) => log !== null) as CheckInOutLog[];
    }

    setFilteredLogs(filtered);
  };

  const renderLogItem = ({ item }: { item: CheckInOutLog }) => {
    return <LogItem log={item} />;
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('logs.title')}
      </Text>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('common.search')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Button
          title="Alle"
          onPress={() => setActionFilter('all')}
          variant={actionFilter === 'all' ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
        <Button
          title={t('child.checkIn')}
          onPress={() => setActionFilter('check_in')}
          variant={actionFilter === 'check_in' ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
        <Button
          title={t('child.checkOut')}
          onPress={() => setActionFilter('check_out')}
          variant={actionFilter === 'check_out' ? 'primary' : 'outline'}
          style={styles.filterButton}
        />
      </View>

      {user?.role === 'staff' && (
        <Button
          title={t('logs.export')}
          onPress={async () => {
            try {
              const csv = await exportLogsToCSV(filteredLogs);
              Alert.alert(t('common.success'), `Eksportert ${filteredLogs.length} logger`);
              // In a real app, you would save/share the CSV file here
              console.log('CSV:', csv);
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || 'Kunne ikke eksportere logger');
            }
          }}
          variant="outline"
          style={styles.exportButton}
        />
      )}

      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Ingen logger funnet
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  searchContainer: {
    marginBottom: Spacing.md,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    height: 40,
    fontSize: FontSizes.md,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  filterButton: {
    flex: 1,
  },
  exportButton: {
    marginBottom: Spacing.md,
  },
});

