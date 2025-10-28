/**
 * Application Constants
 *
 * Centralized constants for magic numbers, strings, and configuration values.
 * This improves maintainability and reduces duplication.
 */

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

// ============================================
// CONNECTION STATUS
// ============================================

export const CONNECTION_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  DISCONNECTED: 'DISCONNECTED',
} as const;

export type ConnectionStatus = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];

// ============================================
// CONNECTION TYPES
// ============================================

export const CONNECTION_TYPES = {
  PAID_SUBSCRIPTION: 'PAID_SUBSCRIPTION',
  FREE_LISTING: 'FREE_LISTING',
  SELF_REPORTED: 'SELF_REPORTED',
} as const;

export type ConnectionType = typeof CONNECTION_TYPES[keyof typeof CONNECTION_TYPES];

// ============================================
// SERVICE TYPES
// ============================================

export const SERVICE_TYPES = {
  BTCPAY_SERVER: 'BTCPAY_SERVER',
  BLFS: 'BLFS',
  OTHER: 'OTHER',
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [SERVICE_TYPES.BTCPAY_SERVER]: 'BTCPay Server',
  [SERVICE_TYPES.BLFS]: 'BLFS',
  [SERVICE_TYPES.OTHER]: 'Other',
};

// ============================================
// SHOP TYPES
// ============================================

export const SHOP_TYPES = {
  DIGITAL: 'DIGITAL',
  PHYSICAL: 'PHYSICAL',
} as const;

export type ShopType = typeof SHOP_TYPES[keyof typeof SHOP_TYPES];

export const SHOP_TYPE_LABELS: Record<ShopType, string> = {
  [SHOP_TYPES.DIGITAL]: 'Online Store',
  [SHOP_TYPES.PHYSICAL]: 'Physical Shop',
};

// ============================================
// SHOP SOURCES
// ============================================

export const SHOP_SOURCES = {
  LOCAL: 'local',
  BTCMAP: 'btcmap',
} as const;

export type ShopSource = typeof SHOP_SOURCES[keyof typeof SHOP_SOURCES];

// ============================================
// VIEW TYPES (for filtering)
// ============================================

export const VIEW_TYPES = {
  ALL: 'all',
  SHOPS: 'shops',
  INFRASTRUCTURE: 'infrastructure',
} as const;

export type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

// ============================================
// TIME CONSTANTS
// ============================================

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Cookie expiration times
export const COOKIE_MAX_AGE = {
  SESSION: TIME.HOUR * 2, // 2 hours
  REMEMBER_ME: TIME.WEEK, // 7 days
  THEME: TIME.DAY * 365, // 1 year
} as const;

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMIT_WINDOWS = {
  DEFAULT: 15 * TIME.MINUTE, // 15 minutes
  STRICT: TIME.MINUTE, // 1 minute
  RELAXED: TIME.HOUR, // 1 hour
} as const;

export const RATE_LIMIT_MAX_REQUESTS = {
  DEFAULT: 100, // 100 requests per window
  AUTH: 5, // 5 login attempts
  API_WRITE: 20, // 20 writes per window
  API_READ: 100, // 100 reads per window
} as const;

// ============================================
// DEBOUNCE DELAYS
// ============================================

export const DEBOUNCE_DELAYS = {
  SEARCH: 300, // 300ms for search input
  FILTER: 200, // 200ms for filter changes
  RESIZE: 150, // 150ms for window resize
} as const;

// ============================================
// HTTP STATUS CODES
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  // Authentication
  NOT_AUTHENTICATED: 'Not authenticated',
  NOT_AUTHORIZED: 'Not authorized',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Session expired',

  // Validation
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_URL: 'Invalid URL format',

  // Resources
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists',

  // Operations
  OPERATION_FAILED: 'Operation failed',
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',

  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',

  // Specific
  SHOP_NOT_FOUND: 'Shop not found',
  PROVIDER_NOT_FOUND: 'Infrastructure provider not found',
  CONNECTION_FAILED: 'Failed to establish connection',
  PAYMENT_FAILED: 'Payment processing failed',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  CONNECTION_ESTABLISHED: 'Connection established successfully',
  PAYMENT_PROCESSED: 'Payment processed successfully',
} as const;

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  URL_MAX_LENGTH: 500,
  EMAIL_MAX_LENGTH: 255,
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURES = {
  ENABLE_BTCMAP: true,
  ENABLE_NWC_PAYMENTS: true,
  ENABLE_RATE_LIMITING: true,
  ENABLE_ANALYTICS: false, // TODO: Implement analytics
} as const;

// ============================================
// ENVIRONMENT
// ============================================

export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
