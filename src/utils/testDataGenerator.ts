/**
 * Test Data Generator
 * Generates fictional test data for development and testing
 * IMPORTANT: All data is fictional and should not be used in production
 */

import { Child, User, UserRole } from '../types';

/**
 * Generate fictional child data
 */
export const generateFictionalChildren = (count: number): Omit<Child, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const firstNames = [
    'Emma', 'Noah', 'Olivia', 'Liam', 'Sofia', 'Erik', 'Maja', 'Oskar',
    'Nora', 'Lucas', 'Sara', 'Filip', 'Ingrid', 'Jakob', 'Hanna', 'Marius'
  ];
  const lastNames = [
    'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen',
    'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Berg', 'Haugen'
  ];

  const children: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const year = 2018 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;

    children.push({
      firstName,
      lastName,
      dateOfBirth: new Date(year, month, day),
      parentIds: [], // Will be linked separately
      allergies: Math.random() > 0.7 ? 'Nøtter, melk' : undefined,
      notes: Math.random() > 0.8 ? 'Liker å tegne og leke utendørs' : undefined,
    });
  }

  return children;
};

/**
 * Generate fictional user data
 */
export const generateFictionalUsers = (count: number, role: UserRole): Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const firstNames = [
    'Kari', 'Ole', 'Anne', 'Per', 'Lisa', 'Tom', 'Maria', 'Jan',
    'Inger', 'Bjørn', 'Liv', 'Stein', 'Gunn', 'Lars', 'Tone', 'Geir'
  ];
  const lastNames = [
    'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen',
    'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Berg', 'Haugen'
  ];

  const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `+47${Math.floor(90000000 + Math.random() * 10000000)}`;

    users.push({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      role,
    });
  }

  return users;
};

