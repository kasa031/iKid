/**
 * Messaging utilities
 * Functions for sending emails and messages
 */

import { Linking, Platform } from 'react-native';

/**
 * Open email client with pre-filled email
 */
export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  const emailUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  try {
    const canOpen = await Linking.canOpenURL(emailUrl);
    if (canOpen) {
      await Linking.openURL(emailUrl);
    } else {
      throw new Error('Kan ikke åpne e-postklient');
    }
  } catch (error) {
    console.error('Error opening email:', error);
    throw error;
  }
};

