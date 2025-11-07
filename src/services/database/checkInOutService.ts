/**
 * Check-in/Check-out service
 * Handles check-in and check-out operations and logging
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CheckInOutLog, ChildStatus } from '../../types';

/**
 * Check in a child
 */
export const checkInChild = async (
  childId: string,
  userId: string,
  notes?: string
): Promise<void> => {
  try {
    const timestamp = Timestamp.now();

    // Create log entry
    const logRef = doc(collection(db, 'checkInOutLogs'));
    await setDoc(logRef, {
      childId,
      userId,
      action: 'check_in',
      timestamp,
      notes: notes || '',
    });

    // Update child status
    const childRef = doc(db, 'children', childId);
    const childDoc = await getDoc(childRef);
    if (childDoc.exists()) {
      await setDoc(
        childRef,
        {
          status: ChildStatus.CHECKED_IN,
          lastCheckIn: timestamp,
          updatedAt: timestamp,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error checking in child:', error);
    throw error;
  }
};

/**
 * Check out a child
 */
export const checkOutChild = async (
  childId: string,
  userId: string,
  notes?: string
): Promise<void> => {
  try {
    const timestamp = Timestamp.now();

    // Create log entry
    const logRef = doc(collection(db, 'checkInOutLogs'));
    await setDoc(logRef, {
      childId,
      userId,
      action: 'check_out',
      timestamp,
      notes: notes || '',
    });

    // Update child status
    const childRef = doc(db, 'children', childId);
    const childDoc = await getDoc(childRef);
    if (childDoc.exists()) {
      await setDoc(
        childRef,
        {
          status: ChildStatus.CHECKED_OUT,
          lastCheckOut: timestamp,
          updatedAt: timestamp,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Error checking out child:', error);
    throw error;
  }
};

/**
 * Get check-in/out logs for a child
 */
export const getChildLogs = async (childId: string): Promise<CheckInOutLog[]> => {
  try {
    const q = query(
      collection(db, 'checkInOutLogs'),
      where('childId', '==', childId),
      orderBy('timestamp', 'desc')
    );
    const logsSnapshot = await getDocs(q);
    return logsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        childId: data.childId,
        userId: data.userId,
        action: data.action as 'check_in' | 'check_out',
        timestamp: data.timestamp?.toDate() || new Date(),
        notes: data.notes,
      };
    });
  } catch (error) {
    console.error('Error getting child logs:', error);
    return [];
  }
};

/**
 * Get all check-in/out logs
 */
export const getAllLogs = async (): Promise<CheckInOutLog[]> => {
  try {
    const q = query(collection(db, 'checkInOutLogs'), orderBy('timestamp', 'desc'));
    const logsSnapshot = await getDocs(q);
    return logsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        childId: data.childId,
        userId: data.userId,
        action: data.action as 'check_in' | 'check_out',
        timestamp: data.timestamp?.toDate() || new Date(),
        notes: data.notes,
      };
    });
  } catch (error) {
    console.error('Error getting all logs:', error);
    return [];
  }
};

/**
 * Subscribe to real-time updates for a child's status
 */
export const subscribeToChildStatus = (
  childId: string,
  callback: (status: ChildStatus | null) => void
): (() => void) => {
  const childRef = doc(db, 'children', childId);
  return onSnapshot(childRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback(data.status || null);
    } else {
      callback(null);
    }
  });
};

