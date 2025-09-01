# AGENTS.md

## Goal
You are a coding agent working on SubscriptN, a Bitcoin subscription management platform built with Next.js 15. Follow these instructions strictly to build, test, and validate changes before proposing a PR.

## Project Overview
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Package Manager**: npm (as indicated by package-lock.json)
- **Styling**: Tailwind CSS v4 with custom color palette
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom auth system with bcryptjs
- **Lightning Network**: Bitcoin Connect, WebLN, and NWC integration
- **Default Branch**: main (check current git branch)

## Tech Stack Details
- **Frontend**: React 19, Next.js 15 with App Router
- **Backend**: Next.js API routes, Server Actions
- **Database**: SQLite with Prisma migrations
- **Styling**: Tailwind CSS with custom SubscriptN brand colors
- **Authentication**: Session-based auth with bcryptjs
- **Lightning**: @getalby/bitcoin-connect, @getalby/lightning-tools
- **Development**: ESLint, TypeScript strict mode

## Dev Environment Setup
- **Node Version**: 18+ (as specified in README)
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Database Setup**:
  ```bash
  npx prisma generate
  npx prisma db push
  ```
- **Environment Variables**:
  ```bash
  cp env.example .env.local
  # Edit .env.local with your configuration
  ```

## Development Commands
- **Start Dev Server**:
  ```bash
  npm run dev
  ```
- **Build Production**:
  ```bash
  npm run build
  ```
- **Start Production**:
  ```bash
  npm run start
  ```
- **Lint Code**:
  ```bash
  npm run lint
  ```
- **Type Check**:
  ```bash
  npx tsc --noEmit
  ```

## Code Style & Patterns

### TypeScript & React
- Use TypeScript strict mode (already configured)
- Prefer functional components with hooks
- Use Server Components by default; mark `"use client"` only when needed
- Prefer named exports; avoid default exports except for Next page components
- Use path aliases from `tsconfig.json` (e.g., `@/components/...`)

### Next.js App Router
- Pages go under `src/app/`
- Use Server Actions for mutations when possible
- API routes under `src/app/api/`
- Follow Next.js 15 best practices for Server/Client Components

