/**
 * Type definitions for iKid application
 * Defines all interfaces and types used throughout the application
 */

// User roles in the system
export enum UserRole {
  PARENT = 'parent',
  STAFF = 'staff',
  ADMIN = 'admin',
}

// Child status for check-in/check-out
export enum ChildStatus {
  NOT_CHECKED_IN = 'not_checked_in',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Child interface
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  parentIds: string[]; // Array of parent user IDs
  photoUrl?: string;
  allergies?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Check-in/Check-out log entry
export interface CheckInOutLog {
  id: string;
  childId: string;
  userId: string; // User who performed the action
  action: 'check_in' | 'check_out';
  timestamp: Date;
  notes?: string;
}

// Calendar event
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  eventType: 'parent_meeting' | 'field_trip' | 'other';
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

// Language options
export type SupportedLanguage = 'no' | 'en' | 'pl';

// Theme mode
export type ThemeMode = 'light' | 'dark' | 'system';
