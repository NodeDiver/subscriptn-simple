Enable automated monthly subscription payments via NWC for BTCPayServer users.

_This version will solely verify subscriptions on BTCPayServer via NWC. User management features will be deferred to later phases._

# SubscriptN Logbook

## Project Overview

SubscriptN is a project initiated for the Geyser Hackathon in July 2025. Its goal is to build an innovative subscription and payment integration tool leveraging Bitcoin and Lightning Network technologies, extending the functionality of existing solutions like ZapPlanner.

---

## Entries

### 2025-07-03: Refactor Frontend & Live Data

- **Task**: Refactor and enhance the Next.js front end in `subscriptn-simple`.
- **Action**: Overhauled `page.tsx` to fetch live store data from BTCPayServer (`/api/stores`), set default shop, and auto-generate subscription comments.
- **Enhancements**:
  - Dynamic shop selector populated from BTCPayServer.
  - Lightning address override input.
  - Amount slider with minimum recommendation notice.
  - Timeframe buttons for 1 week, 1 month, 3 months, 1 year.
  - Styled UI with Tailwind for dark/light modes.
- **Repository**: https://github.com/NodeDiver/subscriptn-simple
- **Result**: UI now displays live store list and improved user interface ready for subscription flow.
- **Plan for 2025-07-04**: Focus on architectural design, simulating two user roles—server infrastructure owners vs. shop owners—to define authentication and permission boundaries.

### 2025-07-02: Simple Next.js Prototype

- **Task**: Set up a minimal Next.js repository to test a direct call to the ZapPlanner API.
- **Repository**: https://github.com/NodeDiver/subscriptn-simple
- **Result**: Basic Next.js app scaffolded; foundation for API integration established.
- **Next Steps**: Implement and test API call logic within the simple app.

### 2025-07-01: Research and Documentation

- **Action**: Read ZapPlanner documentation and explored alternative approaches.
- **Thought**: Might need to deploy my own ZapPlanner instance to gain deeper control.
- **Status**: Unsure—research to continue.

### 2025-06-30: Kickoff and Local Setup

- **Task**: Forked the ZapPlanner repository.
- **Action**: Cloned the fork to local machine.
- **Result**: Attempted to launch ZapPlanner locally but faced errors.
- **Error**: Misconfiguration handling `PRISMA_FIELD_ENCRYPTION_KEY`.
- **Notes**: Unable to get it working today.
