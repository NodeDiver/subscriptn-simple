import { prisma } from './prisma';

export interface ServerWithStats {
  id: number;
  name: string;
  host_url: string; // Changed to snake_case for frontend compatibility
  description: string | null;
  is_public: boolean;
  slots_available: number;
  lightning_address: string | null;
  created_at: Date;
  is_owner: number; // Changed to number for frontend compatibility
  current_shops: number;
  available_slots: number;
  owner_username?: string; // Add owner username
}

export async function getServersWithStats(userId: number): Promise<ServerWithStats[]> {
  try {
    const servers = await prisma.server.findMany({
      include: {
        owner: {
          select: {
            username: true
          }
        },
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
      host_url: server.hostUrl, // Convert to snake_case for frontend compatibility
      description: server.description,
      is_public: server.isPublic,
      slots_available: server.slotsAvailable,
      lightning_address: server.lightningAddress,
      created_at: server.createdAt,
      is_owner: server.ownerId === userId ? 1 : 0, // Convert boolean to number for frontend compatibility
      current_shops: server._count.shops,
      available_slots: server.slotsAvailable - server._count.shops,
      owner_username: server.owner.username
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
        owner: {
          select: {
            username: true
          }
        },
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
        host_url: server.hostUrl, // Convert to snake_case for frontend compatibility
        description: server.description,
        is_public: server.isPublic,
        slots_available: server.slotsAvailable,
        lightning_address: server.lightningAddress,
        created_at: server.createdAt,
        is_owner: 0, // Public servers view - always 0
        current_shops: server._count.shops,
        available_slots: server.slotsAvailable - server._count.shops,
        owner_username: server.owner.username
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
      host_url: server.hostUrl, // Convert to snake_case for frontend compatibility
      description: server.description,
      is_public: server.isPublic,
      slots_available: server.slotsAvailable,
      lightning_address: server.lightningAddress,
      created_at: server.createdAt,
      is_owner: 1, // Creator is always owner
      current_shops: server._count.shops,
      available_slots: server.slotsAvailable - server._count.shops
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

export async function getServerById(serverId: number, ownerId: number): Promise<ServerWithStats | null> {
  try {
    const server = await prisma.server.findFirst({
      where: {
        id: serverId,
        ownerId
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

    if (!server) {
      return null;
    }

    return {
      id: server.id,
      name: server.name,
      host_url: server.hostUrl, // Convert to snake_case for frontend compatibility
      description: server.description,
      is_public: server.isPublic,
      slots_available: server.slotsAvailable,
      lightning_address: server.lightningAddress,
      created_at: server.createdAt,
      is_owner: 1, // Owner view
      current_shops: server._count.shops,
      available_slots: server.slotsAvailable - server._count.shops
    };
  } catch (error) {
    console.error('Get server by ID error:', error);
    return null;
  }
}

export async function getServerByIdForDetails(serverId: number, userId: number): Promise<ServerWithStats | null> {
  try {
    const server = await prisma.server.findUnique({
      where: {
        id: serverId
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

    if (!server) {
      return null;
    }

    return {
      id: server.id,
      name: server.name,
      host_url: server.hostUrl, // Convert to snake_case for frontend compatibility
      description: server.description,
      is_public: server.isPublic,
      slots_available: server.slotsAvailable,
      lightning_address: server.lightningAddress,
      created_at: server.createdAt,
      is_owner: server.ownerId === userId ? 1 : 0, // Convert boolean to number
      current_shops: server._count.shops,
      available_slots: server.slotsAvailable - server._count.shops
    };
  } catch (error) {
    console.error('Get server by ID for details error:', error);
    return null;
  }
} 