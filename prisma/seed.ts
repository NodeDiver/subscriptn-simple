import { PrismaClient, ServiceType, ShopType, ConnectionType, ConnectionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ============================================
  // CREATE USERS
  // ============================================
  console.log('👥 Creating users...');

  const users = [
    // Infrastructure Provider Owners
    { username: 'btcpayserver', password: 'btcpayserver', name: 'BTCPay Server Admin', email: 'admin@btcpayserver.demo' },
    { username: 'alex_martinez', password: 'password123', name: 'Alex Martinez', email: 'alex@lightningpay.io' },
    { username: 'sarah_chen', password: 'password123', name: 'Sarah Chen', email: 'sarah@bitcoinmarket.com' },
    { username: 'james_wilson', password: 'password123', name: 'James Wilson', email: 'james@btcinfra.com' },
    { username: 'maria_garcia', password: 'password123', name: 'Maria Garcia', email: 'maria@satsolutions.io' },
    { username: 'david_kim', password: 'password123', name: 'David Kim', email: 'david@lightning.network' },
    { username: 'emma_johnson', password: 'password123', name: 'Emma Johnson', email: 'emma@btcservices.com' },
    { username: 'robert_brown', password: 'password123', name: 'Robert Brown', email: 'robert@paymentpro.io' },

    // Shop Owners
    { username: 'shopowner', password: 'shopowner', name: 'Shop Owner Demo', email: 'owner@shop.demo' },
    { username: 'mike_roberts', password: 'password123', name: 'Mike Roberts', email: 'mike@cryptoshop.net' },
    { username: 'lisa_wang', password: 'password123', name: 'Lisa Wang', email: 'lisa@digitalstore.com' },
    { username: 'tom_anderson', password: 'password123', name: 'Tom Anderson', email: 'tom@techmart.com' },
    { username: 'sofia_rodriguez', password: 'password123', name: 'Sofia Rodriguez', email: 'sofia@artshop.io' },
    { username: 'john_miller', password: 'password123', name: 'John Miller', email: 'john@coffeeplace.com' },
    { username: 'amy_chen', password: 'password123', name: 'Amy Chen', email: 'amy@boutique.store' },
    { username: 'paul_white', password: 'password123', name: 'Paul White', email: 'paul@bookshop.net' },
    { username: 'nina_patel', password: 'password123', name: 'Nina Patel', email: 'nina@wellness.io' },
    { username: 'carlos_lopez', password: 'password123', name: 'Carlos Lopez', email: 'carlos@restaurant.mx' },

    // Bitcoiners (consumers)
    { username: 'carlos_rodriguez', password: 'password123', name: 'Carlos Rodriguez', email: 'carlos@example.com' },
    { username: 'emma_thompson', password: 'password123', name: 'Emma Thompson', email: 'emma@example.com' },
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
  // CREATE INFRASTRUCTURE PROVIDERS (~30 total)
  // ============================================
  console.log('🏗️  Creating infrastructure providers...');

  const providers = [
    // BTCPAY_SERVER Providers (~10)
    {
      name: 'Demo BTCPay Server',
      description: 'Demo BTCPay Server for testing and development. Professional Bitcoin payment processing infrastructure.',
      serviceType: ServiceType.BTCPAY_SERVER,
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
      ownerId: 0 // Will be set later
    },
    {
      name: 'BTCPay Pro Hosting',
      description: 'Professional managed BTCPay Server hosting. We handle the technical complexity so you can focus on your business.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://btcpaypro.demo.com',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'pay@btcpaypro.demo.com',
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
      ownerId: 1
    },
    {
      name: 'Self-Hosted BTCPay Solutions',
      description: 'Help you set up and maintain your own BTCPay Server instance. Complete sovereignty over your payment infrastructure.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://selfhosted-btcpay.demo.com',
      contactEmail: 'sarah@bitcoinmarket.com',
      lightningAddress: 'selfhosted@btcpay.demo.com',
      pricingTiers: [
        { name: 'Setup', price: 50000, features: ['One-time setup', 'Documentation', '30-day support'] },
        { name: 'Managed', price: 15000, features: ['Monthly maintenance', 'Updates', 'Technical support'] }
      ],
      technicalSpecs: {
        uptime: '99.8%',
        apiAvailable: true,
        features: ['Full node', 'Complete control', 'Privacy-focused', 'Custom plugins']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 10,
      ownerId: 2
    },
    {
      name: 'BTCPay Europe',
      description: 'European BTCPay Server hosting with GDPR compliance. Servers located in Frankfurt and Amsterdam.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://btcpay.eu',
      contactEmail: 'james@btcinfra.com',
      lightningAddress: 'europe@btcpay.eu',
      pricingTiers: [
        { name: 'EU Starter', price: 8000, features: ['EU servers', 'GDPR compliant', '15 shops'] },
        { name: 'EU Business', price: 25000, features: ['Multi-region', 'Priority support', '50 shops'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        maxShops: 50,
        features: ['EU-only infrastructure', 'GDPR tools', 'Multi-language support']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 30,
      ownerId: 3
    },
    {
      name: 'BTCPay Asia Pacific',
      description: 'BTCPay Server hosting optimized for Asia-Pacific merchants. Servers in Singapore, Tokyo, and Sydney.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://btcpay.asia',
      contactEmail: 'maria@satsolutions.io',
      lightningAddress: 'apac@btcpay.asia',
      pricingTiers: [
        { name: 'APAC Basic', price: 6000, features: ['Regional servers', '10 shops', 'Email support'] },
        { name: 'APAC Pro', price: 18000, features: ['Multi-region', '40 shops', '24/7 support'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        maxShops: 40,
        features: ['Low latency APAC', 'Multi-currency', 'Local language support']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 20,
      ownerId: 4
    },
    {
      name: 'Privacy-First BTCPay',
      description: 'Anonymous BTCPay hosting with Tor support and maximum privacy. No KYC, paid in Bitcoin only.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'http://btcpay.onion',
      contactEmail: null,
      lightningAddress: 'privacy@btcpay.onion',
      pricingTiers: [
        { name: 'Anonymous', price: 12000, features: ['Tor-only access', 'No logs', '5 shops'] },
        { name: 'Maximum Privacy', price: 30000, features: ['Tor + VPN', 'Encrypted backups', '20 shops'] }
      ],
      technicalSpecs: {
        uptime: '99.5%',
        apiAvailable: true,
        maxShops: 20,
        features: ['Tor hidden service', 'No KYC', 'Bitcoin-only payments', 'Encrypted everything']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 8,
      ownerId: 5
    },
    {
      name: 'Enterprise BTCPay Solutions',
      description: 'White-label BTCPay Server for large enterprises. Custom branding, dedicated infrastructure, and SLA guarantees.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://enterprise-btcpay.demo.com',
      contactEmail: 'david@lightning.network',
      lightningAddress: 'enterprise@btcpay.demo.com',
      pricingTiers: [
        { name: 'Enterprise', price: 100000, features: ['Unlimited shops', 'White-label', 'Dedicated support team', '99.99% SLA'] }
      ],
      technicalSpecs: {
        uptime: '99.99%',
        apiAvailable: true,
        features: ['Custom branding', 'Dedicated infrastructure', 'Advanced analytics', 'Multi-tenant']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 100,
      ownerId: 5
    },
    {
      name: 'Merchant BTCPay Hosting',
      description: 'Specialized BTCPay hosting for high-volume merchants. Optimized for transaction throughput and reliability.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://merchant-btcpay.demo.com',
      contactEmail: 'emma@btcservices.com',
      lightningAddress: 'merchant@btcpay.demo.com',
      pricingTiers: [
        { name: 'High Volume', price: 35000, features: ['Unlimited transactions', '30 shops', 'Priority processing'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        maxShops: 30,
        features: ['High throughput', 'Load balancing', 'Advanced monitoring', 'DDoS protection']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 15,
      ownerId: 6
    },
    {
      name: 'Community BTCPay',
      description: 'Free community-run BTCPay Server for small businesses and individuals. Donation-supported.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://community.btcpay.demo.com',
      contactEmail: 'robert@paymentpro.io',
      lightningAddress: 'donate@community.btcpay.demo.com',
      pricingTiers: [
        { name: 'Free Tier', price: 0, features: ['2 shops', 'Community support', 'Basic features'] }
      ],
      technicalSpecs: {
        uptime: '99%',
        apiAvailable: true,
        maxShops: 2,
        features: ['Free forever', 'Community support', 'Open source']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 100,
      ownerId: 7
    },
    {
      name: 'BTCPay for Developers',
      description: 'BTCPay Server with extensive API access for developers. Includes testnet, mainnet, and signet environments.',
      serviceType: ServiceType.BTCPAY_SERVER,
      website: 'https://dev.btcpay.demo.com',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'dev@btcpay.demo.com',
      pricingTiers: [
        { name: 'Developer', price: 0, features: ['Testnet access', 'API playground', '5 test shops'] },
        { name: 'Production API', price: 15000, features: ['Mainnet access', 'Extended API limits', '20 shops'] }
      ],
      technicalSpecs: {
        uptime: '99.5%',
        apiAvailable: true,
        maxShops: 20,
        features: ['Full API access', 'Testnet & Mainnet', 'WebSocket support', 'SDK libraries']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 40,
      ownerId: 1
    },

    // BLFS Providers (~10)
    {
      name: 'BLFS Cloud Storage',
      description: 'Bitcoin Lightning File Storage provider. Host your files on Lightning Network with instant payments.',
      serviceType: ServiceType.BLFS,
      website: 'https://blfs.cloud',
      contactEmail: 'sarah@bitcoinmarket.com',
      lightningAddress: 'storage@blfs.cloud',
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
      ownerId: 2
    },
    {
      name: 'Lightning Media Host',
      description: 'Host images, videos, and media files with Lightning Network payments. Perfect for content creators.',
      serviceType: ServiceType.BLFS,
      website: 'https://lightningmedia.host',
      contactEmail: 'james@btcinfra.com',
      lightningAddress: 'media@lightningmedia.host',
      pricingTiers: [
        { name: 'Creator', price: 2000, features: ['25GB media storage', 'CDN delivery', 'Streaming support'] },
        { name: 'Pro Creator', price: 10000, features: ['250GB storage', 'Premium CDN', '4K streaming'] }
      ],
      technicalSpecs: {
        uptime: '99.8%',
        apiAvailable: true,
        features: ['Media transcoding', 'CDN delivery', 'Streaming', 'Lightning paywall']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 30,
      ownerId: 3
    },
    {
      name: 'Satoshi Backup Service',
      description: 'Encrypted backup service with Lightning Network payments. Pay only for what you use.',
      serviceType: ServiceType.BLFS,
      website: 'https://satoshibackup.io',
      contactEmail: 'maria@satsolutions.io',
      lightningAddress: 'backup@satoshibackup.io',
      pricingTiers: [
        { name: 'Personal', price: 500, features: ['5GB encrypted backup', 'Daily snapshots'] },
        { name: 'Business', price: 3000, features: ['50GB backup', 'Hourly snapshots', 'Version control'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['End-to-end encryption', 'Versioning', 'Automated backups', 'Multi-region']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 100,
      ownerId: 4
    },
    {
      name: 'Lightning CDN Pro',
      description: 'Content Delivery Network powered by Lightning Network. Global edge servers with micropayment support.',
      serviceType: ServiceType.BLFS,
      website: 'https://lightningcdn.pro',
      contactEmail: 'david@lightning.network',
      lightningAddress: 'cdn@lightningcdn.pro',
      pricingTiers: [
        { name: 'Startup', price: 8000, features: ['100GB bandwidth', '50GB storage', 'Global CDN'] },
        { name: 'Scale', price: 25000, features: ['1TB bandwidth', '500GB storage', 'Premium CDN'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        features: ['Global CDN', 'DDoS protection', 'Real-time analytics', 'Lightning paywall']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 40,
      ownerId: 5
    },
    {
      name: 'Decentralized File Archive',
      description: 'Long-term file archival on distributed systems. IPFS + Lightning Network for permanent storage.',
      serviceType: ServiceType.BLFS,
      website: 'https://archive.sats.network',
      contactEmail: 'emma@btcservices.com',
      lightningAddress: 'archive@sats.network',
      pricingTiers: [
        { name: 'Archive 10GB', price: 3000, features: ['10GB permanent storage', 'IPFS pinning'] },
        { name: 'Archive 100GB', price: 20000, features: ['100GB permanent storage', 'Multi-node pinning'] }
      ],
      technicalSpecs: {
        uptime: '99.99%',
        apiAvailable: true,
        features: ['IPFS integration', 'Permanent storage', 'Multi-node redundancy', 'Content addressing']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 60,
      ownerId: 6
    },
    {
      name: 'Lightning Storage API',
      description: 'Developer-friendly storage API with Lightning payments. S3-compatible interface.',
      serviceType: ServiceType.BLFS,
      website: 'https://api.lightningstorage.dev',
      contactEmail: 'robert@paymentpro.io',
      lightningAddress: 'api@lightningstorage.dev',
      pricingTiers: [
        { name: 'Developer', price: 0, features: ['1GB free storage', 'API access', 'Testnet'] },
        { name: 'Production', price: 5000, features: ['50GB storage', 'High-speed API', 'Mainnet'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['S3-compatible API', 'REST & GraphQL', 'SDKs', 'Lightning metered billing']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 80,
      ownerId: 7
    },
    {
      name: 'Private File Vault',
      description: 'Zero-knowledge encrypted file storage with Lightning payments. Maximum privacy guaranteed.',
      serviceType: ServiceType.BLFS,
      website: 'https://filevault.private',
      contactEmail: null,
      lightningAddress: 'vault@filevault.private',
      pricingTiers: [
        { name: 'Private 5GB', price: 2000, features: ['5GB encrypted', 'Zero-knowledge', 'Tor support'] },
        { name: 'Private 50GB', price: 15000, features: ['50GB encrypted', 'Multi-device sync'] }
      ],
      technicalSpecs: {
        uptime: '99.7%',
        apiAvailable: true,
        features: ['Zero-knowledge encryption', 'Client-side encryption', 'Tor hidden service', 'No metadata']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 25,
      ownerId: 5
    },
    {
      name: 'Team File Sharing Platform',
      description: 'Collaborative file sharing and storage with Lightning payments. Perfect for remote teams.',
      serviceType: ServiceType.BLFS,
      website: 'https://teamfiles.sats',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'team@teamfiles.sats',
      pricingTiers: [
        { name: 'Small Team', price: 5000, features: ['50GB shared', '5 users', 'Collaboration tools'] },
        { name: 'Large Team', price: 20000, features: ['500GB shared', '50 users', 'Advanced permissions'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['Real-time collaboration', 'Version control', 'Access controls', 'Activity logs']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 35,
      ownerId: 1
    },
    {
      name: 'Video Streaming Service',
      description: 'Host and stream videos with Lightning Network micropayments. Pay-per-view made simple.',
      serviceType: ServiceType.BLFS,
      website: 'https://videostream.sats',
      contactEmail: 'james@btcinfra.com',
      lightningAddress: 'video@videostream.sats',
      pricingTiers: [
        { name: 'Streamer', price: 10000, features: ['100GB video storage', '1TB bandwidth', 'HD streaming'] },
        { name: 'Pro Streamer', price: 35000, features: ['1TB video storage', '10TB bandwidth', '4K streaming'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        features: ['Adaptive streaming', 'Multiple quality levels', 'Lightning paywall', 'Analytics']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 20,
      ownerId: 3
    },
    {
      name: 'Document Cloud',
      description: 'Store and share documents with Lightning payments. Office file formats fully supported.',
      serviceType: ServiceType.BLFS,
      website: 'https://doccloud.btc',
      contactEmail: 'maria@satsolutions.io',
      lightningAddress: 'docs@doccloud.btc',
      pricingTiers: [
        { name: 'Personal', price: 1500, features: ['10GB documents', 'Format conversion', 'Online preview'] },
        { name: 'Professional', price: 7500, features: ['100GB documents', 'Advanced search', 'Collaboration'] }
      ],
      technicalSpecs: {
        uptime: '99.8%',
        apiAvailable: true,
        features: ['Document preview', 'Format conversion', 'Full-text search', 'Collaborative editing']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 45,
      ownerId: 4
    },

    // OTHER Service Providers (~10)
    {
      name: 'Lightning Node Hosting Co.',
      description: 'Managed Lightning node hosting for merchants and enthusiasts. We handle the technical complexity.',
      serviceType: ServiceType.OTHER,
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
      ownerId: 2
    },
    {
      name: 'Wallet API Services',
      description: 'RESTful wallet APIs for developers. Integrate Bitcoin payments into your app with our simple API.',
      serviceType: ServiceType.OTHER,
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
      ownerId: 1
    },
    {
      name: 'Point of Sale Systems',
      description: 'Bitcoin-native POS hardware and software. Turn any device into a Lightning payment terminal.',
      serviceType: ServiceType.OTHER,
      website: 'https://btcpos.systems',
      contactEmail: 'david@lightning.network',
      lightningAddress: 'pos@btcpos.systems',
      pricingTiers: [
        { name: 'Software Only', price: 5000, features: ['Mobile app', '1 terminal', 'Basic reporting'] },
        { name: 'Hardware Bundle', price: 50000, features: ['POS hardware', '5 terminals', 'Advanced analytics'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['NFC payments', 'QR codes', 'Offline mode', 'Inventory management']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 50,
      ownerId: 5
    },
    {
      name: 'Channel Management Service',
      description: 'Professional Lightning channel management. Optimize your node liquidity and routing fees.',
      serviceType: ServiceType.OTHER,
      website: 'https://channelmanager.ln',
      contactEmail: 'emma@btcservices.com',
      lightningAddress: 'channels@channelmanager.ln',
      pricingTiers: [
        { name: 'Basic', price: 10000, features: ['10 channels monitored', 'Monthly reports', 'Email alerts'] },
        { name: 'Pro', price: 30000, features: ['Unlimited channels', 'Real-time monitoring', 'Auto-rebalancing'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        features: ['Liquidity management', 'Auto-rebalancing', 'Fee optimization', 'Channel recommendations']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 25,
      ownerId: 6
    },
    {
      name: 'Watchtower Network',
      description: 'Distributed watchtower service for Lightning Network. Protect your channels 24/7.',
      serviceType: ServiceType.OTHER,
      website: 'https://watchtower.network',
      contactEmail: 'robert@paymentpro.io',
      lightningAddress: 'watch@watchtower.network',
      pricingTiers: [
        { name: 'Single Tower', price: 2000, features: ['1 watchtower', 'Basic monitoring', '10 channels'] },
        { name: 'Distributed', price: 8000, features: ['5 watchtowers', 'Geo-distributed', 'Unlimited channels'] }
      ],
      technicalSpecs: {
        uptime: '99.99%',
        apiAvailable: true,
        features: ['Multi-watchtower', 'Geo-distributed', 'Breach detection', 'Automated response']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 200,
      ownerId: 7
    },
    {
      name: 'NWC Connection Provider',
      description: 'Nostr Wallet Connect (NWC) service provider. Connect your Lightning wallet to any NWC-compatible app.',
      serviceType: ServiceType.OTHER,
      website: 'https://nwc.provider.io',
      contactEmail: 'james@btcinfra.com',
      lightningAddress: 'nwc@provider.io',
      pricingTiers: [
        { name: 'Free Tier', price: 0, features: ['5 connections', 'Basic relay access'] },
        { name: 'Premium', price: 5000, features: ['Unlimited connections', 'Premium relays', 'Advanced permissions'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['NWC protocol', 'Nostr relays', 'Permission management', 'Multi-wallet support']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 150,
      ownerId: 3
    },
    {
      name: 'Lightning Payment Gateway',
      description: 'Payment gateway for e-commerce platforms. WooCommerce, Shopify, and custom integrations.',
      serviceType: ServiceType.OTHER,
      website: 'https://lngateway.pay',
      contactEmail: 'maria@satsolutions.io',
      lightningAddress: 'gateway@lngateway.pay',
      pricingTiers: [
        { name: 'Small Shop', price: 10000, features: ['1% fee', '100 transactions/month', 'Basic plugins'] },
        { name: 'Enterprise', price: 40000, features: ['0.5% fee', 'Unlimited transactions', 'All plugins'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        features: ['E-commerce plugins', 'Payment pages', 'Invoicing', 'Subscription billing']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 35,
      ownerId: 4
    },
    {
      name: 'Bitcoin Invoicing Platform',
      description: 'Professional invoicing for freelancers and businesses. Accept Bitcoin and Lightning payments.',
      serviceType: ServiceType.OTHER,
      website: 'https://btcinvoice.pro',
      contactEmail: 'alex@lightningpay.io',
      lightningAddress: 'invoice@btcinvoice.pro',
      pricingTiers: [
        { name: 'Freelancer', price: 3000, features: ['Unlimited invoices', 'Payment tracking', 'Email reminders'] },
        { name: 'Business', price: 12000, features: ['Multi-user', 'Accounting integrations', 'API access'] }
      ],
      technicalSpecs: {
        uptime: '99.9%',
        apiAvailable: true,
        features: ['Invoice generation', 'Payment tracking', 'Accounting exports', 'Multi-currency']
      },
      isPublic: true,
      supportsNwc: true,
      slotsAvailable: 70,
      ownerId: 1
    },
    {
      name: 'Lightning Network Explorer',
      description: 'Advanced Lightning Network explorer and analytics. Monitor the network in real-time.',
      serviceType: ServiceType.OTHER,
      website: 'https://lnexplorer.network',
      contactEmail: 'david@lightning.network',
      lightningAddress: 'explorer@lnexplorer.network',
      pricingTiers: [
        { name: 'Free', price: 0, features: ['Public data access', 'Basic analytics'] },
        { name: 'Pro Analytics', price: 15000, features: ['Advanced analytics', 'API access', 'Historical data'] }
      ],
      technicalSpecs: {
        uptime: '99.95%',
        apiAvailable: true,
        features: ['Network topology', 'Channel analytics', 'Node statistics', 'Routing analysis']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 100,
      ownerId: 5
    },
    {
      name: 'Custody Solutions',
      description: 'Institutional-grade Bitcoin custody with Lightning integration. Multi-sig and cold storage.',
      serviceType: ServiceType.OTHER,
      website: 'https://custody.btc.pro',
      contactEmail: 'emma@btcservices.com',
      lightningAddress: 'custody@btc.pro',
      pricingTiers: [
        { name: 'Standard', price: 50000, features: ['Multi-sig', 'Cold storage', 'Insurance'] },
        { name: 'Premium', price: 200000, features: ['Dedicated HSM', 'Custom policies', 'Compliance tools'] }
      ],
      technicalSpecs: {
        uptime: '99.99%',
        apiAvailable: true,
        features: ['Multi-sig', 'Cold storage', 'Hardware security modules', 'Insurance coverage']
      },
      isPublic: true,
      supportsNwc: false,
      slotsAvailable: 15,
      ownerId: 6
    }
  ];

  const createdProviders: any[] = [];
  for (let i = 0; i < providers.length; i++) {
    const providerData = providers[i];
    // Set owner ID (cycling through infrastructure provider owners)
    providerData.ownerId = createdUsers[i % 8].id;

    const provider = await prisma.infrastructureProvider.create({
      data: providerData
    });
    createdProviders.push(provider);
    console.log(`✅ Created provider: ${providerData.name} (${providerData.serviceType})`);
  }

  // ============================================
  // CREATE SHOPS (~50 total)
  // ============================================
  console.log('🏪 Creating shops...');

  const shops = [
    // DIGITAL Shops (~25)
    {
      name: 'TechGadgets Pro',
      description: 'Latest tech gadgets and electronics with instant Lightning payments. Worldwide shipping available.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://techgadgets.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'tech@techgadgets.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Digital Art Gallery',
      description: 'NFT marketplace and digital art gallery. Discover unique digital artwork from artists worldwide.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://digitalart.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'art@digitalart.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'SaaS Startup Platform',
      description: 'Project management SaaS platform accepting Bitcoin subscriptions. Built for remote teams.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://saasplatform.io',
      contactEmail: 'tom@techmart.com',
      lightningAddress: 'subs@saasplatform.io',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 11
    },
    {
      name: 'Online Course Academy',
      description: 'Learn Bitcoin development and Lightning Network. Courses paid with Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://btccourses.academy',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'learn@btccourses.academy',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    },
    {
      name: 'VPN Privacy Service',
      description: 'Anonymous VPN service with Lightning payments. No logs, no registration required.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://vpnprivacy.sats',
      contactEmail: 'john@coffeeplace.com',
      lightningAddress: 'vpn@vpnprivacy.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 13
    },
    {
      name: 'Gaming Marketplace',
      description: 'Buy and sell in-game items with Bitcoin. Instant delivery, secure escrow.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://gamingmarket.sats',
      contactEmail: 'amy@boutique.store',
      lightningAddress: 'game@gamingmarket.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 14
    },
    {
      name: 'Web Hosting Service',
      description: 'Bitcoin-native web hosting. Pay-as-you-go with Lightning Network.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://btchosting.net',
      contactEmail: 'paul@bookshop.net',
      lightningAddress: 'host@btchosting.net',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 15
    },
    {
      name: 'Software Templates Store',
      description: 'Premium website templates and UI kits. One-time purchase with Bitcoin.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://templates.sats',
      contactEmail: 'nina@wellness.io',
      lightningAddress: 'templates@sats.io',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 16
    },
    {
      name: 'Music Streaming Platform',
      description: 'Independent music streaming. Artists paid directly via Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://musicstream.sats',
      contactEmail: 'carlos@restaurant.mx',
      lightningAddress: 'music@musicstream.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 17
    },
    {
      name: 'Ebook Publishing Platform',
      description: 'Publish and sell ebooks with Bitcoin. Authors keep 95% of revenue.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://ebookpub.btc',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'books@ebookpub.btc',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Freelance Services Hub',
      description: 'Hire freelancers and pay with Bitcoin. Escrow and milestone payments.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://freelance.sats',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'work@freelance.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Stock Photos Library',
      description: 'High-quality stock photos. Pay per download with Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://stockphotos.btc',
      contactEmail: 'tom@techmart.com',
      lightningAddress: 'photos@stockphotos.btc',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 11
    },
    {
      name: 'Cloud Storage Service',
      description: 'Encrypted cloud storage with Lightning payments. 2TB for 10k sats/month.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://cloudstorage.sats',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'cloud@cloudstorage.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    },
    {
      name: 'API Marketplace',
      description: 'Buy and sell API access with Bitcoin. Pay per call with Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://apimarket.io',
      contactEmail: 'john@coffeeplace.com',
      lightningAddress: 'api@apimarket.io',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 13
    },
    {
      name: 'Email Newsletter Platform',
      description: 'Send newsletters and charge subscribers with Lightning. No middlemen.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://newsletter.sats',
      contactEmail: 'amy@boutique.store',
      lightningAddress: 'news@newsletter.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 14
    },
    {
      name: 'Bitcoin Consulting Services',
      description: 'Expert Bitcoin and Lightning consulting. Hourly billing via Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://btcconsulting.pro',
      contactEmail: 'paul@bookshop.net',
      lightningAddress: 'consult@btcconsulting.pro',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 15
    },
    {
      name: 'Podcast Hosting Service',
      description: 'Host your podcast and earn sats from listeners. Value4Value model.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://podcasthost.sats',
      contactEmail: 'nina@wellness.io',
      lightningAddress: 'podcast@podcasthost.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 16
    },
    {
      name: 'Online Gaming Tournament',
      description: 'Esports tournaments with Bitcoin prize pools. Entry fees via Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://esports.sats',
      contactEmail: 'carlos@restaurant.mx',
      lightningAddress: 'tournament@esports.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 17
    },
    {
      name: 'Virtual Events Platform',
      description: 'Host virtual conferences and webinars. Ticket sales via Lightning.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://virtualevents.btc',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'events@virtualevents.btc',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Software Licensing Service',
      description: 'Software license management with Bitcoin payments. Automated delivery.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://licensing.sats',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'license@licensing.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Mobile App Marketplace',
      description: 'Discover and purchase mobile apps with Bitcoin. No app store fees.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://appmarket.sats',
      contactEmail: 'tom@techmart.com',
      lightningAddress: 'apps@appmarket.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 11
    },
    {
      name: 'Document Signing Service',
      description: 'Digital document signing with Bitcoin timestamping. Legally binding.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://docsign.btc',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'sign@docsign.btc',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    },
    {
      name: 'AI Image Generator',
      description: 'Generate AI images with Lightning micropayments. Pay per generation.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://aiimage.sats',
      contactEmail: 'john@coffeeplace.com',
      lightningAddress: 'ai@aiimage.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 13
    },
    {
      name: 'Translation Services Hub',
      description: 'Professional translation services paid in Bitcoin. 100+ languages supported.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://translate.sats',
      contactEmail: 'amy@boutique.store',
      lightningAddress: 'translate@translate.sats',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 14
    },
    {
      name: 'Code Repository Hosting',
      description: 'Private Git repositories with Bitcoin payments. Developer-focused.',
      shopType: ShopType.DIGITAL,
      address: null,
      latitude: null,
      longitude: null,
      isPhysicalLocation: false,
      website: 'https://codehost.btc',
      contactEmail: 'paul@bookshop.net',
      lightningAddress: 'git@codehost.btc',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 15
    },

    // PHYSICAL Shops (~25)
    {
      name: 'Mi Tienda Demo',
      description: 'Demo shop for testing integrations. We sell everything you need for Bitcoin payments.',
      shopType: ShopType.PHYSICAL,
      address: 'Calle Bitcoin 123, Madrid, Spain',
      latitude: 40.4168,
      longitude: -3.7038,
      isPhysicalLocation: true,
      website: 'https://tienda.demo.com',
      contactEmail: 'owner@shop.demo',
      lightningAddress: 'tienda@lightning.example.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 8
    },
    {
      name: 'CryptoCafe',
      description: 'Bitcoin-friendly coffee shop. Premium coffee and pastries, pay with Lightning!',
      shopType: ShopType.PHYSICAL,
      address: '789 Blockchain Ave, New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
      isPhysicalLocation: true,
      website: 'https://cryptocafe.demo.com',
      contactEmail: 'contact@cryptocafe.demo.com',
      lightningAddress: 'coffee@cryptocafe.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Fashion Forward',
      description: 'Sustainable fashion store accepting Bitcoin. Eco-friendly clothing for conscious consumers.',
      shopType: ShopType.PHYSICAL,
      address: '321 Green Street, Portland, OR, USA',
      latitude: 45.5152,
      longitude: -122.6784,
      isPhysicalLocation: true,
      website: 'https://fashionforward.demo.com',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'fashion@fashionforward.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Artisan Coffee Roasters',
      description: 'Small batch coffee roasters accepting Bitcoin. Premium beans from around the world.',
      shopType: ShopType.PHYSICAL,
      address: '555 Bean Lane, Seattle, WA, USA',
      latitude: 47.6062,
      longitude: -122.3321,
      isPhysicalLocation: true,
      website: 'https://artisancoffee.demo.com',
      contactEmail: 'owner@shop.demo',
      lightningAddress: 'beans@artisancoffee.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 8
    },
    {
      name: 'Vintage Vinyl Records',
      description: 'Rare vinyl collection shop. Physical store with Lightning payments.',
      shopType: ShopType.PHYSICAL,
      address: '101 Music Row, Nashville, TN, USA',
      latitude: 36.1627,
      longitude: -86.7816,
      isPhysicalLocation: true,
      website: 'https://vintagevinyl.demo.com',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'vinyl@vintagevinyl.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Organic Farm Market',
      description: 'Farm-to-table marketplace. Fresh organic produce with Bitcoin payments.',
      shopType: ShopType.PHYSICAL,
      address: '789 Farm Road, Austin, TX, USA',
      latitude: 30.2672,
      longitude: -97.7431,
      isPhysicalLocation: true,
      website: 'https://organicfarm.demo.com',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'farm@organicfarm.demo.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Bitcoin Bookstore',
      description: 'Independent bookstore accepting Bitcoin. Books, magazines, and rare editions.',
      shopType: ShopType.PHYSICAL,
      address: '234 Library Street, Boston, MA, USA',
      latitude: 42.3601,
      longitude: -71.0589,
      isPhysicalLocation: true,
      website: 'https://btcbookstore.com',
      contactEmail: 'paul@bookshop.net',
      lightningAddress: 'books@btcbookstore.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 15
    },
    {
      name: 'Health & Wellness Center',
      description: 'Holistic health center accepting Bitcoin. Yoga, massage, and nutrition counseling.',
      shopType: ShopType.PHYSICAL,
      address: '456 Wellness Way, Boulder, CO, USA',
      latitude: 40.0150,
      longitude: -105.2705,
      isPhysicalLocation: true,
      website: 'https://wellnesscenter.health',
      contactEmail: 'nina@wellness.io',
      lightningAddress: 'health@wellnesscenter.health',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 16
    },
    {
      name: 'Taco Lightning',
      description: 'Authentic Mexican restaurant with Lightning payments. Fast food, faster payments.',
      shopType: ShopType.PHYSICAL,
      address: '678 Taco Street, San Diego, CA, USA',
      latitude: 32.7157,
      longitude: -117.1611,
      isPhysicalLocation: true,
      website: 'https://tacolightning.mx',
      contactEmail: 'carlos@restaurant.mx',
      lightningAddress: 'tacos@tacolightning.mx',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 17
    },
    {
      name: 'Bitcoin Barbershop',
      description: 'Traditional barbershop with modern payments. Haircuts paid in sats.',
      shopType: ShopType.PHYSICAL,
      address: '890 Barber Lane, Chicago, IL, USA',
      latitude: 41.8781,
      longitude: -87.6298,
      isPhysicalLocation: true,
      website: 'https://btcbarber.shop',
      contactEmail: 'john@coffeeplace.com',
      lightningAddress: 'cuts@btcbarber.shop',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 13
    },
    {
      name: 'Craft Beer Brewery',
      description: 'Local craft brewery accepting Bitcoin. Taproom and bottle shop.',
      shopType: ShopType.PHYSICAL,
      address: '123 Brew Street, Denver, CO, USA',
      latitude: 39.7392,
      longitude: -104.9903,
      isPhysicalLocation: true,
      website: 'https://craftbeer.brewery',
      contactEmail: 'tom@techmart.com',
      lightningAddress: 'beer@craftbeer.brewery',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 11
    },
    {
      name: 'Bike Repair Shop',
      description: 'Bicycle sales and repairs with Bitcoin payments. E-bikes a specialty.',
      shopType: ShopType.PHYSICAL,
      address: '345 Cycle Road, Portland, OR, USA',
      latitude: 45.5155,
      longitude: -122.6793,
      isPhysicalLocation: true,
      website: 'https://bikerepair.shop',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'bikes@bikerepair.shop',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    },
    {
      name: 'Pet Supply Store',
      description: 'Pet food, toys, and supplies. Bitcoin-friendly pet shop.',
      shopType: ShopType.PHYSICAL,
      address: '567 Pet Avenue, Miami, FL, USA',
      latitude: 25.7617,
      longitude: -80.1918,
      isPhysicalLocation: true,
      website: 'https://petsupply.store',
      contactEmail: 'amy@boutique.store',
      lightningAddress: 'pets@petsupply.store',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 14
    },
    {
      name: 'Electronics Repair Center',
      description: 'Smartphone and laptop repairs. Pay with Lightning while you wait.',
      shopType: ShopType.PHYSICAL,
      address: '789 Tech Street, San Francisco, CA, USA',
      latitude: 37.7749,
      longitude: -122.4194,
      isPhysicalLocation: true,
      website: 'https://electrorepair.center',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'repair@electrorepair.center',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Yoga Studio',
      description: 'Community yoga studio accepting Bitcoin. Drop-in classes and memberships.',
      shopType: ShopType.PHYSICAL,
      address: '901 Zen Lane, Santa Monica, CA, USA',
      latitude: 34.0195,
      longitude: -118.4912,
      isPhysicalLocation: true,
      website: 'https://yogastudio.om',
      contactEmail: 'nina@wellness.io',
      lightningAddress: 'yoga@yogastudio.om',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 16
    },
    {
      name: 'Hardware Store',
      description: 'Local hardware store with Bitcoin payments. Tools, lumber, and supplies.',
      shopType: ShopType.PHYSICAL,
      address: '234 Hardware Ave, Philadelphia, PA, USA',
      latitude: 39.9526,
      longitude: -75.1652,
      isPhysicalLocation: true,
      website: 'https://hardwarestore.local',
      contactEmail: 'paul@bookshop.net',
      lightningAddress: 'tools@hardwarestore.local',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 15
    },
    {
      name: 'Bakery & Pastry Shop',
      description: 'French bakery accepting Lightning. Fresh bread and pastries daily.',
      shopType: ShopType.PHYSICAL,
      address: '456 Bread Street, New Orleans, LA, USA',
      latitude: 29.9511,
      longitude: -90.0715,
      isPhysicalLocation: true,
      website: 'https://bakery.fresh',
      contactEmail: 'carlos@restaurant.mx',
      lightningAddress: 'bread@bakery.fresh',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 17
    },
    {
      name: 'Art Gallery',
      description: 'Contemporary art gallery. Purchase original artworks with Bitcoin.',
      shopType: ShopType.PHYSICAL,
      address: '678 Gallery Row, Los Angeles, CA, USA',
      latitude: 34.0522,
      longitude: -118.2437,
      isPhysicalLocation: true,
      website: 'https://artgallery.art',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'art@artgallery.art',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    },
    {
      name: 'Coworking Space',
      description: 'Bitcoin-native coworking space. Daily, weekly, and monthly memberships.',
      shopType: ShopType.PHYSICAL,
      address: '890 Work Street, Austin, TX, USA',
      latitude: 30.2672,
      longitude: -97.7431,
      isPhysicalLocation: true,
      website: 'https://cowork.space',
      contactEmail: 'tom@techmart.com',
      lightningAddress: 'desk@cowork.space',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 11
    },
    {
      name: 'Pharmacy & Health Store',
      description: 'Local pharmacy accepting Bitcoin. Prescriptions and over-the-counter medications.',
      shopType: ShopType.PHYSICAL,
      address: '123 Health Plaza, Phoenix, AZ, USA',
      latitude: 33.4484,
      longitude: -112.0740,
      isPhysicalLocation: true,
      website: 'https://pharmacy.health',
      contactEmail: 'john@coffeeplace.com',
      lightningAddress: 'rx@pharmacy.health',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 13
    },
    {
      name: 'Hotel Bitcoin',
      description: 'Boutique hotel with Lightning payments. Book rooms with sats.',
      shopType: ShopType.PHYSICAL,
      address: '345 Hotel Drive, Las Vegas, NV, USA',
      latitude: 36.1699,
      longitude: -115.1398,
      isPhysicalLocation: true,
      website: 'https://hotelbitcoin.com',
      contactEmail: 'owner@shop.demo',
      lightningAddress: 'rooms@hotelbitcoin.com',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 8
    },
    {
      name: 'Music Instrument Store',
      description: 'Guitars, drums, and musical instruments. Bitcoin payments accepted.',
      shopType: ShopType.PHYSICAL,
      address: '567 Music Road, Nashville, TN, USA',
      latitude: 36.1627,
      longitude: -86.7816,
      isPhysicalLocation: true,
      website: 'https://musicinstruments.shop',
      contactEmail: 'mike@cryptoshop.net',
      lightningAddress: 'music@musicinstruments.shop',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 9
    },
    {
      name: 'Outdoor Gear Shop',
      description: 'Camping, hiking, and outdoor equipment. Adventure with Bitcoin.',
      shopType: ShopType.PHYSICAL,
      address: '789 Adventure Trail, Salt Lake City, UT, USA',
      latitude: 40.7608,
      longitude: -111.8910,
      isPhysicalLocation: true,
      website: 'https://outdoorgear.shop',
      contactEmail: 'amy@boutique.store',
      lightningAddress: 'outdoor@outdoorgear.shop',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 14
    },
    {
      name: 'Grocery Market',
      description: 'Local grocery store accepting Bitcoin. Fresh produce and everyday essentials.',
      shopType: ShopType.PHYSICAL,
      address: '901 Market Street, San Jose, CA, USA',
      latitude: 37.3382,
      longitude: -121.8863,
      isPhysicalLocation: true,
      website: 'https://grocerymarket.local',
      contactEmail: 'lisa@digitalstore.com',
      lightningAddress: 'grocery@grocerymarket.local',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 10
    },
    {
      name: 'Tattoo Parlor',
      description: 'Custom tattoos and piercings. Book appointments and pay with Lightning.',
      shopType: ShopType.PHYSICAL,
      address: '234 Ink Street, Portland, OR, USA',
      latitude: 45.5152,
      longitude: -122.6784,
      isPhysicalLocation: true,
      website: 'https://tattooparlor.ink',
      contactEmail: 'sofia@artshop.io',
      lightningAddress: 'ink@tattooparlor.ink',
      acceptsBitcoin: true,
      isPublic: true,
      ownerId: 12
    }
  ];

  const createdShops: any[] = [];
  for (let i = 0; i < shops.length; i++) {
    const shopData = shops[i];
    const shop = await prisma.shop.create({
      data: shopData
    });
    createdShops.push(shop);
    console.log(`✅ Created shop: ${shopData.name} (${shopData.shopType})`);
  }

  // ============================================
  // CREATE CONNECTIONS (~40 connections)
  // ============================================
  console.log('🔗 Creating connections...');

  const connections = [
    // Active connections
    { shopId: createdShops[0].id, providerId: createdProviders[0].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 10000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[1].id, providerId: createdProviders[1].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 20000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[2].id, providerId: createdProviders[0].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[3].id, providerId: createdProviders[2].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 15000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[4].id, providerId: createdProviders[3].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[5].id, providerId: createdProviders[1].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 25000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[6].id, providerId: createdProviders[4].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[7].id, providerId: createdProviders[0].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[8].id, providerId: createdProviders[5].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 30000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[9].id, providerId: createdProviders[6].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[10].id, providerId: createdProviders[1].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 20000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[11].id, providerId: createdProviders[7].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[12].id, providerId: createdProviders[10].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 5000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[13].id, providerId: createdProviders[11].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 10000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[14].id, providerId: createdProviders[12].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[15].id, providerId: createdProviders[13].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 8000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[16].id, providerId: createdProviders[14].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[17].id, providerId: createdProviders[15].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[18].id, providerId: createdProviders[20].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 15000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[19].id, providerId: createdProviders[21].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 25000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[20].id, providerId: createdProviders[22].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[21].id, providerId: createdProviders[0].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 10000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[22].id, providerId: createdProviders[1].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 20000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[23].id, providerId: createdProviders[23].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[24].id, providerId: createdProviders[24].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[25].id, providerId: createdProviders[0].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[26].id, providerId: createdProviders[1].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 10000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[27].id, providerId: createdProviders[2].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[28].id, providerId: createdProviders[25].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 12000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[29].id, providerId: createdProviders[26].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },

    // Pending connections
    { shopId: createdShops[30].id, providerId: createdProviders[3].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.PENDING, subscriptionAmount: 15000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[31].id, providerId: createdProviders[4].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.PENDING },
    { shopId: createdShops[32].id, providerId: createdProviders[27].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.PENDING, subscriptionAmount: 20000, subscriptionInterval: 'monthly' },

    // Disconnected connections
    { shopId: createdShops[33].id, providerId: createdProviders[5].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.DISCONNECTED, subscriptionAmount: 10000, subscriptionInterval: 'monthly' },
    { shopId: createdShops[34].id, providerId: createdProviders[6].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.DISCONNECTED },

    // Some shops with multiple providers
    { shopId: createdShops[0].id, providerId: createdProviders[20].id, connectionType: ConnectionType.SELF_REPORTED, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[1].id, providerId: createdProviders[10].id, connectionType: ConnectionType.FREE_LISTING, status: ConnectionStatus.ACTIVE },
    { shopId: createdShops[2].id, providerId: createdProviders[21].id, connectionType: ConnectionType.PAID_SUBSCRIPTION, status: ConnectionStatus.ACTIVE, subscriptionAmount: 5000, subscriptionInterval: 'monthly' },
  ];

  const createdConnections: any[] = [];
  for (const connectionData of connections) {
    const connection = await prisma.connection.create({
      data: connectionData
    });
    createdConnections.push(connection);
    const shop = createdShops.find((s: any) => s.id === connectionData.shopId);
    const provider = createdProviders.find((p: any) => p.id === connectionData.providerId);
    console.log(`✅ Connected: ${shop?.name} → ${provider?.name} (${connectionData.connectionType}, ${connectionData.status})`);
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Database seeding completed!');
  console.log(`📊 Summary:`);
  console.log(`   👥 Users: ${createdUsers.length}`);
  console.log(`   🏗️  Infrastructure Providers: ${createdProviders.length}`);
  console.log(`      - BTCPAY_SERVER: ${createdProviders.filter((p: any) => p.serviceType === ServiceType.BTCPAY_SERVER).length}`);
  console.log(`      - BLFS: ${createdProviders.filter((p: any) => p.serviceType === ServiceType.BLFS).length}`);
  console.log(`      - OTHER: ${createdProviders.filter((p: any) => p.serviceType === ServiceType.OTHER).length}`);
  console.log(`   🏪 Shops: ${createdShops.length}`);
  console.log(`      - DIGITAL: ${createdShops.filter((s: any) => s.shopType === ShopType.DIGITAL).length}`);
  console.log(`      - PHYSICAL: ${createdShops.filter((s: any) => s.shopType === ShopType.PHYSICAL).length}`);
  console.log(`   🔗 Connections: ${createdConnections.length}`);
  console.log(`      - ACTIVE: ${createdConnections.filter((c: any) => c.status === ConnectionStatus.ACTIVE).length}`);
  console.log(`      - PENDING: ${createdConnections.filter((c: any) => c.status === ConnectionStatus.PENDING).length}`);
  console.log(`      - DISCONNECTED: ${createdConnections.filter((c: any) => c.status === ConnectionStatus.DISCONNECTED).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
