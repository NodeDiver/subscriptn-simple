# Bitinfrashop

_Bitcoin Infrastructure & Shop Marketplace. Lightning fast. ⚡_

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Hackathon](https://img.shields.io/badge/hackathon-Geyser%202025-orange)

## 🎯 Overview

**Bitinfrashop** is a Bitcoin infrastructure and shop marketplace that connects infrastructure providers (BTCPay Server, BLFS, and more) with Bitcoin-accepting shops. Built with Next.js 15, TypeScript, and PostgreSQL, it enables automated Lightning payments and seamless connections through NWC (Nostr Wallet Connect).

## ✨ Features

- **🏠 Unified Dashboard**: Complete infrastructure and shops management
- **⚡ Lightning Payments**: NWC integration for secure Bitcoin payments
- **🗺️ BTCMap Integration**: Real-time discovery of Bitcoin-accepting shops worldwide with interactive map
- **🏪 Marketplace**: Browse infrastructure providers and shops with filtering, search, and categories
- **🖥️ BTCPay Marketplace**: Browse and connect to public servers
- **🛍️ Shop Management**: Create shops with automated subscriptions
- **🔐 Secure Wallets**: Encrypted NWC connection strings
- **👁️ Visibility Control**: Public/private options for servers and shops
- **📊 Real-time Tracking**: Live payment monitoring
- **🐳 Docker Ready**: Full containerization with PostgreSQL
- **🔒 Enterprise Security**: Rate limiting, validation, and encryption

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Lightning wallet (NWC compatible)
- PostgreSQL (or use Docker)

### Installation

```bash
# Clone and install
git clone https://github.com/NodeDiver/bitinfrashop.git
cd bitinfrashop
npm install

# Configure environment
cp env.example .env.local
# Edit .env.local with your settings

# Start development server
npm run dev
```

### Docker Setup

```bash
# Start with Docker Compose
docker-compose up -d

# Access application
open http://localhost:3003
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5433/bitinfrashop

# Session & Security
SESSION_SECRET=your-session-secret
NWC_ENCRYPTION_KEY=your-32-char-hex-key

# Optional
NODE_ENV=development
```

## 💡 Usage

**Bitinfrashop is a unified platform** - all users have access to all features without role distinctions:

### Getting Started
1. **Register**: Create your account with username and password
2. **Explore**: Browse infrastructure providers and Bitcoin-accepting shops
3. **List Services**: Add your BTCPay server, Lightning node, or other Bitcoin infrastructure
4. **Manage Shops**: Create and list your Bitcoin-accepting business
5. **Connect**: Make connections with optional NWC-powered subscriptions
6. **Discover**: Use the integrated BTCMap to find Bitcoin businesses worldwide

### Key Capabilities
- **Infrastructure Providers**: List services, set availability, configure Lightning addresses
- **Shop Management**: Create shops, connect to infrastructure, manage subscriptions
- **Discovery**: Interactive map view with BTCMap integration for finding Bitcoin merchants
- **Payments**: Optional automated Lightning payments via NWC for subscriptions

## 📚 Documentation

**Complete documentation** is available in the `docs/` folder:

- **[Documentation Index](./docs/README.md)** - Start here
- **[Product Vision](./docs/02-planning/product-vision.md)** - What we're building and why
- **[Feature Development Workflow](./docs/workflows/feature-development.md)** - How we build features
- **[AI Agent Guidelines](./docs/workflows/ai-agent-guidelines.md)** - AI assistant integration
- **[Architecture Decisions](./docs/02-planning/architecture-decisions/)** - Technical choices and rationale

### Quick Links
- [Roadmap](./docs/02-planning/roadmap.md)
- [Feature Registry](./docs/02-planning/feature-registry.md)
- [Development Log](./docs/04-implementation/dev-journal/development-log.md)
- [Claude Code Setup](./docs/tools/claude-code/README.md)

## 🔒 Security

- **Encryption**: AES-256-GCM for NWC secrets
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive sanitization
- **Authentication**: Session-based security
- **Database**: PostgreSQL with proper indexing

See [SECURITY.md](SECURITY.md) for detailed information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### AI Agent Support
This project includes comprehensive documentation for AI coding assistants:
- [AI Agent Guidelines](./docs/workflows/ai-agent-guidelines.md)
- [Claude Code Setup](./docs/tools/claude-code/README.md)
- [Feature Development Workflow](./docs/workflows/feature-development.md)

## 🏗️ Development

### Current Status: Production Ready
- ✅ Complete NWC payment system
- ✅ PostgreSQL migration and Docker support
- ✅ Unified homepage dashboard
- ✅ Security fixes and validation
- ✅ API consistency improvements
- ✅ Comprehensive documentation framework

### Recent Updates (October 2025)
- **🏪 Marketplace Transformation**: Evolved from subscription tool to full Bitcoin marketplace
- **🗺️ BTCMap Integration**: Real-time discovery with interactive map showing Bitcoin merchants worldwide
- **🔍 Enhanced Discovery**: Filtering, search, and categories for infrastructure providers and shops
- **🔗 Connection System**: Shops can find and connect with Lightning infrastructure providers
- **📱 Improved UX**: Shop type labels (Online Store/Physical Shop), aligned card layouts, sticky footer patterns
- **🔢 Counter Fixes**: Accurate marketplace totals display
- **🔔 Notification System**: Shops can seek and connect with infrastructure providers
- **🎨 Platform Unification**: Removed user role distinctions - all users access all features
- **🎨 Unified Color Scheme**: Transitioned to warm orange/amber branding reflecting Bitcoin's energy
- **🏗️ Database Schema**: Simplified User model by removing role field
- **🎯 Homepage Redesign**: Unified hero section with feature-focused layout
- **📝 Registration Flow**: Streamlined signup without role selection
- **🔧 Auth System**: Updated APIs and authentication to support unified model
- **📚 Enhanced Documentation**: BMAD-METHOD inspired organization
- **🤖 Claude Code Integration**: Complete AI assistant documentation

See [Development Log](./docs/04-implementation/dev-journal/development-log.md) for detailed history.

## ❓ FAQ

**What is Bitinfrashop?**
A Bitcoin marketplace connecting infrastructure providers with Bitcoin-accepting shops worldwide, featuring automated Lightning payments, BTCMap integration for global discovery, and seamless NWC-powered connections.

**Do I need my own BTCPay Server?**
No, you can browse and connect to public servers listed on the platform marketplace.

**What wallets are supported?**
NWC (Nostr Wallet Connect) compatible wallets like Alby, Zeus, Mutiny, and Coinos.

**How does BTCMap integration work?**
The discover page features an interactive map showing Bitcoin-accepting businesses globally from BTCMap, with filtering and search capabilities.

**Is this production-ready?**
Yes, the core functionality is complete with enterprise-grade security measures.

## 📞 Support

- **Contact**: nodediver@proton.me
- **Issues**: [GitHub Issues](https://github.com/NodeDiver/bitinfrashop/issues)
- **Documentation**: [Complete docs](./docs/README.md)

---

**Built with ❤️ for the Bitcoin community**
