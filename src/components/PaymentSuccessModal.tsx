"use client";

import React from 'react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: {
    amountSats: number;
    recipientAddress: string;
    subscriptionId: string;
    preimage?: string;
  };
}

export default function PaymentSuccessModal({ isOpen, onClose, paymentDetails }: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful! ⚡
          </h3>
          <p className="text-gray-600">
            Your Lightning payment has been processed successfully.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-green-600">{paymentDetails.amountSats} sats</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-medium text-sm">{paymentDetails.recipientAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subscription ID:</span>
              <span className="font-mono text-sm">{paymentDetails.subscriptionId}</span>
            </div>
            {paymentDetails.preimage && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Payment Preimage:</div>
                <div className="font-mono text-xs bg-white p-2 rounded border break-all">
                  {paymentDetails.preimage}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
          <button
            onClick={() => {
              // Copy payment details to clipboard
              const details = `Payment: ${paymentDetails.amountSats} sats to ${paymentDetails.recipientAddress}\nSubscription ID: ${paymentDetails.subscriptionId}`;
              navigator.clipboard.writeText(details);
              alert('Payment details copied to clipboard!');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Copy Details
          </button>
        </div>

        {/* Lightning Network Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by the Lightning Network ⚡
          </p>
        </div>
      </div>
    </div>
  );
} 