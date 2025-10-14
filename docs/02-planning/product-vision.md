# SubscriptN Product Vision

**Last Updated**: 2025-10-13
**Status**: Living Document
**Review Cadence**: Quarterly

---

## Mission Statement

**To make Bitcoin subscription management accessible, secure, and effortless for small BTCPay Server providers and shop owners through Lightning Network automation.**

---

## Problem We're Solving

### The Market Gap
Bitcoin payments are peer-to-peer, fast, and global. But recurring subscriptions on Bitcoin/Lightning are still:
- **Complex** to set up and manage
- **Fragmented** across different platforms
- **Inaccessible** to small businesses without technical expertise
- **Disconnected** from existing BTCPay Server infrastructure

### Our Solution
A **unified platform** that bridges BTCPay Server providers with shop owners, enabling:
- One-click subscription setup
- Automated Lightning payments via NWC (Nostr Wallet Connect)
- Marketplace for discovering providers
- Enterprise-grade security for everyone

---

## Target Users

### Primary: Small BTCPay Server Providers
**Profile**: Individuals or small businesses running BTCPay Server instances

**Pain Points**:
- Difficulty monetizing spare server capacity
- No easy way to onboard shop owners
- Manual subscription management is time-consuming
- Limited visibility in the market

**Jobs to Be Done**:
- List server in marketplace for discovery
- Manage multiple shop subscriptions
- Automate recurring payment collection
- Monitor subscription health and revenue

**Success Metrics**:
- Number of shops onboarded per provider
- Monthly recurring revenue per provider
- Time saved on subscription management
- Provider satisfaction score

---

### Secondary: Shop Owners
**Profile**: Small online businesses wanting to accept Bitcoin subscriptions

**Pain Points**:
- Don't have technical expertise to run own BTCPay Server
- Expensive or complex existing solutions
- Need reliable Lightning infrastructure
- Want seamless wallet integration

**Jobs to Be Done**:
- Find trustworthy BTCPay Server providers
- Set up subscriptions quickly
- Connect Lightning wallet via NWC
- Track subscription payments

**Success Metrics**:
- Time to first subscription (< 5 minutes)
- Successful payment rate
- Wallet connection success rate
- Shop owner satisfaction score

---

## Strategic Pillars (3-Year Vision)

### 1. Simplicity First
**Goal**: Anyone can set up Bitcoin subscriptions in under 5 minutes

**Key Initiatives**:
- One-click server connection
- Guided onboarding flows
- Pre-configured templates for common subscription types
- Automated error recovery

**2025 Milestone**: Zero-friction NWC wallet connection ✅
**2026 Milestone**: AI-powered subscription optimization
**2027 Milestone**: One-click subscription creation from any website

---

### 2. Trust & Security
**Goal**: Enterprise-grade security accessible to small businesses

**Key Initiatives**:
- AES-256-GCM encryption for sensitive data
- Rate limiting and DDoS protection
- Input validation and sanitization
- Transparent security audit trail

**2025 Milestone**: Production-ready security implementation ✅
**2026 Milestone**: External security audit and certification
**2027 Milestone**: Bug bounty program and security community

---

### 3. Community Connection
**Goal**: Create a thriving Bitcoin subscription economy

**Key Initiatives**:
- Marketplace for provider/shop discovery
- Reputation and review system
- Community forums and support
- Open-source contribution model

**2025 Milestone**: Public marketplace with server listings ✅
**2026 Milestone**: Reputation system and verified badges
**2027 Milestone**: Decentralized network of providers

---

## Product Positioning

### What We Are
- **Subscription Management Platform** for Bitcoin/Lightning
- **Marketplace** connecting providers and shops
- **Integration Layer** between BTCPay Server and NWC wallets
- **Community Platform** for the Bitcoin subscription economy

### What We're NOT
- **Not** a full BTCPay Server replacement (we integrate with it)
- **Not** a payment processor (we use Lightning Network directly)
- **Not** a merchant directory (we focus on subscriptions)
- **Not** a custodial wallet service (NWC is non-custodial)

