/**
 * Messaging utilities
 * Functions for sending emails and messages
 */

// import { Linking, Platform } from 'react-native'; // Not needed for web

/**
 * Open email client with pre-filled email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<void> => {
  const emailUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    // On web, we can directly open mailto links
    window.location.href = emailUrl;
  } catch (error) {
    console.error('Error opening email:', error);
    throw error;
  }
};
