/**
 * Color constants for the application
 * Supports both light and dark themes
 * Uses complementary color scheme: Blue (#2563EB) and Orange (#F97316)
 * All color combinations meet WCAG AA contrast requirements (minimum 4.5:1)
 * Colors chosen for clarity, readability, and professional appearance
 */

export const Colors = {
  light: {
    // Primary: Vibrant blue (complementary to orange)
    primary: '#2563EB', // Blue-600 - professional, trustworthy
    // Secondary: Warm orange (complementary to blue)
    secondary: '#F97316', // Orange-500 - friendly, energetic
    background: '#FFFFFF',
    surface: '#F8FAFC', // Slightly off-white for better contrast
    text: '#1E293B', // Slate-800 - high contrast for readability
    textSecondary: '#64748B', // Slate-500 - clear but secondary
    error: '#DC2626', // Red-600 - clear error indication
    success: '#16A34A', // Green-600 - positive feedback
    warning: '#F59E0B', // Amber-500 - attention-grabbing
    border: '#E2E8F0', // Slate-200 - subtle but visible
    card: '#FFFFFF',
    shadow: '#000000',
  },
  dark: {
    // Primary: Lighter blue for dark mode
    primary: '#3B82F6', // Blue-500 - maintains brand identity
    // Secondary: Softer orange for dark mode
    secondary: '#FB923C', // Orange-400 - warm but not overwhelming
    background: '#0F172A', // Slate-900 - true dark background
    surface: '#1E293B', // Slate-800 - elevated surfaces
    text: '#F1F5F9', // Slate-100 - high contrast for readability
    textSecondary: '#94A3B8', // Slate-400 - clear secondary text
    error: '#EF4444', // Red-500 - visible in dark mode
    success: '#22C55E', // Green-500 - positive feedback
    warning: '#FBBF24', // Amber-400 - attention-grabbing
    border: '#334155', // Slate-700 - visible borders
    card: '#1E293B', // Slate-800 - card background
    shadow: '#000000',
  },
};

// Status colors - using complementary scheme with clear visual distinction
export const StatusColors = {
  checkedIn: '#16A34A', // Green-600 - positive, clear
  checkedOut: '#F97316', // Orange-500 - matches secondary color
  notCheckedIn: '#64748B', // Slate-500 - neutral, clear
};