---

## Competitive Landscape

### Direct Competitors
None currently offering this exact solution.

### Adjacent Solutions
- **BTCPay Server**: Infrastructure, but no subscription marketplace
- **OpenNode/Strike**: Payment processors, but not subscription-focused
- **Traditional SaaS**: Subscriptions, but not Bitcoin/Lightning native

### Our Differentiators
1. **Marketplace Model**: Connect providers with shops
2. **NWC Integration**: Seamless wallet connection
3. **Small Business Focus**: Built for individuals, not enterprises
4. **Open Source**: Community-driven development

---

## Success Metrics

### User Acquisition (2026 Targets)
- **Providers**: 100 active BTCPay Server providers
- **Shops**: 1,000 active shop subscriptions
- **Payment Volume**: 10,000 successful recurring payments/month

### User Engagement
- **Provider Retention**: 80% after 6 months
- **Shop Retention**: 70% after 6 months
- **Average Shops per Provider**: 10
- **Payment Success Rate**: 95%+

### Product Quality
- **Time to First Subscription**: < 5 minutes
- **Bug Rate**: < 1% of sessions encounter errors
- **Support Tickets**: < 5% of users need help
- **User Satisfaction (NPS)**: 50+

### Business Impact
- **Provider Revenue**: Help providers generate $1k+ MRR
- **Platform Growth**: 20% MoM growth in active subscriptions
- **Community Health**: Active contributors and forum engagement

---

## Anti-Goals (What We're NOT Building)

### Scope Boundaries
1. **Not a Full BTCPay Server**: We integrate, not replace
2. **Not a General Payment Processor**: Focus is recurring subscriptions
3. **Not Enterprise-Only**: Serving individuals and small businesses
4. **Not Closed-Source SaaS**: Commitment to open-source model
5. **Not Custodial**: Non-custodial, user-controlled funds only

### Feature Exclusions
- ❌ One-time payments (use BTCPay Server directly)
- ❌ Fiat on/off ramps (out of scope)
- ❌ KYC/AML compliance tools (too complex for target market)
- ❌ Multi-currency support beyond Bitcoin (focused on Bitcoin-only)
- ❌ White-label/reseller programs (at least not initially)

---

## Reflection Questions (Review Quarterly)

### Vision Alignment
1. **Are we still solving the right problem?**
   - Review user feedback and pain points
   - Validate market need

2. **What have we learned about our users?**
   - User interviews and surveys
   - Usage analytics and patterns

3. **Which assumptions were wrong?**
   - Document invalidated assumptions
   - Adjust strategy accordingly

### Strategic Focus
4. **Are we staying true to our pillars?**
   - Simplicity, Security, Community
   - Check feature alignment

5. **What should we stop doing?**
   - Review features with low usage
   - Identify distractions from core mission

6. **Where should we double down?**
   - Identify high-impact areas
   - Allocate resources accordingly

### Market Dynamics
7. **How has the competitive landscape changed?**
   - New competitors or adjacent solutions
   - Market consolidation or fragmentation

8. **What new opportunities have emerged?**
   - Technology advancements (e.g., new Lightning features)
   - Regulatory changes
   - Market shifts

### Team & Resources
9. **Do we have the right capabilities?**
   - Skill gaps or training needs
   - Hiring priorities

10. **Are we building sustainably?**
    - Technical debt vs. feature velocity
    - Team health and work-life balance

---

## Revision History

| Date | Changes | Author |
|------|---------|--------|
| 2025-10-13 | Initial product vision document | Claude Code |
| - | - | - |

---

## Related Documents

- [Roadmap](./roadmap.md)
- [Feature Registry](./feature-registry.md)
- [Architecture Decisions](./architecture-decisions/)
- [Development Log](../04-implementation/dev-journal/development-log.md)

---

**Next Review**: 2026-01-13
**Owner**: Product Team / nodediver@proton.me
