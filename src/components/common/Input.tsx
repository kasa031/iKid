/**
 * Input component
 * Reusable text input component with theme support
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '../../constants/sizes';
import './Input.css';

// Ensure minimum touch target size
const MIN_TOUCH_TARGET = 44;

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: React.CSSProperties;
  editable?: boolean;
  type?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  editable = true,
  type,
}) => {
  const { colors } = useTheme();

  const getInputType = (): string => {
    if (type) return type;
    if (secureTextEntry) return 'password';
    if (keyboardType === 'email-address') return 'email';
    if (keyboardType === 'numeric') return 'number';
    if (keyboardType === 'phone-pad') return 'tel';
    return 'text';
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: error ? colors.error : colors.border,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: BorderRadius.md,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    paddingTop: 10, // Redusert for mer kompakt design
    paddingBottom: 10, // Redusert for mer kompakt design
    fontSize: FontSizes.md,
    minHeight: MIN_TOUCH_TARGET,
    lineHeight: 1.3, // Mer kompakt line-height
    width: '100%',
    fontFamily: 'inherit',
    ...(multiline && { minHeight: 100, resize: 'vertical' }),
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    fontWeight: 600,
    marginBottom: 2, // Redusert fra xs (4px) til 2px for mer kompakt design
    letterSpacing: 0.2,
    color: colors.text,
    display: 'block',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: FontSizes.xs,
    marginTop: 2, // Redusert fra xs (4px) til 2px
    color: colors.error,
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="input-container" style={{ marginBottom: Spacing.xs }}> {/* Redusert ytterligere for mer kompakt design */}
      {label && (
        <label
          style={labelStyle}
          htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
        >
          {label}
        </label>
      )}
      <InputComponent
        id={label?.replace(/\s+/g, '-').toLowerCase()}
        type={getInputType()}
        value={value}
        onChange={e => onChangeText(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        disabled={!editable}
        rows={multiline ? numberOfLines : undefined}
        autoCapitalize={autoCapitalize}
        aria-label={label || placeholder}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${label?.replace(/\s+/g, '-').toLowerCase()}-error`
            : undefined
        }
      />
      {error && (
        <div
          id={`${label?.replace(/\s+/g, '-').toLowerCase()}-error`}
          style={errorStyle}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};
