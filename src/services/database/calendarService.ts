/**
 * Calendar service
 * Handles calendar events
 */

import {
  collection,
  doc,
  // getDoc, // Unused
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CalendarEvent } from '../../types';

/**
 * Get all calendar events
 */
export const getAllEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const q = query(collection(db, 'calendarEvents'), orderBy('date', 'asc'));
    const eventsSnapshot = await getDocs(q);
    return eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date?.toDate() || new Date(),
        eventType: data.eventType,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

/**
 * Get events for a specific date range
 */
export const getEventsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  try {
    const q = query(
      collection(db, 'calendarEvents'),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'asc')
    );
    const eventsSnapshot = await getDocs(q);
    return eventsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.date?.toDate() || new Date(),
        eventType: data.eventType,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting events by date range:', error);
    return [];
  }
};

/**
 * Create a new calendar event
 */
export const createEvent = async (
  eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const eventRef = doc(collection(db, 'calendarEvents'));
    await setDoc(eventRef, {
      ...eventData,
      date: Timestamp.fromDate(eventData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return eventRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update a calendar event
 */
export const updateEvent = async (
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }

    // Remove id, createdAt, updatedAt from updates
    delete updateData.id;
    delete updateData.createdAt;

    await updateDoc(doc(db, 'calendarEvents', eventId), updateData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete a calendar event
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'calendarEvents', eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
