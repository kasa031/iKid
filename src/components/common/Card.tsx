/**
 * Card component
 * Reusable card component with theme support
 */

import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, BorderRadius } from '../../constants/sizes';
import './Card.css';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  className = '',
}) => {
  const { colors } = useTheme();

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: `0 2px 8px ${colors.shadow}15`,
    transition: 'all 0.2s ease',
    ...style,
  };

  const Component = onPress ? 'button' : 'div';
  const componentProps = onPress
    ? {
        onClick: onPress,
        type: 'button' as const,
        className: `card card--clickable ${className}`,
      }
    : {
        className: `card ${className}`,
      };

  return (
    <Component style={cardStyle} {...componentProps}>
      {children}
    </Component>
  );
};
