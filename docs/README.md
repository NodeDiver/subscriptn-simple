# Bitinfrashop Documentation

**Complete documentation for the Bitinfrashop Bitcoin subscription platform**

---

## Quick Navigation

### For New Team Members
- [Product Vision](./02-planning/product-vision.md) - Understand what we're building and why
- [Roadmap](./02-planning/roadmap.md) - See where we're going
- [Development Workflow](./workflows/feature-development.md) - How we build features

### For Developers
- [AI Agent Guidelines](./workflows/ai-agent-guidelines.md) - How to work with AI assistants
- [Claude Code Setup](./tools/claude-code/README.md) - Configure Claude Code
- [Architecture Decisions](./02-planning/architecture-decisions/) - Why we built it this way
- [Development Journal](./04-implementation/dev-journal/development-log.md) - What we've built

### For Product/PM
- [Feature Registry](./02-planning/feature-registry.md) - All features and their status
- [Backlog](./04-implementation/backlog.md) - Current task list
- [Problem Statements](./01-analysis/problem-statements/) - User problems we're solving

---

## Documentation Structure

This documentation follows the **BMAD-METHOD inspired framework**: a four-phase approach to product development that emphasizes reflection, collaboration, and systematic thinking.

```
docs/
├── 01-analysis/              # Understanding & Research
├── 02-planning/              # Strategic Planning
├── 03-solutioning/           # Design & Specification
├── 04-implementation/        # Execution & Tracking
├── workflows/                # Process Documentation
└── tools/                    # Tool-specific guides
```

---

## Phase 1: Analysis

**Purpose**: Deeply understand problems before proposing solutions

### Problem Statements
Document user pain points with evidence and success metrics.
- [Template](./01-analysis/problem-statements/_TEMPLATE.md)
- [Browse All](./01-analysis/problem-statements/)

### Research
- [Competitive Research](./01-analysis/competitive-research/)
- [User Research](./01-analysis/user-research/)
- [Technical Research](./01-analysis/technical-research/)

### Ideas
Early-stage concepts and brainstorms.
- [Browse Ideas](./01-analysis/ideas/)

---

## Phase 2: Planning

**Purpose**: Prioritize and strategize feature development

### Strategic Documents
- **[Product Vision](./02-planning/product-vision.md)**: Our mission and 3-year strategy
- **[Roadmap](./02-planning/roadmap.md)**: Quarterly feature planning and milestones
- **[Feature Registry](./02-planning/feature-registry.md)**: All features with status and priority

### Architecture Decisions
Why we made key technical choices.
- [ADR Template](./02-planning/architecture-decisions/ADR-000-template.md)
- [ADR-001: PostgreSQL over SQLite](./02-planning/architecture-decisions/ADR-001-postgresql-over-sqlite.md)
- [Browse All ADRs](./02-planning/architecture-decisions/)

### Feature Roadmap
Quarterly planning and feature timeline.
- [Feature Roadmap](./02-planning/feature-roadmap/)

---

## Phase 3: Solutioning

**Purpose**: Design technical solutions with thorough specifications

### Feature Specifications
Detailed design docs for features.
- **[Template](./03-solutioning/features/_TEMPLATE.md)** - Use this for new features
- [Private Server Invitations](./03-solutioning/features/private-server-invitations.md)
- [Browse All Features](./03-solutioning/features/)

### Design Assets
- [UX Flows](./03-solutioning/ux-flows/)
- [API Contracts](./03-solutioning/api-contracts/)

### Integrations
Third-party service integration guides.
- [Google OAuth Setup](./03-solutioning/integrations/google-oauth-setup.md)
- [Browse All Integrations](./03-solutioning/integrations/)

---

## Phase 4: Implementation

**Purpose**: Track execution and document progress

### Development Journal
Daily/weekly progress logs.
- [Development Log](./04-implementation/dev-journal/development-log.md)
- [Browse All Entries](./04-implementation/dev-journal/)

### Sprints
Sprint planning and retrospectives.
- [Sprint Template](./04-implementation/sprints/_TEMPLATE.md)
- [Browse Sprints](./04-implementation/sprints/)

### Backlog
Current tasks and priorities.
- [Backlog](./04-implementation/backlog.md)

### Testing
Test reports and quality assurance.
- [Testing Reports](./04-implementation/testing-reports/)

### Hackathon 2024
Documentation from Geyser NWC Hackathon win.
- [Hackathon Docs](./04-implementation/hackathon-2024/)

---

## Workflows

**Purpose**: Systematic processes for development activities

### Core Workflows
- **[Feature Development](./workflows/feature-development.md)** - Complete feature lifecycle
- [Bug Fix Workflow](./workflows/bug-fix-workflow.md) - Fix and prevent bugs
- [Release Process](./workflows/release-process.md) - Ship to production

