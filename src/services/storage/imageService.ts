/**
 * Image Service
 * Handles image upload and storage
 */

import { storage } from '../firebase/config';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

/**
 * Upload image to Firebase Storage
 * Accepts either a File object (web) or a file URI string (mobile)
 */
export const uploadImage = async (
  fileOrUri: File | string,
  path: string
): Promise<string> => {
  try {
    let blob: Blob;

    if (fileOrUri instanceof File) {
      // Web: File object
      blob = fileOrUri;
    } else {
      // Mobile: URI string - convert to blob
      const response = await fetch(fileOrUri);
      blob = await response.blob();
    }

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload file
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete image from Firebase Storage
 */
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
