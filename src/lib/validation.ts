import { NextRequest } from 'next/server';

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateField(value: unknown, rules: ValidationRule): ValidationResult {
  const errors: Record<string, string> = {};

  // Check if required
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.required = 'This field is required';
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return { isValid: true, errors };
  }

  const stringValue = String(value);

  // Type validation
  if (rules.type) {
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.type = 'Must be a string';
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          errors.type = 'Must be a number';
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && !['true', 'false', '0', '1'].includes(stringValue)) {
          errors.type = 'Must be a boolean';
        }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(stringValue)) {
          errors.type = 'Must be a valid email address';
        }
        break;
      case 'url':
        try {
          new URL(stringValue);
        } catch {
          errors.type = 'Must be a valid URL';
        }
        break;
    }
  }

  // Length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.minLength = `Must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.maxLength = `Must be no more than ${rules.maxLength} characters`;
  }

  // Numeric range validation
  if (rules.min !== undefined && Number(value) < rules.min) {
    errors.min = `Must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    errors.max = `Must be no more than ${rules.max}`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.pattern = 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.custom = customError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateForm(data: Record<string, unknown>, schema: Record<string, ValidationRule>): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const fieldResult = validateField(data[field], rules);
    if (!fieldResult.isValid) {
      errors[field] = Object.values(fieldResult.errors)[0]; // Take first error
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Predefined validation schemas
export const authValidationSchema = {
  username: {
    required: true,
    type: 'string' as const,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  password: {
    required: true,
    type: 'string' as const,
    minLength: 6,
    maxLength: 100
  }
};

export const registerValidationSchema = {
  username: {
    required: true,
    type: 'string' as const,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    custom: (value: unknown) => {
      const username = String(value);
      if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'root') {
        return 'Username not allowed';
      }
      return null;
    }
  },
  password: {
    required: true,
    type: 'string' as const,
    minLength: 6,
    maxLength: 100,
    custom: (value: unknown) => {
      const password = String(value);
      if (password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    }
  }
};

export const serverValidationSchema = {
  name: {
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 100
  },
  host_url: {
    required: true,
    type: 'url' as const,
    custom: (value: unknown) => {
      const url = String(value);
      if (!url.startsWith('https://')) {
        return 'Host URL must use HTTPS';
      }
      return null;
    }
  },
  api_key: {
    required: true,
    type: 'string' as const,
    minLength: 10,
    maxLength: 200
  },
  description: {
    required: false,
    type: 'string' as const,
    maxLength: 500
  },
  is_public: {
    required: true,
    type: 'boolean' as const
  },
  slots_available: {
    required: true,
    type: 'number' as const,
    min: 1,
    max: 1000,
    custom: (value: unknown) => {
      const slots = Number(value);
      if (slots <= 0) {
        return 'Slots available must be greater than 0';
      }
      if (slots > 1000) {
        return 'Slots available cannot exceed 1000';
      }
      return null;
    }
  },
  lightning_address: {
    required: true,
    type: 'string' as const,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    custom: (value: unknown) => {
      const address = String(value);
      if (!address.includes('@')) {
        return 'Lightning address must be in format: username@domain.com';
      }
      return null;
    }
  }
};

export const shopValidationSchema = {
  name: {
    required: true,
    type: 'string' as const,
    minLength: 1,
    maxLength: 100
  },
  lightning_address: {
    required: false,
    type: 'string' as const,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    custom: (value: unknown) => {
      if (!value) return null; // Optional field
      const address = String(value);
      if (!address.includes('@')) {
        return 'Lightning address must be in format: username@domain.com';
      }
      return null;
    }
  },
  server_id: {
    required: true,
    type: 'number' as const,
    min: 1
  }
};

export const subscriptionValidationSchema = {
  shop_id: {
    required: true,
    type: 'number' as const,
    min: 1
  },
  amount_sats: {
    required: true,
    type: 'number' as const,
    min: 1,
    max: 1000000000, // 1 billion sats max
    custom: (value: unknown) => {
      const amount = Number(value);
      if (amount <= 0) {
        return 'Amount must be greater than 0';
      }
      if (amount > 1000000000) {
        return 'Amount cannot exceed 1 billion sats';
      }
      return null;
    }
  },
  interval: {
    required: true,
    type: 'string' as const,
    custom: (value: unknown) => {
      const validIntervals = ['daily', 'weekly', 'monthly', 'yearly'];
      if (!validIntervals.includes(String(value))) {
        return 'Interval must be one of: daily, weekly, monthly, yearly';
      }
      return null;
    }
  }
};

// API route validation helper
export async function validateApiRequest(
  request: NextRequest, 
  schema: Record<string, ValidationRule>
): Promise<{ isValid: boolean; data: Record<string, unknown>; errors: Record<string, string> }> {
  try {
    const body = await request.json();
    const validation = validateForm(body, schema);
    
    return {
      isValid: validation.isValid,
      data: body,
      errors: validation.errors
    };
  } catch {
    return {
      isValid: false,
      data: {},
      errors: { body: 'Invalid JSON in request body' }
    };
  }
}

// Sanitize input to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

// Validate and sanitize numeric input
export function validateAndSanitizeNumber(input: unknown, min?: number, max?: number): number | null {
  const num = Number(input);
  if (isNaN(num)) return null;
  if (min !== undefined && num < min) return null;
  if (max !== undefined && num > max) return null;
  return num;
}

// Validate Lightning address format
export function validateLightningAddress(address: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(address);
}

// Validate BTCPay Server URL
export function validateBTCPayUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
} 