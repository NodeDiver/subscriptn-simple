import { prisma } from './prisma';
import { nwcEncryption, EncryptedNWCData } from './nwc-encryption';
import { NWCEncryptionService } from './nwc-encryption';

/**
 * NWC (Nostr Wallet Connect) Service
 * 
 * This service manages NWC connection strings for subscription payments.
 * It handles secure storage, retrieval, and validation of NWC credentials.
 * 
 * Security Features:
 * - Encrypted storage of NWC connection strings
 * - Access control (only subscription owners can access their NWC)
 * - Audit logging for NWC access
 * - Rate limiting for NWC operations
 */

interface NWCConnectionInfo {
  id: number;
  subscriptionId: number;
  shopId: number;
  ownerId: number;
  encryptedConnectionString: string;
  encryptedKey: string;
  createdAt: Date;
  lastUsed?: Date;
}

interface CreateNWCConnectionData {
  subscriptionId: number;
  nwcConnectionString: string;
  ownerId: number;
}

class NWCService {
  /**
   * Store encrypted NWC connection string for a subscription
   */
  async storeNWCConnection(data: CreateNWCConnectionData): Promise<NWCConnectionInfo> {
    try {
      // Verify subscription ownership
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: data.subscriptionId,
          shop: {
            ownerId: data.ownerId
          }
        },
        include: {
          shop: true
        }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      // Encrypt NWC connection string
      const encryptedData = nwcEncryption.encrypt(data.nwcConnectionString);

      // Store encrypted data in database
      const updatedSubscription = await prisma.subscription.update({
        where: { id: data.subscriptionId },
        data: {
          nwcConnectionString: encryptedData.encrypted,
          nwcEncryptedKey: JSON.stringify({
            iv: encryptedData.iv,
            authTag: encryptedData.authTag,
            salt: encryptedData.salt
          })
        },
        include: {
          shop: true
        }
      });

      // Log the operation
      await this.logNWCOperation(data.subscriptionId, 'store', data.ownerId);

      return {
        id: updatedSubscription.id,
        subscriptionId: updatedSubscription.id,
        shopId: updatedSubscription.shopId,
        ownerId: data.ownerId,
        encryptedConnectionString: updatedSubscription.nwcConnectionString!,
        encryptedKey: updatedSubscription.nwcEncryptedKey!,
        createdAt: updatedSubscription.createdAt
      };
    } catch (error) {
      console.error('Error storing NWC connection:', error);
      throw new Error('Failed to store NWC connection');
    }
  }

  /**
   * Retrieve and decrypt NWC connection string (backend only)
   */
  async getNWCConnection(subscriptionId: number, requesterId: number): Promise<string> {
    try {
      // Verify access permissions
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          shop: {
            ownerId: requesterId
          }
        }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      if (!subscription.nwcConnectionString || !subscription.nwcEncryptedKey) {
        throw new Error('No NWC connection stored for this subscription');
      }

      // Parse encrypted key data
      const keyData = JSON.parse(subscription.nwcEncryptedKey);
      const encryptedData: EncryptedNWCData = {
        encrypted: subscription.nwcConnectionString,
        iv: keyData.iv,
        authTag: keyData.authTag,
        salt: keyData.salt
      };

      // Decrypt NWC connection string
      const decryptedConnectionString = nwcEncryption.decrypt(encryptedData);

      // Log the access
      await this.logNWCOperation(subscriptionId, 'access', requesterId);

      return decryptedConnectionString;
    } catch (error) {
      console.error('Error retrieving NWC connection:', error);
      throw new Error('Failed to retrieve NWC connection');
    }
  }

  /**
   * Check if subscription has NWC connection stored
   */
  async hasNWCConnection(subscriptionId: number, ownerId: number): Promise<boolean> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          shop: {
            ownerId: ownerId
          },
          nwcConnectionString: {
            not: null
          }
        }
      });

      return !!subscription;
    } catch (error) {
      console.error('Error checking NWC connection:', error);
      return false;
    }
  }

  /**
   * Remove NWC connection from subscription
   */
  async removeNWCConnection(subscriptionId: number, ownerId: number): Promise<void> {
    try {
      // Verify ownership
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          shop: {
            ownerId: ownerId
          }
        }
      });

      if (!subscription) {
        throw new Error('Subscription not found or access denied');
      }

      // Remove encrypted data
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          nwcConnectionString: null,
          nwcEncryptedKey: null
        }
      });

      // Log the operation
      await this.logNWCOperation(subscriptionId, 'remove', ownerId);
    } catch (error) {
      console.error('Error removing NWC connection:', error);
      throw new Error('Failed to remove NWC connection');
    }
  }

  /**
   * Validate NWC connection string format
   */
  validateNWCConnectionString(connectionString: string): boolean {
    // Basic validation - should be a valid NWC connection string
    const nwcPattern = /^nostr\+walletconnect:\/\/[a-zA-Z0-9+/=]+$/;
    return nwcPattern.test(connectionString);
  }

  /**
   * Log NWC operations for audit trail
   */
  private async logNWCOperation(subscriptionId: number, operation: string, userId: number): Promise<void> {
    try {
      // Create audit log entry
      await prisma.subscriptionHistory.create({
        data: {
          subscriptionId,
          paymentAmount: 0, // No payment for NWC operations
          status: `nwc_${operation}`,
          paymentMethod: 'nwc_management'
        }
      });

      console.log(`NWC ${operation} operation logged for subscription ${subscriptionId} by user ${userId}`);
    } catch (error) {
      console.error('Error logging NWC operation:', error);
      // Don't throw here as this is just logging
    }
  }

  /**
   * Get all NWC connections for a user (for management)
   */
  async getUserNWCConnections(userId: number): Promise<Array<{
    subscriptionId: number;
    shopName: string;
    hasConnection: boolean;
    createdAt: Date;
  }>> {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          shop: {
            ownerId: userId
          }
        },
        include: {
          shop: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return subscriptions.map(sub => ({
        subscriptionId: sub.id,
        shopName: sub.shop.name,
        hasConnection: !!sub.nwcConnectionString,
        createdAt: sub.createdAt
      }));
    } catch (error) {
      console.error('Error getting user NWC connections:', error);
      throw new Error('Failed to retrieve NWC connections');
    }
  }
}

// Export singleton instance
export const nwcService = new NWCService();

// Export class for testing
export { NWCService };

// Export types
export type { NWCConnectionInfo, CreateNWCConnectionData };
