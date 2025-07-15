<!-- Project Logo/Banner -->
<p align="center">
  <img src="public/file.svg" alt="SubscriptN Logo" width="120" />
</p>

# SubscriptN

_Bitcoin subscriptions made easy. Lightning fast. ⚡_

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Hackathon](https://img.shields.io/badge/hackathon-Geyser%202025-orange)

## Quick Links
- [Live Demo](#) <!-- Add link if available -->
- [Documentation](#)
- [Logbook](#subscriptn-logbook)
- [Contributing](#contributing)

## Features
- ⚡ **Real Lightning Network payments** using @getalby/lightning-tools
- 🏪 Unified dashboard access for all users (no roles)
- 🔒 Secure authentication & privacy-first design
- 🔗 Bitcoin Connect wallet integration with WebLN support
- 🎨 Modern, responsive UI (dark mode ready!)
- 💳 **Direct Lightning address integration** for invoice generation

## Getting Started

```bash
# Welcome to SubscriptN!
# Run the following to get started:
git clone https://github.com/yourusername/subscriptn-simple.git
cd subscriptn-simple
npm install
cp env.example .env.local
# Edit .env.local with your BTCPay Server details
npm run dev
```

> 💡 **Tip:** You can connect your Lightning wallet in just two clicks!
>
> 🧙‍♂️ **Fun Fact:** This project was built during the Geyser Hackathon 2025!

## Screenshots
![Dashboard Screenshot](public/screenshot-dashboard.png)
![Connect Wallet Modal](public/screenshot-modal.png)

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- BTCPay Server instance
- BTCPay Server API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/subscriptn-simple.git
   cd subscriptn-simple
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` and add your BTCPay Server details:
   ```env
   BTCPAY_HOST=https://your-btcpay-server.com
   BTCPAY_API_KEY=your-btcpay-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The database will be automatically created with demo users on first run, and the app will be available at `http://localhost:3000`

### Demo Credentials
- **Demo User**: `demo` / `demo`

### Lightning Wallet Requirements
To use the subscription payment features, you'll need a Lightning wallet with WebLN support:
- **Alby** (recommended) - [getalby.com](https://getalby.com)
- **BlueWallet** - [bluewallet.io](https://bluewallet.io)
- **Phoenix** - [phoenix.acinq.co](https://phoenix.acinq.co)
- **Breez** - [breez.technology](https://breez.technology)

## Security & Privacy

### Environment Variables
This application uses environment variables for sensitive configuration. Copy `env.example` to `.env.local` and fill in your actual values:

```bash
cp env.example .env.local
```

**Required variables:**
- `BTCPAY_HOST`: Your BTCPay Server URL
- `BTCPAY_API_KEY`: Your BTCPay Server API key

### Database Security
- The SQLite database (`subscriptn.db`) contains sensitive user data and is automatically excluded from Git
- Never commit the database file or any `.env` files
- Use environment variables for all secrets and API keys

### Development Security
- Demo credentials are hardcoded for development only
- In production, implement proper user registration and password hashing
- Use HTTPS in production environments
- Implement proper session management and CSRF protection

## Week 3 Summary (Current Week)
- 🔧 *Fixed critical UI/UX issues and implemented comprehensive duplicate prevention*
- 🛡️ *Added robust database constraints and ownership management*
- ⚡ *Enhanced Bitcoin Connect integration with official API*
- 🧹 *Performed major database cleanup and system optimization*

## Week 2 Summary
- 🎯 *Wednesday: Hackathon presentation and demo*
- 🏆 *Friday: Winner announcement - we won!*
- 🧠 *Saturday: Continued development work on project features*
- 📚 *Monday: Research and analysis of other projects and NWC perspectives*

## Week 1 Summary
- 🚀 *Set up project foundation and local development environment*
- 🔐 *Built full authentication, unified dashboard access, and core API routes*
- ⚡ *Integrated Lightning payments and subscription management*
- 🖥️ *Added persistent top bar, sidebar, and improved UI/UX*
- 🧩 *Began Bitcoin Connect integration (modal, context, TopBar); modal theming WIP*

<details>
<summary>Week 3: 2025-07-08 to 2025-07-12 (Current Week)</summary>

### 2025-07-12: Comprehensive Duplicate Prevention & System Optimization
- **Action**: 🛡️ *Implemented comprehensive duplicate prevention for shops and subscriptions, fixed UI issues, and performed major database cleanup.*
- **Updates**:
  - 🔧 *Fixed text color issues in shop dashboard (unreadable white text on white background).*
  - 🛡️ *Added database constraints: unique indexes for shops (name+server_id) and subscriptions (active per shop).*
  - 🚫 *Implemented shop duplicate prevention: same user cannot add same shop name on same server, different users cannot claim same shop.*
  - 🔒 *Implemented subscription duplicate prevention: one active subscription per shop only.*
  - 🗑️ *Added shop removal functionality with cascade deletion and payment cancellation warnings.*
  - 🧹 *Performed major database cleanup: removed all existing shops (17), subscriptions (1), and subscription history.*
  - ⚡ *Enhanced Bitcoin Connect integration using official API instead of custom implementation.*
- **Result**: ✅ *System now has robust duplicate prevention, proper ownership management, and clean database state. All UI issues resolved.*
- **Plan for next session**: 📝 *Continue testing and refining the duplicate prevention logic, and work on remaining NWC integration features.*

### 2025-07-11: Research & Analysis Day
- **Action**: 📚 *Spent the day reading and analyzing other hackathon projects to understand different NWC perspectives and approaches.*
- **Updates**:
  - 🔍 *Researched other Geyser Hackathon 2025 projects and their NWC implementations.*
  - 💭 *Analyzed different approaches to Nostr Wallet Connect integration.*
  - 🧠 *Contemplated future development direction for SubscriptN project.*
  - 📖 *Studied various NWC use cases and implementation patterns.*
- **Result**: 💡 *Gained valuable insights into NWC ecosystem and different implementation approaches.*
- **Plan for next session**: 📝 *Apply learnings to continue SubscriptN development with improved NWC integration strategy.*

### 2025-07-10: Post-Hackathon Development Work
- **Action**: 🧠 *Continued development work on SubscriptN features after hackathon victory.*
- **Updates**:
  - 🔧 *Worked on various project features and improvements.*
  - 🎯 *Applied lessons learned from hackathon presentation and feedback.*
  - ⚡ *Continued Bitcoin Connect integration work.*
- **Result**: ✅ *Made progress on project features and improvements.*
- **Plan for next session**: 📝 *Continue development with focus on user experience and system stability.*

### 2025-07-09: Wallet Connection Debugging & UI Improvements
- **Action**: 🐞 *Debugged wallet connection synchronization issues and improved UI/UX.*
- **Updates**:
  - 🔄 *Refactored wallet connect button to use callback ref for robust event handling.*
  - 📝 *Added detailed logging and diagnostics for wallet connection events.*
  - 🖥️ *Improved UI/UX for wallet connection and LightningSubscription form.*
  - 💤 *User ended session for sleep; blocker documented for next session.*
- **Result**: ⚠️ *Wallet connection state still not syncing properly to LightningSubscription form.*
- **Plan for next session**: 📝 *Fix wallet connection state propagation issues.*

### 2025-07-08: Phase 3 - Subscription Management with Lightning Payments
- **Action**: 🚀 *Began Phase 3 implementation focusing on subscription management and Lightning payments.*
- **Updates**:
  - 🎯 *Started Phase 3 with focus on Lightning payment flows and subscription lifecycle.*
  - ⚡ *Planned NWC (Nostr Wallet Connect) integration to replace ZapPlanner dependency.*
  - 🔄 *Outlined subscription automation and recurring payment handling.*
- **Result**: 📋 *Phase 3 goals and roadmap established.*
- **Plan for next session**: 📝 *Continue Phase 3 implementation with wallet integration.*

</details>

<details>
<summary>Week 2: 2025-07-01 to 2025-07-07</summary>

### 2025-07-07: Winner Announcement
- **Action**: *Won the Geyser Hackathon 2025!*
- **Updates**:
  - 🏆 *SubscriptN was announced as the winner!*
  - 🎯 *Project recognized for innovative Bitcoin subscription management approach.*
  - ⚡ *Lightning Network integration and NWC implementation praised.*
  - 🎊 *Celebrated victory with the team.*
- **Result**: *Hackathon victory achieved! Project validated by industry experts.*
- **Plan for next session**: *Continue development with renewed motivation and feedback.*

### 2025-07-05: Presentation Day
- **Action**: *Presented SubscriptN at the Geyser Hackathon 2025.*
- **Updates**:
  - 🎤 *Delivered presentation and demo of SubscriptN.*
  - 🖥️ *Showcased Lightning Network integration and subscription management features.*
  - 💬 *Answered questions from judges and other participants.*
  - 🎯 *Demonstrated the innovative approach to Bitcoin subscription management.*
- **Result**: *Successful presentation completed.*
- **Plan for next session**: *Await results and continue development.*

### 2025-07-04: Final Preparation
- **Action**: *Final preparations for presentation.*
- **Updates**:
  - 🎯 *Polished presentation materials and demo.*
  - 🔧 *Final bug fixes and feature improvements.*
  - 📝 *Prepared presentation script and technical documentation.*
  - ⚡ *Ensured Lightning Network integration was working properly.*
- **Result**: *Ready for presentation.*
- **Plan for next session**: *Present and showcase SubscriptN.*

### 2025-07-03: Intensive Development Sprint
- **Action**: *Major development sprint with significant feature implementation and system improvements.*
- **Updates**:
  - 🚀 *Rapid feature development and integration across the entire application.*
  - 🔧 *Comprehensive bug fixes and system optimization for production readiness.*
  - 🎨 *Extensive UI/UX improvements and polish for professional presentation.*
  - 📝 *Complete documentation and presentation preparation with technical details.*
  - ⚡ *Enhanced Lightning Network integration with improved error handling.*
  - 🛡️ *Added security improvements and validation throughout the application.*
  - 🗄️ *Database optimizations and query improvements for better performance.*
- **Result**: *Significant progress made with production-ready features and polished presentation materials.*
- **Plan for next session**: *Continue preparation and final polish for presentation.*

### 2025-07-02: Project Planning & Architecture
- **Action**: *Planned and structured SubscriptN with comprehensive technical architecture.*
- **Updates**:
  - 🎯 *Defined project scope and goals with clear technical requirements.*
  - 📝 *Created detailed project timeline and development milestones.*
  - 🧩 *Planned technical implementation approach with modern web technologies.*
  - 🎨 *Designed user experience and interface concepts with focus on usability.*
  - ⚡ *Outlined Lightning Network and NWC integration strategy.*
  - 🗄️ *Designed database schema and API architecture.*
- **Result**: *Comprehensive project plan established with clear technical direction.*
- **Plan for next session**: *Begin intensive development sprint.*

### 2025-07-01: Project Registration & Vision
- **Action**: *Registered for Geyser Hackathon 2025 and began project planning.*
- **Updates**:
  - 📝 *Registered SubscriptN for the competition.*
  - 🎯 *Defined project vision and goals for Bitcoin subscription management.*
  - 🧠 *Planned innovative approach to subscription management with Lightning Network.*
  - ⚡ *Outlined Lightning Network and NWC integration strategy.*
- **Result**: *Successfully registered with clear project vision.*
- **Plan for next session**: *Begin detailed project planning and development.*

</details>

<details>
<summary>Week 1: 2025-07-01 to 2025-07-05</summary>

### 2025-07-12: Bitcoin Connect Integration - Official API Implementation
- **Action**: *Replaced custom Bitcoin Connect context with official @getalby/bitcoin-connect API integration for reliable wallet connection state management.*
- **Updates**:
  - ⚡ *Migrated from custom event listeners to official Bitcoin Connect API functions (`onConnected`, `onDisconnected`, `onConnecting`, `isConnected`, `launchModal`, etc.).*
  - 🔧 *Updated `BitcoinConnectContext.tsx` to use official API instead of custom web component event handling.*
  - 🎯 *Removed dependency on `@getalby/bitcoin-connect-react` package (which didn't provide the expected Provider/hook).*
  - 🧹 *Cleaned up custom modal implementation and event listener logic.*
  - ✅ *Maintained existing `ConnectWalletButton` component using official `<bc-button>` web component.*
- **Result**: *Wallet connection state should now properly sync across all components using the official Bitcoin Connect API. The context now uses reliable event subscriptions instead of DOM event listeners.*
- **Plan for next session**: *Test the wallet connection flow end-to-end and verify that the LightningSubscription form properly detects wallet connection state.*

### 2025-07-09: Wallet Connection Debugging, UI/UX Improvements, and Next Steps
- **Action**: *Debugged wallet connection sync between Bitcoin Connect web component and React context. Improved event listener logic and diagnostics in `ConnectWalletButton.tsx`.*
- **Updates**:
  - 🔄 *Refactored wallet connect button to use callback ref for robust event handling.*
  - 📝 *Added detailed logging and diagnostics for wallet connection events.*
  - 🖥️ *UI/UX for wallet connection and LightningSubscription form improved, but form still does not recognize wallet as connected due to event propagation issues.*
  - 💤 *User ended session for sleep; blocker documented for next session.*
- **Result**: *Wallet connection state is still not syncing to the LightningSubscription form. This is the top priority for the next session.*
- **Plan for next session**: *Fix wallet connection state propagation so the LightningSubscription form can reliably detect wallet connection and enable subscription creation.*

### 2025-07-05: Development Log Setup, Bitcoin Connect Integration & Project Continuity
- **Action**: *Created comprehensive development log system for project continuity and session tracking. Began and advanced Bitcoin Connect integration (Phase 2).*
- **Updates**:
  - 📓 *Created `DEVELOPMENT_LOG.md` file to track all user prompts and code changes.*
  - 🤖 *Established maintenance instructions for AI assistants to maintain project context.*
  - 🗂️ *Set up structured logging format for future development sessions.*
  - ⚡ *Implemented Bitcoin Connect modal using web component `<bc-connect />` and integrated it with context and TopBar.*
  - 🎨 *Attempted to force modal dark mode for UI consistency (not fully working yet; modal theming still broken).*
- **Result**: *Project now has complete development diary for seamless continuity between work sessions. Bitcoin Connect modal appears and is integrated, but theming issues remain.*
- **Plan for next session**: *Get the modal working in full dark mode and finish the BitcoinConnect implementation (wallet connection, payment flow, and error handling).*

### 2025-07-04: Full App Build, Security & Production Prep
- **Action**: *Built out the full SubscriptN app with ChatGPT and Cursor AI, focusing on authentication, API, database, and security.*
- **Updates**:  
  - 🔑 *Implemented session auth, role-based access, and all core API routes.*  
  - ⚡ *Integrated Lightning payments and subscription management.*  
  - 🛡️ *Added error handling, toasts, validation, and rate limiting.*  
  - 🔒 *Performed a security audit, excluded sensitive files, and created SECURITY.md.*  
  - 📄 *Updated README and env.example for clarity and onboarding.*
- **Result**: *First complete user flows working, there are still lots of work to do, many implementations were "half made" and still need some configuring...*
- **Plan for 2025-07-05**: *Polish all half-implemented features, finalize UI flows, and validate end-to-end subscription functionality.*
- **Thought**: *I realized today that with this rest-call to zapplanner I am actually not really implementing nwc. I should re-focus and think of implementing perhaps a nwc connection somewhere and let the webapp do the subscription instead of asking the user to go to zapplanner with the click of the button add new shop button.*

### 2025-07-03: Refactor Frontend & Live Data
- **Task**: *Refactor and enhance the Next.js front end in `subscriptn-simple`.*
- **Action**: *Overhauled `page.tsx` to fetch live store data from BTCPayServer (`/api/stores`), set default shop, and auto-generate subscription comments.*
- **Enhancements**:
  - 🏪 *Dynamic shop selector populated from BTCPayServer.*
  - ⚡ *Lightning address override input.*
  - 💸 *Amount slider with minimum recommendation notice.*
  - ⏳ *Timeframe buttons for 1 week, 1 month, 3 months, 1 year.*
  - 🎨 *Styled UI with Tailwind for dark/light modes.*
- **Repository**: [GitHub](https://github.com/NodeDiver/subscriptn-simple)
- **Result**: *UI now displays live store list and improved user interface ready for subscription flow.*
- **Plan for 2025-07-04**: *Focus on architectural design, simulating two user roles—server infrastructure owners vs. shop owners—to define authentication and permission boundaries.*

### 2025-07-02: Simple Next.js Prototype
- **Task**: *Set up a minimal Next.js repository to test a direct call to the ZapPlanner API.*
- **Repository**: [GitHub](https://github.com/NodeDiver/subscriptn-simple)
- **Result**: *Basic Next.js app scaffolded; foundation for API integration established.*
- **Next Steps**: *Implement and test API call logic within the simple app.*

### 2025-07-01: Research and Documentation
- **Action**: *Read ZapPlanner documentation and explored alternative approaches.*
- **Thought**: *Might need to deploy my own ZapPlanner instance to gain deeper control.*
- **Status**: *Unsure—research to continue.*

</details>

### 2025-06-30: Kickoff and Local Setup
- **Task**: *Forked the ZapPlanner repository.*
- **Action**: *Cloned the fork to local machine.*
- **Result**: *Attempted to launch ZapPlanner locally but faced errors.*
- **Error**: *Misconfiguration handling `PRISMA_FIELD_ENCRYPTION_KEY`.*
- **Notes**: *Unable to get it working today.*

## FAQ
- **Q:** Can I use this with any BTCPay Server?
  **A:** Yes!
- **Q:** Is it really lightning fast?
  **A:** ⚡ Of course!

## Contributing
We 💛 open source! PRs, issues, and ideas are always welcome.

---
_Thanks for checking out SubscriptN! May your sats flow endlessly. 🚀_
