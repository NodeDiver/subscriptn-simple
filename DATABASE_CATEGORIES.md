# Bitinfrashop Database Categories & Filters

Complete reference of all categories, filters, and enum values in the Bitinfrashop database.

## Table of Contents
1. [Infrastructure Providers](#infrastructure-providers)
2. [Shops](#shops)
3. [Connections](#connections)
4. [Summary Statistics](#summary-statistics)

---

## Infrastructure Providers

Infrastructure providers are Bitcoin/Lightning service providers that shops can connect to.

### Service Type Categories
```
Infrastructure Providers
├── BTCPAY_SERVER (BTCPay Server)
│   ├── Self-hosted instances
│   ├── Managed hosting services
│   ├── Enterprise solutions
│   ├── Regional providers (EU, APAC, Americas)
│   ├── Privacy-focused providers
│   ├── Developer-oriented services
│   └── Community/Free tiers
│
├── BLFS (Bitcoin Lightning File Storage)
│   ├── File storage services
│   ├── Media hosting (images, videos)
│   ├── Backup services
│   ├── CDN providers
│   ├── Document management
│   ├── Team collaboration tools
│   └── Video streaming platforms
│
└── OTHER (Other Bitcoin Services)
    ├── Lightning node hosting
    ├── Wallet APIs
    ├── Point of Sale (POS) systems
    ├── Channel management services
    ├── Watchtower services
    ├── NWC (Nostr Wallet Connect) providers
    ├── Payment gateways
    ├── Invoicing platforms
    ├── Network explorers
    └── Custody solutions
```

### Additional Provider Properties

**NWC Support** (`supportsNwc`)
- `true` - Supports Nostr Wallet Connect
- `false` - Does not support NWC

**Slots Availability** (`slotsAvailable`)
- `null` - Unlimited slots
- `number` - Specific number of available connection slots

**Pricing Information** (`pricingTiers`)
- JSON array of pricing tiers
- Each tier includes: name, price (in sats), features

**Technical Specs** (`technicalSpecs`)
- JSON object with capabilities
- Includes: uptime, API availability, features list

---

## Shops

Shops are businesses that accept Bitcoin/Lightning payments.

### Shop Type Categories
```
Shops
├── DIGITAL (Online/Digital Shops)
│   ├── E-commerce platforms
│   ├── Digital goods (software, courses, templates)
│   ├── SaaS platforms
│   ├── VPN/Privacy services
│   ├── Gaming marketplaces
│   ├── Web hosting
│   ├── Music/Video streaming
│   ├── Ebook publishing
│   ├── Freelance services
│   ├── Stock photo libraries
│   ├── Cloud storage
│   ├── API marketplaces
│   ├── Newsletter platforms
│   ├── Consulting services
│   ├── Podcast hosting
│   ├── Virtual events
│   ├── Software licensing
│   ├── Mobile app marketplaces
│   ├── Document signing
│   ├── AI services
│   ├── Translation services
│   └── Code repository hosting
│
└── PHYSICAL (Real World/Physical Locations)
    ├── Cafes & Restaurants
    ├── Retail stores
    │   ├── Electronics
    │   ├── Fashion/Clothing
    │   ├── Books
    │   ├── Music instruments
    │   ├── Pet supplies
    │   ├── Hardware
    │   ├── Outdoor gear
    │   └── Grocery/Markets
    ├── Health & Wellness
    │   ├── Pharmacies
    │   ├── Yoga studios
    │   └── Wellness centers
    ├── Hospitality
    │   ├── Hotels
    │   └── Coworking spaces
    ├── Services
    │   ├── Barbershops
    │   ├── Tattoo parlors
    │   ├── Repair shops (bikes, electronics)
    │   └── Bakeries
    ├── Entertainment
    │   ├── Breweries/Bars
    │   └── Art galleries
    └── Specialty
        ├── Farm markets
        ├── Coffee roasters
        └── Vinyl record shops
```

### Shop Source Filter
```
Shop Sources
├── local (This App)
│   └── Shops created in Bitinfrashop database
│
└── btcmap (BTCMap)
    └── Shops fetched from BTCMap API
```

### Shop Properties

**Location Type** (`isPhysicalLocation`)
- `true` - Has a physical address and coordinates
- `false` - Online/Digital only

**Bitcoin Acceptance** (`acceptsBitcoin`)
- `true` - Accepts Bitcoin payments
- `false` - Does not accept Bitcoin

**Lightning Address** (`lightningAddress`)
- Optional Lightning address for payments
- Format: `user@domain.com`

---

## Connections

Connections link shops to infrastructure providers.

### Connection Type Categories
```
Connection Types
├── PAID_SUBSCRIPTION
│   ├── Recurring monthly/yearly payments
│   ├── Subscription amount in sats
│   ├── Can include NWC connection string
│   └── Tracked payment history
│
├── FREE_LISTING
│   ├── No payment required
│   ├── Basic tier or promotional listing
│   └── No subscription tracking
│
└── SELF_REPORTED
    ├── Shop claims to use provider
    ├── Not verified by provider
    └── No payment integration
```

### Connection Status Categories
```
Connection Status
├── ACTIVE
│   └── Connection is currently active and working
│
├── PENDING
│   └── Connection requested but not yet approved
│
└── DISCONNECTED
    └── Connection was active but has been terminated
```

### Connection Properties

**Subscription Details** (PAID_SUBSCRIPTION only)
- `subscriptionAmount` - Amount in satoshis
- `subscriptionInterval` - 'monthly', 'yearly', etc.
- `nwcConnectionString` - Encrypted NWC connection (optional)

**Payment History** (PAID_SUBSCRIPTION only)
- Tracked in `PaymentHistory` model
- Includes: amount, date, status, payment method
- Lightning preimage for verification

---

## Summary Statistics

### Data Distribution (Mockup Data)

**Infrastructure Providers: 30 Total**
```
BTCPAY_SERVER: 10 providers (33%)
├── Demo BTCPay Server
├── BTCPay Pro Hosting
├── Self-Hosted BTCPay Solutions
├── BTCPay Europe
├── BTCPay Asia Pacific
├── Privacy-First BTCPay
├── Enterprise BTCPay Solutions
├── Merchant BTCPay Hosting
├── Community BTCPay
└── BTCPay for Developers

BLFS: 10 providers (33%)
├── BLFS Cloud Storage
├── Lightning Media Host
├── Satoshi Backup Service
├── Lightning CDN Pro
├── Decentralized File Archive
├── Lightning Storage API
├── Private File Vault
├── Team File Sharing Platform
├── Video Streaming Service
└── Document Cloud

OTHER: 10 providers (33%)
├── Lightning Node Hosting Co.
├── Wallet API Services
├── Point of Sale Systems
├── Channel Management Service
├── Watchtower Network
├── NWC Connection Provider
├── Lightning Payment Gateway
├── Bitcoin Invoicing Platform
├── Lightning Network Explorer
└── Custody Solutions
```

**Shops: 50 Total**
```
DIGITAL: 25 shops (50%)
└── E-commerce, SaaS, Digital services, etc.

PHYSICAL: 25 shops (50%)
└── Cafes, retail stores, services, etc.
```

**Connections: ~38 Total**
```
By Type:
├── PAID_SUBSCRIPTION: ~60%
├── FREE_LISTING: ~30%
└── SELF_REPORTED: ~10%

By Status:
├── ACTIVE: ~86%
├── PENDING: ~8%
└── DISCONNECTED: ~6%
```

---

## Filter Combinations

### Available Filter Combinations

**Infrastructure Provider Filters:**
1. Service Type: `BTCPAY_SERVER | BLFS | OTHER | all`
2. NWC Support: `true | false | all`
3. Slots Available: `has_slots | unlimited | all`
4. Search: text search in name/description

**Shop Filters:**
1. Shop Type: `DIGITAL | PHYSICAL | all`
2. Source: `local | btcmap | all`
3. Location: has coordinates (latitude/longitude)
4. Search: text search in name/description/address

**Connection Filters:**
1. Type: `PAID_SUBSCRIPTION | FREE_LISTING | SELF_REPORTED | all`
2. Status: `ACTIVE | PENDING | DISCONNECTED | all`
3. By Shop: filter by specific shop ID
4. By Provider: filter by specific provider ID

### Example Filter Queries

```
# Digital shops from local database only
type=shops&shopType=DIGITAL&source=local

# BTCPay Server providers with NWC support
type=infrastructure&serviceType=BTCPAY_SERVER

# Physical shops from BTCMap
type=shops&shopType=PHYSICAL&source=btcmap

# All active paid subscriptions
type=connections&connectionType=PAID_SUBSCRIPTION&status=ACTIVE

# BLFS providers with available slots
type=infrastructure&serviceType=BLFS
```

---

## Database Schema Reference

### Enum Types

**ServiceType**
```prisma
enum ServiceType {
  BTCPAY_SERVER       // BTCPay Server
  BLFS                // Bitcoin Lightning File System
  OTHER               // Other Bitcoin services
}
```

**ShopType**
```prisma
enum ShopType {
  DIGITAL             // Online/digital shop
  PHYSICAL            // Physical location
}
```

**ConnectionType**
```prisma
enum ConnectionType {
  PAID_SUBSCRIPTION   // Shop pays provider via NWC
  FREE_LISTING        // Free connection
  SELF_REPORTED       // Shop claims to use provider (not verified)
}
```

**ConnectionStatus**
```prisma
enum ConnectionStatus {
  ACTIVE
  PENDING
  DISCONNECTED
}
```

---

## Notes

### Filtering Logic

- **Additive Filters**: Shop filters work with AND logic
  - Example: `shopType=DIGITAL + source=local` = only digital shops from local database

- **Source Inference**: BTCMap shops automatically infer shop type from coordinates
  - Has coordinates (lat/long) = `PHYSICAL`
  - No coordinates = `DIGITAL`

- **Slot Calculation**: Provider available slots calculated dynamically
  - `available_slots = total_slots - active_connections_count`
  - `null` slots = unlimited capacity

### Search Functionality

- Case-insensitive text search
- Searches across:
  - Shop: name, description, address
  - Provider: name, description
- Uses PostgreSQL `contains` with `insensitive` mode

---

**Last Updated**: October 2025
**Database Version**: 1.0
**Total Entities**: ~118 (20 users, 30 providers, 50 shops, ~38 connections)