### AI & Tools
- **[AI Agent Guidelines](./workflows/ai-agent-guidelines.md)** - How AI assistants should work with this codebase
- [Claude Code Setup](./tools/claude-code/README.md) - Configure Claude Code
- [Claude Code Configuration](./tools/claude-code/configuration.md) - Detailed permission settings

---

## Tools & Integrations

### Claude Code
AI-powered development assistant integration.
- [README](./tools/claude-code/README.md) - Overview and use cases
- [Configuration](./tools/claude-code/configuration.md) - Detailed setup

### AI Agents
Guidelines for working with AI assistants.
- [AI Agent Guidelines](./workflows/ai-agent-guidelines.md)

---

## Key Documents by Role

### Product Manager
1. [Product Vision](./02-planning/product-vision.md)
2. [Feature Registry](./02-planning/feature-registry.md)
3. [Roadmap](./02-planning/roadmap.md)
4. [Feature Development Workflow](./workflows/feature-development.md)

### Software Engineer
1. [AI Agent Guidelines](./workflows/ai-agent-guidelines.md)
2. [Architecture Decisions](./02-planning/architecture-decisions/)
3. [Feature Specifications](./03-solutioning/features/)
4. [Development Log](./04-implementation/dev-journal/development-log.md)

### Tech Lead/Architect
1. [Architecture Decisions](./02-planning/architecture-decisions/)
2. [Feature Development Workflow](./workflows/feature-development.md)
3. [Technical Research](./01-analysis/technical-research/)
4. [ADR Template](./02-planning/architecture-decisions/ADR-000-template.md)

### Designer
1. [UX Flows](./03-solutioning/ux-flows/)
2. [Feature Specifications](./03-solutioning/features/)
3. [User Research](./01-analysis/user-research/)

---

## Document Templates

Use these templates to create consistent documentation:

- [Problem Statement Template](./01-analysis/problem-statements/_TEMPLATE.md)
- [Feature Specification Template](./03-solutioning/features/_TEMPLATE.md)
- [ADR Template](./02-planning/architecture-decisions/ADR-000-template.md)
- [Sprint Template](./04-implementation/sprints/_TEMPLATE.md)

---

## Documentation Standards

### Writing Guidelines
- **Clear & Concise**: Get to the point quickly
- **Structured**: Use headings, lists, and tables
- **Actionable**: Include next steps and checklists
- **Dated**: Include creation and update dates
- **Linked**: Reference related documents

### Maintenance
- **Review Cadence**: Quarterly for strategic docs, monthly for tactical docs
- **Ownership**: Assign document owners
- **Version Control**: All docs in git, track changes
- **Archival**: Move outdated docs to archive folder

### File Naming
- Use kebab-case: `private-server-invitations.md`
- Prefix ADRs with number: `ADR-001-description.md`
- Prefix sprints with date: `2025-10-13-sprint-5.md`
- Use _TEMPLATE for templates: `_TEMPLATE.md`

---

## Contributing to Documentation

### Adding a New Feature
1. Create problem statement in `01-analysis/problem-statements/`
2. Add to feature registry in `02-planning/feature-registry.md`
3. Create specification in `03-solutioning/features/`
4. Follow [Feature Development Workflow](./workflows/feature-development.md)

### Documenting a Decision
1. Use ADR template from `02-planning/architecture-decisions/ADR-000-template.md`
2. Number sequentially (ADR-001, ADR-002, etc.)
3. Get team review before marking "Accepted"
4. Schedule 6-month reflection review

### Updating Documentation
1. Update "Last Updated" date
2. Note changes in revision history (if applicable)
3. Update related documents with cross-references
4. Commit with descriptive message

---

## Related Resources

### Root Documentation
- [README.md](../README.md) - Project overview and setup
- [SECURITY.md](../SECURITY.md) - Security policy and reporting

### External Links
- [GitHub Repository](https://github.com/NodeDiver/bitinfrashop)
- [Geyser Hackathon](https://geyser.fund/)
- [BTCPay Server](https://btcpayserver.org/)
- [NWC Specification](https://nwc.dev/)

---

## Getting Help

### For Documentation Questions
- Contact: nodediver@proton.me
- GitHub Issues: [Report documentation issues](https://github.com/NodeDiver/bitinfrashop/issues)

### For Technical Questions
See [AI Agent Guidelines](./workflows/ai-agent-guidelines.md) or [Development Log](./04-implementation/dev-journal/development-log.md)

---

**Last Updated**: 2025-10-13
**Documentation Framework**: Inspired by BMAD-METHOD™
**Maintained By**: Development Team
