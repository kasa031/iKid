/**
 * Accessibility Hook
 * Provides accessibility utilities
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook to check if screen reader is enabled
 */
export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      setIsScreenReaderEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', (enabled) => {
      setIsScreenReaderEnabled(enabled);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { isScreenReaderEnabled };
};

