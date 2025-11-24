/**
 * Accessibility Wrapper Component
 * Provides accessibility features for better universal design
 */

import React, { ReactNode } from 'react';

interface AccessibilityWrapperProps {
  children: ReactNode;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}) => {
  return (
    <div
      aria-label={accessibilityLabel}
      aria-describedby={accessibilityHint ? undefined : undefined}
      role={accessibilityRole}
    >
      {children}
    </div>
  );
};
