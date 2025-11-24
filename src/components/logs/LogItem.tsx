/**
 * Log Item Component
 * Displays a single log entry
 */

import React, { useState, useEffect } from 'react';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs }}>
        <span style={{ fontSize: FontSizes.md, fontWeight: 700, letterSpacing: 0.2, lineHeight: FontSizes.md * 1.3, color: colors.primary }}>
          {log.action === 'check_in' ? t('child.checkIn') : t('child.checkOut')}
        </span>
        <span style={{ fontSize: FontSizes.sm, lineHeight: FontSizes.sm * 1.4, color: colors.textSecondary }}>
          {formatDate(log.timestamp)} {formatTime(log.timestamp)}
        </span>
      </div>
      {childName && (
        <p style={{ fontSize: FontSizes.md, marginTop: Spacing.sm, margin: 0, lineHeight: FontSizes.md * 1.4, color: colors.text }}>
          {t('logs.child')}: {childName}
        </p>
      )}
      {log.notes && (
        <p style={{ fontSize: FontSizes.sm, marginTop: Spacing.sm, margin: 0, fontStyle: 'italic', lineHeight: FontSizes.sm * 1.5, color: colors.textSecondary }}>
          {log.notes}
        </p>
      )}
    </Card>
  );
};
