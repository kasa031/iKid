/**
 * Accessibility Hook
 * Provides accessibility utilities for web
 */

import { useEffect, useState } from 'react';

/**
 * Hook to check if screen reader is enabled
 * For web, we check for common screen reader indicators
 */
export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    // Check for common screen reader indicators on web
    const checkScreenReader = () => {
      // Check if user prefers reduced motion (often used with screen readers)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for common screen reader user agents
      const userAgent = navigator.userAgent.toLowerCase();
      const isScreenReaderUA = 
        userAgent.includes('nvda') || 
        userAgent.includes('jaws') || 
        userAgent.includes('voiceover') ||
        userAgent.includes('talkback');
      
      // Check if aria-hidden is being used (indicates screen reader awareness)
      const hasAriaHidden = document.querySelector('[aria-hidden="true"]') !== null;
      
      // For web, we can't definitively detect screen readers, so we use heuristics
      setIsScreenReaderEnabled(prefersReducedMotion || isScreenReaderUA || hasAriaHidden);
    };

    checkScreenReader();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => checkScreenReader();
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return { isScreenReaderEnabled };
};
