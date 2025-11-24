/**
 * Child service
 * Handles CRUD operations for children
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Child } from '../../types';

/**
 * Get a child by ID
 */
export const getChildById = async (childId: string): Promise<Child | null> => {
  try {
    const childDoc = await getDoc(doc(db, 'children', childId));
    if (!childDoc.exists()) {
      return null;
    }

    const data = childDoc.data();
    return {
      id: childDoc.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
      parentIds: data.parentIds || [],
      photoUrl: data.photoUrl,
      allergies: data.allergies,
      notes: data.notes,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting child:', error);
    return null;
  }
};

/**
 * Get all children
 */
export const getAllChildren = async (): Promise<Child[]> => {
  try {
    const childrenSnapshot = await getDocs(collection(db, 'children'));
    return childrenSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
        parentIds: data.parentIds || [],
        photoUrl: data.photoUrl,
        allergies: data.allergies,
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting children:', error);
    return [];
  }
};

/**
 * Get children by parent ID
 */
export const getChildrenByParentId = async (
  parentId: string
): Promise<Child[]> => {
  try {
    const q = query(
      collection(db, 'children'),
      where('parentIds', 'array-contains', parentId)
    );
    const childrenSnapshot = await getDocs(q);
    return childrenSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
        parentIds: data.parentIds || [],
        photoUrl: data.photoUrl,
        allergies: data.allergies,
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting children by parent:', error);
    return [];
  }
};

/**
 * Create a new child
 */
export const createChild = async (
  childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const childRef = doc(collection(db, 'children'));
    await setDoc(childRef, {
      ...childData,
      dateOfBirth: Timestamp.fromDate(childData.dateOfBirth),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return childRef.id;
  } catch (error) {
    console.error('Error creating child:', error);
    throw error;
  }
};

/**
 * Update a child
 */
export const updateChild = async (
  childId: string,
  updates: Partial<Child>
): Promise<void> => {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.dateOfBirth) {
      updateData.dateOfBirth = Timestamp.fromDate(updates.dateOfBirth);
    }

    // Remove id, createdAt, updatedAt from updates
    delete updateData.id;
    delete updateData.createdAt;

    await updateDoc(doc(db, 'children', childId), updateData);
  } catch (error) {
    console.error('Error updating child:', error);
    throw error;
  }
};

/**
 * Delete a child
 */
export const deleteChild = async (childId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'children', childId));
  } catch (error) {
    console.error('Error deleting child:', error);
    throw error;
  }
};
