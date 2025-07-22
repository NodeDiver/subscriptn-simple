import { LightningAddress, Invoice } from "@getalby/lightning-tools";

export interface LightningInvoice {
  paymentRequest: string;
  amount: number;
  description: string;
  expiresAt: Date;
  paymentHash?: string;
}

export interface PaymentResult {
  success: boolean;
  preimage?: string;
  error?: string;
}

export class LightningService {
  private static instance: LightningService;
  private connectedWallet: { provider?: unknown } | null = null;

  static getInstance(): LightningService {
    if (!LightningService.instance) {
      LightningService.instance = new LightningService();
    }
    return LightningService.instance;
  }

  setConnectedWallet(walletInfo: { provider?: unknown }) {
    this.connectedWallet = walletInfo;
    console.log('Lightning service: Wallet connected', walletInfo);
  }

  clearConnectedWallet() {
    this.connectedWallet = null;
    console.log('Lightning service: Wallet disconnected');
  }

  async generateInvoice(
    amountSats: number, 
    description: string, 
    recipientAddress: string
  ): Promise<LightningInvoice> {
    try {
      console.log('Generating Lightning invoice:', {
        amountSats,
        description,
        recipientAddress
      });

      // Validate Lightning address format
      if (!recipientAddress || !recipientAddress.includes('@')) {
        throw new Error('Invalid Lightning address format. Expected format: username@domain.com');
      }

      // Create Lightning address instance
      const ln = new LightningAddress(recipientAddress);
      
      console.log('Fetching Lightning address data...');
      await ln.fetch();
      console.log('Lightning address data fetched successfully');

      // Request invoice from the Lightning address
      console.log('Requesting invoice...');
      const invoice = await ln.requestInvoice({ 
        satoshi: amountSats,
        comment: description 
      });
      console.log('Invoice generated successfully:', invoice.paymentRequest);

      return {
        paymentRequest: invoice.paymentRequest,
        amount: amountSats,
        description,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        paymentHash: invoice.paymentHash
      };
    } catch (error) {
      console.error('Error generating Lightning invoice:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error(`Failed to fetch Lightning address data for ${recipientAddress}. Please check if the address is valid and accessible.`);
        } else if (error.message.includes('invoice')) {
          throw new Error(`Failed to generate invoice from ${recipientAddress}. The Lightning address might not support invoice generation.`);
        } else {
          throw new Error(`Failed to generate Lightning invoice: ${error.message}`);
        }
      }
      
      throw new Error(`Failed to generate Lightning invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendPayment(
    paymentRequest: string, 
    amountSats: number
  ): Promise<PaymentResult> {
    try {
      if (!this.connectedWallet) {
        throw new Error('No wallet connected');
      }

      console.log('Sending Lightning payment:', {
        paymentRequest,
        amountSats,
        walletInfo: this.connectedWallet
      });

      // Check if WebLN is available
      if (typeof window !== 'undefined' && window.webln) {
        try {
          // Enable WebLN
          await window.webln.enable();
          
          // Send payment using WebLN
          const response = await window.webln.sendPayment(paymentRequest);
          
          console.log('WebLN payment response:', response);
          
          return {
            success: true,
            preimage: response.preimage
          };
        } catch (weblnError) {
          console.error('WebLN payment failed:', weblnError);
          throw new Error(`WebLN payment failed: ${weblnError instanceof Error ? weblnError.message : 'Unknown error'}`);
        }
      } else {
        throw new Error('WebLN not available - please connect a Lightning wallet');
      }
    } catch (error) {
      console.error('Error sending Lightning payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  async payInvoice(
    amountSats: number,
    description: string,
    recipientAddress: string
  ): Promise<PaymentResult> {
    try {
      console.log('Processing Lightning payment:', {
        amountSats,
        description,
        recipientAddress
      });

      // Generate invoice
      const invoice = await this.generateInvoice(amountSats, description, recipientAddress);
      
      // Send payment
      const result = await this.sendPayment(invoice.paymentRequest, amountSats);
      
      if (result.success && result.preimage) {
        // Verify the payment using the lightning-tools library
        const invoiceInstance = new Invoice({ 
          pr: invoice.paymentRequest, 
          preimage: result.preimage 
        });
        
        const isValid = invoiceInstance.validatePreimage(result.preimage);
        if (!isValid) {
          return {
            success: false,
            error: 'Payment verification failed'
          };
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error paying invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  async verifyPayment(
    paymentRequest: string,
    preimage: string
  ): Promise<boolean> {
    try {
      const invoice = new Invoice({ pr: paymentRequest, preimage });
      return invoice.validatePreimage(preimage);
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  // Check if wallet supports specific capabilities
  supportsFeature(feature: string): boolean {
    if (!this.connectedWallet) return false;
    
    // For now, assume all connected wallets support basic features
    // In a real implementation, you'd check the actual wallet capabilities
    switch (feature) {
      case 'makeInvoice':
        return true;
      case 'sendPayment':
        return true;
      case 'getBalance':
        return true;
      default:
        return false;
    }
  }

  // Get wallet balance (if supported)
  async getBalance(): Promise<number | null> {
    try {
      if (!this.connectedWallet || !this.supportsFeature('getBalance')) {
        return null;
      }

      if (typeof window !== 'undefined' && window.webln) {
        try {
          await window.webln.enable();
          const balance = await window.webln.getBalance();
          return balance.balance;
        } catch (error) {
          console.error('Error getting WebLN balance:', error);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return null;
    }
  }

  // Check if WebLN is available
  isWebLNAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.webln;
  }

  // Get Lightning address info
  async getLightningAddressInfo(address: string) {
    try {
      const ln = new LightningAddress(address);
      await ln.fetch();
      return {
        address: ln.address,
        keysendData: ln.keysendData,
        lnurlpData: ln.lnurlpData
      };
    } catch (error) {
      console.error('Error fetching Lightning address info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const lightningService = LightningService.getInstance();

// Add WebLN types to global window object
declare global {
  interface Window {
    webln?: {
      enable(): Promise<void>;
      sendPayment(paymentRequest: string): Promise<{ preimage: string }>;
      getBalance(): Promise<{ balance: number }>;
    };
  }
} 