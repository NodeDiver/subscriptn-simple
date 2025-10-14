# Feature Development Workflow

**Purpose**: Systematic process for developing new features from idea to production

**Inspired by**: BMAD-METHOD™ four-phase workflow (Analysis → Planning → Solutioning → Implementation)

---

## Workflow Overview

```
Analysis → Planning → Solutioning → Implementation → Reflection
   │          │            │              │              │
   └──────────┴────────────┴──────────────┴──────────────┘
                    Continuous Iteration
```

---

## Phase 1: Analysis (Analyst Agent)

**Duration**: 1-3 days
**Output**: Problem statement document
**Owner**: Product/Analyst role

### Objective
Deeply understand the user problem before proposing solutions.

### Checklist
- [ ] **Document User Pain Point**
  - What problem are users experiencing?
  - How does it impact their workflow?
  - What's the cost of not solving it?

- [ ] **Gather Evidence**
  - User interviews or feedback quotes
  - Support tickets related to issue
  - Analytics data (if available)
  - Market research or competitor analysis

- [ ] **Define Success Metrics**
  - How will we measure if this solves the problem?
  - Quantitative metrics (usage, time saved, etc.)
  - Qualitative metrics (satisfaction, feedback)

- [ ] **Validate with Stakeholders**
  - Present findings to team
  - Confirm problem is worth solving
  - Get buy-in for next phase

### Deliverable
Create `docs/01-analysis/problem-statements/[feature-name].md`

### Exit Criteria
✅ Problem statement approved by team
✅ Evidence supports need for solution
✅ Success metrics defined and agreed upon

---

## Phase 2: Planning (PM Agent)

**Duration**: 1-2 days
**Output**: Feature prioritization and roadmap placement
**Owner**: Product Manager role

### Objective
Determine priority, effort, and scheduling for the feature.

### Checklist
- [ ] **Assess Effort vs Impact**
  - Estimate development effort (S/M/L/XL)
  - Evaluate business impact (P0/P1/P2/P3)
  - Consider technical complexity

- [ ] **Identify Dependencies**
  - What features must exist first?
  - What does this feature unblock?
  - Are there external dependencies?

- [ ] **Determine Priority**
  - P0 (Critical): Blocking users or critical bug
  - P1 (High): High value, ready to implement
  - P2 (Medium): Valuable but not urgent
  - P3 (Low): Nice to have

- [ ] **Create Milestone Plan**
  - Break into phases if large
  - Estimate timeline
  - Identify resource needs

- [ ] **Update Feature Registry**
  - Add to `docs/02-planning/feature-registry.md`
  - Place in roadmap timeline

### Deliverable
Entry in `docs/02-planning/feature-registry.md` with priority and effort

### Exit Criteria
✅ Feature prioritized in backlog
✅ Timeline and resources estimated
✅ Dependencies identified and managed

---

## Phase 3: Solutioning (Architect Agent)

**Duration**: 2-5 days
**Output**: Technical specification
**Owner**: Tech Lead/Architect role

### Objective
Design the technical solution with thorough consideration of architecture.

### Checklist
- [ ] **System Architecture**
  - Which components are affected?
  - Frontend changes needed?
  - Backend/API changes needed?
  - Database schema changes?

- [ ] **API Contracts**
  - Define endpoint signatures
  - Request/response formats
  - Error handling strategies
  - Rate limiting considerations

- [ ] **Data Model**
  - Database schema changes
  - Migration scripts
  - Data validation rules

- [ ] **Security Considerations**
  - Authentication/authorization
  - Input validation
  - Data encryption (if applicable)
  - Rate limiting

- [ ] **Identify Technical Risks**
  - Performance concerns
  - Scalability issues
  - Integration challenges
  - Migration risks

- [ ] **Review with Team**
  - Present technical approach
  - Get feedback on design
  - Identify blind spots
  - Refine based on input

- [ ] **Document ADR (if significant architectural decision)**
  - Create `docs/02-planning/architecture-decisions/ADR-XXX-[decision].md`
  - Document alternatives considered
  - Explain rationale

### Deliverable
Complete feature specification using template:
`docs/03-solutioning/features/[feature-name].md`

### Exit Criteria
✅ Technical specification reviewed and approved
✅ Architecture validated by team
✅ Risks identified with mitigation strategies
✅ ADR created (if applicable)

---

## Phase 4: Implementation (Scrum Master Agent)

**Duration**: Variable (based on effort estimate)
**Output**: Tested, deployed feature
**Owner**: Development Team

### Objective
Build, test, and deploy the feature according to specification.

### Checklist

#### Development
- [ ] **Break Down into Tasks**
  - Create granular tasks in feature spec
  - Assign estimates to each task
  - Prioritize task order

- [ ] **Implement with Tests**
  - Write unit tests first (TDD) or alongside code
  - Follow coding conventions from AGENTS.md
  - Write clean, documented code

