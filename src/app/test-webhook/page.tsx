"use client";

import { useState } from 'react';

export default function TestWebhook() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [zapPlannerId, setZapPlannerId] = useState('');
  const [event, setEvent] = useState('subscription.created');
  const [amount, setAmount] = useState('1000');

  const sendWebhook = async () => {
    const webhookData = {
      event,
      subscription_id: zapPlannerId,
      amount: parseInt(amount),
      metadata: {
        subscriptionId: subscriptionId
      }
    };

    try {
      const response = await fetch('/api/webhooks/zapplanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        alert('Webhook sent successfully!');
      } else {
        alert('Failed to send webhook');
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      alert('Error sending webhook');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test ZapPlanner Webhook</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription ID (from our database)
              </label>
              <input
                type="text"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subscription ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZapPlanner Subscription ID
              </label>
              <input
                type="text"
                value={zapPlannerId}
                onChange={(e) => setZapPlannerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ZapPlanner subscription ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="subscription.created">Subscription Created</option>
                <option value="subscription.payment_succeeded">Payment Succeeded</option>
                <option value="subscription.payment_failed">Payment Failed</option>
                <option value="subscription.cancelled">Subscription Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (sats)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount in sats"
              />
            </div>

            <button
              onClick={sendWebhook}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Webhook
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Webhook Payload:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify({
                event,
                subscription_id: zapPlannerId,
                amount: parseInt(amount),
                metadata: {
                  subscriptionId: subscriptionId
                }
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 