/**
 * Loading Screen Component
 * Displays loading state
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, FontSizes } from '../../constants/sizes';
import { useTranslation } from 'react-i18next';
import './LoadingScreen.css';

export const LoadingScreen: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: colors.background,
  };

  const textStyle: React.CSSProperties = {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: colors.text,
  };

  return (
    <div style={containerStyle}>
      <div
        className="loading-spinner"
        style={{ borderTopColor: colors.primary }}
      />
      <p style={textStyle}>{t('common.loading')}</p>
    </div>
  );
};
