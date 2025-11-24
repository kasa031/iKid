/**
 * Calendar Screen
 * Displays calendar events
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  getAllEvents,
  deleteEvent,
} from '../../services/database/calendarService';
import { CalendarEvent, UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spacing, FontSizes } from '../../constants/sizes';
import { formatDate, formatTime } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import {
  getUpcomingEvents,
} from '../../utils/notifications';
import './CalendarScreen.css';

export const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Check for upcoming events and show notifications
    const upcomingEvents = getUpcomingEvents(events, 24);
    if (upcomingEvents.length > 0) {
      // In a real app, you would use a notification library here
      // For now, we'll just log to console
      // Upcoming events detected (can be used for notifications in the future)
      // upcomingEvents.forEach(event => {
      //   // Event: formatEventNotification(event)
      // });
    }
  }, [events]);

  const loadEvents = async () => {
    try {
      const eventsData = await getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeText = (eventType: string): string => {
    switch (eventType) {
      case 'parent_meeting':
        return t('calendar.parentMeeting');
      case 'field_trip':
        return t('calendar.fieldTrip');
      default:
        return t('calendar.other');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm(t('calendar.confirmDelete'))) {
      try {
        await deleteEvent(eventId);
        await loadEvents();
      } catch (error: any) {
        window.alert(error.message || t('calendar.deleteError'));
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.background, padding: Spacing.md, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: FontSizes.md, color: colors.text }}>
          {t('common.loading')}
        </p>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: Spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: 700,
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
    color: colors.text,
    margin: 0,
  };

  return (
    <div style={containerStyle} className="calendar-screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
        <h1 style={titleStyle}>
          {t('calendar.title')}
        </h1>
        <Button
          title={t('calendar.addEvent')}
          onPress={() => {
            navigate('/calendar/add-event');
          }}
          variant="outline"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        {events.length === 0 ? (
          <p style={{ fontSize: FontSizes.md, textAlign: 'center', marginTop: Spacing.xl, color: colors.textSecondary }}>
            {t('calendar.noEvents')}
          </p>
        ) : (
          events.map(event => (
            <Card key={event.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: FontSizes.lg, fontWeight: 700, marginBottom: Spacing.sm, lineHeight: FontSizes.lg * 1.4, letterSpacing: -0.2, color: colors.text, margin: 0 }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: FontSizes.sm, fontWeight: 600, marginBottom: Spacing.xs, letterSpacing: 0.3, color: colors.primary, margin: 0 }}>
                    {getEventTypeText(event.eventType)}
                  </p>
                  <p style={{ fontSize: FontSizes.md, marginBottom: Spacing.sm, lineHeight: FontSizes.md * 1.4, color: colors.textSecondary, margin: 0 }}>
                    {formatDate(event.date)} {formatTime(event.date)}
                  </p>
                  {event.description && (
                    <p style={{ fontSize: FontSizes.md, marginTop: Spacing.sm, lineHeight: FontSizes.md * 1.5, color: colors.text, margin: 0 }}>
                      {event.description}
                    </p>
                  )}
                </div>
                {(user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN) && (
                  <Button
                    title={t('common.delete')}
                    onPress={() => handleDelete(event.id)}
                    variant="outline"
                    style={{ marginLeft: Spacing.md, alignSelf: 'flex-start' }}
                  />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
