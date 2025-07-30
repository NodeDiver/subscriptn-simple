import { prisma } from './prisma';

export interface SubscriptionWithDetails {
  id: number;
  amountSats: number;
  interval: string;
  status: string;
  createdAt: Date;
  shopName: string;
  serverName: string;
}

export async function getUserSubscriptions(userId: number): Promise<SubscriptionWithDetails[]> {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        shop: {
          ownerId: userId
        }
      },
      include: {
        shop: {
          include: {
            server: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return subscriptions.map(sub => ({
      id: sub.id,
      amountSats: sub.amountSats,
      interval: sub.interval,
      status: sub.status,
      createdAt: sub.createdAt,
      shopName: sub.shop.name,
      serverName: sub.shop.server.name
    }));
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    return [];
  }
}

export async function createSubscription(data: {
  shopId: number;
  ownerId: number;
  amountSats: number;
  interval: string;
}): Promise<SubscriptionWithDetails | null> {
  try {
    // Verify the shop belongs to the user
    const shop = await prisma.shop.findFirst({
      where: {
        id: data.shopId,
        ownerId: data.ownerId
      }
    });

    if (!shop) {
      throw new Error('Shop not found');
    }

    // Check if this shop already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        shopId: data.shopId,
        status: 'active'
      }
    });

    if (existingSubscription) {
      throw new Error('This shop already has an active subscription. Please cancel the existing subscription before creating a new one.');
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        shopId: data.shopId,
        amountSats: data.amountSats,
        interval: data.interval,
        status: 'active'
      },
      include: {
        shop: {
          include: {
            server: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return {
      id: subscription.id,
      amountSats: subscription.amountSats,
      interval: subscription.interval,
      status: subscription.status,
      createdAt: subscription.createdAt,
      shopName: subscription.shop.name,
      serverName: subscription.shop.server.name
    };
  } catch (error) {
    console.error('Create subscription error:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: number, ownerId: number): Promise<boolean> {
  try {
    // Verify the subscription belongs to a shop owned by the user
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        shop: {
          ownerId
        }
      }
    });

    if (!subscription) {
      return false;
    }

    // Update subscription status to cancelled
    await prisma.subscription.update({
      where: {
        id: subscriptionId
      },
      data: {
        status: 'cancelled'
      }
    });

    // Add to subscription history
    await prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'cancelled',
        amountSats: subscription.amountSats,
        timestamp: new Date()
      }
    });

    return true;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return false;
  }
}

export async function getSubscriptionHistory(subscriptionId: number, ownerId: number): Promise<any[]> {
  try {
    // Verify the subscription belongs to a shop owned by the user
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        shop: {
          ownerId
        }
      }
    });

    if (!subscription) {
      return [];
    }

    const history = await prisma.subscriptionHistory.findMany({
      where: {
        subscriptionId
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return history;
  } catch (error) {
    console.error('Get subscription history error:', error);
    return [];
  }
}

export async function getShopSubscriptions(shopId: number): Promise<SubscriptionWithDetails[]> {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        shopId
      },
      include: {
        shop: {
          include: {
            server: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return subscriptions.map(sub => ({
      id: sub.id,
      amountSats: sub.amountSats,
      interval: sub.interval,
      status: sub.status,
      createdAt: sub.createdAt,
      shopName: sub.shop.name,
      serverName: sub.shop.server.name
    }));
  } catch (error) {
    console.error('Get shop subscriptions error:', error);
    return [];
  }
} 