- [ ] **Code Review**
  - Create PR with clear description
  - Reference feature spec in PR
  - Address reviewer feedback
  - Get approval from team member

#### Testing
- [ ] **Unit Testing**
  - Test individual functions/components
  - Aim for high coverage of critical paths

- [ ] **Integration Testing**
  - Test API endpoints
  - Test database interactions
  - Test third-party integrations

- [ ] **Manual QA Testing**
  - Test happy paths
  - Test edge cases
  - Test error handling
  - Test on multiple devices/browsers

- [ ] **Security Testing**
  - Verify input validation
  - Check authentication/authorization
  - Test for common vulnerabilities (XSS, CSRF, SQL injection)

#### Deployment
- [ ] **Deploy to Staging**
  - Deploy feature to staging environment
  - Run smoke tests

- [ ] **Internal Testing**
  - Team tests feature in staging
  - Fix any issues discovered

- [ ] **Production Deployment**
  - Deploy to production (with feature flag if applicable)
  - Monitor metrics and errors
  - Verify feature works in production

- [ ] **Documentation**
  - Update API documentation
  - Update user guides
  - Update README if needed
  - Create changelog entry

### Deliverable
- Working feature in production
- Tests passing
- Documentation updated
- Metrics being tracked

### Exit Criteria
✅ Feature live in production
✅ All tests passing
✅ Documentation updated
✅ No critical bugs
✅ Metrics being collected

---

## Phase 5: Reflection (Team)

**Duration**: 30 minutes
**Output**: Documented learnings
**Owner**: Entire Team

### Objective
Learn from the experience to improve future feature development.

### Reflection Questions

1. **Did we solve the right problem?**
   - Review success metrics
   - Check user feedback
   - Validate assumptions

2. **What surprised us?**
   - Unexpected challenges
   - Things that were easier than expected
   - User reactions different than anticipated

3. **What would we do differently?**
   - Process improvements
   - Technical approach changes
   - Communication improvements

4. **What did we learn?**
   - Technical learnings
   - Process learnings
   - Team learnings

5. **What should we celebrate?**
   - Wins and successes
   - Good teamwork moments
   - Creative solutions

### Deliverable
Add reflection notes to feature spec document

### Exit Criteria
✅ Team retrospective completed
✅ Learnings documented
✅ Action items created (if applicable)

---

## Special Cases

### Bug Fixes
For bug fixes, use simplified workflow:
1. Analysis: Reproduce and understand root cause
2. Planning: Assess priority (P0 if critical)
3. Solutioning: Design fix (can be quick)
4. Implementation: Fix, test, deploy
5. Reflection: Document learnings to prevent recurrence

See: [Bug Fix Workflow](./bug-fix-workflow.md)

### Urgent Hotfixes
For production emergencies:
- Skip to Implementation phase immediately
- Document retroactively
- Conduct post-mortem afterward

### Experiments/Prototypes
For explorations:
- Analysis + Quick Solutioning only
- Build minimal prototype
- Decide: Continue, Pivot, or Kill
- If continuing, start full workflow

---

## Tools & Templates

### Document Templates
- [Problem Statement Template](../01-analysis/problem-statements/_TEMPLATE.md)
- [Feature Specification Template](../03-solutioning/features/_TEMPLATE.md)
- [ADR Template](../02-planning/architecture-decisions/ADR-000-template.md)

### Tracking Documents
- [Feature Registry](../02-planning/feature-registry.md)
- [Roadmap](../02-planning/roadmap.md)
- [Backlog](../04-implementation/backlog.md)

### AI Assistant Integration
- [Claude Code Guidelines](../tools/claude-code/README.md)
- [AI Agent Guidelines](./ai-agent-guidelines.md)

---

## Best Practices

### Do's ✅
- **Start with the problem**, not the solution
- **Involve stakeholders** early and often
- **Document decisions** and rationale
- **Test thoroughly** at each stage
- **Reflect and learn** from every feature

### Don'ts ❌
- **Don't skip phases** (unless justified)
- **Don't over-engineer** - simplest solution wins
- **Don't ignore risks** - address them upfront
- **Don't forget users** - validate with real feedback
- **Don't skip reflection** - learnings compound

---

## Metrics & Improvement

### Process Metrics to Track
- **Cycle Time**: Analysis → Production
- **Quality**: Bugs per feature
- **Velocity**: Features completed per month
- **Accuracy**: Estimates vs. actuals

### Quarterly Review
- Review all features developed in quarter
- Identify patterns and improvements
- Update workflow as needed
- Share learnings with team

---

## Related Documents
- [Product Vision](../02-planning/product-vision.md)
- [Roadmap](../02-planning/roadmap.md)
- [AI Agent Guidelines](./ai-agent-guidelines.md)
- [Bug Fix Workflow](./bug-fix-workflow.md)
- [Release Process](./release-process.md)

---

**Last Updated**: 2025-10-13
**Next Review**: 2026-01-13
**Owner**: Development Team
