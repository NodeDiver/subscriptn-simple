"use client";

import React, { useState } from 'react';
import { useBitcoinConnectContext } from '@/contexts/BitcoinConnectContext';
import { useToast } from '@/contexts/ToastContext';
import { lightningService } from '@/lib/lightning';
import ConnectWalletButton from './ConnectWalletButton';
import { useBitcoinConnectHandlers } from '@/contexts/BitcoinConnectContext';
import PaymentSuccessModal from './PaymentSuccessModal';
import { LightningLoadingSpinner } from './LoadingSpinner';

interface LightningSubscriptionProps {
  shopId: string;
  amountSats: number;
  interval: string;
  recipientAddress: string;
  comment?: string;
  onSuccess?: (subscriptionId: string) => void;
  onCancel?: () => void;
}

export default function LightningSubscription({
  shopId,
  amountSats,
  interval,
  recipientAddress,
  comment = '',
  onSuccess,
  onCancel
}: LightningSubscriptionProps) {
  const { isConnected, connect, info } = useBitcoinConnectContext();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { onConnect, onDisconnect } = useBitcoinConnectHandlers();

  const handleCreateSubscription = async () => {
    if (!isConnected) {
      showToast('Please connect your wallet first', 'error');
      connect();
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // First, create the subscription in our database
      const subscriptionResponse = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopId,
          amountSats,
          interval,
          // We'll add NWC integration here later
        }),
      });

      if (!subscriptionResponse.ok) {
        const data = await subscriptionResponse.json();
        throw new Error(data.error || 'Failed to create subscription');
      }

      const subscriptionData = await subscriptionResponse.json();
      const subscriptionId = subscriptionData.subscription.id;

      // Now initiate the Lightning payment
      const paymentResult = await initiateLightningPayment(subscriptionId, amountSats, recipientAddress, comment);

      setPaymentStatus('success');
      setPaymentDetails({
        amountSats,
        recipientAddress,
        subscriptionId,
        preimage: paymentResult?.preimage
      });
      setShowSuccessModal(true);
      showToast('Subscription created and payment successful!', 'success');
      
      if (onSuccess) {
        onSuccess(subscriptionId);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setPaymentStatus('failed');
      showToast(error instanceof Error ? error.message : 'Failed to create subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const initiateLightningPayment = async (
    subscriptionId: string, 
    amountSats: number, 
    recipientAddress: string, 
    comment: string
  ) => {
    try {
      // Check if WebLN is available
      if (!lightningService.isWebLNAvailable()) {
        throw new Error('No Lightning wallet detected. Please install a Lightning wallet extension like Alby.');
      }

      // Use the Lightning service to pay the invoice
      const paymentResult = await lightningService.payInvoice(
        amountSats,
        comment,
        recipientAddress
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Record the payment in subscription history
      await fetch('/api/subscriptions/' + subscriptionId + '/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amountSats,
          status: 'success',
          paymentMethod: 'lightning',
          walletProvider: 'Bitcoin Connect',
          preimage: paymentResult.preimage
        }),
      });

      return paymentResult;
    } catch (error) {
      console.error('Error initiating Lightning payment:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to process Lightning payment');
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing Lightning payment...';
      case 'success':
        return 'Payment successful!';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Create Lightning Subscription
        </h3>
        <p className="text-sm text-gray-600">
          Set up a recurring Lightning payment for your subscription.
        </p>
      </div>

      {/* Subscription Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">{amountSats} sats</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Interval:</span>
          <span className="font-medium capitalize">{interval}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Recipient:</span>
          <span className="font-medium text-sm">{recipientAddress}</span>
        </div>
        {comment && (
          <div className="flex justify-between">
            <span className="text-gray-600">Comment:</span>
            <span className="font-medium text-sm">{comment}</span>
          </div>
        )}
      </div>

      {/* Wallet Connection Status */}
      <div className="mb-6">
        {isConnected ? (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Wallet Connected: Bitcoin Connect
              </p>
              <p className="text-xs text-green-600">
                Ready to process Lightning payments
              </p>
              <p className="text-xs text-green-700 mt-1">Balance: Connected</p>
            </div>
          </div>
        ) : (
          <>
            {/* Connect Wallet Button (same as top bar) */}
            <div className="flex justify-center mb-2">
              <ConnectWalletButton onConnect={onConnect} onDisconnect={onDisconnect} />
            </div>
            {/* Yellow warning */}
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Wallet Not Connected
                </p>
                <p className="text-xs text-yellow-600">
                  Connect your Lightning wallet to create subscriptions
                </p>
              </div>
            </div>
          </>
        )}
        {/* WebLN Availability Check */}
        {!lightningService.isWebLNAvailable() && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Lightning Wallet Required
                </p>
                <p className="text-xs text-red-600">
                  Please install a Lightning wallet extension like Alby to make payments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Status */}
      {paymentStatus !== 'idle' && (
        <div className="mb-6">
          <div className={`flex items-center p-3 rounded-lg ${
            paymentStatus === 'processing' ? 'bg-blue-50 border border-blue-200' :
            paymentStatus === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-3 ${
              paymentStatus === 'processing' ? 'bg-blue-500' :
              paymentStatus === 'success' ? 'bg-green-500' :
              'bg-red-500'
            }`}></div>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleCreateSubscription}
          disabled={loading || !isConnected}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              ⚡ Create Subscription
            </>
          )}
        </button>
      </div>

      {/* Enhanced Loading State */}
      {loading && (
        <div className="mt-6">
          <LightningLoadingSpinner text="Processing Lightning payment..." />
        </div>
      )}

      {/* Payment Success Modal */}
      {paymentDetails && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          paymentDetails={paymentDetails}
        />
      )}
    </div>
  );
} 