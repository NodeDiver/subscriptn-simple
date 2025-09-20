import crypto from 'crypto';
import { NextRequest } from 'next/server';

/**
 * NWC Security Middleware
 * 
 * This module provides additional security measures for NWC operations:
 * - Rate limiting for NWC operations
 * - IP-based restrictions
 * - Request signing and validation
 * - Audit logging
 */

interface SecurityConfig {
  maxNWCOperationsPerHour: number;
  maxNWCOperationsPerDay: number;
  allowedIPs?: string[];
  requireRequestSigning: boolean;
}

class NWCSecurityService {
  private readonly defaultConfig: SecurityConfig = {
    maxNWCOperationsPerHour: 10,
    maxNWCOperationsPerDay: 50,
    requireRequestSigning: false // Set to true in production
  };

  private readonly operationCounts = new Map<string, {
    hourly: { count: number; resetTime: number };
    daily: { count: number; resetTime: number };
  }>();

  /**
   * Check if request is allowed based on rate limits and IP restrictions
   */
  async checkRequestSecurity(
    request: NextRequest,
    operation: 'store' | 'access' | 'remove' | 'payment',
    userId?: number
  ): Promise<{
    allowed: boolean;
    reason?: string;
    remainingOperations?: { hourly: number; daily: number };
  }> {
    try {
      const clientIP = this.getClientIP(request);
      const userKey = userId ? `user_${userId}` : `ip_${clientIP}`;

      // Check IP restrictions
      if (!this.isIPAllowed(clientIP)) {
        return {
          allowed: false,
          reason: 'IP address not allowed'
        };
      }

      // Check rate limits
      const rateLimitResult = this.checkRateLimit(userKey, operation);
      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          reason: rateLimitResult.reason,
          remainingOperations: rateLimitResult.remaining
        };
      }

      // Check request signing (if enabled)
      if (this.defaultConfig.requireRequestSigning) {
        const signingResult = this.validateRequestSignature(request);
        if (!signingResult.valid) {
          return {
            allowed: false,
            reason: 'Invalid request signature'
          };
        }
      }

      // Log the operation
      await this.logSecurityOperation(operation, userId, clientIP, true);

      return {
        allowed: true,
        remainingOperations: rateLimitResult.remaining
      };

    } catch (error) {
      console.error('Security check error:', error);
      return {
        allowed: false,
        reason: 'Security check failed'
      };
    }
  }

  /**
   * Get client IP address from request
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const remoteAddr = request.headers.get('x-remote-addr');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || remoteAddr || 'unknown';
  }

  /**
   * Check if IP address is allowed
   */
  private isIPAllowed(ip: string): boolean {
    // In production, implement IP whitelist/blacklist
    // For now, allow all IPs
    return true;
  }

  /**
   * Check rate limits for NWC operations
   */
  private checkRateLimit(
    userKey: string,
    operation: string
  ): {
    allowed: boolean;
    reason?: string;
    remaining?: { hourly: number; daily: number };
  } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;

    // Get or create user operation counts
    if (!this.operationCounts.has(userKey)) {
      this.operationCounts.set(userKey, {
        hourly: { count: 0, resetTime: now + oneHour },
        daily: { count: 0, resetTime: now + oneDay }
      });
    }

    const counts = this.operationCounts.get(userKey)!;

    // Reset counters if time has passed
    if (now > counts.hourly.resetTime) {
      counts.hourly.count = 0;
      counts.hourly.resetTime = now + oneHour;
    }
    if (now > counts.daily.resetTime) {
      counts.daily.count = 0;
      counts.daily.resetTime = now + oneDay;
    }

    // Check limits
    const hourlyLimit = this.getOperationLimit(operation, 'hourly');
    const dailyLimit = this.getOperationLimit(operation, 'daily');

    if (counts.hourly.count >= hourlyLimit) {
      return {
        allowed: false,
        reason: `Hourly limit exceeded (${hourlyLimit} operations per hour)`,
        remaining: {
          hourly: 0,
          daily: Math.max(0, dailyLimit - counts.daily.count)
        }
      };
    }

    if (counts.daily.count >= dailyLimit) {
      return {
        allowed: false,
        reason: `Daily limit exceeded (${dailyLimit} operations per day)`,
        remaining: {
          hourly: Math.max(0, hourlyLimit - counts.hourly.count),
          daily: 0
        }
      };
    }

    // Increment counters
    counts.hourly.count++;
    counts.daily.count++;

    return {
      allowed: true,
      remaining: {
        hourly: hourlyLimit - counts.hourly.count,
        daily: dailyLimit - counts.daily.count
      }
    };
  }

  /**
   * Get operation limit based on type and timeframe
   */
  private getOperationLimit(operation: string, timeframe: 'hourly' | 'daily'): number {
    const limits = {
      store: { hourly: 5, daily: 20 },
      access: { hourly: 10, daily: 50 },
      remove: { hourly: 5, daily: 20 },
      payment: { hourly: 20, daily: 100 }
    };

    return limits[operation as keyof typeof limits]?.[timeframe] || 1;
  }

  /**
   * Validate request signature (if signing is enabled)
   */
  private validateRequestSignature(request: NextRequest): { valid: boolean; reason?: string } {
    // In production, implement request signing validation
    // For now, always return valid
    return { valid: true };
  }

  /**
   * Log security operations for audit
   */
  private async logSecurityOperation(
    operation: string,
    userId?: number,
    ip?: string,
    success: boolean = true
  ): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        userId,
        ip,
        success,
        userAgent: 'unknown' // Would extract from request in real implementation
      };

      // In production, log to secure audit system
      console.log('🔒 NWC Security Operation:', logEntry);
    } catch (error) {
      console.error('Error logging security operation:', error);
    }
  }

  /**
   * Generate secure token for NWC operations
   */
  generateSecureToken(userId: number, operation: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(16).toString('hex');
    const data = `${userId}:${operation}:${timestamp}:${random}`;
    
    const secret = process.env.NWC_SECURITY_SECRET || process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error('NWC_SECURITY_SECRET not configured');
    }

    const signature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    return Buffer.from(`${data}:${signature}`).toString('base64');
  }

  /**
   * Validate secure token
   */
  validateSecureToken(token: string, userId: number, operation: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [userIdStr, op, timestamp, random, signature] = decoded.split(':');
      
      if (parseInt(userIdStr) !== userId || op !== operation) {
        return false;
      }

      // Check token age (max 1 hour)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 60 * 60 * 1000) {
        return false;
      }

      // Validate signature
      const data = `${userIdStr}:${op}:${timestamp}:${random}`;
      const secret = process.env.NWC_SECURITY_SECRET || process.env.SESSION_SECRET;
      
      if (!secret) {
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Sanitize NWC connection string for logging (remove sensitive parts)
   */
  sanitizeNWCConnectionString(connectionString: string): string {
    try {
      const url = new URL(connectionString);
      // Keep only the protocol and host, remove sensitive parts
      return `${url.protocol}//${url.host}${url.pathname}`;
    } catch (error) {
      return 'invalid_connection_string';
    }
  }

  /**
   * Clean up old rate limit data
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, counts] of this.operationCounts.entries()) {
      if (now > counts.daily.resetTime) {
        this.operationCounts.delete(key);
      }
    }
  }
}

// Export singleton instance
export const nwcSecurity = new NWCSecurityService();

// Export class for testing
export { NWCSecurityService };

// Export types
export type { SecurityConfig };

// Cleanup rate limit data every hour
setInterval(() => {
  nwcSecurity.cleanup();
}, 60 * 60 * 1000);
