# 🚀 GLC-UI | Production-Grade React Architecture

A scalable, feature-based React application built with TypeScript, Redux Toolkit, and RTK Query. Designed for high performance, maintainability, and clean separation of concerns.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Primitives**: [shadcn/ui](https://ui.shadcn.com/)
- **Utilities**: `async-mutex`, `lucide-react`, `clsx`

---

## 🏗️ Architecture Principles

This project follows a **Feature-Based Modular Architecture**. The code is organized by business domain rather than technical type, ensuring the codebase remains navigable as it scales.

### Core Patterns:
1. **Unidirectional Data Flow**: State is managed centrally in Redux.
2. **Persistence-Agnostic Componentry**: UI components consume state/API logic via hooks and remain unaware of the underlying implementation.
3. **Atomic API Handling**: Centralized base API with automatic token refresh logic.
4. **Recursive Routing**: Dynamic route configuration with automatic `Suspense` injection.

---

## 📁 Project Structure

```text
src/
├── app/                # Global Application Setup
│   ├── store/          # Redux Store & Root Reducer
│   ├── router/         # Routing Config & Access Guards (AuthGuard, GuestGuard)
│   └── index.ts
│
├── core/               # System-Level Logic (Shared)
│   ├── api/            # RTK Query Base API & Reauth Logic
│   ├── config/         # Environment variables & Global Constants
│   ├── hooks/          # Global Typed Hooks (useAppDispatch, etc.)
│   └── index.ts
│
├── features/           # Business Logic Modules (Self-contained)
│   ├── auth/           # Authentication Module (Login, Logic, Slices)
│   ├── dashboard/      # Dashboard Domain
│   └── ...             # Feature directories (pages, store, api, components)
│
├── components/         # Global UI Components
│   ├── ui/             # shadcn/ui primitives
│   ├── common/         # Cross-feature business components
│   └── index.ts
│
├── assets/             # Global Assets (Images, Icons, Fonts)
├── types/              # Global TypeScript Definitions
├── utils/              # Helper functions
└── main.tsx            # Entry Point
```

---

## 🔐 Auth & API Layer

### Redux-First Auth
Authentication state is managed strictly via the `auth` slice. Access tokens and refresh tokens are stored in `localStorage` but interfaced through Redux actions for reactivity.

### Automatic Token Refresh
The API layer uses a custom `baseQueryWithReauth` implementation:
- **Automatic Headers**: Injects `Bearer` tokens into every request.
- **401 Handling**: If a request fails with 401, it automatically attempts a token refresh via the `/auth/refresh` endpoint.
- **Mutex Sync**: Uses `async-mutex` to ensure that if multiple requests fail at once, only one refresh call is made.

---

## 🛣️ Routing System

Routes are split into three categories in `routes.config.tsx`:
1. **Guest Routes**: Only accessible when logged out (e.g., Login).
2. **Auth Routes**: Accessible only to authenticated users (e.g., Dashboard).
3. **Public Routes**: Accessible to everyone (e.g., Design System).

**Features:**
- **Lazy Loading**: Every route is lazy-loaded by default.
- **Access Guards**: Wrapped in `AuthGuard` or `GuestGuard` to handle redirection.
- **Recursive Suspense**: `AppRouter` recursively wraps all nested routes in a `Suspense` boundary with a global `PageLoader`.

---

## 🎭 Role-Based Dynamic Layout System

### Overview
The app renders a **different shell layout** based on the logged-in user's role. Pages know nothing about which layout they are inside — they only render content. The layout is fully automatic.

### Supported Roles & Layouts

| Role | Layout Type | Style | Primary Color |
|---|---|---|---|
| `ROLE_MANAGER` | Left Sidebar + Header | Style A (Navy Blue) | `#0F2942` |
| `FIELD_OFFICER` | Header Navigation Only | No sidebar | `#2780C4` |
| `CCS_OFFICER` | Left Sidebar + Header | Style B (Dark Purple) | `#7C3AED` |

### Architecture (4 Layers)

```
layoutConfig.ts          → Role key → { layoutVariant, navItems, roleLabel }
      ↓
useRoleLayout.ts         → Reads state.auth.user.role from Redux → returns config
      ↓
RootLayout.tsx           → LAYOUT_MAP[layoutVariant] → renders correct shell
      ↓
routes.config.tsx        → authRoutes wrapped with <RootLayout> as parent
```

### Key Files

```text
src/
├── core/
│   ├── config/
│   │   └── layoutConfig.ts         ← Master role → layout map (update role strings here)
│   └── hooks/
│       └── useRoleLayout.ts        ← Hook: role from Redux → layout config
│
└── components/
    └── common/
        └── layouts/
            ├── RootLayout.tsx      ← Switcher: picks shell by layoutVariant
            ├── RoleManagerLayout.tsx   ← Sidebar Style A (Navy)
            ├── CcsOfficerLayout.tsx    ← Sidebar Style B (Purple)
            └── FieldOfficerLayout.tsx  ← Header-only nav
```

### Adding a New Role
1. Add an entry in `src/core/config/layoutConfig.ts`:
   ```ts
   NEW_ROLE: {
     layoutVariant: 'sidebar-role-manager', // reuse or add a new variant
     roleLabel: 'New Role Name',
     navItems: [...],
   },
   ```
2. If a new layout style is needed, create a new layout component and register it in `RootLayout.tsx`:
   ```ts
   'sidebar-new-role': NewRoleLayout,
   ```
3. **Nothing else changes** — routes, guards, Redux are untouched.

### Mock Login Credentials (Development Only)
> These credentials are hardcoded in `src/core/config/layoutConfig.ts → MOCK_USERS`. Remove when real API is integrated.

| Role | Email | Password |
|---|---|---|
| Role Manager | `manager@glc.com` | `manager@123` |
| Field Officer | `officer@glc.com` | `officer@123` |
| CCS Officer | `ccs@glc.com` | `ccs@123` |

---

## 📝 Coding Standards

- **Naming**:
  - `Components.tsx` (PascalCase)
  - `logicFiles.ts` (camelCase)
  - `feature-folders` (kebab-case)
- **Exports**: Use **Barrel Exports** (`index.ts`) in every directory to keep imports clean.
- **Environment**: Always use the typed `env` object from `core/config/env.ts` instead of `import.meta.env` directly.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root based on `.env.example`:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

### Development
```bash
npm run dev
```
# GLC-Super-Admin
