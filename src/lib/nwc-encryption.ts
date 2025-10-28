import crypto from 'crypto';
import { logger } from './logger';

/**
 * NWC Connection String Encryption Service
 * 
 * This service provides secure encryption/decryption for NWC connection strings
 * which contain sensitive wallet access credentials.
 * 
 * Security Features:
 * - AES-256-GCM encryption (authenticated encryption)
 * - Random IV for each encryption
 * - HMAC-based authentication
 * - Environment-based encryption keys
 */

interface EncryptedNWCData {
  encrypted: string;
  iv: string;
  authTag: string;
  salt: string;
}

class NWCEncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 32; // 256 bits
  private readonly tagLength = 16; // 128 bits

  /**
   * Derive encryption key from environment variable and salt
   */
  private deriveKey(salt: Buffer): Buffer {
    const masterKey = process.env.NWC_ENCRYPTION_KEY || process.env.SESSION_SECRET;
    
    if (!masterKey) {
      throw new Error('NWC_ENCRYPTION_KEY or SESSION_SECRET environment variable is required');
    }

    if (masterKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters long');
    }

    return crypto.pbkdf2Sync(masterKey, salt, 100000, this.keyLength, 'sha512');
  }

  /**
   * Encrypt NWC connection string
   */
  encrypt(nwcConnectionString: string): EncryptedNWCData {
    try {
      // Validate NWC connection string format
      if (!this.isValidNWCConnectionString(nwcConnectionString)) {
        throw new Error('Invalid NWC connection string format');
      }

      // Generate random salt and IV
      const salt = crypto.randomBytes(this.saltLength);
      const iv = crypto.randomBytes(this.ivLength);

      // Derive encryption key
      const key = this.deriveKey(salt);

      // Create cipher with explicit IV
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      cipher.setAAD(Buffer.from('nwc-bitinfrashop', 'utf8'));

      // Encrypt the data
      let encrypted = cipher.update(nwcConnectionString, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get authentication tag
      const authTag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        salt: salt.toString('hex')
      };
    } catch (error) {
      logger.error('NWC encryption failed', error, {
        operation: 'encrypt',
        algorithm: this.algorithm,
      });
      throw new Error('Failed to encrypt NWC connection string');
    }
  }

  /**
   * Decrypt NWC connection string
   */
  decrypt(encryptedData: EncryptedNWCData): string {
    try {
      // Reconstruct buffers
      const salt = Buffer.from(encryptedData.salt, 'hex');
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const authTag = Buffer.from(encryptedData.authTag, 'hex');

      // Derive the same encryption key
      const key = this.deriveKey(salt);

      // Create decipher with explicit IV
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAAD(Buffer.from('nwc-bitinfrashop', 'utf8'));
      decipher.setAuthTag(authTag);

      // Decrypt the data
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Validate decrypted NWC connection string
      if (!this.isValidNWCConnectionString(decrypted)) {
        throw new Error('Decrypted data is not a valid NWC connection string');
      }

      return decrypted;
    } catch (error) {
      logger.error('NWC decryption failed', error, {
        operation: 'decrypt',
        algorithm: this.algorithm,
      });
      throw new Error('Failed to decrypt NWC connection string');
    }
  }

  /**
   * Validate NWC connection string format
   */
  private isValidNWCConnectionString(connectionString: string): boolean {
    // Basic validation for NWC connection string format
    // Should start with nostr+walletconnect:// or similar
    const nwcPattern = /^nostr\+walletconnect:\/\/[a-zA-Z0-9+/=]+$/;
    return nwcPattern.test(connectionString);
  }

  /**
   * Generate a secure random encryption key (for environment setup)
   */
  static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash NWC connection string for storage (one-way, for validation)
   */
  static hashNWCConnectionString(connectionString: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(connectionString, salt, 10000, 64, 'sha512');
    return `${salt}:${hash.toString('hex')}`;
  }

  /**
   * Verify NWC connection string against hash
   */
  static verifyNWCConnectionString(connectionString: string, hash: string): boolean {
    try {
      const [salt, hashHex] = hash.split(':');
      const computedHash = crypto.pbkdf2Sync(connectionString, salt, 10000, 64, 'sha512');
      return computedHash.toString('hex') === hashHex;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const nwcEncryption = new NWCEncryptionService();

// Export class for testing
export { NWCEncryptionService };

// Export types
export type { EncryptedNWCData };
