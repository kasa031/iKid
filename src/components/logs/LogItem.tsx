/**
 * Log Item Component
 * Displays a single log entry
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { CheckInOutLog } from '../../types';
import { getChildById } from '../../services/database/childService';
import { Card } from '../common/Card';
import { Spacing, FontSizes } from '../../constants/sizes';
import { formatDate, formatTime } from '../../utils/helpers';

interface LogItemProps {
  log: CheckInOutLog;
}

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [childName, setChildName] = useState<string>('');

  useEffect(() => {
    const loadChildName = async () => {
      const child = await getChildById(log.childId);
      if (child) {
        setChildName(`${child.firstName} ${child.lastName}`);
      }
    };
    loadChildName();
  }, [log.childId]);

  return (
    <Card>
      <View style={styles.logRow}>
        <Text style={[styles.logAction, { color: colors.primary }]}>
          {log.action === 'check_in' ? t('child.checkIn') : t('child.checkOut')}
        </Text>
        <Text style={[styles.logDate, { color: colors.textSecondary }]}>
          {formatDate(log.timestamp)} {formatTime(log.timestamp)}
        </Text>
      </View>
      {childName && (
        <Text style={[styles.logChild, { color: colors.text }]}>
          {t('logs.child')}: {childName}
        </Text>
      )}
      {log.notes && (
        <Text style={[styles.logNotes, { color: colors.textSecondary }]}>
          {log.notes}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  logAction: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    letterSpacing: 0.2, // Improved letter spacing
    lineHeight: FontSizes.md * 1.3, // Improved line height
  },
  logDate: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.4, // Improved line height
  },
  logChild: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
    lineHeight: FontSizes.md * 1.4, // Improved line height
  },
  logNotes: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
    lineHeight: FontSizes.sm * 1.5, // Improved line height for readability
  },
});

