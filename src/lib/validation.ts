export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true, errors: [] };
  }

  const stringValue = value.toString();

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('Invalid format');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateForm(data: Record<string, any>, schema: Record<string, ValidationRule>): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const fieldValidation = validateField(data[field], rules);
    if (!fieldValidation.isValid) {
      isValid = false;
      errors.push(`${field}: ${fieldValidation.errors.join(', ')}`);
    }
  }

  return { isValid, errors };
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  lightningAddress: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  positiveNumber: /^[1-9]\d*$/,
};

// Common validation rules
export const VALIDATION_RULES = {
  required: { required: true },
  email: { required: true, pattern: VALIDATION_PATTERNS.email },
  url: { required: true, pattern: VALIDATION_PATTERNS.url },
  lightningAddress: { required: true, pattern: VALIDATION_PATTERNS.lightningAddress },
  positiveNumber: { required: true, pattern: VALIDATION_PATTERNS.positiveNumber },
  serverName: { required: true, minLength: 2, maxLength: 50 },
  shopName: { required: true, minLength: 2, maxLength: 100 },
  amount: { 
    required: true, 
    custom: (value: any) => {
      const num = parseInt(value);
      if (isNaN(num) || num <= 0) {
        return 'Amount must be a positive number';
      }
      if (num > 1000000) {
        return 'Amount cannot exceed 1,000,000 sats';
      }
      return null;
    }
  },
}; 