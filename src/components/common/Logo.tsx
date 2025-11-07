/**
 * Logo Component
 * Displays Eventyrhagen Barnehage logo
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontSizes, Spacing } from '../../constants/sizes';

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

  return (
    <View style={styles.container}>
      {/* If you have a logo image, uncomment and use this: */}
      {/* <Image
        source={require('../../assets/logo.png')}
        style={[styles.image, { width: sizeStyle.fontSize * 2, height: sizeStyle.fontSize * 2 }]}
        resizeMode="contain"
      /> */}
      <Text style={[styles.text, { color: colors.primary, fontSize: sizeStyle.fontSize }]}>
        Eventyrhagen
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: sizeStyle.fontSize * 0.6 }]}>
        Barnehage
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: Spacing.xs,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5, // Improved letter spacing for logo
    lineHeight: sizeStyle.fontSize * 1.2, // Improved line height
  },
  subtitle: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    letterSpacing: 0.3, // Improved letter spacing
    lineHeight: sizeStyle.fontSize * 0.7 * 1.3, // Improved line height
  },
});

