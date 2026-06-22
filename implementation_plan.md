# Kravingo Enterprise Admin Panel — Architecture & Implementation Plan

After reviewing the specific `kravingo` repository, I have adapted the master prompt requirements to perfectly match your existing stack (Next.js 16.1, React 19.2, MongoDB, Next-Auth, Redux Toolkit, Tailwind v4) and the beautiful "Heritage Warmth" design system.

---

## 1. Application Architecture & Monorepo Strategy

Currently, the `kravingo` repository is a standard single Next.js application. Your prompt requests the creation of a dedicated `apps/admin` application.

**Architecture Strategy:**
We will convert the repository into an NPM Workspace / Monorepo. 
- The existing Next.js app will be moved to `apps/web` (or we can leave it at root and place the admin panel in `apps/admin`, but a proper monorepo is cleaner).
- The new admin panel will be scaffolded at `apps/admin`.
- Both apps will share the same database (MongoDB via Mongoose) and authentication states.

**Tech Stack for `apps/admin`:**
- **Framework**: Next.js 16.1.6 (App Router)
- **State**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Database**: MongoDB (Mongoose)
- **Auth**: Next-Auth (v5 beta) to share sessions with the main app
- **Storage**: Supabase Storage / Cloudinary (as used in existing app)
- **Forms & Data**: React Hook Form, Zod, Recharts, TanStack Table v8

---

## 2. Brand & Theme Parity

The admin panel will strictly adhere to the **"Heritage Warmth"** design system defined in `kravingo-visual-theme-system.md`:
- **Colors**: Terracotta Red (`#C84B4B`), Turmeric Gold, Curry Leaf Green, Tamarind Brown.
- **Backgrounds**: Warm White (`#FFFBF7`) for the app background, Pearl Cream for cards.
- **Typography**: `Cormorant Garamond` for dashboard headings and `Inter` for data tables and UI elements.

---

## 3. Folder Structure (`apps/admin`)

```text
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx               # Analytics Dashboard
│   │   │   ├── users/page.tsx         # User Management
│   │   │   ├── vendors/page.tsx       # Vendor Management
│   │   │   ├── products/page.tsx      # Product Management
│   │   │   ├── orders/page.tsx        # Order Management
│   │   │   ├── content/page.tsx       # CMS / Hero Banners
│   │   │   └── settings/page.tsx      # Platform Configuration
│   │   ├── layout.tsx
│   │   └── globals.css                # Heritage Warmth Tailwind tokens
│   ├── components/
│   │   ├── layout/                    # Sidebar, Topbar, Breadcrumbs
│   │   └── ui/                        # Shadcn components
│   ├── store/
│   │   ├── index.ts
│   │   └── api/                       # RTK Query (userApi, orderApi)
│   ├── lib/                           # Mongoose connection, auth configs
│   └── middleware.ts                  # Next-Auth RBAC protection
```

---

## 4. Database Models (MongoDB Additions)

We will extend your existing Mongoose schemas to support Admin features:
- **`User` Schema**: Add `roles` array (e.g., `['SUPER_ADMIN', 'VENDOR_MANAGER']`).
- **`Vendor` Schema**: Store KYC docs, commission rates, approval status (`PENDING`, `APPROVED`, `REJECTED`).
- **`Order` Schema**: Add timeline arrays, refund details, and vendor payout status.
- **`AuditLog` Schema**: Track every mutation (`adminId`, `action`, `resource`, `timestamp`, `ipAddress`).
- **`Coupon` Schema**: `code`, `discountType`, `value`, `expiryDate`, `maxUses`.

---

## 5. Security & Role-Based Access Control (RBAC)

1. **Next-Auth v5**: We will configure Next-Auth in `apps/admin` to connect to the exact same MongoDB database. 
2. **Middleware Guard**: `middleware.ts` will verify the JWT session. If the user lacks an `ADMIN` role, they are redirected to a 403 Forbidden page.
3. **UI Granular Permissions**: A custom `usePermissions()` hook will dynamically hide sidebar links and action buttons based on the specific admin's role (e.g., Finance Manager vs Support Agent).

---

## 6. UI/UX Deliverables

- **Sidebar Navigation**: Collapsible, themed with Tamarind Brown accents.
- **Data Tables**: Built with TanStack Table featuring server-side pagination, global text search, column sorting, and bulk actions.
- **Analytics Dashboard**: Recharts graphs showing Monthly Revenue, Order Volume, and Vendor Registrations.
- **Forms**: Complex multi-step forms (e.g., adding a Product with variants and image uploads) fully validated by Zod before submission.

---

## Open Questions for You

> [!WARNING]
> **Monorepo Conversion**
> The Kravingo codebase is currently a single Next.js project, but your prompt asks for `apps/admin`. 
> 
> **Option A**: We fully convert the repository into an NPM Workspace (moving the current app to `apps/web` and creating `apps/admin`). This is cleaner but disrupts the current folder structure.
> **Option B**: We just scaffold the admin dashboard inside the existing Next.js app under `src/app/(admin)`. This shares all the database models, UI components, and authentication seamlessly without needing a complex monorepo setup.
> 
> **Which option do you prefer?**

> [!IMPORTANT]
> **Database & Backend**
> Since this is a MongoDB/Next.js app, the "Backend APIs" are Next.js Route Handlers (`src/app/api`). Are you comfortable with me building out these secure REST APIs inside the admin app to power the RTK Query data tables?

Please let me know your thoughts on the Monorepo vs Embedded Admin question, and I will begin scaffolding!
