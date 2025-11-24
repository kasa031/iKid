/**
 * Logo Component
 * Displays Eventyrhagen Barnehage logo
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FontSizes, Spacing } from '../../constants/sizes';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: FontSizes.lg, padding: Spacing.sm };
      case 'large':
        return { fontSize: FontSizes.xxxl, padding: Spacing.lg };
      default:
        return { fontSize: FontSizes.xxl, padding: Spacing.md };
    }
  };

  const sizeStyle = getSize();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === 'large' ? Spacing.sm : sizeStyle.padding * 0.5,
    paddingTop: size === 'large' ? Spacing.xs : sizeStyle.padding * 0.25,
    paddingBottom: size === 'large' ? Spacing.xs : sizeStyle.padding * 0.5,
  };

  const textStyle: React.CSSProperties = {
    color: colors.primary,
    fontSize: sizeStyle.fontSize,
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: sizeStyle.fontSize * 1.2,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    color: colors.textSecondary,
    fontSize: sizeStyle.fontSize * 0.6,
    textAlign: 'center',
    marginTop: 1, // Redusert ytterligere for tettere spacing
    letterSpacing: 0.3,
    lineHeight: sizeStyle.fontSize * 0.6 * 1.1, // Redusert line-height
    margin: '1px 0 0 0',
  };

  return (
    <div style={containerStyle} className="logo-container">
      {/* If you have a logo image, add it here: */}
      {/* <img src="/logo.png" alt="Eventyrhagen Logo" style={{ width: sizeStyle.fontSize * 2, height: sizeStyle.fontSize * 2, marginBottom: Spacing.xs }} /> */}
      <h1 style={textStyle} className="logo-text">
        Eventyrhagen
      </h1>
      <p style={subtitleStyle} className="logo-subtitle">
        Barnehage
      </p>
    </div>
  );
};
