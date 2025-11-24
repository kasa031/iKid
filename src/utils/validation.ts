/**
 * Validation utilities
 * Common validation functions used throughout the app
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password strength requirements
 */
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-4 (0 = weak, 4 = very strong)
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  feedback: string[];
}

/**
 * Validate password strength with detailed feedback
 * Strong password requirements:
 * - Minimum 12 characters (OWASP recommendation)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePasswordStrength = (
  password: string
): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const feedback: string[] = [];
  let score = 0;

  if (requirements.minLength) {
    score++;
  } else {
    feedback.push('Passord må være minst 12 tegn');
  }

  if (requirements.hasUpperCase) {
    score++;
  } else {
    feedback.push('Passord må inneholde minst én stor bokstav');
  }

  if (requirements.hasLowerCase) {
    score++;
  } else {
    feedback.push('Passord må inneholde minst én liten bokstav');
  }

  if (requirements.hasNumber) {
    score++;
  } else {
    feedback.push('Passord må inneholde minst ett tall');
  }

  if (requirements.hasSpecialChar) {
    score++;
  } else {
    feedback.push('Passord må inneholde minst ett spesialtegn');
  }

  // Bonus for length
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;

  // Cap at 4
  score = Math.min(score, 4);

  const isValid =
    requirements.minLength &&
    requirements.hasUpperCase &&
    requirements.hasLowerCase &&
    requirements.hasNumber &&
    requirements.hasSpecialChar;

  return {
    isValid,
    score,
    requirements,
    feedback,
  };
};

/**
 * Validate password strength (simple boolean check)
 * For development/testing: minimum 8 characters
 * For production: should use validatePasswordStrength for stronger requirements
 */
export const isValidPassword = (password: string): boolean => {
  // Minimum 8 characters for basic validation
  // For stronger validation, use validatePasswordStrength directly
  return password.length >= 8;
};

/**
 * Validate phone number (Norwegian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+47|0047)?[2-9]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 */
export const isRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

/**
 * Validate date
 */
export const isValidDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d instanceof Date && !isNaN(d.getTime());
};
