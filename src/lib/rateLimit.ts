interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.store[identifier];

    // Clean up expired records
    if (record && now > record.resetTime) {
      delete this.store[identifier];
    }

    // If no record exists, create one
    if (!this.store[identifier]) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    // Check if within limit
    if (this.store[identifier].count < this.config.maxRequests) {
      this.store[identifier].count++;
      return true;
    }

    return false;
  }

  getRemainingTime(identifier: string): number {
    const record = this.store[identifier];
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }

  // Clean up old records (call this periodically)
  cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Create rate limiters for different endpoints
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});

export const webhookRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 webhook calls per minute
});

export const shopRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 shop operations per minute
});

export const subscriptionRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 subscription operations per minute
});

export const serverRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 15, // 15 server operations per minute
});

// Clean up old records every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup();
  apiRateLimiter.cleanup();
  webhookRateLimiter.cleanup();
  shopRateLimiter.cleanup();
  subscriptionRateLimiter.cleanup();
  serverRateLimiter.cleanup();
}, 5 * 60 * 1000); 