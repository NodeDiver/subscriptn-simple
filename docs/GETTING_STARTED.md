# Getting Started with SubscriptN Documentation

**Welcome to the enhanced documentation framework!**

This guide will help you understand and use the new BMAD-METHOD inspired documentation structure.

---

## What Changed?

### Before
```
├── AGENTS.md
├── ROADMAP.md
├── TODO.md
├── DEVELOPMENT_LOG.md
├── Branstorming Ideas/
└── Geyser Hackaton NWC/
```

### After
```
docs/
├── 01-analysis/           # Problem discovery
├── 02-planning/           # Strategic planning
├── 03-solutioning/        # Technical design
├── 04-implementation/     # Execution tracking
├── workflows/             # Process guides
└── tools/                 # Tool documentation
```

---

## Quick Start by Role

### I'm a Developer 👨‍💻

**Start here**:
1. Read [AI Agent Guidelines](./workflows/ai-agent-guidelines.md) - How to work with Claude Code
2. Check [Development Log](./04-implementation/dev-journal/development-log.md) - What's been built
3. Review [Backlog](./04-implementation/backlog.md) - Current tasks

**When building a feature**:
1. Check if feature spec exists in `03-solutioning/features/`
2. Follow [Feature Development Workflow](./workflows/feature-development.md)
3. Create ADR if making architectural decision

**When fixing a bug**:
1. Document root cause
2. Fix and test
3. Update relevant docs

---

### I'm a Product Manager 📊

**Start here**:
1. Read [Product Vision](./02-planning/product-vision.md) - Understand our mission
2. Check [Feature Registry](./02-planning/feature-registry.md) - All features and status
3. Review [Roadmap](./02-planning/roadmap.md) - Quarterly planning

**When proposing a feature**:
1. Create problem statement (use template in `01-analysis/problem-statements/`)
2. Add to [Feature Registry](./02-planning/feature-registry.md)
3. Create feature spec (use template in `03-solutioning/features/`)
4. Follow [Feature Development Workflow](./workflows/feature-development.md)

**Weekly tasks**:
- Update feature registry with status changes
- Review in-progress features
- Prioritize backlog

---

### I'm a Tech Lead/Architect 🏗️

**Start here**:
1. Review [Architecture Decisions](./02-planning/architecture-decisions/) - Past decisions
2. Check [Product Vision](./02-planning/product-vision.md) - Strategic direction
3. Read [Feature Development Workflow](./workflows/feature-development.md) - Process

**When making architectural decisions**:
1. Use [ADR Template](./02-planning/architecture-decisions/ADR-000-template.md)
2. Document alternatives considered
3. Explain rationale clearly
4. Get team review
5. Schedule 6-month reflection

**When reviewing feature specs**:
1. Check technical approach
2. Identify risks
3. Validate against architecture principles
4. Suggest improvements

---

## Common Tasks

### Task: Start a New Feature

1. **Analysis Phase**
   ```
   Create: docs/01-analysis/problem-statements/[feature-name].md
   - Document user pain point
   - Gather evidence
   - Define success metrics
   ```

2. **Planning Phase**
   ```
   Update: docs/02-planning/feature-registry.md
   - Add feature entry
   - Set priority (P0-P3)
   - Estimate effort (S/M/L/XL)
   ```

3. **Solutioning Phase**
   ```
   Create: docs/03-solutioning/features/[feature-name].md
   Use template: docs/03-solutioning/features/_TEMPLATE.md
   - Design technical approach
   - Define API contracts
   - Identify risks
   ```

4. **Implementation Phase**
   ```
   - Break into tasks in feature spec
   - Build and test
   - Update docs/04-implementation/backlog.md
   ```

5. **Reflection Phase**
   ```
   - Document learnings in feature spec
   - Update feature registry status
   - Conduct team retrospective
   ```

---

### Task: Document an Architectural Decision

1. **Copy Template**
   ```bash
   cp docs/02-planning/architecture-decisions/ADR-000-template.md \
      docs/02-planning/architecture-decisions/ADR-XXX-your-decision.md
   ```

