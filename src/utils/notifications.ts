/**
 * Notifications Utility
 * Functions for handling calendar event notifications
 */

import { CalendarEvent } from '../types';

/**
 * Check if an event is coming up soon (within 24 hours)
 */
export const isEventComingSoon = (
  event: CalendarEvent,
  hoursThreshold: number = 24
): boolean => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const diffInHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffInHours > 0 && diffInHours <= hoursThreshold;
};

/**
 * Get upcoming events that need notifications
 */
export const getUpcomingEvents = (
  events: CalendarEvent[],
  hoursThreshold: number = 24
): CalendarEvent[] => {
  return events.filter(event => isEventComingSoon(event, hoursThreshold));
};

/**
 * Format notification message for an event
 */
export const formatEventNotification = (event: CalendarEvent): string => {
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${event.title} - ${dateStr}`;
};
