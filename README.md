Enable automated monthly subscription payments via NWC for BTCPayServer users.

_This version will solely verify subscriptions on BTCPayServer via NWC. User management features will be deferred to later phases._

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
- **BTCPay Server Provider**: `btcpayserver` / `btcpayserver`
- **Shop Owner**: `shopowner` / `shopowner`

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
