# Kravingo — Enterprise Admin Panel Architecture Document

This is the comprehensive, detailed architecture and technical specification for the Kravingo Enterprise Admin Panel (`apps/admin`), based strictly on the Master Prompt requirements.

---

## 1. Complete Admin Architecture

**Application Overview:**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Rendering Strategy:** Server-Side Rendering (SSR) for initial auth checks and layout; Client-Side Rendering (CSR) for interactive data grids and Redux state.
- **State Management:** Redux Toolkit for global UI state; RTK Query for data fetching, caching, and synchronization.
- **Styling & UI:** Tailwind CSS, Shadcn/UI (incorporating ThankU/Kravingo brand tokens), Lucide React (Icons).
- **Forms & Validation:** React Hook Form bound with Zod schemas for strict client-side validation before API submission.
- **Data Visualization:** Recharts for analytics; TanStack Table v8 for complex, filterable, and sortable data grids.
- **Authentication:** JWT (JSON Web Tokens) with short-lived access tokens in memory and rotating Refresh Tokens stored in secure HTTP-only cookies.

---

## 2. Folder Structure

The application will reside in `apps/admin` within the monorepo.

```text
apps/admin/
├── src/
│   ├── app/                            # Next.js 15 App Router
│   │   ├── (auth)/                     # Auth routes (Login, Forgot Password)
│   │   ├── (dashboard)/                # Protected Layout
│   │   │   ├── dashboard/page.tsx      # Main Analytics Dashboard
│   │   │   ├── users/page.tsx          # User Management Module
│   │   │   ├── vendors/page.tsx        # Vendor Management Module
│   │   │   ├── products/page.tsx       # Product Management Module
│   │   │   ├── orders/page.tsx         # Order Management Module
│   │   │   ├── payments/page.tsx       # Payment & Refunds
│   │   │   ├── content/page.tsx        # CMS & Pages
│   │   │   ├── coupons/page.tsx        # Discount Rules
│   │   │   ├── support/page.tsx        # Ticketing System
│   │   │   ├── settings/page.tsx       # Platform Settings
│   │   │   ├── roles/page.tsx          # RBAC Configuration
│   │   │   └── audit-logs/page.tsx     # Security Logs
│   │   ├── layout.tsx                  # Root Layout (Providers)
│   │   └── globals.css                 # Tailwind directives & Brand Tokens
│   │
│   ├── components/                     # Shared UI Components
│   │   ├── layout/                     # Sidebar, TopNav, Breadcrumbs, PageHeader
│   │   ├── ui/                         # Shadcn/UI generic components (Button, Input, Table)
│   │   ├── forms/                      # Reusable RHF Form fields with Zod integration
│   │   └── shared/                     # Domain-agnostic complex components (DataTable, StatCard)
│   │
│   ├── features/                       # Feature-sliced logic (Components specific to a domain)
│   │   ├── users/                      # User filters, User modal
│   │   ├── orders/                     # Order timeline component, Status badge
│   │   └── analytics/                  # Recharts wrappers
│   │
│   ├── store/                          # Redux Toolkit Configuration
│   │   ├── index.ts                    # Store configuration & persist setup
│   │   ├── slices/                     # authSlice.ts, uiSlice.ts (sidebar state)
│   │   └── api/                        # RTK Query implementations
│   │
│   ├── hooks/                          # Custom React Hooks
│   │   ├── usePermissions.ts           # Hook to check if current admin can perform an action
│   │   ├── useDebounce.ts              # For search inputs
│   │   └── useTableFilters.ts          # TanStack table sync with URL params
│   │
│   ├── types/                          # TypeScript Definitions
│   │   ├── api.d.ts                    # Backend response schemas
│   │   ├── models.d.ts                 # Domain models (User, Order, Vendor)
│   │   └── rbac.d.ts                   # Role and Permission enums
│   │
│   ├── utils/                          # Helper functions
│   │   ├── formatters.ts               # Currency, Date (date-fns)
│   │   └── cn.ts                       # Tailwind merge utility (clsx + tailwind-merge)
│   │
│   ├── constants/                      # Application Constants
│   │   ├── navigation.ts               # Sidebar link definitions mapping to permissions
│   │   └── enums.ts                    # OrderStatus, TicketStatus
│   │
│   ├── middleware.ts                   # Next.js Route Protection & JWT Validation
│   └── providers/                      # ReduxProvider, ThemeProvider, ToastProvider
```

