/**
 * Cryptographic utilities for password hashing and encryption
 * Uses Web Crypto API for strong client-side encryption
 * 
 * IMPORTANT: This provides an additional layer of security on top of Firebase Authentication.
 * Firebase already handles password hashing server-side, but this adds client-side hashing
 * for extra security and to ensure passwords are never sent in plain text.
 */

/**
 * Generate a cryptographically secure random salt
 * @param length - Length of salt in bytes (default: 32)
 * @returns Base64 encoded salt
 */
export const generateSalt = async (length: number = 32): Promise<string> => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * Hash a password using PBKDF2 with SHA-256
 * This is a strong, industry-standard key derivation function
 * 
 * @param password - Plain text password
 * @param salt - Salt for hashing (if not provided, generates a new one)
 * @param iterations - Number of iterations (default: 100000, OWASP recommended minimum)
 * @returns Object containing hashed password and salt
 */
export const hashPassword = async (
  password: string,
  salt?: string,
  iterations: number = 100000
): Promise<{ hash: string; salt: string }> => {
  // Generate salt if not provided
  const saltValue = salt || (await generateSalt(32));
  const saltBuffer = Uint8Array.from(atob(saltValue), c => c.charCodeAt(0));

  // Convert password to ArrayBuffer
  const passwordBuffer = new TextEncoder().encode(password);

  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  // Convert to base64 for storage
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return {
    hash: hashBase64,
    salt: saltValue,
  };
};

/**
 * Verify a password against a hash
 * 
 * @param password - Plain text password to verify
 * @param hash - Stored hash to compare against
 * @param salt - Salt used for hashing
 * @param iterations - Number of iterations used (must match original)
 * @returns True if password matches hash
 */
export const verifyPassword = async (
  password: string,
  hash: string,
  salt: string,
  iterations: number = 100000
): Promise<boolean> => {
  try {
    const { hash: computedHash } = await hashPassword(
      password,
      salt,
      iterations
    );
    
    // Constant-time comparison to prevent timing attacks
    return constantTimeEqual(computedHash, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

/**
 * Encrypt sensitive data using AES-GCM
 * 
 * @param data - Data to encrypt (string)
 * @param key - Encryption key (will be derived from password if not provided)
 * @returns Encrypted data as base64 string with IV prepended
 */
export const encryptData = async (
  data: string,
  key?: CryptoKey
): Promise<string> => {
  // Generate IV if not provided
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits for GCM

  // Use provided key or generate from password
  let encryptionKey = key;
  if (!encryptionKey) {
    // Generate a random key for this encryption
    encryptionKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Convert data to ArrayBuffer
  const dataBuffer = new TextEncoder().encode(data);

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    encryptionKey,
    dataBuffer
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Return as base64
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypt data encrypted with encryptData
 * 
 * @param encryptedData - Base64 encoded encrypted data with IV
 * @param key - Decryption key (must match encryption key)
 * @returns Decrypted data as string
 */
export const decryptData = async (
  encryptedData: string,
  key: CryptoKey
): Promise<string> => {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

  // Extract IV (first 12 bytes)
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encrypted
  );

  // Convert to string
  return new TextDecoder().decode(decrypted);
};

/**
 * Generate a secure random token
 * @param length - Length in bytes (default: 32)
 * @returns Base64 encoded token
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, ''); // URL-safe base64
};

