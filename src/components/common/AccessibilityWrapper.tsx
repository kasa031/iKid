/**
 * Accessibility Wrapper Component
 * Provides accessibility features for better universal design
 */

import React, { ReactNode } from 'react';
import { View, AccessibilityInfo } from 'react-native';

interface AccessibilityWrapperProps {
  children: ReactNode;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole as any}
    >
      {children}
    </View>
  );
};