---

## 3. Database Models (Backend Integration)

To support the Admin Panel, the underlying PostgreSQL database (accessed via Supabase/Prisma) will require the following foundational schema additions:

- **AdminProfile:** Links a UUID to an admin identity, storing full name, department, and phone number.
- **Roles & Permissions:** 
  - `Role` table (e.g., Super Admin, Finance Manager).
  - `Permission` table (e.g., `read:orders`, `update:settings`).
  - `RolePermission` join table.
  - `AdminRole` mapping admins to roles.
- **AuditLog:** 
  - `id` (UUID)
  - `admin_id` (FK to AdminProfile)
  - `action` (e.g., "DELETED_USER")
  - `module` (e.g., "USER_MANAGEMENT")
  - `target_id` (UUID of the modified resource)
  - `changes` (JSONB diff of previous and new state)
  - `ip_address` (String)
  - `created_at` (Timestamp)
- **Coupons:** `code`, `discount_type` (fixed/percentage), `discount_value`, `max_uses`, `current_uses`, `expires_at`.
- **SupportTickets:** `id`, `user_id`, `vendor_id` (nullable), `subject`, `description`, `status` (OPEN/PENDING/CLOSED), `priority`.

---

## 4. API Integration Layer (RTK Query)

The application will entirely avoid raw `axios` calls inside components, favoring RTK Query for caching, polling, and invalidation.

- **Base API Setup (`store/api/apiSlice.ts`)**:
  - Contains `baseQueryWithReauth`, an interceptor that detects 401 errors.
  - If 401 is detected, it automatically halts pending queries, requests `/api/v1/auth/refresh`, updates the token, and replays the failed queries.
- **Endpoint Injection**:
  - `userApi.ts`: `getUsers`, `getUserById`, `updateUserStatus`. (Tags: `['User']`)
  - `orderApi.ts`: `getOrders`, `updateOrderStatus`. (Tags: `['Order']`)
  - `vendorApi.ts`: `approveVendor`, `rejectVendor`. (Tags: `['Vendor']`)
- **Pagination & Filtering**:
  - All `GET` list endpoints will accept `page`, `limit`, `sortBy`, `sortOrder`, and `search` parameters to enable server-side filtering via TanStack Table.

---

## 5. Redux Setup

**Global State Slices:**
1. **`authSlice`**: Stores the decoded JWT payload (admin ID, name, email) and the active `permissions` array. Does *not* store the raw token (token is kept in HTTP-only cookies or short-lived memory).
2. **`uiSlice`**: Manages global UI states like Sidebar collapsed/expanded state, active Theme (Light/Dark), and global loading overlays.
3. **RTK Query Cache (`apiSlice`)**: Manages the massive state of all fetched data.

