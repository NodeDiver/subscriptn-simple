import { prisma } from './prisma';

export interface ServerWithStats {
  id: number;
  name: string;
  hostUrl: string;
  description: string | null;
  isPublic: boolean;
  slotsAvailable: number;
  lightningAddress: string | null;
  createdAt: Date;
  isOwner: boolean;
  currentShops: number;
  availableSlots: number;
}

export async function getServersWithStats(userId: number): Promise<ServerWithStats[]> {
  try {
    const servers = await prisma.server.findMany({
      include: {
        _count: {
          select: {
            shops: {
              where: {
                subscriptionStatus: 'active'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return servers.map(server => ({
      id: server.id,
      name: server.name,
      hostUrl: server.hostUrl,
      description: server.description,
      isPublic: server.isPublic,
      slotsAvailable: server.slotsAvailable,
      lightningAddress: server.lightningAddress,
      createdAt: server.createdAt,
      isOwner: server.ownerId === userId,
      currentShops: server._count.shops,
      availableSlots: server.slotsAvailable - server._count.shops
    }));
  } catch (error) {
    console.error('Get servers with stats error:', error);
    return [];
  }
}

export async function getPublicServers(): Promise<ServerWithStats[]> {
  try {
    const servers = await prisma.server.findMany({
      where: {
        isPublic: true
      },
      include: {
        _count: {
          select: {
            shops: {
              where: {
                subscriptionStatus: 'active'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return servers
      .filter(server => (server.slotsAvailable - server._count.shops) > 0)
      .map(server => ({
        id: server.id,
        name: server.name,
        hostUrl: server.hostUrl,
        description: server.description,
        isPublic: server.isPublic,
        slotsAvailable: server.slotsAvailable,
        lightningAddress: server.lightningAddress,
        createdAt: server.createdAt,
        isOwner: false, // Public servers view
        currentShops: server._count.shops,
        availableSlots: server.slotsAvailable - server._count.shops
      }));
  } catch (error) {
    console.error('Get public servers error:', error);
    return [];
  }
}

export async function createServer(data: {
  name: string;
  hostUrl: string;
  apiKey: string;
  ownerId: number;
  description?: string;
  isPublic?: boolean;
  slotsAvailable?: number;
  lightningAddress?: string;
}) {
  try {
    const server = await prisma.server.create({
      data: {
        name: data.name,
        hostUrl: data.hostUrl,
        apiKey: data.apiKey,
        ownerId: data.ownerId,
        description: data.description,
        isPublic: data.isPublic ?? true,
        slotsAvailable: data.slotsAvailable ?? 21,
        lightningAddress: data.lightningAddress
      },
      include: {
        _count: {
          select: {
            shops: {
              where: {
                subscriptionStatus: 'active'
              }
            }
          }
        }
      }
    });

    return {
      id: server.id,
      name: server.name,
      hostUrl: server.hostUrl,
      description: server.description,
      isPublic: server.isPublic,
      slotsAvailable: server.slotsAvailable,
      lightningAddress: server.lightningAddress,
      createdAt: server.createdAt,
      isOwner: true,
      currentShops: server._count.shops,
      availableSlots: server.slotsAvailable - server._count.shops
    };
  } catch (error) {
    console.error('Create server error:', error);
    throw error;
  }
}

export async function deleteServer(serverId: number, ownerId: number) {
  try {
    // Delete related data in the correct order
    await prisma.$transaction(async (tx) => {
      // Delete subscription history first
      await tx.subscriptionHistory.deleteMany({
        where: {
          subscription: {
            shop: {
              serverId
            }
          }
        }
      });

      // Delete subscriptions
      await tx.subscription.deleteMany({
        where: {
          shop: {
            serverId
          }
        }
      });

      // Delete shops
      await tx.shop.deleteMany({
        where: {
          serverId
        }
      });

      // Delete server
      await tx.server.delete({
        where: {
          id: serverId,
          ownerId
        }
      });
    });

    return true;
  } catch (error) {
    console.error('Delete server error:', error);
    return false;
  }
} 