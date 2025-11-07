/**
 * Calendar Screen
 * Displays calendar events
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAllEvents, deleteEvent } from '../../services/database/calendarService';
import { CalendarEvent, UserRole } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spacing, FontSizes } from '../../constants/sizes';
import { formatDate, formatTime } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { getUpcomingEvents, formatEventNotification } from '../../utils/notifications';

export const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadEvents();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Check for upcoming events and show notifications
    const upcomingEvents = getUpcomingEvents(events, 24);
    if (upcomingEvents.length > 0) {
      // In a real app, you would use a notification library here
      // For now, we'll just log to console
      upcomingEvents.forEach((event) => {
        console.log('Upcoming event:', formatEventNotification(event));
        // You could use react-native-push-notification or similar here
      });
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
    Alert.alert(
      t('common.delete'),
      'Er du sikker på at du vil slette denne hendelsen?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              await loadEvents();
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || 'Kunne ikke slette hendelse');
            }
          },
        },
      ]
    );
  };

  const renderEventItem = ({ item }: { item: CalendarEvent }) => {
    return (
      <Card>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.eventType, { color: colors.primary }]}>
              {getEventTypeText(item.eventType)}
            </Text>
            <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
              {formatDate(item.date)} {formatTime(item.date)}
            </Text>
            {item.description && (
              <Text style={[styles.eventDescription, { color: colors.text }]}>
                {item.description}
              </Text>
            )}
          </View>
          {user?.role === UserRole.STAFF && (
            <Button
              title={t('common.delete')}
              onPress={() => handleDelete(item.id)}
              variant="outline"
              style={styles.deleteButton}
            />
          )}
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('calendar.title')}
        </Text>
        {user?.role === UserRole.STAFF && (
          <Button
            title={t('calendar.addEvent')}
            onPress={() => {
              (navigation as any).navigate('AddEvent');
            }}
            variant="outline"
          />
        )}
      </View>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('calendar.noEvents')}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: FontSizes.xxl * 1.2,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  eventTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.lg * 1.4, // Improved line height
    letterSpacing: -0.2, // Tighter spacing for headings
  },
  eventType: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    letterSpacing: 0.3, // Improved letter spacing
  },
  eventDate: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.sm,
    lineHeight: FontSizes.md * 1.4, // Improved line height
  },
  eventDescription: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
    lineHeight: FontSizes.md * 1.5, // Improved line height for body text
  },
  loadingText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: Spacing.md,
    alignSelf: 'flex-start',
  },
});

