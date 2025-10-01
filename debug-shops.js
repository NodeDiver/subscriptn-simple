const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugShops() {
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
      },
      take: 1
    });

    console.log('Raw shop from database:');
    console.log(JSON.stringify(shops[0], null, 2));

    const mappedShop = shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      lightning_address: shop.lightningAddress,
      subscription_status: shop.subscriptionStatus,
      created_at: shop.createdAt,
      is_public: shop.isPublic,
      server_name: shop.server.name,
      owner_username: shop.owner.username
    }))[0];

    console.log('\nMapped shop:');
    console.log(JSON.stringify(mappedShop, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugShops();
