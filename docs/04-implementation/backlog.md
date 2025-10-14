# TODO - Project Task List v1.0

A human-readable list of tasks and improvements for the SubscriptN - Bitcoin Subscription Management platform.

## 🎯 Future Enhancements

### Backend & Data Integrity
- **BTCPay Store ID persistence**: Add `btcpayStoreId` field to Shop model in database
  - Update `src/app/api/stores/[serverId]/route.ts` to match on store ID instead of names
  - Ensures accurate "hasActiveSubscription" detection
- **API consistency**: Standardize naming convention across backend and frontend
  - Convert all `server-prisma.ts` responses to use snake_case
  - Update pages like `src/app/infrastructure/page.tsx` to match API format
  - Remove camelCase/snake_case mixing throughout the codebase

### Security & Authentication
- **Password handling fix**: Remove `sanitizeString` calls before password hashing
  - Fix `src/app/api/auth/login/route.ts` to preserve password characters
  - Fix `src/app/api/auth/register/route.ts` to preserve password characters
  - Currently strips `<`/`>` characters and trims, which mangles credentials
- **Auth module consolidation**: Remove legacy `src/lib/auth.ts` file
  - Point all imports to `auth-prisma.ts` for single source of truth
  - Resolve type mismatches in client context caused by mixed imports

### UI Design System
- **Professional color palette refresh**: Update `tailwind.config.js` with refined colors
  - Primary: Deep navy `#14213D`
  - Accent: Bitcoin orange `#F7931A`
  - Support: Professional teal `#2A9D8F`
  - Neutrals: Light gray `#F4F6F8` and dark gray `#1F2933`
  - Remove current neon gradients for calmer light/dark themes
- **Button styling normalization**: Consistent button design across all pages
  - Apply new palette with flat fills and subdued shadows
  - Standardize sizing and spacing (remove hover scale/gradient jumps)
  - Update `src/app/page.tsx`, `src/components/TopBar.tsx`, and auth forms
- **Icon system upgrade**: Replace emoji icons with professional icon set
  - Replace emoji tab icons in `src/app/settings/page.tsx` with Heroicons
  - Tighten spacing for more professional appearance
  - Remove playful emoji bullets from marketing sections

### Page-Level Improvements
- **Homepage marketing refresh**: Rework `src/app/page.tsx` layout
  - Rely on stronger typography and whitespace
  - Use real product imagery instead of stacked emoji cards
  - Reduce accent colors per section for cleaner look
- **Card component standardization**: Update infrastructure and dashboard cards
  - Create single unified card component
  - Implement quieter hover states with solid borders
  - Align iconography across `src/app/infrastructure/page.tsx` and `src/app/dashboard/page.tsx`
- **Secondary pages audit**: Polish auth and management pages
  - Remove green/blue gradients from `src/app/login/page.tsx` and `src/app/register/page.tsx`
  - Switch CTA buttons to new primary color
  - Add heading/subheading pairs matching home hero style
  - Update `src/app/nwc-management/page.tsx` for consistency

### Contact & Communication
- **Contact functionality**: Implement "Contact Admin" and "Contact Shop" buttons
  - Add contact modal or email integration
  - Store contact preferences in user profiles
  - Enable messaging between shop owners and server providers

## ✅ Recently Completed - Version 1.0 (September 2025)

### Major UI Improvements
- **✅ Interactive button effects**: Added magnetic pull, glow, icon rotation, shadow pulse, and color wave effects
  - All buttons now have hover animations for engaging user experience
  - Smooth transitions using CSS transforms for optimal performance
- **✅ Typography refresh**: Replaced Geist fonts with Manrope + Roboto Mono
  - Warmer, community-friendly font combination
  - Professional sans-serif paired with clean monospace for technical content
- **✅ Avatar system**: Implemented themed icons for servers and shops
  - Automatic 2-letter initials from names
  - Soft slate-based gradients with emerald (servers) and orange (shops) accents
  - Squared corners with slight rounding for modern look
  - Support for future image uploads
- **✅ Shop descriptions**: Added description field to shop listings
  - Updated Prisma schema with description field
  - Modified all shop functions to include descriptions
  - Display descriptions at end of shop cards matching server format
- **✅ Server listing enhancements**: Added owner and lightning address information
  - Server cards now show owner username
  - Display creation date and lightning address
  - Consistent information display matching shop listings
- **✅ Login button gradient**: Fixed gradient to end with dark blue `#101828`
  - Replaced black ending with proper dark blue matching login page background
  - Maintains blue finish on hover state
- **✅ Button redesign**: Replaced text links with styled action buttons
  - "More Details" buttons with themed gradients
  - "Contact Admin" and "Contact Shop" buttons added
  - "Manage Server" and "Manage Shop" buttons for user's own items
  - Consistent sizing and professional appearance across all listings

### Technical Infrastructure
- **✅ Google OAuth integration**: Added NextAuth.js with Google provider
  - Complete OAuth flow implementation
  - Prisma schema updates for Account, Session, and VerificationToken models
  - Optional configuration based on environment variables
  - Comprehensive setup documentation in `GOOGLE_OAUTH_SETUP.md`
- **✅ Database schema improvements**: Enhanced Shop and Server models
  - Added description field to shops
  - Added owner_username to shop interfaces
  - Improved query efficiency with proper relations
- **✅ Color palette system**: Established professional color scheme
  - Custom Tailwind colors for BTCPay servers (green tones)
  - Custom colors for shops (orange tones)  
  - Login-specific blue colors (`#101828`)
  - Consistent gradient system across all buttons

### Code Quality & Organization
- **✅ Commit message standards**: Enforced conventional commits format
  - Using `feat:`, `fix:`, `chore:` prefixes
  - Maximum 140 characters per commit message
  - Single sentence descriptions for clarity
- **✅ Component architecture**: Created reusable Avatar component
  - Type-safe props with TypeScript
  - Flexible sizing (sm, md, lg)
  - Theme-aware with server/shop type distinction

## 📝 Development Notes

### Design Principles
- **Simplicity first**: Keep interfaces clean and intuitive
- **Professional aesthetics**: Avoid playful elements in favor of trust and credibility
- **Consistency**: Maintain uniform styling across all pages and components
- **Performance**: Use CSS transforms for animations, avoid heavy JavaScript
- **Accessibility**: Ensure all interactive elements are keyboard accessible

### Technical Standards
- **TypeScript everywhere**: No JavaScript files in source code
- **Prisma best practices**: Use proper relations and snake_case for database fields
- **Tailwind conventions**: Utilize custom colors from config, avoid arbitrary values
- **Component reusability**: Extract common patterns into shared components
- **Git workflow**: Feature branches, conventional commits, thorough PR reviews

**Current Status**: Project is feature-complete for initial marketplace launch. Focus on polish, performance, and user feedback before v2.0 planning.
