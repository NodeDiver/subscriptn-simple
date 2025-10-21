import { PrismaClient, ServiceType, ConnectionType, ConnectionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ============================================
  // CREATE USERS (UNIFIED - NO ROLES)
  // ============================================
  console.log('👥 Creating users...');

  const users = [
    // Infrastructure Providers
    {
      username: 'btcpayserver',
      password: 'btcpayserver',
      name: 'BTCPay Server Admin',
      email: 'admin@btcpayserver.demo'
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
    // Shop Owners
    {
      username: 'shopowner',
      password: 'shopowner',
      name: 'Shop Owner Demo',
      email: 'owner@shop.demo'
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
    // Bitcoiners (consumers)
    {
      username: 'carlos_rodriguez',
      password: 'password123',
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com'
    },
    {
      username: 'emma_thompson',
      password: 'password123',
      name: 'Emma Thompson',
      email: 'emma@example.com'
    },
  ];

  const createdUsers: any[] = [];
  for (const userData of users) {
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
  }

  // ============================================
  // CREATE INFRASTRUCTURE PROVIDERS
  // ============================================
  console.log('🏗️  Creating infrastructure providers...');

  const providers = [
    {
      name: 'Demo BTCPay Server',
      description: 'Demo BTCPay Server for testing and development. Professional Bitcoin payment processing infrastructure.',
      serviceType: ServiceType.PAYMENT_PROCESSOR,
      website: 'https://btcpay.example.com',
      contactEmail: 'admin@btcpayserver.demo',
      lightningAddress: 'demo@btcpay.example.com',
      pricingTiers: [
        { name: 'Free', price: 0, features: ['5 shops', 'Basic support', 'Standard uptime'] },
        { name: 'Pro', price: 10000, features: ['20 shops', 'Priority support', '99.9% uptime'] }
      ],
      technicalSpecs: {
        uptime: '99.5%',
        apiAvailable: true,
        maxShops: 20,
        features: ['Lightning Network', 'On-chain payments', 'Point of Sale']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 15,
      ownerId: createdUsers[0].id // btcpayserver
    },
    {
      name: 'LightningPay Infrastructure',
      description: 'Professional Lightning payment infrastructure with 99.9% uptime guarantee. Enterprise-grade solution for high-volume merchants.',
      serviceType: ServiceType.PAYMENT_PROCESSOR,
      website: 'https://lightningpay.demo.io',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'pay@lightningpay.demo.io',
      pricingTiers: [
        { name: 'Starter', price: 5000, features: ['10 shops', 'Email support', '99% uptime'] },
        { name: 'Business', price: 20000, features: ['50 shops', '24/7 support', '99.9% uptime'] },
        { name: 'Enterprise', price: 50000, features: ['Unlimited shops', 'Dedicated support', '99.99% uptime'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        maxShops: 100,
        features: ['Lightning Network', 'Multi-currency', 'Analytics dashboard', 'Webhook support']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 25,
      ownerId: createdUsers[1].id // alex_martinez
    },
    {
      name: 'BLFS Node Provider',
      description: 'Bitcoin Lightning File Storage provider. Host your files on Lightning Network with instant payments.',
      serviceType: ServiceType.OTHER,
      website: 'https://github.com/MegalithicBTC/BLFS',
      contactEmail: 'sarah@bitcoinmarket.com',
      lightningAddress: 'blfs@bitcoinmarket.com',
      pricingTiers: [
        { name: 'Storage Basic', price: 1000, features: ['10GB storage', 'Standard speed'] },
        { name: 'Storage Pro', price: 5000, features: ['100GB storage', 'High speed', 'Priority access'] }
      ],
      technicalSpecs: {
        uptime: '99.5%',
        apiAvailable: true,
        features: ['File storage', 'Lightning payments', 'IPFS integration']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 50,
      ownerId: createdUsers[2].id // sarah_chen
    },
    {
      name: 'Lightning Node Hosting Co.',
      description: 'Managed Lightning node hosting for merchants and enthusiasts. We handle the technical complexity.',
      serviceType: ServiceType.LIGHTNING_NODE,
      website: 'https://lnhosting.demo.com',
      contactEmail: 'sarah@bitcoinmarket.com',
      lightningAddress: 'node@lnhosting.demo.com',
      pricingTiers: [
        { name: 'Hobby Node', price: 15000, features: ['5 channels', 'Basic monitoring'] },
        { name: 'Merchant Node', price: 30000, features: ['20 channels', 'Advanced monitoring', 'Channel management'] }
      ],
      technicalSpecs: {
        uptime: '99.8%',
        apiAvailable: true,
        features: ['LND', 'Channel management', 'Watchtower', 'Auto-pilot']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 10,
      ownerId: createdUsers[2].id // sarah_chen
    },
    {
      name: 'Wallet API Services',
      description: 'RESTful wallet APIs for developers. Integrate Bitcoin payments into your app with our simple API.',
      serviceType: ServiceType.WALLET_API,
      website: 'https://walletapi.demo.com',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'api@walletapi.demo.com',
      pricingTiers: [
        { name: 'Developer', price: 0, features: ['1000 API calls/month', 'Testnet access'] },
        { name: 'Production', price: 25000, features: ['100k API calls/month', 'Mainnet access', 'Priority support'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['REST API', 'Websockets', 'Webhooks', 'SDKs for major languages']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 100,
      ownerId: createdUsers[1].id // alex_martinez
    }
  ];

  const createdProviders: any[] = [];
  for (const providerData of providers) {
    const provider = await prisma.infrastructureProvider.create({
      data: providerData
    });
    createdProviders.push(provider);
    console.log(`✅ Created provider: ${providerData.name} (${providerData.serviceType})`);
  }

  // ============================================
  // CREATE SHOPS
  // ============================================
  console.log('🏪 Creating shops...');

  const shops = [
    // Connected shops
    {
      name: 'Mi Tienda Demo',
      description: 'Demo shop for testing integrations. We sell everything you need for Bitcoin payments.',
      address: 'Calle Bitcoin 123, Madrid, Spain',
      latitude: 40.4168,
      longitude: -3.7038,
      isPhysicalLocation: true,
      website: 'https://tienda.demo.com',
      contactEmail: 'owner@shop.demo',
      lightningAddress: 'tienda@lightning.example.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[3].id // shopowner
    },
    {
      name: 'TechGadgets Pro',
      description: 'Latest tech gadgets and electronics with instant Lightning payments. Worldwide shipping available.',
      address: '456 Silicon Valley, San Francisco, CA, USA',
      latitude: 37.7749,
      longitude: -122.4194,
      isPhysicalLocation: false,
      website: 'https://techgadgets.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'tech@techgadgets.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[4].id // mike_roberts
    },
    {
      name: 'CryptoCafe',
      description: 'Bitcoin-friendly coffee shop. Premium coffee and pastries, pay with Lightning!',
      address: '789 Blockchain Ave, New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      isPhysicalLocation: true,
      website: 'https://cryptocafe.demo.com',
      contactEmail: 'contact@cryptocafe.demo.com',
      lightningAddress: 'coffee@cryptocafe.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[5].id // lisa_wang
    },
    {
      name: 'Digital Art Gallery',
      description: 'NFT marketplace and digital art gallery. Discover unique digital artwork from artists worldwide.',
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://digitalart.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'art@digitalart.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[4].id // mike_roberts
    },
    {
      name: 'Fashion Forward',
      description: 'Sustainable fashion store accepting Bitcoin. Eco-friendly clothing for conscious consumers.',
      address: '321 Green Street, Portland, OR, USA',
      latitude: 45.5152,
      longitude: -122.6784,
      isPhysicalLocation: true,
      website: 'https://fashionforward.demo.com',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'fashion@fashionforward.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[5].id // lisa_wang
    },
    // Standalone shops (no provider connection yet)
    {
      name: 'Artisan Coffee Roasters',
      description: 'Small batch coffee roasters looking to accept Bitcoin payments. Premium beans from around the world.',
      address: '555 Bean Lane, Seattle, WA, USA',
      latitude: 47.6062,
      longitude: -122.3321,
      isPhysicalLocation: true,
      website: 'https://artisancoffee.demo.com',
      contactEmail: 'owner@shop.demo',
      lightningAddress: null,
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[3].id // shopowner
    },
    {
      name: 'Vintage Vinyl Records',
      description: 'Rare vinyl collection shop. Looking for Lightning payment infrastructure to sell globally.',
      address: '101 Music Row, Nashville, TN, USA',
      latitude: 36.1627,
      longitude: -86.7816,
      isPhysicalLocation: true,
      website: 'https://vintagevinyl.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: null,
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[4].id // mike_roberts
    },
    {
      name: 'Organic Farm Market',
      description: 'Farm-to-table marketplace. Fresh organic produce delivered locally, wanting Bitcoin payments.',
      address: '789 Farm Road, Austin, TX, USA',
      latitude: 30.2672,
      longitude: -97.7431,
      isPhysicalLocation: true,
      website: 'https://organicfarm.demo.com',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: null,
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: createdUsers[5].id // lisa_wang
    }
  ];

  const createdShops: any[] = [];
  for (const shopData of shops) {
    const shop = await prisma.shop.create({
      data: shopData
    });
    createdShops.push(shop);
    console.log(`✅ Created shop: ${shopData.name}`);
  }

  // ============================================
  // CREATE CONNECTIONS (Shop-Provider Relationships)
  // ============================================
  console.log('🔗 Creating connections...');

  const connections = [
    {
      shopId: createdShops[0].id, // Mi Tienda Demo
      providerId: createdProviders[0].id, // Demo BTCPay Server
      connectionType: ConnectionType.FREE_LISTING,
      status: ConnectionStatus.ACTIVE
    },
    {
      shopId: createdShops[1].id, // TechGadgets Pro
      providerId: createdProviders[1].id, // LightningPay Infrastructure
      connectionType: ConnectionType.PAID_SUBSCRIPTION,
      status: ConnectionStatus.ACTIVE,
      subscriptionAmount: 20000, // 20k sats
      subscriptionInterval: 'monthly'
    },
    {
      shopId: createdShops[2].id, // CryptoCafe
      providerId: createdProviders[0].id, // Demo BTCPay Server
      connectionType: ConnectionType.SELF_REPORTED,
      status: ConnectionStatus.ACTIVE
    },
    {
      shopId: createdShops[3].id, // Digital Art Gallery
      providerId: createdProviders[3].id, // Lightning Node Hosting
      connectionType: ConnectionType.PAID_SUBSCRIPTION,
      status: ConnectionStatus.ACTIVE,
      subscriptionAmount: 30000, // 30k sats
      subscriptionInterval: 'monthly'
    },
    {
      shopId: createdShops[4].id, // Fashion Forward
      providerId: createdProviders[1].id, // LightningPay Infrastructure
      connectionType: ConnectionType.FREE_LISTING,
      status: ConnectionStatus.ACTIVE
    }
  ];

  const createdConnections: any[] = [];
  for (const connectionData of connections) {
    const connection = await prisma.connection.create({
      data: connectionData
    });
    createdConnections.push(connection);
    const shop = createdShops.find(s => s.id === connectionData.shopId);
    const provider = createdProviders.find(p => p.id === connectionData.providerId);
    console.log(`✅ Connected: ${shop?.name} → ${provider?.name} (${connectionData.connectionType})`);
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Database seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   👥 Users: ${createdUsers.length}`);
  console.log(`      - Providers: ${createdUsers.filter(u => u.role === 'PROVIDER').length}`);
  console.log(`      - Shop Owners: ${createdUsers.filter(u => u.role === 'SHOP_OWNER').length}`);
  console.log(`      - Bitcoiners: ${createdUsers.filter(u => u.role === 'BITCOINER').length}`);
  console.log(`   🏗️  Infrastructure Providers: ${createdProviders.length}`);
  console.log(`   🏪 Shops: ${createdShops.length}`);
  console.log(`   🔗 Connections: ${createdConnections.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
