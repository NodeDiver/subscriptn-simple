import { prisma } from './prisma';

export interface ShopWithServer {
  id: number;
  name: string;
  description: string | null; // Add description field
  lightning_address: string | null; // Changed to snake_case for frontend compatibility
  subscription_status: string; // Changed to snake_case for frontend compatibility
  created_at: Date; // Changed to snake_case for frontend compatibility
  is_public: boolean; // Changed to snake_case for frontend compatibility
  server_name: string; // Changed to snake_case for frontend compatibility
  owner_username?: string; // Add owner username
}

export async function getUserShops(userId: number): Promise<ShopWithServer[]> {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        ownerId: userId
      },
      include: {
        server: {
          select: {
            name: true
          }
        },
        owner: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description, // Add description field
      lightning_address: shop.lightningAddress, // Convert to snake_case for frontend compatibility
      subscription_status: shop.subscriptionStatus, // Convert to snake_case for frontend compatibility
      created_at: shop.createdAt, // Convert to snake_case for frontend compatibility
      is_public: shop.isPublic, // Convert to snake_case for frontend compatibility
      server_name: shop.server.name, // Convert to snake_case for frontend compatibility
      owner_username: shop.owner.username
    }));
  } catch (error) {
    console.error('Get user shops error:', error);
    return [];
  }
}

export async function getPublicShops(): Promise<ShopWithServer[]> {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        isPublic: true
      },
      include: {
        server: {
          select: {
            name: true
          }
        },
        owner: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description, // Add description field
      lightning_address: shop.lightningAddress, // Convert to snake_case for frontend compatibility
      subscription_status: shop.subscriptionStatus, // Convert to snake_case for frontend compatibility
      created_at: shop.createdAt, // Convert to snake_case for frontend compatibility
      is_public: shop.isPublic, // Convert to snake_case for frontend compatibility
      server_name: shop.server.name, // Convert to snake_case for frontend compatibility
      owner_username: shop.owner.username
    }));
  } catch (error) {
    console.error('Get public shops error:', error);
    return [];
  }
}

export async function createShop(data: {
  name: string;
  description?: string;
  serverId: number;
  ownerId: number;
  lightningAddress?: string;
  isPublic?: boolean;
}): Promise<ShopWithServer | null> {
  try {
    // Verify the server exists
    const server = await prisma.server.findUnique({
      where: { id: data.serverId }
    });

    if (!server) {
      throw new Error('Server not found');
    }

    // Check if this shop name already exists on this server
    const existingShop = await prisma.shop.findFirst({
      where: {
        name: data.name,
        serverId: data.serverId
      }
    });

    if (existingShop) {
      if (existingShop.ownerId === data.ownerId) {
        throw new Error('You already own a shop with this name on this server');
      } else {
        throw new Error('This shop is already owned by another user');
      }
    }

    const shop = await prisma.shop.create({
      data: {
        name: data.name,
        description: data.description,
        lightningAddress: data.lightningAddress,
        serverId: data.serverId,
        ownerId: data.ownerId,
        isPublic: data.isPublic ?? true
      },
      include: {
        server: {
          select: {
            name: true
          }
        }
      }
    });

    return {
      id: shop.id,
      name: shop.name,
      description: shop.description,
      lightning_address: shop.lightningAddress,
      subscription_status: shop.subscriptionStatus,
      created_at: shop.createdAt,
      is_public: shop.isPublic,
      server_name: shop.server.name
    };
  } catch (error) {
    console.error('Create shop error:', error);
    throw error;
  }
}

export async function deleteShop(shopId: number, ownerId: number): Promise<boolean> {
  try {
    // Delete related data in the correct order
    await prisma.$transaction(async (tx) => {
      // Delete subscription history first
      await tx.subscriptionHistory.deleteMany({
        where: {
          subscription: {
            shopId
          }
        }
      });

      // Delete subscriptions
      await tx.subscription.deleteMany({
        where: {
          shopId
        }
      });

      // Delete shop
      await tx.shop.delete({
        where: {
          id: shopId,
          ownerId
        }
      });
    });

    return true;
  } catch (error) {
    console.error('Delete shop error:', error);
    return false;
  }
}

export async function getShopsByServer(serverId: number): Promise<ShopWithServer[]> {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        serverId
      },
      include: {
        server: {
          select: {
            name: true
          }
        },
        owner: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      lightning_address: shop.lightningAddress,
      subscription_status: shop.subscriptionStatus,
      created_at: shop.createdAt,
      is_public: shop.isPublic,
      server_name: shop.server.name,
      owner_username: shop.owner.username
    }));
  } catch (error) {
    console.error('Get shops by server error:', error);
    return [];
  }
}

export async function getShopById(shopId: number, ownerId: number): Promise<ShopWithServer | null> {
  try {
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        ownerId
      },
      include: {
        server: {
          select: {
            name: true
          }
        }
      }
    });

    if (!shop) {
      return null;
    }

    return {
      id: shop.id,
      name: shop.name,
      description: shop.description,
      lightning_address: shop.lightningAddress,
      subscription_status: shop.subscriptionStatus,
      created_at: shop.createdAt,
      is_public: shop.isPublic,
      server_name: shop.server.name
    };
  } catch (error) {
    console.error('Get shop by ID error:', error);
    return null;
  }
} 