export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validates a phone number (US format)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Phone is optional
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number must contain only digits' };
  }

  // Check length (10 digits for US, 11 if includes country code)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

/**
 * Validates required text field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

/**
 * Validates text length
 */
export function validateLength(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates name field (first name, last name)
 */
export function validateName(name: string, fieldName: string): ValidationResult {
  const required = validateRequired(name, fieldName);
  if (!required.isValid) {
    return required;
  }

  const length = validateLength(name, 2, 50, fieldName);
  if (!length.isValid) {
    return length;
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true };
}

/**
 * Validates comments/textarea field
 */
export function validateComments(comments: string): ValidationResult {
  if (!comments || comments.trim() === '') {
    return { isValid: true }; // Comments are optional
  }

  const length = validateLength(comments, 0, 1000, 'Comments');
  return length;
}