2. **Fill Out ADR**
   - Context: What problem are we solving?
   - Decision: What did we decide?
   - Alternatives: What else did we consider?
   - Consequences: What are the trade-offs?

3. **Get Review**
   - Present to team
   - Gather feedback
   - Refine based on input

4. **Mark Accepted**
   - Change status to "Accepted"
   - Commit to repository

5. **Schedule Reflection**
   - Calendar reminder for 6 months
   - Review if decision was correct

---

### Task: Use Claude Code

1. **Read Guidelines**
   - [Claude Code README](./tools/claude-code/README.md)
   - [AI Agent Guidelines](./workflows/ai-agent-guidelines.md)

2. **Configure Permissions**
   - Review `.claude/settings.local.json`
   - Add permissions as needed
   - See [Configuration Guide](./tools/claude-code/configuration.md)

3. **Ask Claude Code**
   - Be specific and provide context
   - Reference relevant docs
   - Verify output before committing

**Example prompts**:
- "Implement the private server invitations feature from docs/03-solutioning/features/private-server-invitations.md"
- "Review src/app/api/servers/route.ts for security issues"
- "Create an ADR documenting why we chose PostgreSQL over SQLite"

---

## Documentation Maintenance

### Daily
- Update task status in backlog
- Add notes to development log (if significant changes)

### Weekly
- Review feature registry
- Update sprint progress (if using sprints)
- Check for stale documents

### Monthly
- Review and update roadmap
- Reprioritize backlog
- Update technical debt register (create if needed)

### Quarterly
- Review product vision
- Conduct ADR reflections (6 months after acceptance)
- Update strategic documents
- Archive outdated docs

---

## Templates Available

### Analysis Phase
- [Problem Statement Template](./01-analysis/problem-statements/_TEMPLATE.md)

### Planning Phase
- [ADR Template](./02-planning/architecture-decisions/ADR-000-template.md)

### Solutioning Phase
- [Feature Specification Template](./03-solutioning/features/_TEMPLATE.md)

### Implementation Phase
- [Sprint Template](./04-implementation/sprints/_TEMPLATE.md) (to be created)

---

## File Locations Reference

### Old Location → New Location

| Old | New |
|-----|-----|
| `AGENTS.md` | `docs/workflows/ai-agent-guidelines.md` |
| `ROADMAP.md` | `docs/02-planning/roadmap.md` |
| `TODO.md` | `docs/04-implementation/backlog.md` |
| `DEVELOPMENT_LOG.md` | `docs/04-implementation/dev-journal/development-log.md` |
| `GOOGLE_OAUTH_SETUP.md` | `docs/03-solutioning/integrations/google-oauth-setup.md` |
| `Branstorming Ideas/` | `docs/01-analysis/ideas/` |
| `Geyser Hackaton NWC/` | `docs/04-implementation/hackathon-2024/` |

---

## Key Principles

### 1. Documentation is Living
Update docs as you work, not after. Documentation should reflect current reality.

### 2. Context is King
Provide enough context so anyone can understand decisions made 6 months ago.

### 3. Simplicity Wins
Use templates for consistency, but don't over-document. Quality over quantity.

### 4. Reflection Matters
Schedule regular reviews of decisions and learnings. Continuous improvement.

### 5. Link Everything
Cross-reference related documents. Create a web of knowledge, not silos.

---

## Getting Help

### Questions about Documentation
- Contact: nodediver@proton.me
- Issue: [Report on GitHub](https://github.com/NodeDiver/subscriptn-simple/issues)

### Questions about BMAD-METHOD
- This framework is inspired by BMAD-METHOD™ principles
- Focus: Analysis → Planning → Solutioning → Implementation → Reflection
- Visit: https://github.com/bmad-code-org/BMAD-METHOD

---

## Next Steps

1. **Read the docs index**: [docs/README.md](./README.md)
2. **Review your role's quick start** (above)
3. **Explore the directory structure**
4. **Start using templates for new work**
5. **Provide feedback** on what works and what doesn't

---

**Welcome to systematic, reflective, collaborative development!**

**Last Updated**: 2025-10-13
**Framework**: Inspired by BMAD-METHOD™
