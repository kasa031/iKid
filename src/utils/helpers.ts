/**
 * Helper utilities
 * Common helper functions used throughout the app
 */

import { Child, ChildStatus } from '../types';

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('no-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('no-NO', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get child's full name
 */
export const getChildFullName = (child: Child): string => {
  return `${child.firstName} ${child.lastName}`;
};

/**
 * Get child's age
 */
export const getChildAge = (dateOfBirth: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Get status color
 * Uses complementary color scheme for clear visual distinction
 */
export const getStatusColor = (status: ChildStatus): string => {
  switch (status) {
    case ChildStatus.CHECKED_IN:
      return '#16A34A'; // Green-600 - clear positive indicator
    case ChildStatus.CHECKED_OUT:
      return '#F97316'; // Orange-500 - matches secondary color, warm
    case ChildStatus.NOT_CHECKED_IN:
      return '#64748B'; // Slate-500 - neutral, clear
    default:
      return '#64748B';
  }
};

/**
 * Get status text
 */
export const getStatusText = (status: ChildStatus): string => {
  switch (status) {
    case ChildStatus.CHECKED_IN:
      return 'Til stede';
    case ChildStatus.CHECKED_OUT:
      return 'Hentet';
    case ChildStatus.NOT_CHECKED_IN:
      return 'Ikke levert';
    default:
      return 'Ukjent';
  }
};

