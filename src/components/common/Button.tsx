/**
 * Button component
 * Reusable button component with theme support
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '../../constants/sizes';
import './Button.css';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  type = 'button',
}) => {
  const { colors } = useTheme();

  const getButtonClassName = (): string => {
    const baseClass = 'button';
    if (variant === 'primary') return `${baseClass} button--primary`;
    if (variant === 'secondary') return `${baseClass} button--secondary`;
    return `${baseClass} button--outline`;
  };

  const buttonStyle: React.CSSProperties = {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
    borderRadius: BorderRadius.md,
    minHeight: 44,
    minWidth: 44,
    ...(variant === 'primary' && { backgroundColor: colors.primary }),
    ...(variant === 'secondary' && { backgroundColor: colors.secondary }),
    ...(variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.primary,
    }),
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
    ...style,
  };

  const textStyleObj: React.CSSProperties = {
    fontSize: FontSizes.md,
    fontWeight: 600,
    ...(variant === 'outline'
      ? { color: colors.primary }
      : { color: '#FFFFFF' }),
    ...textStyle,
  };

  return (
    <button
      className={getButtonClassName()}
      style={buttonStyle}
      onClick={onPress}
      disabled={disabled || loading}
      type={type}
      aria-label={title}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <span
          className="button__spinner"
          style={{ color: variant === 'outline' ? colors.primary : '#FFFFFF' }}
        >
          ⏳
        </span>
      ) : (
        <span style={textStyleObj}>{title}</span>
      )}
    </button>
  );
};
