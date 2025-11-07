/**
 * Forgot Password Link Component
 * Link to forgot password screen from login
 */

import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Spacing, FontSizes } from '../../constants/sizes';

export const ForgotPasswordLink: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate('ForgotPassword');
      }}
      style={styles.link}
    >
      <Text style={[styles.linkText, { color: colors.primary }]}>
        {t('auth.forgotPassword')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-end',
  },
  linkText: {
    fontSize: FontSizes.sm,
    textDecorationLine: 'underline',
  },
});