*(Note: Data like Users, Orders, and Products are NOT stored in custom Redux slices. They are managed automatically by RTK Query's cache to prevent stale data and boilerplate).*

---

## 6. Layout Components

- **Sidebar Navigation**:
  - Dynamically renders based on the `permissions` array in Redux. If a Support Agent lacks `read:settings`, the Settings tab is completely hidden.
  - Collapsible design for extra screen real estate.
- **Top Navigation**:
  - Global Command Palette (`Cmd+K` / `Ctrl+K`) to jump to specific modules, users, or orders.
  - Notification Bell (connected to a WebSocket or polling interval) for urgent alerts (e.g., New Vendor Registration).
  - Admin Profile dropdown (My Profile, Logout).
- **Breadcrumbs**: Automated component using `next/navigation` hooks to display exact nested paths (e.g., `Home > Users > Profile > Edit`).

---

## 7. Dashboard Screens & Modules

### Dashboard Module
- **Top Metrics**: 4-6 Shadcn Cards displaying Total Revenue, Active Vendors, Total Users, Open Tickets.
- **Charts**: Recharts `AreaChart` for Monthly Revenue Trend; `BarChart` for Vendor Signups.
- **Recent Activity Feed**: A miniature table of the 5 most recent orders and the 5 most recent audit logs.

### User Management
- **View**: TanStack Table with columns: Avatar, Name, Email, Status Badge (Active/Suspended/Banned), Registration Date.
- **Actions**: Context menu (three dots) to view full profile, suspend, or trigger a password reset email.
- **Profile Page**: Deep dive showing user's lifetime spending, recent orders, and associated support tickets.

### Vendor Management
- **Approval Workflow**: Dedicated tab for "Pending Verification". Admins can view uploaded KYC documents (via Supabase Storage securely signed URLs).
- **Vendor Analytics**: Graphs showing a specific vendor's performance and commission splits.

### Product Management
- **Grid**: Displays product thumbnails, SKU, Category, Price, Stock level.
- **Bulk Actions**: Select multiple products to instantly archive them or apply a bulk category change.

### Order Management
- **Timeline**: A visual stepper inside the order detail page showing the journey from Pending -> Processing -> Shipped -> Delivered.
- **Actions**: Ability to refund an order (interacts with Payment API) or re-assign to a different vendor if the current one fails to fulfill.

---

## 8. Role Management & Security (RBAC)

**Roles Matrix Implementation:**
1. **Super Admin**: Full access to all modules.
2. **Admin**: Cannot alter Super Admins or modify core platform structural settings.
3. **Operations Manager**: Full access to Orders, Vendors, Products. No access to Finance/Settings.
4. **Finance Manager**: Full access to Payments, Refunds, Revenue Analytics.
5. **Support Agent**: Read-only access to Users, full access to Support Tickets.
6. **Content Manager**: Full access to CMS, Banners, FAQs.
7. **Vendor Manager**: Full access to Vendor approvals and onboarding.

**Implementation (`usePermissions` hook):**
```typescript
const { hasPermission } = usePermissions();
if (!hasPermission('delete:user')) {
  return null; // The Delete button is stripped from the DOM entirely
}
```

---

## 9. Security Layer

- **JWT Authentication**: Utilizes asymmetric signing (RS256).
- **Middleware Guard**: Next.js `middleware.ts` intercepts every request to `/admin/*`. It verifies the JWT validity edge-side before rendering any HTML, immediately redirecting to `/admin/login` if unauthenticated.
- **CSRF & XSS**: Forms use React Hook Form + Zod preventing SQL injection payloads. Next.js handles HTML escaping natively (XSS prevention).
- **Rate Limiting**: Configured upstream at the Nginx/API Gateway level, supplemented by Upstash Redis if using Next.js Server Actions.
- **MFA Support**: Integrated. On login, if the admin has MFA enabled, they are redirected to a `/verify-mfa` screen before the session token is fully granted.

---

## 10. Deployment Configuration

- **Hosting Environment**: Vercel.
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Build Optimization**: Vercel takes advantage of Next.js Image Optimization and static route caching for non-dynamic CMS pages.

---

## 11. CI/CD Setup (GitHub Actions)

**Pipeline 1: PR Validation (`.github/workflows/validate.yml`)**
- Trigger: On Pull Request to `main`.
- Actions: 
  - Install dependencies (`npm ci`).
  - Run ESLint (`npm run lint`).
  - Run strict TypeScript compiler (`tsc --noEmit`).
  - Run Unit Tests (Jest).

**Pipeline 2: Production Deployment (`.github/workflows/deploy.yml`)**
- Trigger: On Push to `main`.
- Actions:
  - Deploys automatically via Vercel GitHub integration.
  - Notifies Slack channel upon successful build.
  - Uploads sourcemaps to Sentry for production error tracking.

---

## 12. Production Readiness Checklist

- [ ] **Accessibility**: All Shadcn components must pass WCAG AA standards (keyboard navigability, ARIA tags).
- [ ] **Error Boundaries**: Wrap entire modules in React Error Boundaries to prevent a crash in a single widget from taking down the whole dashboard.
- [ ] **Empty States**: Beautiful illustrations/messages for when a table returns 0 results.
- [ ] **Loading Skeletons**: Ensure no "flash of empty content". Skeletons must exactly match the height of the expected content to prevent Layout Shift.
- [ ] **Audit Logging**: Confirm that the RTK Query endpoints for mutating data (POST, PUT, DELETE) trigger backend mechanisms to write to the `AuditLog` table.
- [ ] **Performance**: Ensure heavy Recharts components are lazily loaded (`next/dynamic`) to keep the initial JS bundle small.
- [ ] **Dark Mode**: Verify that all charts and tables invert colors perfectly via the existing ThankU CSS custom properties (`var(--color-surface)`, etc.).
