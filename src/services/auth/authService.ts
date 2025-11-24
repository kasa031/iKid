/**
 * Authentication service
 * Handles user authentication, registration, and password management
 * 
 * SECURITY NOTE:
 * - Firebase Authentication handles password hashing server-side using scrypt
 * - We validate password strength client-side before sending to Firebase
 * - Passwords are sent over HTTPS (TLS 1.3) and never stored in plain text
 * - For additional encryption of sensitive data, use utils/crypto.ts
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  // User as FirebaseUser, // Unused type alias
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, UserRole } from '../../types';

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      // User exists in Auth but not in Firestore - create the document
      // This can happen if registration failed partway through
      const defaultUserData = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        phone: '',
        role: 'parent' as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), defaultUserData);
        // Retry getting the document
        const newUserDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!newUserDoc.exists()) {
          throw new Error('Kunne ikke opprette brukerdata. Prøv å registrere deg på nytt.');
        }
        const userData = newUserDoc.data();
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name,
          phone: userData.phone,
          role: userData.role as UserRole,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        };
      } catch (createError: any) {
        throw new Error('Brukerdata mangler. Prøv å registrere deg på nytt, eller kontakt administrator.');
      }
    }

    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData.name,
      phone: userData.phone,
      role: userData.role as UserRole,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    };
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('Ingen konto funnet med denne e-posten. Vennligst registrer deg først.');
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Feil e-post eller passord. Prøv igjen.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Ugyldig e-postadresse. Vennligst skriv inn en gyldig e-post.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Nettverksfeil. Sjekk internettforbindelsen din.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('E-post/Passord-autentisering er ikke aktivert i Firebase Console. Vennligst aktiver det i Authentication → Sign-in method.');
    }
    throw new Error(error.message || 'Kunne ikke logge inn');
  }
};

/**
 * Register a new user
 */
export const register = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
  phone?: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Create user document in Firestore
    const userData = {
      email,
      name,
      phone: phone || '',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    return {
      id: firebaseUser.uid,
      email,
      name,
      phone,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/Password authentication is not enabled in Firebase Console. Please enable it in Authentication → Sign-in method.');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please use a different email or log in instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password (at least 12 characters with uppercase, lowercase, number, and special character).');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address. Please enter a valid email.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message?.includes('referer') || error.message?.includes('referrer')) {
      throw new Error('Firebase referrer blocking error. Please add localhost:3000 to authorized domains in Firebase Console → Authentication → Settings → Authorized domains, and also add localhost:* to HTTP referrers in Google Cloud Console → APIs & Services → Credentials → Browser key.');
    }
    throw new Error(error.message || 'Failed to register');
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user logged in');
    }

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Get current user data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData.name,
      phone: userData.phone,
      role: userData.role as UserRole,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    return null;
  }
};