### Styling
- Use Tailwind CSS classes from the custom color palette
- Brand colors are defined in `tailwind.config.js`:
  - Primary: `subscriptn-green-500` (#2D5A3D)
  - Secondary: `subscriptn-blue-500` (#1E3A8A)
  - Accent: `subscriptn-teal-500` (#0F766E)
- Use the predefined gradients and animations from the config
- Maintain dark mode compatibility

### Database & Prisma
- Use Prisma Client for all database operations
- Follow the existing schema patterns in `prisma/schema.prisma`
- Never modify migration files directly
- Use proper Prisma relations and field mappings

## Project-Specific Guidelines

### Bitcoin & Lightning Network
- Use lowercase "lightning network" everywhere (project preference)
- Avoid excessive Bitcoin lore or repetitive "bitcoin" mentions
- Focus on practical subscription management features
- Use proper error handling for lightning payments

### Authentication & Security
- Follow the existing auth patterns in `src/lib/auth.ts`
- Use bcryptjs for password hashing
- Never log or expose sensitive information
- Follow the security guidelines in `SECURITY.md`

### Component Structure
- Keep components in `src/components/`
- Use the existing context providers (AuthContext, BitcoinConnectContext, etc.)
- Follow the established patterns for protected routes
- Maintain the existing error boundary and loading patterns

## Testing Requirements
- **Before Proposing Changes**:
  ```bash
  npm run lint && npx tsc --noEmit
  ```
- **Add Tests For**:
  - New API endpoints
  - Critical business logic
  - Lightning payment flows
  - Authentication flows
- **Test Coverage Areas**:
  - Server/Shop management
  - Subscription logic
  - Payment processing
  - User authentication

## File Organization
- **API Routes**: `src/app/api/`
- **Pages**: `src/app/`
- **Components**: `src/components/`
- **Contexts**: `src/contexts/`
- **Database**: `src/lib/` (Prisma client)
- **Types**: Use TypeScript interfaces/types
- **Styling**: Tailwind CSS classes, avoid custom CSS

## Safety & Boundaries

### DO NOT TOUCH
- `.env*` files or environment variables
- `prisma/migrations/` directory
- `subscriptn.db` file directly
- `package-lock.json` (use `npm install` instead)
- CI/CD configuration files

### BE CAREFUL WITH
- Database schema changes (requires migration)
- Authentication logic
- Lightning payment flows
- Environment variable usage

## Commits & PRs

### Commit Messages
- Follow Conventional Commits standard
- Use prefixes: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`
- Header ≤ 100 characters, present tense, no period
- Optional body ≤ 120 chars per line

### PR Requirements
- [ ] Lint passes (`npm run lint`)
- [ ] TypeScript check passes (`npx tsc --noEmit`)
- [ ] Tests added/updated for new functionality
- [ ] Database changes properly migrated
- [ ] Environment variables documented
- [ ] Lightning payment flows tested

### Branch Strategy
- Base off `main` branch
- Use descriptive branch names: `feat/subscription-management`, `fix/lightning-payment`
- Keep PRs focused and small

## Runbooks

### Add a New Page
1. Create `src/app/<route>/page.tsx`
2. Add `"use client"` only if client-side state is needed
3. Use existing layout patterns and styling
4. Add to navigation if needed
5. Test rendering and functionality

### Add an API Endpoint
1. Create `src/app/api/<name>/route.ts`
2. Follow existing API patterns
3. Add proper error handling
4. Use Prisma for database operations
5. Add input validation
6. Test with proper authentication

### Add a Database Model
1. Update `prisma/schema.prisma`
2. Create and run migration: `npx prisma migrate dev --name <description>`
3. Update Prisma client: `npx prisma generate`
4. Add to appropriate Prisma service files
5. Update related models and relations

### Add a UI Component
1. Create in `src/components/`
2. Use Tailwind CSS with brand colors
3. Make it reusable and properly typed
4. Add to existing component patterns
5. Test rendering and interactions

## Lightning Network Integration

### Payment Flows
- Use existing `@getalby/bitcoin-connect` integration
- Follow WebLN standards for wallet communication
- Implement proper error handling for failed payments
- Use the existing `LightningSubscription` component patterns

### Wallet Compatibility
- Support WebLN compatible wallets (Alby, BlueWallet, Zap)
- Support NWC compatible wallets (Alby Hub, Coinos, Mutiny, Zeus)
- Test with multiple wallet types
- Handle wallet connection failures gracefully

## Performance & Accessibility
- Use Server Components for static content
- Implement proper loading states
- Add ARIA labels and semantic HTML
- Optimize database queries with Prisma
- Use Next.js Image component for images
- Implement proper error boundaries

## Deployment Considerations
- Environment variables must be set in production
- Database migrations must be run before deployment
- Lightning network configuration must be production-ready
- Test payment flows in staging environment
- Monitor for failed payments and connection issues

## Troubleshooting

### Common Issues
- **Database Connection**: Check `.env.local` and run `npx prisma generate`
- **Lightning Payments**: Verify wallet connection and network status
- **Build Errors**: Check TypeScript errors with `npx tsc --noEmit`
- **Styling Issues**: Verify Tailwind classes and custom color usage

### Debug Commands
```bash
# Check database status
npx prisma studio

# View Prisma schema
npx prisma format

# Reset database (development only)
npx prisma migrate reset

# Check environment variables
echo $NODE_ENV
```

## Tooling Awareness
- **Before Proposing Changes**: Always run `npm run lint && npx tsc --noEmit`
- **Database Changes**: Use Prisma migrations, never edit schema directly
- **Styling**: Use Tailwind CSS classes, avoid custom CSS
- **Authentication**: Follow existing patterns, don't bypass security
- **Lightning**: Test with real wallets, handle failures gracefully

## Project-Specific Notes
- This is a Bitcoin subscription platform, not a general web app
- Lightning network integration is core functionality
- User privacy and security are paramount
- Focus on practical subscription management features
- Maintain compatibility with multiple wallet types
- Follow the established color scheme and branding guidelines
