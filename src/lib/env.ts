import { z } from 'zod';

/**
 * Environment Variable Validation Schema
 *
 * This ensures all required environment variables are present and valid
 * at application startup, preventing runtime errors.
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Security
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters for security'),

  NWC_ENCRYPTION_KEY: z
    .string()
    .length(64, 'NWC_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)')
    .regex(/^[0-9a-f]{64}$/i, 'NWC_ENCRYPTION_KEY must contain only hex characters'),

  // NextAuth
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters for security'),

  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL')
    .default('http://localhost:3000'),

  // OAuth (Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Demo Credentials (Optional - for development)
  DEMO_PROVIDER_USERNAME: z.string().optional(),
  DEMO_PROVIDER_PASSWORD: z.string().optional(),
  DEMO_SHOP_OWNER_USERNAME: z.string().optional(),
  DEMO_SHOP_OWNER_PASSWORD: z.string().optional(),

  // Runtime
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 *
 * Throws an error with detailed information if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n');

      throw new Error(
        `❌ Environment variable validation failed:\n\n${missingVars}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for reference.`
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Safe to use throughout the application
 */
export const env = validateEnv();
