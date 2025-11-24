/**
 * Logs Screen
 * Displays check-in/check-out logs
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllLogs } from '../../services/database/checkInOutService';
import { CheckInOutLog } from '../../types';
import { LogItem } from '../../components/logs/LogItem';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spacing, FontSizes } from '../../constants/sizes';
import { getChildById } from '../../services/database/childService';
import { exportLogsToCSV } from '../../utils/exportLogs';
import './LogsScreen.css';

export const LogsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [logs, setLogs] = useState<CheckInOutLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<CheckInOutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<
    'all' | 'check_in' | 'check_out'
  >('all');
  const [dateFilter] = useState(''); // Date filter not implemented yet

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
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(log => {
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
        filtered.map(async log => {
          const child = await getChildById(log.childId);
          if (child) {
            const childName =
              `${child.firstName} ${child.lastName}`.toLowerCase();
            return childName.includes(query) ? log : null;
          }
          return null;
        })
      );
      filtered = filteredWithNames.filter(
        log => log !== null
      ) as CheckInOutLog[];
    }

    setFilteredLogs(filtered);
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

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
  };

  return (
    <div style={containerStyle} className="logs-screen">
      <h1 style={titleStyle}>
        {t('logs.title')}
      </h1>

      <div style={{ marginBottom: Spacing.md }}>
        <Input
          label={t('common.search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('common.search')}
        />
      </div>

      <div style={{ display: 'flex', marginBottom: Spacing.md, gap: Spacing.xs }}>
        <Button
          title="Alle"
          onPress={() => setActionFilter('all')}
          variant={actionFilter === 'all' ? 'primary' : 'outline'}
          style={{ flex: 1 }}
        />
        <Button
          title={t('child.checkIn')}
          onPress={() => setActionFilter('check_in')}
          variant={actionFilter === 'check_in' ? 'primary' : 'outline'}
          style={{ flex: 1 }}
        />
        <Button
          title={t('child.checkOut')}
          onPress={() => setActionFilter('check_out')}
          variant={actionFilter === 'check_out' ? 'primary' : 'outline'}
          style={{ flex: 1 }}
        />
      </div>

      {user?.role === 'staff' && (
        <Button
          title={t('logs.export')}
          onPress={async () => {
            try {
              const csv = await exportLogsToCSV(filteredLogs);
              window.alert(t('common.success') + `: Eksportert ${filteredLogs.length} logger`);
              // In a real app, you would save/share the CSV file here
              // CSV data ready for download
            } catch (error: any) {
              window.alert(t('common.error') + ': ' + (error.message || 'Kunne ikke eksportere logger'));
            }
          }}
          variant="outline"
          style={{ marginBottom: Spacing.md, width: '100%' }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
        {filteredLogs.length === 0 ? (
          <p style={{ fontSize: FontSizes.md, textAlign: 'center', marginTop: Spacing.xl, color: colors.textSecondary }}>
            Ingen logger funnet
          </p>
        ) : (
          filteredLogs.map(log => (
            <LogItem key={log.id} log={log} />
          ))
        )}
      </div>
    </div>
  );
};
