import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Default export for convenience
export default prisma;

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Database statistics
export async function getDatabaseStats(): Promise<{
  users: number;
  servers: number;
  shops: number;
  subscriptions: number;
  payments: number;
}> {
  try {
    const [users] = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM users`;
    const [servers] = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM servers`;
    const [shops] = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM shops`;
    const [subscriptions] = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM subscriptions`;
    const [payments] = await prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM subscription_history`;
    
    return {
      users: Number(users.count),
      servers: Number(servers.count),
      shops: Number(shops.count),
      subscriptions: Number(subscriptions.count),
      payments: Number(payments.count)
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      users: 0,
      servers: 0,
      shops: 0,
      subscriptions: 0,
      payments: 0
    };
  }
} 