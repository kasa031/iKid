/**
 * Forgot Password Link Component
 * Link to forgot password screen from login
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, FontSizes } from '../../constants/sizes';
import './ForgotPasswordLink.css';

export const ForgotPasswordLink: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const linkStyle: React.CSSProperties = {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
    fontSize: FontSizes.sm,
    color: colors.primary,
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  return (
    <Link
      to="/forgot-password"
      style={linkStyle}
      className="forgot-password-link"
    >
      {t('auth.forgotPassword')}
    </Link>
  );
};
