import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo users
  const users = [
    {
      username: 'btcpayserver',
      password: 'btcpayserver',
      name: 'BTCPay Server Admin',
      email: 'admin@btcpayserver.demo'
    },
    {
      username: 'shopowner',
      password: 'shopowner',
      name: 'Shop Owner',
      email: 'owner@shop.demo'
    },
    {
      username: 'alex_martinez',
      password: 'password123',
      name: 'Alex Martinez',
      email: 'alex@lightningpay.io'
    },
    {
      username: 'sarah_chen',
      password: 'password123',
      name: 'Sarah Chen',
      email: 'sarah@bitcoinmarket.com'
    },
    {
      username: 'mike_roberts',
      password: 'password123',
      name: 'Mike Roberts',
      email: 'mike@cryptoshop.net'
    },
    {
      username: 'lisa_wang',
      password: 'password123',
      name: 'Lisa Wang',
      email: 'lisa@digitalstore.com'
    },
    {
      username: 'carlos_rodriguez',
      password: 'password123',
      name: 'Carlos Rodriguez',
      email: 'carlos@bitcoinstore.mx'
    },
    {
      username: 'emma_thompson',
      password: 'password123',
      name: 'Emma Thompson',
      email: 'emma@lightningcommerce.co.uk'
    },
    {
      username: 'david_kim',
      password: 'password123',
      name: 'David Kim',
      email: 'david@satoshistore.kr'
    },
    {
      username: 'maria_gonzalez',
      password: 'password123',
      name: 'Maria Gonzalez',
      email: 'maria@bitcoinboutique.es'
    }
  ];

  console.log('👥 Creating users...');
  const createdUsers = [];
  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          passwordHash: hashedPassword,
          name: userData.name,
          email: userData.email
        }
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${userData.username}`);
    } else {
      createdUsers.push(existingUser);
      console.log(`⚠️  User already exists: ${userData.username}`);
    }
  }

  // Create BTCPay servers
  console.log('🖥️  Creating BTCPay servers...');
  const servers = [
    {
      name: 'Demo BTCPay Server',
      hostUrl: 'https://btcpay.example.com',
      apiKey: 'demo_api_key_123',
      ownerId: createdUsers[0].id, // btcpayserver user
      description: 'Servidor demo para testing',
      isPublic: true,
      slotsAvailable: 15,
      lightningAddress: 'demo@btcpay.example.com'
    },
    {
      name: 'LightningPay Infrastructure',
      hostUrl: 'https://lightningpay.demo.io',
      apiKey: 'lpi_api_key_456',
      ownerId: createdUsers[2].id, // alex_martinez
      description: 'Professional Lightning payment infrastructure with 99.9% uptime guarantee',
      isPublic: true,
      slotsAvailable: 25,
      lightningAddress: 'pay@lightningpay.demo.io'
    },
    {
      name: 'BitcoinMarket Solutions',
      hostUrl: 'https://bitcoinmarket.demo.com',
      apiKey: 'bms_api_key_789',
      ownerId: createdUsers[3].id, // sarah_chen
      description: 'Enterprise-grade BTCPay server hosting for high-volume merchants',
      isPublic: true,
      slotsAvailable: 12,
      lightningAddress: 'merchant@bitcoinmarket.demo.com'
    },
    {
      name: 'CryptoShop Network',
      hostUrl: 'https://cryptoshop.demo.net',
      apiKey: 'csn_api_key_101',
      ownerId: createdUsers[4].id, // mike_roberts
      description: 'Reliable Bitcoin payment processing for small to medium businesses',
      isPublic: true,
      slotsAvailable: 8,
      lightningAddress: 'shop@cryptoshop.demo.net'
    },
    {
      name: 'DigitalStore Hub',
      hostUrl: 'https://digitalstore.demo.com',
      apiKey: 'dsh_api_key_202',
      ownerId: createdUsers[5].id, // lisa_wang
      description: 'Modern Lightning infrastructure with advanced analytics and reporting',
      isPublic: true,
      slotsAvailable: 20,
      lightningAddress: 'hub@digitalstore.demo.com'
    },
    {
      name: 'BitcoinStore Mexico',
      hostUrl: 'https://bitcoinstore.demo.mx',
      apiKey: 'bsm_api_key_303',
      ownerId: createdUsers[6].id, // carlos_rodriguez
      description: 'Servicios de pagos Lightning para comercios en México y América Latina',
      isPublic: true,
      slotsAvailable: 18,
      lightningAddress: 'mexico@bitcoinstore.demo.mx'
    },
    {
      name: 'LightningCommerce UK',
      hostUrl: 'https://lightningcommerce.demo.co.uk',
      apiKey: 'lcu_api_key_404',
      ownerId: createdUsers[7].id, // emma_thompson
      description: 'Premium Lightning payment services for UK and European businesses',
      isPublic: true,
      slotsAvailable: 10,
      lightningAddress: 'uk@lightningcommerce.demo.co.uk'
    },
    {
      name: 'SatoshiStore Korea',
      hostUrl: 'https://satoshistore.demo.kr',
      apiKey: 'ssk_api_key_505',
      ownerId: createdUsers[8].id, // david_kim
      description: 'Korean Bitcoin payment infrastructure with local language support',
      isPublic: true,
      slotsAvailable: 14,
      lightningAddress: 'korea@satoshistore.demo.kr'
    },
    {
      name: 'BitcoinBoutique Spain',
      hostUrl: 'https://bitcoinboutique.demo.es',
      apiKey: 'bbs_api_key_606',
      ownerId: createdUsers[9].id, // maria_gonzalez
      description: 'Elegant Lightning payment solutions for Spanish and European merchants',
      isPublic: true,
      slotsAvailable: 16,
      lightningAddress: 'spain@bitcoinboutique.demo.es'
    }
  ];

  const createdServers = [];
  for (const serverData of servers) {
    const existingServer = await prisma.server.findFirst({
      where: { 
        OR: [
          { hostUrl: serverData.hostUrl },
          { 
            name: serverData.name,
            ownerId: serverData.ownerId
          }
        ]
      }
    });

    if (!existingServer) {
      const server = await prisma.server.create({
        data: serverData
      });
      createdServers.push(server);
      console.log(`✅ Created server: ${serverData.name}`);
    } else {
      createdServers.push(existingServer);
      console.log(`⚠️  Server already exists: ${serverData.name}`);
    }
  }

  // Create shops
  console.log('🏪 Creating shops...');
  const shops = [
    {
      name: 'Mi Tienda Demo',
      description: 'Tienda de demostración para pruebas de integración',
      serverId: createdServers[0].id, // Demo BTCPay Server
      ownerId: createdUsers[1].id, // shopowner
      lightningAddress: 'tienda@lightning.example.com',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'TechGadgets Pro',
      description: 'Latest tech gadgets and electronics with Lightning payments',
      serverId: createdServers[1].id, // LightningPay Infrastructure
      ownerId: createdUsers[2].id, // alex_martinez
      lightningAddress: 'tech@lightningpay.demo.io',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'CryptoCafe',
      description: 'Coffee shop accepting Bitcoin for premium coffee and pastries',
      serverId: createdServers[2].id, // BitcoinMarket Solutions
      ownerId: createdUsers[3].id, // sarah_chen
      lightningAddress: 'coffee@bitcoinmarket.demo.com',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Digital Art Gallery',
      description: 'NFT marketplace and digital art gallery with instant Lightning payments',
      serverId: createdServers[3].id, // CryptoShop Network
      ownerId: createdUsers[4].id, // mike_roberts
      lightningAddress: 'art@cryptoshop.demo.net',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Fashion Forward',
      description: 'Sustainable fashion store accepting Bitcoin for eco-friendly clothing',
      serverId: createdServers[4].id, // DigitalStore Hub
      ownerId: createdUsers[5].id, // lisa_wang
      lightningAddress: 'fashion@digitalstore.demo.com',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Mexican Spices Co.',
      description: 'Authentic Mexican spices and ingredients delivered worldwide',
      serverId: createdServers[5].id, // BitcoinStore Mexico
      ownerId: createdUsers[6].id, // carlos_rodriguez
      lightningAddress: 'spices@bitcoinstore.demo.mx',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'London Tea House',
      description: 'Premium British tea blends and accessories with Lightning payments',
      serverId: createdServers[6].id, // LightningCommerce UK
      ownerId: createdUsers[7].id, // emma_thompson
      lightningAddress: 'tea@lightningcommerce.demo.co.uk',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'K-Beauty Store',
      description: 'Korean beauty products and skincare with instant Bitcoin payments',
      serverId: createdServers[7].id, // SatoshiStore Korea
      ownerId: createdUsers[8].id, // david_kim
      lightningAddress: 'beauty@satoshistore.demo.kr',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Spanish Wine Cellar',
      description: 'Premium Spanish wines and spirits delivered globally',
      serverId: createdServers[8].id, // BitcoinBoutique Spain
      ownerId: createdUsers[9].id, // maria_gonzalez
      lightningAddress: 'wine@bitcoinboutique.demo.es',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Lightning Books',
      description: 'Digital books and e-learning courses with instant payments',
      serverId: createdServers[1].id, // LightningPay Infrastructure
      ownerId: createdUsers[2].id, // alex_martinez
      lightningAddress: 'books@lightningpay.demo.io',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Bitcoin Pizza Co.',
      description: 'Pizza delivery accepting Bitcoin - the original crypto pizza experience',
      serverId: createdServers[2].id, // BitcoinMarket Solutions
      ownerId: createdUsers[3].id, // sarah_chen
      lightningAddress: 'pizza@bitcoinmarket.demo.com',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Crypto Hardware Store',
      description: 'Hardware wallets, mining equipment, and crypto accessories',
      serverId: createdServers[3].id, // CryptoShop Network
      ownerId: createdUsers[4].id, // mike_roberts
      lightningAddress: 'hardware@cryptoshop.demo.net',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Green Energy Solutions',
      description: 'Solar panels and renewable energy equipment for crypto miners',
      serverId: createdServers[4].id, // DigitalStore Hub
      ownerId: createdUsers[5].id, // lisa_wang
      lightningAddress: 'energy@digitalstore.demo.com',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Taco Bitcoin',
      description: 'Authentic Mexican tacos and street food with Lightning payments',
      serverId: createdServers[5].id, // BitcoinStore Mexico
      ownerId: createdUsers[6].id, // carlos_rodriguez
      lightningAddress: 'tacos@bitcoinstore.demo.mx',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Scottish Whisky Exchange',
      description: 'Premium Scottish whisky collection with global delivery',
      serverId: createdServers[6].id, // LightningCommerce UK
      ownerId: createdUsers[7].id, // emma_thompson
      lightningAddress: 'whisky@lightningcommerce.demo.co.uk',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Samsung Tech Hub',
      description: 'Official Samsung products and accessories with Bitcoin payments',
      serverId: createdServers[7].id, // SatoshiStore Korea
      ownerId: createdUsers[8].id, // david_kim
      lightningAddress: 'samsung@satoshistore.demo.kr',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    {
      name: 'Flamenco Dance Academy',
      description: 'Online flamenco dance lessons and traditional Spanish music',
      serverId: createdServers[8].id, // BitcoinBoutique Spain
      ownerId: createdUsers[9].id, // maria_gonzalez
      lightningAddress: 'flamenco@bitcoinboutique.demo.es',
      serverLinked: true,
      subscriptionStatus: 'active',
      isPublic: true
    },
    // Unlinked shops looking for BTCPay Server hosting
    {
      name: 'Artisan Coffee Roasters',
      description: 'Small batch coffee roasters looking to accept Bitcoin payments',
      serverId: null,
      ownerId: createdUsers[2].id, // alex_martinez
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Vintage Vinyl Records',
      description: 'Rare vinyl collection shop seeking Lightning payment infrastructure',
      serverId: null,
      ownerId: createdUsers[3].id, // sarah_chen
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Organic Farm Market',
      description: 'Farm-to-table marketplace wanting to integrate Bitcoin payments',
      serverId: null,
      ownerId: createdUsers[4].id, // mike_roberts
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Handmade Jewelry Studio',
      description: 'Artisan jewelry looking for reliable BTCPay Server provider',
      serverId: null,
      ownerId: createdUsers[5].id, // lisa_wang
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Local Bookstore Café',
      description: 'Independent bookstore wanting to start accepting Lightning payments',
      serverId: null,
      ownerId: createdUsers[6].id, // carlos_rodriguez
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Yoga & Wellness Studio',
      description: 'Wellness center seeking Bitcoin payment infrastructure',
      serverId: null,
      ownerId: createdUsers[7].id, // emma_thompson
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Craft Beer Brewery',
      description: 'Local brewery looking to accept Bitcoin for online orders',
      serverId: null,
      ownerId: createdUsers[8].id, // david_kim
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    },
    {
      name: 'Pet Supplies & Grooming',
      description: 'Pet store wanting to modernize payment options with Lightning',
      serverId: null,
      ownerId: createdUsers[9].id, // maria_gonzalez
      lightningAddress: null,
      serverLinked: false,
      subscriptionStatus: 'pending',
      isPublic: true
    }
  ];

  const createdShops = [];
  for (const shopData of shops) {
    const existingShop = await prisma.shop.findFirst({
      where: { 
        name: shopData.name,
        ownerId: shopData.ownerId
      }
    });

    if (!existingShop) {
      const shop = await prisma.shop.create({
        data: shopData
      });
      createdShops.push(shop);
      console.log(`✅ Created shop: ${shopData.name}`);
    } else {
      createdShops.push(existingShop);
      console.log(`⚠️  Shop already exists: ${shopData.name}`);
    }
  }

  console.log('🎉 Database seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   👥 Users: ${createdUsers.length}`);
  console.log(`   🖥️  Servers: ${createdServers.length}`);
  console.log(`   🏪 Shops: ${createdShops.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
