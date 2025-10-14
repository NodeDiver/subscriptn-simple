# Feature Registry

**Purpose**: Central tracking document for all features across their lifecycle

**Last Updated**: 2025-10-13

---

## Active Features

| Feature | Phase | Priority | Effort | Status | Owner | Target |
|---------|-------|----------|--------|--------|-------|--------|
| Private Server Invitations | Solutioning | P1 | M | Spec Complete | - | Q4 2025 |
| Recurring Payment Automation | Analysis | P0 | L | Research | - | Q4 2025 |
| Advanced Analytics Dashboard | Planning | P2 | M | Backlog | - | Q1 2026 |

---

## Feature Pipeline

### Next 3 Months (Q4 2025)
**Focus**: Core functionality and automation

1. **Recurring Payment Automation** (P0 - Critical)
   - Automated payment scheduling
   - Payment failure handling and retry logic
   - Subscription renewal notifications
   - Status: Analysis phase

2. **Private Server Invitations** (P1 - High)
   - Unique invitation links for private servers
   - Invitation management dashboard
   - Status: Specification complete

3. **Advanced Analytics Dashboard** (P2 - Medium)
   - Payment success/failure tracking
   - Subscription health monitoring
   - Revenue insights
   - Status: Backlog

---

### Following 3 Months (Q1 2026)
**Focus**: User experience and growth features

1. **Mobile PWA** (P2 - Medium)
   - Progressive Web App features
   - Mobile-responsive design improvements
   - Offline capability
   - Status: Analysis

2. **Enhanced Search & Discovery** (P2 - Medium)
   - Search BTCPay servers by features
   - Filter shops by category
   - Improved marketplace UX
   - Status: Not started

3. **Reputation System** (P2 - Medium)
   - Provider ratings and reviews
   - Verified provider badges
   - Trust indicators
   - Status: Not started

---

### Future (Q2+ 2026)
**Focus**: Scale and advanced features

- Multi-currency Support (P3 - Low)
- Webhook System (P2 - Medium)
- API for Developers (P2 - Medium)
- White-label Options (P3 - Low)
- Multi-tenant Architecture (P3 - Low)

---

## Completed Features

| Feature | Completed | Priority | Impact |
|---------|-----------|----------|--------|
| NWC Payment System | 2025-09 | P0 | High - Core functionality |
| PostgreSQL Migration | 2025-09 | P0 | High - Production readiness |
| Unified Homepage Dashboard | 2025-09 | P1 | Medium - Better UX |
| Docker Support | 2025-09 | P1 | High - Deployment |
| Marketplace Implementation | 2025-10 | P1 | High - Discovery |
| Google OAuth Integration | 2025-09 | P2 | Medium - Easier signup |

---

## Feature Definitions

### Priority Levels

**P0 - Critical**
- Blocking users or critical bug
- Must ship immediately
- Example: Payment system broken

**P1 - High**
- High business value
- Ready to implement
- Clear user need
- Example: Private server invitations

**P2 - Medium**
- Valuable but not urgent
- Nice to have improvement
- Example: Analytics dashboard

**P3 - Low**
- Nice to have
- Future consideration
- Example: Multi-currency support

### Effort Levels

**S (Small)**: 1-3 days
- Minor UI tweaks
- Simple bug fixes
- Documentation updates

**M (Medium)**: 1-2 weeks
- New page or component
- API endpoint additions
- Feature enhancements

**L (Large)**: 2-4 weeks
- Complex feature
- Multiple components
- System integration

**XL (Extra Large)**: 1-3 months
- Major system change
- Architecture overhaul
- Multiple large features

### Status Definitions

**Analysis**: Understanding problem and gathering requirements
**Planning**: Prioritizing and roadmapping
**Solutioning**: Designing technical approach
**Implementation**: Building and testing
**Complete**: Deployed to production

---

## Feature Request Process

### How to Propose a Feature

1. **Create Problem Statement**
   - Document user pain point
   - Gather evidence
   - Define success metrics
   - Template: `docs/01-analysis/problem-statements/_TEMPLATE.md`

2. **Submit for Review**
   - Present to team
   - Discuss priority and effort
   - Add to this registry

3. **Move Through Phases**
   - Analysis → Planning → Solutioning → Implementation
   - Follow [Feature Development Workflow](../workflows/feature-development.md)

### Review Cadence
- **Weekly**: Review in-progress features
- **Monthly**: Reprioritize backlog
- **Quarterly**: Strategic roadmap planning

---

## Detailed Feature Tracking

### Recurring Payment Automation
**Phase**: Analysis
**Priority**: P0 - Critical
**Effort**: L (2-4 weeks)
**Status**: Research phase

**Problem**: Manual payment processing is time-consuming and error-prone
**Solution**: Automated payment scheduling with retry logic
**Success Metrics**:
- 95%+ automated payment success rate
- < 5% manual intervention needed
- User satisfaction improvement

**Next Steps**:
- [ ] Complete analysis document
- [ ] Research scheduling solutions
- [ ] Design technical approach
- [ ] Create feature specification

**Links**:
- Analysis: [TBD]
- Spec: [TBD]

---

### Private Server Invitations
**Phase**: Solutioning
**Priority**: P1 - High
**Effort**: M (1-2 weeks)
**Status**: Specification complete

**Problem**: Shop owners can't discover private BTCPay servers
**Solution**: Unique invitation links for private servers
**Success Metrics**:
- 50+ private server invitations used within 3 months
- < 10% invitation link errors
- Positive user feedback

**Next Steps**:
- [ ] Begin implementation Phase 1
- [ ] Database migration
- [ ] API endpoints
- [ ] Frontend components

**Links**:
- Specification: [docs/03-solutioning/features/private-server-invitations.md](../03-solutioning/features/private-server-invitations.md)

---

### Advanced Analytics Dashboard
**Phase**: Planning
**Priority**: P2 - Medium
**Effort**: M (1-2 weeks)
**Status**: Backlog

**Problem**: Limited visibility into subscription and payment metrics
**Solution**: Dashboard with payment trends, subscription health, revenue insights
**Success Metrics**:
- Providers check analytics weekly
- Identify failing subscriptions proactively
- Data-driven business decisions

**Next Steps**:
- [ ] Gather requirements from providers
- [ ] Design dashboard mockups
- [ ] Prioritize metrics to show
- [ ] Create specification

**Links**:
- Analysis: [TBD]

---

## Related Documents
- [Product Vision](./product-vision.md)
- [Roadmap](./roadmap.md)
- [Backlog](../04-implementation/backlog.md)
- [Feature Development Workflow](../workflows/feature-development.md)

---

**Maintained By**: Product Team
**Update Frequency**: Weekly
**Next Review**: 2025-10-20
