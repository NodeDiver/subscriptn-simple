const { getPublicShops } = require('./src/lib/shop-prisma.ts');

async function testAPIResponse() {
  try {
    const shops = await getPublicShops();
    console.log('First shop from getPublicShops:');
    console.log(JSON.stringify(shops[0], null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPIResponse();
