/**
 * User service
 * Handles user-related database operations
 */

import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User } from '../../types';

/**
 * Update user information
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };

    // Remove id, createdAt from updates
    delete updateData.id;
    delete updateData.createdAt;

    await updateDoc(doc(db, 'users', userId), updateData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user and all associated data
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete user document
    await deleteDoc(doc(db, 'users', userId));

    // Delete all children linked to this user (if parent)
    const childrenQuery = query(collection(db, 'children'), where('parentIds', 'array-contains', userId));
    const childrenSnapshot = await getDocs(childrenQuery);
    
    for (const childDoc of childrenSnapshot.docs) {
      const childData = childDoc.data();
      const updatedParentIds = (childData.parentIds || []).filter((id: string) => id !== userId);
      
      if (updatedParentIds.length === 0) {
        // Delete child if no parents left
        await deleteDoc(doc(db, 'children', childDoc.id));
      } else {
        // Update child to remove parent reference
        await updateDoc(doc(db, 'children', childDoc.id), {
          parentIds: updatedParentIds,
        });
      }
    }

    // Delete all check-in/out logs by this user
    const logsQuery = query(collection(db, 'checkInOutLogs'), where('userId', '==', userId));
    const logsSnapshot = await getDocs(logsQuery);
    
    for (const logDoc of logsSnapshot.docs) {
      await deleteDoc(doc(db, 'checkInOutLogs', logDoc.id));
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
