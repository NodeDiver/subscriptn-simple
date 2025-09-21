# SubscriptN

_Bitcoin subscriptions made easy. Lightning fast. ⚡_

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Hackathon](https://img.shields.io/badge/hackathon-Geyser%202025-orange)

## 🎯 Overview

**SubscriptN** is a Bitcoin subscription management platform that enables automated Lightning payments for recurring services. Built with Next.js 15, TypeScript, and PostgreSQL, it connects BTCPay Server providers with shop owners through Lightning network and NWC (Nostr Wallet Connect).

## ✨ Features

- **🏠 Unified Dashboard**: Complete infrastructure and shops management
- **⚡ Lightning Payments**: NWC integration for secure Bitcoin payments
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
git clone https://github.com/NodeDiver/subscriptn-simple.git
cd subscriptn-simple
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
DATABASE_URL=postgresql://postgres:password@localhost:5433/subscriptn

# Session & Security
SESSION_SECRET=your-session-secret
NWC_ENCRYPTION_KEY=your-32-char-hex-key

# Optional
NODE_ENV=development
```

## 💡 Usage

### For BTCPay Server Providers
1. Register and add your server details
2. Set public/private status and available slots
3. Configure lightning address for payments
4. Monitor connected shops and payments

### For Shop Owners
1. Browse available BTCPay servers
2. Connect Lightning wallet via NWC
3. Create shop and set up subscriptions
4. Track payment history and status

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
This project includes `AGENTS.md` with comprehensive guidelines for AI coding assistants.

## 📚 Development

### Current Status: Production Ready
- ✅ Complete NWC payment system
- ✅ PostgreSQL migration and Docker support
- ✅ Unified homepage dashboard
- ✅ Security fixes and validation
- ✅ API consistency improvements

### Recent Updates
- Fixed critical password sanitization vulnerability
- Removed legacy code duplication
- Standardized API field naming (snake_case)
- Enhanced security and validation

## ❓ FAQ

**What is SubscriptN?**
A Bitcoin subscription platform connecting BTCPay Server providers with shop owners through Lightning payments.

**Do I need my own BTCPay Server?**
No, you can browse and connect to public servers listed on the platform.

**What wallets are supported?**
NWC (Nostr Wallet Connect) compatible wallets like Alby, Zeus, Mutiny, and Coinos.

**Is this production-ready?**
Yes, the core functionality is complete with enterprise-grade security measures.

## 📞 Support

- **Contact**: nodediver@proton.me
- **Issues**: [GitHub Issues](https://github.com/NodeDiver/subscriptn-simple/issues)
- **Documentation**: See individual `.md` files for detailed guides

---

**Built with ❤️ for the Bitcoin community**