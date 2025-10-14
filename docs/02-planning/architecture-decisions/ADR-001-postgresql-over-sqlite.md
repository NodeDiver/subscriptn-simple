# ADR-001: PostgreSQL over SQLite for Production

**Status**: Accepted
**Date**: 2025-09-21
**Deciders**: Development Team
**Context Tags**: #database #scalability #production #architecture

---

## Context

### Problem Statement
The initial implementation used SQLite for simplicity during development, but production deployment requires a robust database that can handle:
- Concurrent connections from multiple users
- Higher transaction volume
- Better performance under load
- Professional deployment standards

### Background
- Project started with SQLite for rapid prototyping
- Reached production-ready stage with NWC Hackathon win
- Deployment targets (Railway, Vercel, DigitalOcean) favor PostgreSQL
- Need for concurrent user support and scalability

### Stakeholders
- **Developers**: Need reliable database for production
- **Users**: Expect fast, reliable service
- **Operations**: Need manageable, scalable infrastructure

---

## Decision

### What We Decided
**Migrate from SQLite to PostgreSQL for all production deployments.**

### Rationale

1. **Concurrency**: PostgreSQL handles multiple simultaneous connections better than SQLite
2. **Scalability**: Can scale vertically and horizontally as user base grows
3. **Industry Standard**: PostgreSQL is battle-tested for production web applications
4. **Cloud Native**: Better support from major deployment platforms (Railway, Vercel, AWS, DigitalOcean)
5. **Advanced Features**: Support for future needs (full-text search, JSON queries, etc.)

---

## Alternatives Considered

### Option A: Continue with SQLite
**Description**: Keep SQLite for production

**Pros**:
- Zero setup complexity
- No external database server needed
- Lower resource usage
- File-based simplicity

**Cons**:
- Limited concurrency (write locks entire database)
- Difficult to scale horizontally
- Not recommended for production web apps
- Backup and replication challenges
- Most cloud platforms don't support well

**Why Rejected**: Concurrency and scalability limitations make it unsuitable for production web applications

---

### Option B: MySQL/MariaDB
**Description**: Use MySQL instead of PostgreSQL

**Pros**:
- Popular and well-documented
- Good performance
- Wide hosting support
- Large ecosystem

**Cons**:
- Less advanced features than PostgreSQL
- JSON support not as robust
- Some licensing concerns with MySQL (Oracle)
- Community momentum favors PostgreSQL

**Why Rejected**: PostgreSQL offers better features and growing ecosystem support

---

### Option C: NoSQL (MongoDB, etc.)
**Description**: Use document database

**Pros**:
- Flexible schema
- Horizontal scaling built-in
- Good for rapid iteration

**Cons**:
- Relational data model fits our use case better
- Prisma ORM works better with SQL databases
- Unnecessary complexity for current needs
- Steeper learning curve

**Why Rejected**: Our data is inherently relational (users, servers, shops, subscriptions)

---

## Consequences

### Positive Consequences ✅
- **Better Performance**: Handles concurrent users effectively
- **Production Ready**: Industry-standard database for web apps
- **Scalability**: Can grow with user base
- **Cloud Support**: Excellent support from deployment platforms
- **Advanced Features**: Access to PostgreSQL's rich feature set
- **Better Tooling**: pgAdmin, DBeaver, and other professional tools
- **Prisma Compatibility**: Excellent Prisma ORM support

### Negative Consequences ❌
- **Complexity**: Requires separate database server
- **Resource Usage**: More memory and CPU than SQLite
- **Development Setup**: Developers need PostgreSQL installed or Docker
- **Migration Effort**: One-time cost to migrate from SQLite
- **Cost**: Hosted PostgreSQL has monthly fees (though minimal)

### Risks & Mitigation ⚠️
| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Migration data loss | Low | High | Test migration multiple times, backup data |
| Developer setup friction | Medium | Low | Provide Docker Compose, clear documentation |
| Database connection issues | Low | Medium | Connection pooling, retry logic, health checks |
| Higher hosting costs | High | Low | Use free tiers initially, optimize queries |

---

## Implementation

### Changes Required
- **Schema Migration**: Convert SQLite schema to PostgreSQL
- **Connection String**: Update DATABASE_URL in environment variables
- **Prisma Schema**: Update provider from sqlite to postgresql
- **Docker Setup**: Add PostgreSQL to docker-compose.yml
- **Documentation**: Update setup instructions in README

### Migration Path

1. **Setup PostgreSQL**
   ```bash
   docker-compose up -d postgres
   ```

2. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run Migration**
   ```bash
   npx prisma migrate deploy
   ```

4. **Verify Data** (if migrating existing data)
   ```bash
   npx prisma studio
   ```

### Verification
How we verified this decision was successful:
- ✅ All existing features work with PostgreSQL
- ✅ Multiple concurrent users can access the system
- ✅ Performance is acceptable under load
- ✅ Docker setup works smoothly
- ✅ Railway deployment successful

---

## Notes

### Related Decisions
- [ADR-003](./ADR-003-prisma-orm.md): Choice of Prisma as ORM
- [ADR-004](./ADR-004-docker-deployment.md): Docker deployment strategy

### References
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)

### Open Questions (at time of decision)
- ~~How to handle development without Docker?~~ → Resolved: Documented local PostgreSQL setup
- ~~What about connection pooling?~~ → Resolved: Using Prisma's built-in pooling

---

## Reflection (6 months later)

**Review Date**: 2025-10-13
**Reviewed By**: Development Team

### Was This the Right Decision?
- [x] Yes, reaffirmed
- [ ] Mostly yes, with adjustments
- [ ] No, needs revision
- [ ] No, superseded by ADR-YYY

### What We Learned
- PostgreSQL integration was smoother than expected
- Docker Compose made local development easy
- Railway's PostgreSQL support is excellent
- No performance issues with current user load
- Connection pooling handled by Prisma works well

### What We'd Change
- Would have migrated to PostgreSQL earlier
- Could have documented connection string formats better initially
- Should have added database health checks from the start

### Follow-up Actions
- [x] Add database health checks
- [x] Document backup and restore procedures
- [ ] Set up automated backups on production
- [ ] Monitor query performance and add indexes as needed

---

**Created**: 2025-10-13 (retroactive documentation)
**Last Updated**: 2025-10-13
