"use client";

import React, { useState, useEffect } from 'react';

interface Payment {
  id: number;
  payment_amount: number;
  status: 'success' | 'failed' | 'pending';
  payment_method: string;
  wallet_provider: string;
  preimage?: string;
  payment_date: string;
}

interface PaymentHistoryProps {
  subscriptionId: string;
}

export default function PaymentHistory({ subscriptionId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, [subscriptionId]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions/${subscriptionId}/payments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError(error instanceof Error ? error.message : 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchPaymentHistory}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No payments found for this subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getStatusIcon(payment.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(payment.payment_date).toLocaleDateString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Amount:</span>
                <span className="ml-2 font-medium">{payment.payment_amount} sats</span>
              </div>
              <div>
                <span className="text-gray-600">Method:</span>
                <span className="ml-2 font-medium capitalize">{payment.payment_method}</span>
              </div>
              <div>
                <span className="text-gray-600">Wallet:</span>
                <span className="ml-2 font-medium">{payment.wallet_provider || 'Unknown'}</span>
              </div>
              {payment.preimage && (
                <div className="col-span-2">
                  <span className="text-gray-600">Preimage:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {payment.preimage.substring(0, 16)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 