const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testShopDescriptions() {
  try {
    const shops = await prisma.shop.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        description: true
      }
    });
    
    console.log('Shop descriptions from database:');
    shops.forEach(shop => {
      console.log(`${shop.name}: "${shop.description}"`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testShopDescriptions();
