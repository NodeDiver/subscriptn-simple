# Feature: [Feature Name]

**Status**: [Analysis | Planning | Solutioning | Implementation | Complete]
**Priority**: [P0-Critical | P1-High | P2-Medium | P3-Low]
**Effort**: [S (1-3 days) | M (1-2 weeks) | L (2-4 weeks) | XL (1-3 months)]
**Owner**: [Name or "Unassigned"]
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

---

## Quick Links
- [Implementation Checklist](#development-tasks)
- [Technical Spec](#solution-overview)
- [Testing Strategy](#testing-strategy)

---

## Problem Statement (Analyst Perspective)

### User Pain Point
What specific frustration or need does this feature address?

**Example**:
> Shop owners cannot discover private BTCPay servers because they're not listed publicly, creating a barrier for private server providers who want selective onboarding.

### Evidence
Provide data supporting this need:
- **User Feedback**: "Quote from user interview or feedback"
- **Analytics Data**: X% of users requested this feature
- **Market Research**: Competitors offer this; we're missing it
- **Support Tickets**: Y tickets related to this issue

### Affected Users
- **Primary**: [User segment most affected]
- **Secondary**: [Additional affected segments]
- **Volume**: Approximately X users impacted

### Success Criteria
How will we measure if this feature solves the problem?

1. **Metric 1**: [Specific, measurable outcome]
   - Target: [Number]
   - Measurement: [How we'll track it]

2. **Metric 2**: [Specific, measurable outcome]
   - Target: [Number]
   - Measurement: [How we'll track it]

3. **Metric 3**: [User satisfaction or qualitative outcome]
   - Target: [Description]
   - Measurement: [How we'll assess it]

---

## Solution Overview (Architect Perspective)

### Proposed Approach
High-level description of the solution.

**Example**:
> Generate unique invitation IDs for private servers. Server owners can share invitation links that allow specific shops to discover and connect to their servers without listing publicly.

### System Components Affected

#### Frontend Changes
- **Pages/Components**: List affected UI components
  - File: `src/app/path/to/component.tsx`
  - Changes: Description of modifications

#### Backend Changes
- **API Endpoints**: List new or modified endpoints
  - `POST /api/endpoint` - Description
  - `GET /api/endpoint/:id` - Description

#### Database Changes
- **Schema Modifications**:
  ```prisma
  model Example {
    id        Int      @id @default(autoincrement())
    newField  String   // Description of new field
  }
  ```

#### Third-Party Integrations
- **Service**: What it's used for
- **API Calls**: Which endpoints we'll use

### Data Flow
```
User Action → API Endpoint → Database → Response → UI Update
```

Describe the complete flow through the system.

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Risk description | High/Med/Low | High/Med/Low | How we'll address it |

### Dependencies
- **Requires**: [Other features or work that must be done first]
- **Blocks**: [What this feature unblocks]
- **Related**: [Connected but not blocking features]

---

## Implementation Plan (PM Perspective)

### Development Phases

#### Phase 1: Foundation (Week 1-2)
**Goal**: [What we'll accomplish]

**Deliverables**:
- [ ] Database schema changes
- [ ] Migration scripts
- [ ] API endpoints (backend only)

**Exit Criteria**: Backend functionality complete and tested

---

#### Phase 2: Integration (Week 3-4)
**Goal**: [What we'll accomplish]

**Deliverables**:
- [ ] Frontend components
- [ ] User interface
- [ ] End-to-end testing

**Exit Criteria**: Feature functional in staging environment

---

#### Phase 3: Polish & Launch (Week 5)
**Goal**: [What we'll accomplish]

**Deliverables**:
- [ ] Bug fixes
- [ ] Documentation
- [ ] Production deployment

**Exit Criteria**: Feature live in production with monitoring

---

### Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Phase 1 Complete | YYYY-MM-DD | Not Started |
| Phase 2 Complete | YYYY-MM-DD | Not Started |
| Phase 3 Complete | YYYY-MM-DD | Not Started |

### Resource Requirements
- **Development Time**: X days/weeks
- **Design Time**: Y days (if applicable)
- **Testing Time**: Z days
- **Documentation**: Included in phases

---

## Development Tasks (Scrum Master Perspective)

### Backend Tasks
- [ ] **Database Migration**: Add new fields/tables
  - File: `prisma/schema.prisma`
  - Effort: [S/M/L]

- [ ] **API Endpoint 1**: Create/modify endpoint
  - File: `src/app/api/path/route.ts`
  - Effort: [S/M/L]

- [ ] **API Endpoint 2**: Create/modify endpoint
  - File: `src/app/api/path/route.ts`
  - Effort: [S/M/L]

### Frontend Tasks
- [ ] **Component 1**: Create/modify UI component
  - File: `src/app/path/component.tsx`
  - Effort: [S/M/L]

- [ ] **Component 2**: Create/modify UI component
  - File: `src/app/path/component.tsx`
  - Effort: [S/M/L]

### Testing Tasks
- [ ] **Unit Tests**: Test backend logic
  - Coverage: [percentage or description]

- [ ] **Integration Tests**: Test API endpoints
  - Scenarios: [list key scenarios]

- [ ] **E2E Tests**: Test user flows
  - Flows: [list critical paths]

- [ ] **Manual Testing**: Test edge cases
  - Cases: [list specific cases]

### Documentation Tasks
- [ ] **API Documentation**: Document new endpoints
- [ ] **User Guide**: Update user-facing docs
- [ ] **Developer Guide**: Update technical docs
- [ ] **README**: Update if needed

---

## Testing Strategy

### Test Scenarios

#### Happy Path
1. **Scenario**: [Normal usage flow]
   - Given: [Initial state]
   - When: [User action]
   - Then: [Expected outcome]

#### Edge Cases
1. **Scenario**: [Edge case]
   - Given: [Initial state]
   - When: [User action]
   - Then: [Expected outcome]

#### Error Handling
1. **Scenario**: [Error condition]
   - Given: [Initial state]
   - When: [Error trigger]
   - Then: [Expected error handling]

### Security Testing
- [ ] Input validation
- [ ] Authentication/authorization
- [ ] Data encryption (if applicable)
- [ ] Rate limiting
- [ ] SQL injection prevention

### Performance Testing
- [ ] Load testing: [X concurrent users]
- [ ] Response time: [< Y ms target]
- [ ] Database query optimization

---

## UI/UX Considerations

### User Flows
1. **Primary Flow**: [Step-by-step user journey]
2. **Alternative Flow**: [Alternative path]
3. **Error Flow**: [What happens when things go wrong]

### Design Requirements
- **Responsive**: Must work on mobile, tablet, desktop
- **Accessibility**: WCAG compliance level
- **Dark Mode**: Support dark theme
- **Loading States**: Show appropriate feedback

### Wireframes/Mockups
[Link to Figma, screenshots, or ASCII diagrams]

---

## Rollout Strategy

### Deployment Plan
1. **Staging**: Deploy to staging environment
2. **Internal Testing**: Team tests feature
3. **Beta**: Limited user rollout (if applicable)
4. **Production**: Full rollout

### Feature Flags
- [ ] Implement feature flag for gradual rollout
- [ ] Define rollout percentage (e.g., 10% → 50% → 100%)

### Rollback Plan
If feature causes issues:
1. Disable feature flag
2. Or revert deployment
3. Investigate and fix
4. Redeploy

### Monitoring
- **Metrics to Track**:
  - Feature usage: [metric]
  - Error rate: [metric]
  - Performance: [metric]

- **Alerts**:
  - Error rate > X%
  - Response time > Y ms
  - Usage drops by Z%

---

## Documentation Updates

### User-Facing Docs
- [ ] Update README with feature description
- [ ] Add to user guide/help docs
- [ ] Create tutorial or walkthrough

### Developer Docs
- [ ] API documentation
- [ ] Architecture decision record (if applicable)
- [ ] Code comments and inline docs

### Marketing/Communications
- [ ] Announcement blog post
- [ ] Email to users
- [ ] Social media posts

---

## Reflection Questions

### Before Implementation
1. **Is this the simplest solution?**
   - Could we solve this with less complexity?

2. **What assumptions are we making?**
   - List assumptions and how we'll validate them

3. **What could go wrong?**
   - List potential failure modes

### During Implementation
4. **Are we on track?**
   - Check against timeline and milestones

5. **What are we learning?**
   - Document insights and surprises

### After Launch
6. **Did we solve the problem?**
   - Review success metrics

7. **What would we do differently?**
   - Document lessons learned

---

## Post-Launch Review

**Review Date**: [6 weeks after launch]
**Status**: [Success | Partial Success | Needs Iteration]

### Metrics Results
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Metric 1 | X | Y | ✅/❌ |
| Metric 2 | X | Y | ✅/❌ |

### User Feedback
- Positive feedback: [summary]
- Negative feedback: [summary]
- Feature requests: [summary]

### Technical Performance
- Reliability: [uptime, error rate]
- Performance: [response times]
- Scalability: [handling load]

### Lessons Learned
1. **What Went Well**: [summary]
2. **What Could Improve**: [summary]
3. **Surprising Insights**: [summary]

### Next Steps
- [ ] Follow-up feature or improvement
- [ ] Bug fixes or optimizations
- [ ] Documentation updates

---

## Related Documents
- [Product Vision](../../02-planning/product-vision.md)
- [Roadmap](../../02-planning/roadmap.md)
- [Architecture Decisions](../../02-planning/architecture-decisions/)
- [API Documentation](../api-contracts/)

---

**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Next Review**: YYYY-MM-DD
