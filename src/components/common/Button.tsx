/**
 * Button component
 * Reusable button component with theme support
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, AccessibilityInfo } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '../../constants/sizes';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44, // Minimum touch target size for accessibility
      minWidth: 44,
    };

    if (variant === 'primary') {
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
      };
    } else if (variant === 'secondary') {
      return {
        ...baseStyle,
        backgroundColor: colors.secondary,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      };
    }
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'outline') {
      return {
        color: colors.primary,
        fontSize: FontSizes.md,
        fontWeight: '600',
      };
    }
    // Ensure white text on colored backgrounds for maximum readability
    return {
      color: '#FFFFFF',
      fontSize: FontSizes.md,
      fontWeight: '600',
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? 'Knapp er deaktivert' : undefined}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

