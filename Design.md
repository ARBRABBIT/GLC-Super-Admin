# Green Land Capital — Design System

Source audit: **27 October 2026**. Scope: the supplied `glc-super-admin-dev` workspace. This document describes the current implementation; it does not change UI, dependencies, routes, APIs, or business logic.

## Table of contents

1. [Design System Overview](#1-design-system-overview)
2. [Application Architecture](#2-application-architecture)
3. [Design Tokens](#3-design-tokens)
4. [Color System](#4-color-system)
5. [Typography System](#5-typography-system)
6. [Layout System](#6-layout-system)
7. [Component Library](#7-component-library)
8. [Navigation Patterns](#8-navigation-patterns)
9. [Forms & Validation](#9-forms--validation)
10. [Icons & Assets](#10-icons--assets)
11. [Motion & Interaction](#11-motion--interaction)
12. [Responsive Guidelines](#12-responsive-guidelines)
13. [Accessibility Guidelines](#13-accessibility-guidelines)
14. [Page & Screen Patterns](#14-page--screen-patterns)
15. [Design Consistency Audit](#15-design-consistency-audit)
16. [Implementation Guidelines](#16-implementation-guidelines)
17. [New Screen Creation Guidelines](#17-new-screen-creation-guidelines)
18. [Reference Appendix](#18-reference-appendix)
19. [AI Development Rules — Mandatory for All New Screens](#19-ai-development-rules--mandatory-for-all-new-screens)
20. [Verification & Readiness](#20-verification--readiness)

## 1. Design System Overview

### Evidence classifications

- **Existing:** a declaration, render branch, prop, or behavior verified in source. A class existing in JSX does not prove its stylesheet was generated.
- **Inferred:** interpretation of a pattern or framework default, explicitly identified as such.
- **Recommended:** an improvement requiring a future implementation task; not current behavior.
- **Unverified:** computed browser appearance, backend-dependent state, or behavior that cannot be established here.

**Existing visual identity:** a light administrative interface with white rounded panels, pale gray page backgrounds, charcoal navigation, blue actions, and olive/lime verification accents. Photographic farmland imagery, circular avatars, pill actions, compact metadata, and spacious rounded workbenches recur. Maintenance uses its own brighter blues and slate neutrals. These are observable conventions, not a formally enforced theme.

**Inferred principles:** prioritize land identity and workflow status, group related details into panels, retain clear next/back/approval actions, and keep large data sets inside scroll containers. These principles summarize code composition; they are not a historical brand brief.

### How to use this document

Choose the relevant UI family first: super-admin lists/dashboard, document upload/verification, maintenance, or authentication. Read its screen pattern and the component specification before implementing. Sections 3–13 give foundations and shared behavior. Section 14 maps screen composition. Appendix 18 contains the full route ledger and per-file design evidence, including alternatives outside the active import graph. Preserve local exceptions until a separate standardization change is authorized.

Source paths and line numbers refer to this audit snapshot. The per-file utility catalog records **declared classes** and their original spelling; arbitrary values such as `h-[48px]`, `gap-5`, `md:grid-cols-2`, and `bg-[var(--surface-card)]` are implementation-ready source specifications. They are not new token names.

## 2. Application Architecture

### Stack and organization

| Layer | Existing implementation | Evidence |
| --- | --- | --- |
| Build/runtime | Vite `^8.0.9`, React/React DOM `^19.2.5`, TypeScript `~6.0.2` | `package.json`, `vite.config.ts` |
| Routing | React Router DOM `^7.14.2`, `createBrowserRouter`, lazy modules, nested `Outlet` | `src/app/router/` |
| State/data | Redux Toolkit `^2.11.2`, React Redux `^9.2.0`, RTK Query API modules | `src/app/store/`, `src/features/*/api/` |
| Styling | Tailwind CSS `^4.2.4` via `@tailwindcss/postcss`; large global CSS; utility strings; inline styles | `postcss.config.js`, `src/index.css` |
| Primitive composition | Custom `forwardRef` components, CVA for Typography/BackButton, `cn` using clsx + tailwind-merge | `src/components/ui/`, `src/lib/utils.ts` |
| Icons | Lucide React `^1.8.0`, local SVGs, hand-authored inline SVGs | `package.json`, asset and component files |
| Charts/maps | Recharts `^3.8.1`, MapLibre GL `^5.24.0`, SVG polygon editor in pool creation | chart components, upload map pages, pool creation |
| Notifications | Sonner `^2.0.7`, Firebase notification handler | `src/App.tsx`, `src/core/firebase/NotificationHandler.tsx` |
| Installed-in-manifest only | Framer Motion, tw-animate-css, Radix UI, React Day Picker, React Hook Form, Zod, shadcn tooling | Do not assume a shared component exists because its package is listed |

Versions above are **manifest ranges**, not resolved installed versions. This workspace has no `node_modules` or lockfile. It is not a Git checkout. No dependency installation was performed.

### Entry and layout flow

`src/main.tsx` imports global CSS and four font weight files, then renders `App` in StrictMode. `App` provides the Redux store, Firebase handler, router, and `<Toaster richColors position="top-right" />`.

`AppRouter` wraps each route element in Suspense and applies `RouteErrorBoundary`. Guest, authenticated, and public preview routes are separate. Unknown paths redirect to `/`. `/` redirects by role: maintenance dashboard for `MAINTENANCE`, otherwise `/super-admin/farmlands`.

`RootLayout` renders `SuperAdminLayout`: a viewport-height flex shell with overflow hidden and an independently scrolling `<main>`. The sidebar is suppressed for pathname substrings `/Documents/`, `/customer-information`, `/legal-documents`, `/agriculture-report`, `/land-boundaries`, `/valuation`, `/local-intelligence`, and `/profile`. Verification has a separate root outside `RootLayout`; maintenance pages each compose their own navbar. Do not add the super-admin rail to maintenance pages.

### Coverage and screen counting

- **140 `.tsx` modules** were inventoried, including routing, notification infrastructure, entry points, page modules and components; **1 application stylesheet** was audited.
- **54 files under `pages/`**: 46 distinct routed screen modules; 1 imported confirmation-modal module; 7 page modules outside the entry-point import graph.
- **75 files under `components/`**: file count, not a count of exported symbols. Multi-export modules contain additional components. Their named export evidence appears in Appendix 18.
- **89 explicit `path` entries** in `routes.definitions.tsx`, including aliases, `/` redirect, and 2 document-flow parent roots. The pathless `RootLayout` and wildcard in `AppRouter` are additional routing infrastructure.
- **123 TSX modules** are statically reachable from `src/main.tsx` through local imports. Reachability is static import reachability, not a claim that every component is visibly rendered in every feature mode.

All page files, component files, and application TSX infrastructure are included in the appendix. The route ledger includes aliases rather than counting each alias as a new visual screen.

### Directory map

- `src/components/ui/`: Button, Input, Typography, Card family, BackButton.
- `src/components/common/`: S3Image, route error surface, authenticated layouts.
- `src/features/super-admin/components/`: header, rail, notifications, follow-up modal.
- `src/features/super-admin/sub-features/dashboard/`: dashboards, land lists/detail/tag editor, charts and row/card patterns.
- `.../users/`: login states, profiles, user directories.
- `.../pool/`: pool cards/list/create/map/details/investor/publish screens.
- `.../upload-docs/`: land setup, map drawing, owner/family editing, six-step upload workflow.
- `.../farmLandDocsverification/`: current six-step read/review/approve/reject workflow.
- `.../legal-docs/`: older standalone verification flows; outside active entry import graph.
- `.../maintenance/`: dashboard, requests, quotation, customer response, work orders, profile, dialogs.
- `src/index.css`: root tokens, base styles, scrollbar rules and a substantial collection of legacy CSS screen styles.
- `src/assets/`, `public/`: bundled and public imagery/SVGs.

## 3. Design Tokens

### Naming and resolution

**Existing:** root CSS custom properties use kebab-case role prefixes (`--brand-*`, `--surface-*`, `--text-*`, `--status-*`, `--btn-*`). There is no complete exported TypeScript token object, spacing token system, semantic motion scale, or z-index token registry. `--text-muted-strong` is black at **0.4 alpha**, lighter than `--text-muted` at **0.6 alpha** despite its name.

`tailwind.config.js` maps some colors to the CSS variables and adds `4xl: 32px`. However, `src/index.css` imports Tailwind v4 without an `@config` directive and has no custom `@theme` mapping. Tailwind v4 requires explicit loading of legacy JavaScript configuration; see the [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file). **Existing:** the integration directive is absent. **Inferred issue:** the JavaScript color aliases are not loaded. Prefer the already-used explicit `bg-[var(--surface-card)]` / `text-[var(--text-primary)]` syntax when reproducing current tokens; do not assume `bg-surface-card` exists.

`border-primary`, `text-muted-foreground` in the Suspense loader and `text-foreground` in Card have no corresponding project theme definition. `--border-strong` is referenced by the farmland action button but is not declared. `--radius-lg` is not locally declared, but is a Tailwind default theme radius; do not classify it as an unequivocally missing token.

### Complete project custom-property register

Every declaration below is transcribed from `src/index.css:4–216`, preserving aliases, alpha values, gradient stops, and exact numeric values. A declaration can be unused; the usage column distinguishes declarations from actual consumers. “Declaration only” means no `var(...)` consumer outside the defining root block was found; it is not an instruction to introduce it on a new screen.

| Token | Exact value | Definition | Usage examples |
| --- | --- | --- | --- |
| `--font-sans` | `"Plus Jakarta Sans"` | [src/index.css:7](src/index.css#L7) | `src/components/common/RouteErrorBoundary.tsx:25`; `src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:60` |
| `--font-heading` | `"Manrope"` | [src/index.css:8](src/index.css#L8) | `src/components/common/RouteErrorBoundary.tsx:38`; `src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:56` |
| `--font-inter` | `'Inter', sans-serif` | [src/index.css:9](src/index.css#L9) | `src/components/ui/BackButton.tsx:6`; `src/components/ui/button.tsx:58` |
| `--brand-50` | `#EAF3FA` | [src/index.css:12](src/index.css#L12) | Declaration only / root alias |
| `--brand-100` | `#D4E6F3` | [src/index.css:13](src/index.css#L13) | Declaration only / root alias |
| `--brand-200` | `#AED6EF` | [src/index.css:14](src/index.css#L14) | Declaration only / root alias |
| `--brand-300` | `#7DB4D8` | [src/index.css:15](src/index.css#L15) | Declaration only / root alias |
| `--brand-400` | `#3D93D1` | [src/index.css:16](src/index.css#L16) | `src/components/ui/button.tsx:139` |
| `--brand-500` | `#2780C4` | [src/index.css:17](src/index.css#L17) | `src/components/ui/BackButton.tsx:22`; `src/components/ui/button.tsx:44` |
| `--brand-600` | `#1F66A3` | [src/index.css:18](src/index.css#L18) | Declaration only / root alias |
| `--brand-700` | `#174D7B` | [src/index.css:19](src/index.css#L19) | Declaration only / root alias |
| `--brand-800` | `#103354` | [src/index.css:20](src/index.css#L20) | Declaration only / root alias |
| `--brand-900` | `#081A24` | [src/index.css:21](src/index.css#L21) | Declaration only / root alias |
| `--brand-tint` | `rgba(39, 128, 196, 0.08)` | [src/index.css:22](src/index.css#L22) | `src/components/ui/BackButton.tsx:27` |
| `--brand-tint-strong` | `rgba(39, 128, 196, 0.4)` | [src/index.css:23](src/index.css#L23) | Declaration only / root alias |
| `--brand-bar` | `rgba(39, 128, 196, 0.12)` | [src/index.css:24](src/index.css#L24) | Declaration only / root alias |
| `--surface-page` | `#F2F2F2` | [src/index.css:27](src/index.css#L27) | `src/components/common/RouteErrorBoundary.tsx:25`; `src/components/common/layouts/SuperAdminLayout.tsx:31`; `src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx:143`; +1 other modules |
| `--surface-card` | `#FFFFFF` | [src/index.css:28](src/index.css#L28) | `src/components/common/RouteErrorBoundary.tsx:26`; `src/components/ui/BackButton.tsx:12`; `src/components/ui/button.tsx:49`; +10 other modules |
| `--surface-sidebar` | `#191B1C` | [src/index.css:29](src/index.css#L29) | `src/components/ui/BackButton.tsx:17` |
| `--surface-sidebar-accent` | `#5C5C5C` | [src/index.css:30](src/index.css#L30) | Declaration only / root alias |
| `--surface-sidebar-text` | `#FFFFFF` | [src/index.css:31](src/index.css#L31) | `src/components/ui/BackButton.tsx:18` |
| `--text-primary` | `#191B1C` | [src/index.css:34](src/index.css#L34) | `src/components/common/RouteErrorBoundary.tsx:71`; `src/components/ui/button.tsx:64`; `src/components/ui/input.tsx:59`; +28 other modules |
| `--text-secondary` | `#626C70` | [src/index.css:35](src/index.css#L35) | `src/components/common/RouteErrorBoundary.tsx:43`; `src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:60` |
| `--text-subtle` | `#5A5C5E` | [src/index.css:36](src/index.css#L36) | Declaration only / root alias |
| `--text-heading` | `#091426` | [src/index.css:37](src/index.css#L37) | `src/components/common/RouteErrorBoundary.tsx:38`; `src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:56` |
| `--text-muted` | `rgba(0, 0, 0, 0.6)` | [src/index.css:38](src/index.css#L38) | `src/components/ui/input.tsx:87`; `src/features/super-admin/components/SuperAdminHeader.tsx:200`; `src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx:28`; +16 other modules |
| `--text-muted-strong` | `rgba(0, 0, 0, 0.4)` | [src/index.css:39](src/index.css#L39) | `src/features/super-admin/components/SuperAdminHeader.tsx:138` |
| `--text-label-gray` | `#8A96A3` | [src/index.css:40](src/index.css#L40) | Declaration only / root alias |
| `--text-supporting` | `#626c70` | [src/index.css:41](src/index.css#L41) | Declaration only / root alias |
| `--profile-text` | `#191b1c` | [src/index.css:42](src/index.css#L42) | `src/components/ui/input.tsx:58` |
| `--text-button` | `#353535` | [src/index.css:43](src/index.css#L43) | `src/components/ui/BackButton.tsx:13` |
| `--text-strong` | `#000000` | [src/index.css:44](src/index.css#L44) | `src/features/super-admin/components/SuperAdminHeader.tsx:189` |
| `--status-pending` | `var(--brand-500)` | [src/index.css:46](src/index.css#L46) | Declaration only / root alias |
| `--status-success` | `#16A34A` | [src/index.css:47](src/index.css#L47) | Declaration only / root alias |
| `--status-success-soft` | `rgba(22, 163, 74, 0.08)` | [src/index.css:48](src/index.css#L48) | Declaration only / root alias |
| `--status-warning` | `#F59E0B` | [src/index.css:49](src/index.css#L49) | Declaration only / root alias |
| `--status-warning-soft` | `rgba(245, 158, 11, 0.08)` | [src/index.css:50](src/index.css#L50) | Declaration only / root alias |
| `--status-danger` | `#DC2626` | [src/index.css:51](src/index.css#L51) | `src/features/super-admin/components/SuperAdminHeader.tsx:168` |
| `--status-danger-soft` | `rgba(220, 38, 38, 0.08)` | [src/index.css:52](src/index.css#L52) | Declaration only / root alias |
| `--status-pending-bg` | `#f3f3f5` | [src/index.css:53](src/index.css#L53) | Declaration only / root alias |
| `--border` | `rgba(0, 0, 0, 0.1)` | [src/index.css:56](src/index.css#L56) | Declaration only / root alias |
| `--border-default` | `#e1e5ef` | [src/index.css:57](src/index.css#L57) | `src/components/ui/input.tsx:42` |
| `--border-soft` | `rgba(197, 198, 205, 0.3)` | [src/index.css:58](src/index.css#L58) | `src/components/common/RouteErrorBoundary.tsx:26`; `src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx:15`; `src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx:32`; +5 other modules |
| `--border-subtle` | `#EBEBEB` | [src/index.css:59](src/index.css#L59) | Declaration only / root alias |
| `--input` | `var(--surface-page)` | [src/index.css:62](src/index.css#L62) | `src/components/ui/input.tsx:51` |
| `--label-color` | `#3e4a3d` | [src/index.css:63](src/index.css#L63) | `src/components/ui/input.tsx:86` |
| `--grid` | `rgba(0, 0, 0, 0.05)` | [src/index.css:66](src/index.css#L66) | Declaration only / root alias |
| `--tooltip-bg` | `rgba(0, 0, 0, 0.08)` | [src/index.css:67](src/index.css#L67) | Declaration only / root alias |
| `--shadow-card` | `0px 1px 5px rgba(0, 0, 0, 0.08)` | [src/index.css:70](src/index.css#L70) | `src/components/ui/card.tsx:11`; `src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx:119`; `src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx:23`; +1 other modules |
| `--shadow-card-sm` | `0px 1px 2px rgba(0, 0, 0, 0.05)` | [src/index.css:71](src/index.css#L71) | Declaration only / root alias |
| `--shadow-dropdown` | `0px 4px 16px rgba(0, 0, 0, 0.08)` | [src/index.css:72](src/index.css#L72) | Declaration only / root alias |
| `--timer-danger-bg` | `#FEF2F2` | [src/index.css:74](src/index.css#L74) | Declaration only / root alias |
| `--timer-danger-text` | `#BA1A1A` | [src/index.css:75](src/index.css#L75) | Declaration only / root alias |
| `--queue-bg` | `#E7E8E9` | [src/index.css:76](src/index.css#L76) | Declaration only / root alias |
| `--queue-text` | `#45474C` | [src/index.css:77](src/index.css#L77) | Declaration only / root alias |
| `--check-overlay-bg` | `rgba(243, 244, 245, 0.5)` | [src/index.css:78](src/index.css#L78) | Declaration only / root alias |
| `--agent-avatar-bg` | `#D8E3FB` | [src/index.css:79](src/index.css#L79) | Declaration only / root alias |
| `--geo-card-bg` | `rgba(255, 255, 255, 0.95)` | [src/index.css:80](src/index.css#L80) | Declaration only / root alias |
| `--geo-card-shadow` | `0px 1.369rem 2.739rem -0.657rem rgba(9, 20, 38, 0.10)` | [src/index.css:81](src/index.css#L81) | Declaration only / root alias |
| `--geo-nav-bg` | `rgba(255, 255, 255, 0.75)` | [src/index.css:82](src/index.css#L82) | Declaration only / root alias |
| `--geo-overlay-dark` | `rgba(9, 20, 38, 0.90)` | [src/index.css:83](src/index.css#L83) | Declaration only / root alias |
| `--geo-scan-ring` | `rgba(255, 255, 255, 0.20)` | [src/index.css:84](src/index.css#L84) | Declaration only / root alias |
| `--geo-boundary-fill` | `rgba(9, 20, 38, 0.10)` | [src/index.css:85](src/index.css#L85) | Declaration only / root alias |
| `--geo-blue-check-bg` | `rgba(105, 182, 254, 0.20)` | [src/index.css:86](src/index.css#L86) | Declaration only / root alias |
| `--geo-dot-pending` | `rgba(9, 20, 38, 0.05)` | [src/index.css:87](src/index.css#L87) | Declaration only / root alias |
| `--geo-verified-bg` | `rgba(188, 210, 37, 0.20)` | [src/index.css:88](src/index.css#L88) | Declaration only / root alias |
| `--geo-verified-text` | `#191E00` | [src/index.css:89](src/index.css#L89) | Declaration only / root alias |
| `--geo-logo-bg` | `#091426` | [src/index.css:90](src/index.css#L90) | Declaration only / root alias |
| `--geo-white-wash` | `rgba(255, 255, 255, 0.15)` | [src/index.css:91](src/index.css#L91) | Declaration only / root alias |
| `--geo-dot-grid` | `radial-gradient(circle, rgba(0, 98, 158, 0.06) 1px, transparent 1px)` | [src/index.css:92](src/index.css#L92) | Declaration only / root alias |
| `--geo-scan-blur` | `rgba(255, 255, 255, 0.10)` | [src/index.css:93](src/index.css#L93) | Declaration only / root alias |
| `--geo-scan-sweep` | `linear-gradient(180deg, rgba(0, 98, 158, 0) 0%, rgba(0, 98, 158, 0.20) 50%, rgba(0, 98, 158, 0) 100%)` | [src/index.css:94](src/index.css#L94) | Declaration only / root alias |
| `--dot` | `#131600` | [src/index.css:97](src/index.css#L97) | Declaration only / root alias |
| `--toggle-active` | `#4caf50` | [src/index.css:98](src/index.css#L98) | Declaration only / root alias |
| `--avatar-fallback` | `#c0c0c0` | [src/index.css:99](src/index.css#L99) | Declaration only / root alias |
| `--tag-pill-bg` | `#f3f4f5` | [src/index.css:100](src/index.css#L100) | Declaration only / root alias |
| `--priority-card-bg` | `#F9FCE9` | [src/index.css:103](src/index.css#L103) | Declaration only / root alias |
| `--priority-high` | `#7A951C` | [src/index.css:104](src/index.css#L104) | Declaration only / root alias |
| `--priority-under-investigation` | `#B8D327` | [src/index.css:105](src/index.css#L105) | Declaration only / root alias |
| `--priority-resolved` | `#C8DE52` | [src/index.css:106](src/index.css#L106) | Declaration only / root alias |
| `--priority-center-bg` | `rgba(61, 74, 13, 0.08)` | [src/index.css:107](src/index.css#L107) | Declaration only / root alias |
| `--priority-ring-border` | `rgba(0, 0, 0, 0.2)` | [src/index.css:108](src/index.css#L108) | Declaration only / root alias |
| `--priority-dashed-border` | `rgba(0, 0, 0, 0.1)` | [src/index.css:109](src/index.css#L109) | Declaration only / root alias |
| `--performance-card-bg` | `#EBF5FB` | [src/index.css:112](src/index.css#L112) | Declaration only / root alias |
| `--performance-grid` | `rgba(130, 130, 130, 0.1)` | [src/index.css:113](src/index.css#L113) | Declaration only / root alias |
| `--performance-axis` | `rgba(92, 92, 92, 0.5)` | [src/index.css:114](src/index.css#L114) | Declaration only / root alias |
| `--performance-line` | `#0F2F4C` | [src/index.css:115](src/index.css#L115) | Declaration only / root alias |
| `--performance-area-start` | `#85BFE5` | [src/index.css:116](src/index.css#L116) | Declaration only / root alias |
| `--performance-area-end` | `rgba(215, 235, 247, 0)` | [src/index.css:117](src/index.css#L117) | Declaration only / root alias |
| `--performance-approved` | `#94C7E9` | [src/index.css:118](src/index.css#L118) | Declaration only / root alias |
| `--performance-pill-border` | `rgba(130, 130, 130, 0.4)` | [src/index.css:119](src/index.css#L119) | Declaration only / root alias |
| `--banner-from` | `#2a5c3f` | [src/index.css:122](src/index.css#L122) | Declaration only / root alias |
| `--banner-via` | `#3a7d5a` | [src/index.css:123](src/index.css#L123) | Declaration only / root alias |
| `--banner-to` | `#2c6b4a` | [src/index.css:124](src/index.css#L124) | Declaration only / root alias |
| `--approve-gradient-from` | `#2680c4` | [src/index.css:127](src/index.css#L127) | Declaration only / root alias |
| `--approve-gradient-to` | `#4a7bbb` | [src/index.css:128](src/index.css#L128) | Declaration only / root alias |
| `--document-placeholder-from` | `#e8edf5` | [src/index.css:131](src/index.css#L131) | Declaration only / root alias |
| `--document-placeholder-to` | `#d4dce8` | [src/index.css:132](src/index.css#L132) | Declaration only / root alias |
| `--state-text-color` | `#606170` | [src/index.css:135](src/index.css#L135) | Declaration only / root alias |
| `--map-primary` | `#A1BEEF` | [src/index.css:136](src/index.css#L136) | Declaration only / root alias |
| `--map-background` | `#D6E6FF` | [src/index.css:137](src/index.css#L137) | Declaration only / root alias |
| `--map-land-fill-color` | `#F0EEF0` | [src/index.css:138](src/index.css#L138) | Declaration only / root alias |
| `--map-secondary` | `#B8D995` | [src/index.css:139](src/index.css#L139) | Declaration only / root alias |
| `--region-card-top-bg` | `linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)), rgba(39, 128, 196, 0.06)` | [src/index.css:142](src/index.css#L142) | Declaration only / root alias |
| `--area-card-bottom-bg` | `rgba(39, 128, 196, 0.08)` | [src/index.css:143](src/index.css#L143) | Declaration only / root alias |
| `--illus-card-white-bg` | `rgba(255, 255, 255, 0.10)` | [src/index.css:144](src/index.css#L144) | Declaration only / root alias |
| `--illus-glow` | `rgba(242, 255, 219, 0.34)` | [src/index.css:145](src/index.css#L145) | Declaration only / root alias |
| `--header-gradient` | `linear-gradient(94.23deg, rgba(66, 143, 223, 0.07) -8.84%, #D3DDE2 51.66%, #D7EBF7 108.77%)` | [src/index.css:148](src/index.css#L148) | Declaration only / root alias |
| `--chart-bg` | `#F9F9F9` | [src/index.css:154](src/index.css#L154) | Declaration only / root alias |
| `--chart-bar-rejected` | `#37E8DD` | [src/index.css:155](src/index.css#L155) | Declaration only / root alias |
| `--chart-gradient` | `linear-gradient(180deg, rgba(174, 214, 239, 0.92) 0%, #FFFFFF 100%)` | [src/index.css:156](src/index.css#L156) | Declaration only / root alias |
| `--chart-grid` | `var(--grid)` | [src/index.css:159](src/index.css#L159) | Declaration only / root alias |
| `--chart-bar-inactive` | `var(--brand-bar)` | [src/index.css:160](src/index.css#L160) | Declaration only / root alias |
| `--chart-gradient-from` | `rgba(223, 232, 200, 0)` | [src/index.css:161](src/index.css#L161) | Declaration only / root alias |
| `--chart-gradient-to` | `rgba(124, 171, 218, 0.77)` | [src/index.css:162](src/index.css#L162) | Declaration only / root alias |
| `--chart-dot` | `var(--brand-500)` | [src/index.css:163](src/index.css#L163) | Declaration only / root alias |
| `--chart-axis-text` | `var(--text-muted-strong)` | [src/index.css:164](src/index.css#L164) | Declaration only / root alias |
| `--chart-tick-active-bg` | `var(--brand-500)` | [src/index.css:165](src/index.css#L165) | Declaration only / root alias |
| `--chart-tick-inactive-bg` | `var(--surface-page)` | [src/index.css:166](src/index.css#L166) | Declaration only / root alias |
| `--chart-tick-active-text` | `var(--surface-sidebar-text)` | [src/index.css:167](src/index.css#L167) | Declaration only / root alias |
| `--chart-tick-inactive-text` | `var(--text-primary)` | [src/index.css:168](src/index.css#L168) | Declaration only / root alias |
| `--chart-badge-bg` | `var(--tooltip-bg)` | [src/index.css:169](src/index.css#L169) | Declaration only / root alias |
| `--chart-badge-border` | `var(--text-muted-strong)` | [src/index.css:170](src/index.css#L170) | Declaration only / root alias |
| `--chart-badge-text` | `var(--text-primary)` | [src/index.css:171](src/index.css#L171) | Declaration only / root alias |
| `--chart-fo` | `#D3ECFE` | [src/index.css:172](src/index.css#L172) | Declaration only / root alias |
| `--chart-agents` | `#A5BFD7` | [src/index.css:173](src/index.css#L173) | Declaration only / root alias |
| `--mirror-bar-up` | `rgba(255, 255, 255, 0.90)` | [src/index.css:176](src/index.css#L176) | Declaration only / root alias |
| `--mirror-bar-down` | `rgba(100, 200, 210, 0.65)` | [src/index.css:177](src/index.css#L177) | Declaration only / root alias |
| `--pie-1` | `#85BFE5` | [src/index.css:180](src/index.css#L180) | `src/components/ui/button.tsx:242` |
| `--pie-3` | `#1D5E9C` | [src/index.css:181](src/index.css#L181) | Declaration only / root alias |
| `--pie-4` | `#D7EBF7` | [src/index.css:182](src/index.css#L182) | Declaration only / root alias |
| `--btn-secondary` | `#96C9ED` | [src/index.css:185](src/index.css#L185) | `src/components/ui/button.tsx:64` |
| `--btn-navy` | `#1C5F9D` | [src/index.css:186](src/index.css#L186) | `src/components/ui/button.tsx:72` |
| `--btn-purple` | `#8280FF` | [src/index.css:187](src/index.css#L187) | `src/components/ui/button.tsx:80` |
| `--btn-dark` | `#2B2D2F` | [src/index.css:188](src/index.css#L188) | `src/components/ui/button.tsx:87` |
| `--btn-lime` | `#BDD327` | [src/index.css:189](src/index.css#L189) | `src/components/ui/button.tsx:95` |
| `--btn-gradient-blue-from` | `#0095FF` | [src/index.css:192](src/index.css#L192) | `src/components/ui/button.tsx:149` |
| `--btn-gradient-blue-to` | `#1F8AFF` | [src/index.css:193](src/index.css#L193) | `src/components/ui/button.tsx:149` |
| `--btn-gradient-dark-from` | `#3D4A0D` | [src/index.css:194](src/index.css#L194) | `src/components/ui/button.tsx:158` |
| `--btn-gradient-dark-to` | `#2A3008` | [src/index.css:195](src/index.css#L195) | `src/components/ui/button.tsx:158` |
| `--btn-outline-primary-border` | `rgba(39, 128, 196, 0.8)` | [src/index.css:198](src/index.css#L198) | `src/components/ui/button.tsx:104` |
| `--btn-outline-primary-text` | `var(--btn-outline-primary-border)` | [src/index.css:199](src/index.css#L199) | `src/components/ui/button.tsx:103` |
| `--btn-outline-dark-border` | `rgba(0, 0, 0, 0.27)` | [src/index.css:200](src/index.css#L200) | `src/components/ui/button.tsx:113` |
| `--btn-outline-dark-text` | `rgba(0, 0, 0, 0.8)` | [src/index.css:201](src/index.css#L201) | `src/components/ui/button.tsx:112` |
| `--btn-outline-danger-border` | `rgba(205, 0, 0, 0.27)` | [src/index.css:202](src/index.css#L202) | `src/components/ui/button.tsx:122` |
| `--btn-outline-danger-text` | `rgba(208, 20, 20, 0.8)` | [src/index.css:203](src/index.css#L203) | `src/components/ui/button.tsx:121` |
| `--btn-outline-square-border` | `rgba(39, 128, 196, 0.5)` | [src/index.css:204](src/index.css#L204) | `src/components/ui/BackButton.tsx:29`; `src/components/ui/button.tsx:131` |
| `--btn-font-primary` | `var(--font-sans)` | [src/index.css:207](src/index.css#L207) | `src/components/ui/button.tsx:51` |
| `--btn-font-poppins` | `"Poppins", sans-serif` | [src/index.css:208](src/index.css#L208) | `src/components/ui/button.tsx:81` |
| `--btn-radius-pill` | `48px` | [src/index.css:211](src/index.css#L211) | `src/components/ui/BackButton.tsx:34`; `src/components/ui/button.tsx:50` |
| `--btn-radius-pill-sm` | `33px` | [src/index.css:212](src/index.css#L212) | `src/components/ui/BackButton.tsx:33`; `src/components/ui/button.tsx:88` |
| `--btn-radius-circle` | `9999px` | [src/index.css:213](src/index.css#L213) | `src/components/ui/button.tsx:150` |
| `--btn-radius-rounded` | `8px` | [src/index.css:214](src/index.css#L214) | `src/components/ui/button.tsx:141` |
| `--radius-dropdown` | `12px` | [src/index.css:215](src/index.css#L215) | `src/components/ui/button.tsx:132`; `src/components/ui/input.tsx:43` |

### Spacing, radius, borders, elevation, motion and layering

**Existing foundation:** Tailwind's imported default theme provides numeric utility spacing; the project does not override the base spacing variable. **Inferred default conversion:** one numeric spacing step is `0.25rem` (4px at a 16px root), so `p-6` is 24px, `gap-5` is 20px, `px-10` is 40px. Arbitrary values and `clamp()` values coexist extensively. There is no source-enforced requirement to use multiples of four.

| Category | Existing values and usage |
| --- | --- |
| Common utility spacing | `1` = 4px; `1.5` = 6px; `2` = 8px; `2.5` = 10px; `3` = 12px; `3.5` = 14px; `4` = 16px; `5` = 20px; `6` = 24px; `7` = 28px; `8` = 32px; `9` = 36px; `10` = 40px; `12` = 48px. Conversions assume the unmodified imported theme and a 16px root. |
| Repeated super-admin wrapper | gap `clamp(12px,0.5vw,16px)`; horizontal padding `clamp(6px,0.83vw,12px)`; vertical padding `clamp(16px,1.5vw,32px)` |
| Main workbench spacing | `px-10` (40px), bottom `pb-10` (40px), panel gap `gap-5` (20px); root top `pt-8` (32px), bottom `pb-4` (16px) |
| Common content cards | `p-4 lg:p-6` (16→24px) or `p-6` (24px); detail cards often `p-8`/`p-10` (32/40px) |
| Form spacing | upload owner grid `gap-x-6 md:gap-x-10`, `gap-y-6 md:gap-y-8`; field internal `gap-2`; review display fields `mb-6` |
| Explicit radii | pill 48px, small pill 33px, circle 9999px, rounded button 8px, dropdown 12px; other local radii 4, 8, 12, 16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 69, 73px |
| Radius placement | rail/header/land cards/workbench 24px; maintenance service card 22px; maintenance dialogs 24→28px; profile 32px or 40px; upload comments 18px; controls commonly 8px/12px; avatars `rounded-full` |
| Borders | `border` generally 1px solid (Tailwind default); local `border-2`, `border-4`, `border-[1.5px]`; dropzones 2px dashed; family connectors and old stylesheet include fractional pixel borders |
| Focus | Button 2px brand ring + 2px offset; profile switch 2px green ring + 2px offset; many form fields only change border; shared Input removes outline without a replacement |
| Shadows | root card `0px 1px 5px rgba(0,0,0,0.08)`; small `0px 1px 2px rgba(0,0,0,0.05)`; dropdown `0px 4px 16px rgba(0,0,0,0.08)`; workbench `0px 20px 40px rgba(0,49,50,0.06)`; many utilities/local values coexist |
| Overlays | black at 20%, 35%, 40%, 45%, 50%, 60%; some proceed dialogs white/40; `backdrop-blur-xs`, `backdrop-blur-sm`, `backdrop-blur-[2px]` |
| Layering | common local z 0/1/10/20/30; navbar z40; menus and most dialogs z50; estimation success z60; draft/summary z110; submitted z9999; image picker z99999 |
| Motion | Button 150ms ease-in-out; BackButton 200ms; card/nav 200ms; some card lifts 300ms; image zoom 500ms; see §11 for actual vs unconnected animation declarations |

The exact per-module variants and one-off dimensions are in Appendix 18. These values are a catalog of current use, not an approved consolidated scale.

## 4. Color System

### Usage roles

| Role | Existing color(s) | Where used / caution |
| --- | --- | --- |
| Shared primary action | `--brand-500` `#2780C4`; base hover opacity 0.85, active scale 0.97 | Shared Button. No separate hover/pressed fill token in this component. Brand-600 exists but is not its hover fill. |
| Super-admin chrome | page `#F2F2F2`; details often `#F6F7F6`; rail `#191B1C`, active `#2D3032`, hover `#252729`, inactive `#8E9093` | Shell, rail, detail wrappers; rail uses literal colors rather than root aliases |
| Current header | `linear-gradient(94.23deg, #B1BCB3 -8.84%, #DBE3DA 51.66%, #B1BCB3 108.77%)` | `SuperAdminHeader`; differs from declared `--header-gradient` |
| Document-workflow accent | lime `#BDD327`; light `#E6EEAD`; panel `#F6F9E2`; active `#2D3409`; dark end `#2A3008` | Tabs, file rows, stepper, comments, approval actions |
| Approval/login CTA | radial gradient `50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%` | Current verification footer and super-admin login; not a solid brand-blue action |
| Maintenance primary | `#1E75BB`, hover `#1864A0`; also `#1877F2`, hover `#166FE5` | Navbar, cards, table/filter/detail actions. These are distinct existing palettes, not aliases. |
| Maintenance surfaces | `#F8FAFC` dashboard; `#FDFDFE` many pages; white cards; `#ECEFF2` or `#EAEFF4` borders | No maintenance CSS token namespace currently |
| Maintenance text | primary `#1A1C1D`/`#111827`/`#1E293B`; secondary `#64748B`; supporting `#7A8699` | Labels/headers and copy; source uses literals |
| Success | root `#16A34A`; maintenance `#10B981` with `#E8F8F0`; review status `#BDD327`; other badges `#15803D` on `#DCFCE7` | Context-specific variants, not interchangeable semantics |
| Warning | root `#F59E0B`; maintenance awaiting `#CA8A04` on `#FEF9C3`, dot `#EAB308` | Use text labels in addition to color |
| Error | root `#DC2626`; maintenance `#EF4444` on `#FEE2E2`; review Tailwind red utilities | No single shared destructive filled Button variant |
| Disabled | shared Button opacity 45%; many local controls opacity 50%; read-only forms use slate/gray backgrounds and text | There is no root disabled color token |
| Placeholder | context-specific, e.g. login `#6D7A7A` at 30%; shared Input inherits browser/Tailwind placeholder defaults unless caller overrides | No universal placeholder token |
| Inverse | `--surface-card`/white; sidebar text white | Verify contrast for each actual background |

All root colors, aliases, alpha/gradient variants are in §3. Appendix 18 also inventories literal source colors outside the root and data-driven chart palettes. No dark-mode theme, dark-mode toggle, or `dark:` styling was found. A Button variant named `dark` is an individual component appearance, not dark-mode support.

**Recommended:** migrate repeated literals to reviewed semantic tokens in a separate task, maintaining the existing context differences until agreed. Never replace all maintenance blues with brand-500 as an incidental new-screen change.

## 5. Typography System

### Font loading and inheritance

**Existing:** `main.tsx` loads Manrope **700**, Plus Jakarta Sans **400, 500, 600** via fontsource. Body uses `--font-sans: "Plus Jakarta Sans"`; global `h1` uses `--font-heading: "Manrope"` unless overridden. `.font-inter` references `Inter, sans-serif`.

**Issues:** Inter, Outfit and Poppins are referenced but not loaded by the application. Geist is in the manifest but not imported. Plus Jakarta Sans 700/800 and other unimported weights are frequently requested; synthetic bold or local installed fonts may affect rendering. There is no explicit root font-size override. CSS defaults and px conversions below assume a 16px browser root. The `font-[var(--font-inter)]` spelling in BackButton is preserved in source; verify how the compiler interprets it before assuming computed font-family equivalence with typed `font-[family-name:...]`.

### Primitive typography variants

Source: `src/components/ui/typography.tsx`. Color and family inherit from the element/caller unless stated. Letter spacing `tracking-tight` is the Tailwind default `-0.025em`; default line heights below are imported-theme expectations, not measured browser results.

| Style | Family | Size / default line height | Weight | Tracking | Color | Use |
| --- | --- | --- | --- | --- | --- | --- |
| `h1` | global Manrope; caller can override | 36/40px → lg 48/48px | 800 | -0.025em | inherited | Primitive display heading; not universal page title |
| `h2` | body/caller | 30/36px | 700 | -0.025em | inherited | Large section heading |
| `h3` | body/caller | 24/32px | 600 | -0.025em | inherited | Subsection |
| `h4` | body/caller | 20/28px | 600 | -0.025em | inherited | Small heading |
| `p` | body/caller | 16px, explicit `leading-7` 28px | inherited (usually 400) | inherited/normal | inherited | Body copy |
| `span` | inherited | inherited | inherited | inherited | inherited | Inline text with caller styling |
| h5/h6 | no component variant | inherited/reset styles | inherited | inherited | inherited | No established shared specification |

### Actual application text roles

| Style / source | Family | Font size | Weight | Line height / tracking | Color / alignment | Use |
| --- | --- | --- | --- | --- | --- | --- |
| Super-admin hero title (`SuperAdminHeader`) | Inter declaration, fallback unverified | 28→sm30→lg32→xl36→2xl40px | 500 | 120%; -0.02em; uppercase | `--text-strong`; left | Header title, rendered as p |
| Header subtitle | Inter declaration | 12→sm13→xl14px | 400 | 16→xl18px | `--text-muted`; left | Supporting copy |
| Maintenance page h1 (`MaintenanceDashboard`) | explicit Plus Jakarta Sans | 24→sm30px | 800 | `leading-tight` 1.25; normal tracking | `#1A1C1D`; left | Page title |
| Maintenance card title (`OperationsOverviewCard`, sibling cards) | Plus Jakarta Sans | 15px | 800 | inherited; 0.05em; uppercase | `#1E252B`; left | Card heading |
| Verification panel h3 | `font-sans` | 16→md18px | 700 | `leading-tight` 1.25 | black; left | Active section heading |
| Verification display field label (`FormFields`) | inherited | 22px; radio/input labels 16px | 700 | inherited; normal | gray-900; left | Read-only label hierarchy |
| Verification display value | inherited | 15px | 500 | inherited; normal | gray-500/600/800 by variant | Static values |
| Shared primary action | Plus Jakarta Sans token | 11→lg12→xl13→2xl14px | 600 | inherited; 0.7px; uppercase | white; centered | Primary Button |
| Maintenance navbar | Plus Jakarta Sans | 13px | 600 | inherited; normal | white active / `#4B5563` inactive | Top navigation |
| Shared form Input label | `font-sans` | clamp(12px,0.97vw,16px) | 500 | 1 | `--label-color` | Reusable form label |
| Shared form Input value | `font-sans` | clamp(12px,0.9vw,14px) | inherited | inherited | `--profile-text` | Form input |
| Upload comments | `font-sans` | 16px | 400 | 24px; normal | black; left | Free-text comment |
| Maintenance table header (`MaintenanceServiceRequests`) | Plus Jakarta Sans inherited | 12px | 700 | inherited; `tracking-wider` 0.05em; uppercase | `#64748B`; left | Column headers |
| Status badge (`ServiceRequestCard`) | inherited | 11px | 700 | inherited; normal | per semantic badge | Compact status |
| Farm card metadata | inherited; some `.font-inter` | 12→lg13px | 400 | inherited | `--text-muted` | Acreage and cost |
| KPI (`FarmlandStatsCard`) | Inter declaration | 22→lg26→xl28px | 700 | `leading-tight` 1.25 | `--text-primary`; centered | Numeric totals |
| KPI caption | Inter declaration | 9→lg10→xl11px | 500 | inherited; uppercase/wider | `--text-muted`; centered | Numeric labels |
| Login hero | explicit Plus Jakarta Sans | 28→lg42px | 600 | 1.2→lg52px | white; centered | Photo overlay greeting |
| Login secure footer | Plus Jakarta Sans | 10→lg12px | 400 | 14→lg16px | `#3D4949`/80 | Authentication supporting text |

Some captions fall below 12px and badges below common readability targets. These are existing facts, not recommended minimums. Do not infer a display/H1–H6 scale across all pages from the primitive alone; callers frequently override it. Appendix 18 records each module's size, leading, weight, tracking and alignment classes.

## 6. Layout System

### Shell and containers

| Pattern | Existing specification | Source |
| --- | --- | --- |
| Super-admin shell | flex; height 100vh; outer overflow hidden; main flex-1 overflow auto | `SuperAdminLayout.tsx` |
| Icon rail | 76px wide; margins left/top/bottom 16px; h calc(100vh - 32px); radius 24px; padding 14px; nav targets 48×48px | `components/layout/Sidebar.tsx` |
| Dashboard/list wrapper | flexible min-h-full column, clamp spacing from §3; no universal max-width | dashboard, user lists, pool buying, upload list |
| Hero | fixed 400px height, width 100%, radius 24px, padding 16/12px → 2xl32/20px; overflow clipped only in background layer | `SuperAdminHeader.tsx` |
| Document workflow root | 100vh column, overflow hidden; header px40 pt32 pb16; content px40 pb40 gap20; fixed left rail 280px; report tab rail 320px; flexible min-w-0 content | verification `index.tsx`, upload `index.tsx`, SharedUI |
| Super-admin profile | max-width 1000px centered; white radius32 card | `SuperAdminProfile.tsx` |
| User profile | max-w-4xl (default 56rem / 896px); centered card | `SuperAdminUserProfile.tsx` |
| Agent profile | max-w-6xl (default 72rem / 1152px); card radius40; p40→md56 | `SuperAdminAgentProfile.tsx` |
| Top performers | max-w-5xl (default 64rem / 1024px); podium max-w-3xl (48rem / 768px) | `SuperAdminTopPerformers.tsx` |
| Login | max-width1440px; base min-height100vh; lg height90vh capped920px; lg overflow hidden; two lg:flex-1 columns | both login modules |
| Login form | max-width454px; base horizontal padding24; lg40; xl60; vertical32→lg40 | both login modules |
| Maintenance | own sticky top navbar; main px24→sm32→lg40→xl48; some detail pages lg48; py24→sm32; no global max-width | maintenance navbar/pages |
| Maintenance profile | max-width1240px centered; px16→sm24→lg32 | `MaintenanceProfile.tsx` |
| Pool create | max-width1320px centered; horizontal32, vertical28 with bottom40; map/form stack→lg row; form lg290px | `SuperAdminPoolCreate.tsx` |
| Upload map | h-screen; padding16, md horizontal32; max-w-7xl (80rem / 1280px); map/sheets occupy remaining height | `SuperAdminUploadViewMaps.tsx` |

### Grids and scrolling

- Farmland listings commonly `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; `SuperAdminFarmlands` instead reaches **4 columns at lg**. Preserve the chosen template.
- Super-admin dashboard chart row: one column until xl, then `1.2fr 1fr`.
- Maintenance dashboard: one column → md2 → lg12; timeline/distribution/operations span **4/3/5** at lg; operations spans 2 at md.
- Owner upload form: one → md2 → lg3 columns; tabs and footer remain within the main panel.
- Maintenance detail grids use `lg:grid-cols-12`, often 6/6 splits; tables scroll horizontally rather than converting to mobile cards.
- Requests table min-width760px; sold-out table min-width900px; pipeline inner strip min-width860px with stage minimum160px.
- Root workbenches rely on `min-h-0`/`min-w-0`, fixed header/footer and internal overflow-y-auto. Removing these changes scroll ownership.
- Scrollbars are globally hidden with universal `scrollbar-width:none` and WebKit `display:none`. `.custom-scrollbar` adds width/thumb rules without resetting that display:none; visible custom-scrollbar appearance is not established.
- `useViewportScale` computes `window.innerWidth/baseWidth` (default1440), updates on resize/orientationchange, but has **no current importing consumer**. It is not the application responsiveness strategy.

There is no shared footer for the entire app. Authentication has SecureFooter; workflows have panel action footers; maintenance and dashboard pages use local compositions.

## 7. Component Library

### 7.1 Shared Button

Source: `src/components/ui/button.tsx`. A native `button`, forwardRef, merged classes. Default variant `primary`. All native button props pass through; no automatic `type="button"` default is supplied. Set type explicitly inside forms.

Anatomy: optional navy white badge, optional dark dot, optional left icon (suppressed for navy), spinner, children, optional right icon. `fullWidth` adds w-full. Icon dimensions are caller-controlled except spinner **15×15px**, navy badge **28→lg32→xl32→2xl36px**, and dark indicator **12px** with **2px** border. Most variants do not define a gap; add a caller gap when using icons if the selected variant lacks one.

Common states: 150ms transition-all ease-in-out; hover opacity85%; active scale0.97; disabled opacity45% and not-allowed cursor; focus-visible outline removed and replaced with 2px brand-500 ring + 2px offset. `loading` renders spinner and disables the button along with `disabled`. It does not add aria-busy or a live loading announcement. No success appearance or error prop exists.

Dimensions below list **base / lg / xl / 2xl**, preserving explicit classes. Padding is horizontal; no vertical padding is set in the variant. Common line-height inherits. Each row is a separate supported appearance; there is no independent size prop.

| Variant | Fill / text / border | Radius | Height px | Font px / weight / family | Horizontal padding px |
| --- | --- | --- | --- | --- | --- |
| primary | brand-500 / surface-card / none |48|44/48/52/56|11/12/13/14;600; Jakarta; uppercase,0.7px|24/28/32/40|
| primary-sm | brand-500 / surface-card / none |24|26/28/30/31|9/10/10/11;700; Inter declaration|12/16/16/16|
| secondary | btn-secondary / text-primary / none |48|36/38/40/44|11/12/13/14;600; Jakarta; uppercase,0.7px|24/28/32/40|
| navy | btn-navy / white / none |73|44/48/50/56|13/14/16/18;500; Jakarta|12/14/14/14; gap8|
| purple | btn-purple / white / none |30|24/26/27/29|11/12/13/14;400; Poppins declaration|16|
| dark | btn-dark / white / black1px |33|32/34/36/38|11/12/13/14;600; Jakarta|16/18/18/18; gap10|
| lime | btn-lime / text-primary / none |20|34/36/38/40|11/12/13/14;500; Jakarta|16/20/20/20|
| outline-primary | transparent / outline-primary-text / outline-primary-border1px |33|32/34/36/38|11/12/13/14;500; Jakarta|16/20/20/20|
| outline-dark | transparent / outline-dark-text / outline-dark-border1px |33|32/34/36/38|11/12/13/14;500; Jakarta|16/20/20/20|
| outline-danger | transparent / outline-danger-text / outline-danger-border1px |33|32/34/36/38|11/12/13/14;500; Jakarta|16/20/20/20|
| outline-square | transparent / brand-500 / outline-square-border1px |12|36/38/40/42|11/12/13/14;600; Inter declaration|16/20/20/20|
| export | transparent / brand-400 / brand-4001px |8|32/34/36/38|11/12/13/14;500; Jakarta|16/20/20/20; gap6|
| gradient-blue | linear135deg blue-from0%→blue-to100% / white / none |9999|30/32/34/36|10/11/11/12;500; Inter declaration|16/20/20/20|
| gradient-dark | radial50%50% dark-from0%→dark-to100% / white / none |69|40/42/44/48|11/12/13/14;400; Inter declaration; uppercase,0.4px|32/36/40/40|
| gradient-dark-sm | same radial gradient / white / none |8|28/29/30/32|10/11/12/13;400; Jakarta|12/16/16/16; gap6|

Gradient-blue shadow: `0px 4px 6px -1px rgba(0,0,0,0.10), 0px 2px 4px -2px rgba(0,0,0,0.10)`. Other variants do not add a component shadow by default. There are no named `ghost`, `tertiary`, `destructive`, `icon`, or floating action Button variants. Local native buttons provide those kinds of appearance in some screens.

Example using the existing API (illustrative composition):

```tsx
import { Button } from '@/components/ui/button';
<Button type="submit" variant="primary" loading={isSaving}>Save</Button>
<Button type="button" variant="outline-primary" onClick={onCancel}>Cancel</Button>
```

### 7.2 BackButton

Source: `src/components/ui/BackButton.tsx`. CVA variants: **light** (surface-card/text-button), **dark** (surface-sidebar/sidebar-text), **brand** (brand-500/surface-card), **brandTint** (brand-tint/brand-500, outline-square-border). Default light/default; label defaults to “Go back to dashboard”; supports polymorphic `as`. Navigation is entirely a caller-provided action. Text truncates.

| Size | Min width | Min height (content may make taller) | Padding x / y | Gap | Font size | Arrow |
| --- | --- | --- | --- | --- | --- | --- |
| sm | clamp(8rem,13.8vw,12.5rem) | clamp(2rem,2.9vw,2.625rem) | clamp(0.6rem,1.1vw,1rem) / clamp(0.4rem,0.9vw,0.875rem) | clamp(0.2rem,0.4vw,0.375rem) | clamp(0.7rem,0.97vw,0.875rem) |20px|
| default | clamp(10rem,16.6vw,15rem) | clamp(2.2rem,3.6vw,3.25rem) | clamp(0.7rem,1.38vw,1.25rem) / clamp(0.4rem,1vw,1.1875rem) | clamp(0.3rem,0.55vw,0.5rem) | clamp(0.75rem,1.1vw,1rem) |24px|
| lg | clamp(12rem,19.4vw,17.5rem) | clamp(2.6rem,4.1vw,3.75rem) | clamp(0.9rem,1.6vw,1.5rem) / clamp(0.6rem,1.5vw,1.375rem) | clamp(0.4rem,0.69vw,0.625rem) | clamp(0.85rem,1.25vw,1.125rem) |28px|

Normal font weight, line-height110%; sm radius33px, other sizes48px. Arrow stroke1.4px, round caps/joins. 200ms transition-all; hover translates up1px, active resets translation. Default drop-shadow `0 0 4px rgba(0,0,0,0.12)` → hover `0 2px 8px rgba(0,0,0,0.18)`. No built-in loading, explicit disabled style, or focus-ring style. Native button behavior remains where not overridden. `brandTint` also retains base `border-none`; inspect generated/merged CSS before relying on its nominal border.

### 7.3 Input

Source: `src/components/ui/input.tsx`. Native input with useId-backed label association, forwardRef. Variants: `default`, `white`, `form`; no built-in validation/error/helper-text API. Slots: label, labelRightElement, left icon, rightElement. Caller controls input type and native constraints. Password visibility/search adornments are caller behavior, not automatic variants.

| Property | default / white | form |
| --- | --- | --- |
| Wrapper height | clamp(42px,5.47vh,73px) | clamp(36px,2.9vw,40px) |
| Fill | default `--input` (surface-page); white `--surface-card` | surface-card |
| Border/radius | no explicit wrapper border; rounded-full | 1px border-default; radius-dropdown12px |
| Value | text-primary; font-sans; clamp(11px,1.11vw,21px) | profile-text; font-sans; clamp(12px,0.9vw,14px) |
| Input padding | horizontal clamp(34px,3.33vw,63px), even without icon | no icon horizontal clamp(12px,1vw,16px); with icon left clamp(34px,2.5vw,42px), right clamp(12px,1vw,16px) |
| Label | medium; line-height1; clamp(10px,0.97vw,18px); text-muted | medium; clamp(12px,0.97vw,16px); label-color |
| Label row | height clamp(16px,1.95vh,26px) | same |
| Field gap | clamp(6px,0.78vh,10px) | clamp(6px,0.5vh,10px) |
| Icon | absolute left clamp(13px,1.11vw,21px), opacity40%, pointer-events none | left clamp(10px,0.9vw,14px), opacity40% |
| Right slot | absolute right clamp(13px,1.11vw,21px) | right clamp(10px,0.9vw,14px) |

Input itself is full-width/full-height, transparent, border-none and outline-none. `login-input` has no matching project CSS definition. No shared hover/focus/error/disabled visual variant exists; native disabled prop passes through. Add accessible field feedback at the screen layer as an explicit improvement; do not document that improvement as current Input behavior.

```tsx
import { Input } from '@/components/ui/input';
<Input variant="form" label="Name" value={name}
  onChange={(event) => setName(event.target.value)} />
```

### 7.4 Card and Typography

Source: `src/components/ui/card.tsx`. Card is a native div with `rounded bg-white text-foreground shadow-[var(--shadow-card)]`; `text-foreground` lacks a project theme definition. Most feature cards override the small default radius and/or shadow. CardHeader is flex column, space-y6px and p24px. CardTitle is h3, weight600, line-height1 and tracking-tight; CardDescription p14px + `.text-muted`; CardContent p24px with top0; CardFooter flex row/center p24px with top0. There is no variant, state machine, loading, or hover on the base Card. Use feature compositions for actual land/service cards. Typography API and values are in §5; `as` overrides the semantic element independently of visual variant.

### 7.5 Land, user, KPI and chart components

| Component | Anatomy / dimensions / appearance | Variants and behavior |
| --- | --- | --- |
| `SuperAdminFarmlandCard` | radius24px, white, shadow-sm, border-soft; photo full-width200px high; content p16→lg24 gap16; title18→lg20px; metadata12→lg13px; agent24→lg32px circle | `imagePosition` top/bottom; optional status and GLC Exclusive badge; View Details callback; agent hidden if absent; action references undefined border-strong |
| `SuperAdminFarmlandsListCard` | photo container180px high with p12 top/sides; photo radius16; content p16→lg24; title18→lg20 | editable tag pill with Pencil; content/action details in appendix |
| `PoolBuyingCard` | image width200px, min-height260px; two-column metadata, horizontal card | no viewport breakpoint declaration in module; parent grid controls arrangement |
| `SuperAdminUserListCard` | horizontal white rounded row; leading identity width18rem→lg22rem; avatars48→lg56px; title16→lg17px Manrope700 | subscription/device icons, profile action; rigid internal widths can overflow narrow screens |
| `FarmlandStatsCard` | centered numbers22→lg26→xl28px; captions9→lg10→xl11px; divider and horizontal padding | display-only values |
| `StatusCards` | white rounded16 panels, min-width120px each, three-item flex row; icon container40→lg44→xl48px; icon20→lg24px | approved/rejected/in-progress icon map; no automatic stacking |
| `VisitorSalesCard` | compact metric panels, font-inter labels13→lg14px; large metric22→lg26→xl28px | up-arrow trend and display bars; data supplied as props |
| `SalesReportChart` | Recharts composed bar+line, ResponsiveContainer; custom tooltip charcoal radius12 p12/8, text11/12px; custom bar/tick | source-defined category colors, legend/period UI; not a shared tooltip primitive |
| `SubscriberGrowthChart` | Recharts Pie, responsive parent, donut wrapper clamp(140px,14vw,200px), min chart area160px | native period select and data legend; chart font sizes frequently clamp below12px |
| `TopPerformersList` | three-person podium, horizontally scrolling inner row, avatar sizes responsive at lg | parent-provided users; no shared ranking-card primitive |
| `SuperAdminSoldOutTable` | white radius16 border-gray-100, overflow-x-auto, table min-width900px, header14px600 px24 py16 | local rows and MoreVertical actions; no generic DataTable API |

Module paths, source declarations, state evidence and every declared size/layout/typography variant are recorded per file in Appendix 18. Chart colors that come from data props are not fixed theme tokens. Default Recharts animation/tooltip keyboard behavior has not been browser verified.

### 7.6 Document workflow components

**Current components are in `farmLandDocsverification/` and `upload-docs/`.** Do not substitute the similarly named `legal-docs/` family without inspecting its different editable behavior.

| Component | Existing anatomy / visual specification | States / behavior |
| --- | --- | --- |
| Verification StepperSidebar (`SharedUI`) | white280px width,24px radius; p32/40; h-full internal scroll; title label0.85rem, ID1.6rem; steps py22 gap24; connector at left9px | pathname determines active/completed; completed20px lime circle +10px check; active18px dark dot,2px olive border and4px alpha-lime halo; future pale dot; click div navigates |
| Verification TabsCard | white320px width,24px radius, workbench shadow; header px24 py24, vertical scrolling buttons px24 py14 gap12 | active pale `#F4F7E6`, right3px `#BDD327`; approved lime seal; rejected red indicator/text; pending nested gray/olive dot; no tablist semantics |
| UploadDocumentsTabsCard | same Section List structure, fixed panel family; heading16→md18, supporting12→md14 | active/completed indicators controlled by props; click updates section |
| Verification CommentsSection | read-only140px-high region; label16px600; fill rgba(230,238,173,0.2),1px `#E6EEAD`,12px radius; body p16,14px leading-relaxed, internal scroll | display-only comment, no editable field |
| Upload Comments |150px high, fill rgba(230,238,173,0.3),1px `#E6EEAD`,18px radius, p16; textarea16/24px | maxLength500; voice button40px circle; listening red + pulse; appends **mock** dictation after2000ms, not speech recognition |
| FooterActions | white top border, pt24, flex justify-between; reject px24 py10, red outlined pill; approve px32 py10 dark radial pill;14px600 | submitting disables both, opacity50%; label PROCESSING; rejected status and optional reason shown; `isApproved` prop does not disable approve in this implementation |
| Read-only FormFields | TextField/DualTextField white bordered radius16 px20 py16; Dropdown/MultiTag/InputTextField gray read-only variants; labels22px700 or16px700 | current verification DropdownField does not open; RadioGroupField displays selected data and is not interactive; InputTextField is readOnly despite its name |
| Legacy legal-docs FormFields | related styling, olive active border/tags; local React selection | DropdownField and RadioGroupField are click-operated; InputTextField editable; different from current review controls |
| UploadFile | one-column→xl two-column; hideDropzone forces one; dropzone min-height250px,2px dashed `#E1E5EF`,12px radius, py32 | drag background `#F3F4F1` vs `#F9FAFB`; click/browse/drop; validate 5MiB and document/image types; toast errors; list empty state |
| Uploaded FileListItem | min-height70px, fill `#F6F9E2`, radius12, px16 py12 gap16;38px white icon tile/radius4; title16/20px, size12px;34px download/delete | downloading disables download and shows spinner; url gates download; delete callback; `progress` field exists in type but this row does not draw a progress bar |
| Verification FileRow |60px high, fill `#F6F9E2`, radius12, px12;36px icon tile; title/metadata; download control | disabled while downloading; no delete in review |
| UploadOwnerDetailsForm | one→md2→lg3 field grid; gaps24→md40 horizontal,24→md32 vertical; field styling local | owner details, native date/contact inputs; parent callbacks; not React Hook Form-based by default |
| UploadFamilyTreeTab | family lists/cards and member editor trigger; connections and hierarchy reflect relatives | Add/Edit member modal, native input/select fields, image upload |
| UploadMemberEditModal |420px max-full width, max-height90vh; white radius24, shadow-xl; header/content/footer with internal scroll | role-dependent fields, native selects and form submit; no shared dialog focus management |
| UploadProfileAvatar | bell and avatar clamp(1.73rem,3.61vw,4.33rem); white round, drop shadow; bell24px | hover scale1.05/active0.95; bell opens common notification dropdown; avatar navigates to profile |
| UploadSubmittedModal |fixed z9999, black40% + blur-sm; white radius24 border20%-black, shadow `0 0 12.5px rgba(0,0,0,0.15)`; p32 | caller controls visibility and continue action; no focus trap |
| RejectModal |fixed z50, black60% + blur-sm; white500px wide, radius32, p32; textarea150px high, radius16 | nonblank trimmed reason gates callback; empty confirm is silent, not disabled; cancel closes; no inline required error |
| ProceedModal |fixed z50, white40% blur-sm; white500px, radius32, py40 px32;140px rotated-square seal | current/next step and land ID copy; proceed callback; legacy component availability does not imply use on every active flow |
| VerificationSummaryModal |fixed z110, black40% blur-sm; white max-w-lg, radius24, p32; shadow `0 8px 32px rgba(0,0,0,0.18)` | section approval/rejection/pending summary; revert/submit busy disables actions; pending count gates final submit |

Upload section field variants are distinct: LegalUploadFile, AgricultureReportUploadFile, LandAndBoundariesUploadFile, ValuationUploadFile, LocalIntelligenceUploadFile. They share a header16→md18px, subtitle12→md14px, border divider, internally scrolling body and next/back actions. Next is disabled when `!isNextEnabled`. Their detailed controls (selects, radio-like pills, tags, numeric sanitization, conditional boundary fields, cover/land image picker) are listed by module in Appendix 18; do not assume the same schema for each report.

### 7.7 Maintenance components and dialogs

Maintenance uses local native controls and literal colors. It does not consistently reuse the shared Button/Input/Card primitives.

| Component | Existing specification | States / usage |
| --- | --- | --- |
| MaintenanceNavbar | sticky top0 z40; white, bottom `#EAEAEA`, shadow-xs; px24→sm32→lg40→xl48, py14; logo h40; nav13px600 px20 py8 pills | three links; active blue `#1E75BB`/white; inactive `#4B5563`, hover gray;40px bell/avatar; notification popover w72(default288px), profile w56(default224px); no mobile menu |
| ProjectsTimelineCard |white, radius24,1px `#ECEFF2`, p24, shadow-xs, min-height380; title15px800 uppercase; progress rows | row hover translate-x1(default4px); click callback shows info toast on dashboard |
| ProjectDistributionCard |same card shell;190px chart region; Recharts donut and local tooltip | data-driven category colors/values; no independent responsive breakpoint |
| OperationsOverviewCard |same card shell; year/category dropdowns; large metric and area chart | year/category selection state and chart tooltip;30px metric at sm; axes11px `#94A3B8` |
| PipelineStepper |white, radius24, p16→sm20, scroll-x; min inner860px; stages min160px, h100, radius18, p16 | stage hover border blue40%, shadow-md; icon36px scale1.05; count24px; click opens detail modal; click div has no keyboard semantics |
| ServiceRequestCard |white, h255, radius22, p20, border `#EAEFF4`, shadow-xs→hover shadow-md | service icon32px; title15px700→blue hover;38px action blue→`#1864A0`,12px700; New/Verification/Quotation/Customer Response variants via props; not the current main requests table |
| WorkOrderInProgressDetail |nested detail with request breadcrumb, data card, services, image/media, completion/progress data | progress width comes from percentage, publish disabled with no services; md header stacking and lg12 grid; parent API behavior determines visible data |
| WorkOrderCompletedDetail |completed status, document/payment summaries and timeline | local composed view; not independently routed; no current entry import reachability detected |

Dialog family: fixed full-screen overlay, white surface, mostly28px radius, border `#ECEFF2`, shadow-2xl, p24→sm32. Backdrop black35–45%, blur-xs. Declared fade/zoom classes are **unconnected animation declarations** (see §11). Visible controls and conditional rendering exist independently of these classes.

| Dialog module | Width / radius / padding | Particular content / actions |
| --- | --- | --- |
| AssignFieldOfficerModal | inspect per-file shell; lg12 grid with6/6 halves; sm padding28/32 | service selection, officer selection/search, assign; disabled while assigning |
| AssignmentSuccessModal |max440px, radius24→sm28, p24→sm32 |green48px icon tile; land/officer/date summary; close/done |
| GeneratedEstimationModal |max620px, radius28, p24→sm32 |land details and estimated services grid→sm2; submit flow |
| EstimationSuccessModal |max390px, radius28, p24→sm28, z60 |blue56px success circle/check28px |
| WorkOrderPublishSuccessModal |max440px, radius28, p32 |blue64px circle/check32px |
| ServiceRequestFilterModal |max-w-2xl(default672px), radius24; header px24 py16 |service/date-range tabs; sm192px sidebar; hand-built calendar; Apply/Reset/close |
| UnderVerificationDetailsModal |max580px, radius28, p24→sm32 |service/land detail content |
| QuotationStatusDetailsModal |max620px, radius28, p24→sm32 |status/history, service-specific details |
| PipelineDetailModal |max-w-2xl, radius24, p24, max-height85vh |fixed heading and scrolling body; close |
| MaintenanceUpdatePasswordModal |max420px, radius28, p28→sm32 |password reveal and validation; disabled loading |
| MaintenanceLogoutModal |max380px, radius28, p32, black35% overlay |red56px circle, logout/cancel |
| Quotation page inline confirmations |max480px success; max520px all-approved, max-height90vh |all-approved dialog has role/aria-modal/aria-labelledby and close label; no evidence of full focus trap |

### 7.8 Feedback, images and unsupported primitives

`RouteErrorBoundary` provides a centered max-w-xl card,16px radius, p32; warning icon64px; reload/home shared buttons; expandable technical details. It has no aria-expanded on the details toggle. Global route loader: full viewport gray-50/50 + blur-sm,40px spinner, Loading text14px500 + pulse; semantic theme classes in it require repair.

`S3Image` resolves bare keys with a presigned-url query, falls back on absent URL/query error/img error, supports `avatar` (external pravatar URL), `cover` (local farmland1.png) and `none` (empty string). It does not add aspect ratio, radius, loading skeleton, dimensions, or meaningful alt text automatically; callers pass those props. No lazy-loading default is implemented.

Sonner is mounted globally top-right with richColors. Some callers use toast.success/error/info. Exact library toast dimensions, duration, colors and focus/announcement behavior remain library defaults and are unverified at runtime.

There is no shared Accordion, Badge, Avatar, Progress, Tooltip, Popover, Dialog, Skeleton, EmptyState, DataTable, Select, Checkbox, RadioGroup, Switch, Slider, OTP or DatePicker module in `src/components/ui`. Local versions exist where enumerated. The profile switch is a local component. Calendars are hand-built or native date inputs; installed React Day Picker is not proof of a project date-picker implementation. No slider/OTP shared interaction was found.

### 7.9 Component state matrix

Legend: **I** = implementation verified in source; **N** = no explicit component implementation; **B** = native/browser behavior only, not visually verified; **NA** = not applicable; **D** = classes declared but animation wiring unresolved. Focus is not guaranteed simply because an element is clickable. Per-module selector and disabled-condition evidence is included in Appendix 18.

| Component / family | Default | Hover | Focus | Active / selected | Disabled | Loading | Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shared Button (all15) |I|I opacity|I ring|I pressed|I|I spinner+disable|N|
| BackButton |I|I lift/shadow|B button|I reset|B native prop only|N|NA|
| Shared Input |I|N|N outline removed|B native input|B native prop only|NA|N|
| Base Card / Typography |I|NA|NA|NA|NA|N|NA|
| Farmland card local action |I|I gray|B button|N|N|N|N|
| Sidebar links |I|I|B link|I pathname|N|NA|NA|
| Sidebar logout/profile divs |I|I|N|N|N|NA|NA|
| Current review display fields |I|NA|NA/readOnly input B|I selected data display|NA|NA|N|
| Legacy editable dropdown/radio |I|I|N div|I local state|N|NA|N|
| Native upload inputs/selects |I|varies|I border in many; other fields N|B native|varies by control|N field; parent overlay I|toast/page validation varies|
| UploadFile dropzone/list |I|I choose/delete/download|B button, dropzone N|I drag background|I download busy|I download spinner|I invalid-file toast|
| Comments textarea/voice |I|I voice opacity|N textarea outline removed|I listening state|N|I mock listening pulse|N|
| Review tab buttons |I|I|B button|I active/status|N|NA|I rejected indicator|
| FooterActions |I|I|B button|I reverted status|I submitting|I text|I reason/status display|
| RejectModal |I|I confirm|I textarea border|I input state|N blank confirm not disabled|N|N inline; nonblank guard|
| Summary modal |I|I local controls|B buttons|I status|I pending/busy|I labels|I rejected/pending summary|
| Profile switch |I|N explicit hover|I green ring|I checked|N|N|N|
| Profile form |I|I actions|I ring on fields|I editing|I save/upload/password|I skeleton/spinner|I local/API feedback|
| Maintenance nav |I|I|B links/buttons|I active tab|N|NA|NA|
| ServiceRequestCard |I|I shadow/title/button|B action button|I status data|N|N|N|
| Pipeline stage |I|I|N click div|I modal selected|N|NA|NA|
| Maintenance table/pagination |I|I local controls|B buttons; search outline removed|I stage/filter/page|I page/busy|I spinner/text|API-dependent; not uniform|
| Maintenance filter/calendar |I|I|B buttons|I range/services|N universal|NA|N|
| Maintenance password modal |I|I|local focus declarations|I reveal|I busy|I spinner/text|I validation|
| Other maintenance modals |I|I local actions|B native controls|I open/close|varies, see module|varies, see module|varies, see module|
| Notification popovers |I|I rows|B trigger, N rows|I open|N|N|N|
| Charts |I|I tooltip where declared|Unverified library behavior|local period/year I|NA|N shared|N shared|
| RouteErrorBoundary |I|I actions|I shared Button|I details expanded|NA|NA|I route failure|
| Declared entry animations |visible conditional render I|NA|NA|D fade/zoom|NA|NA|NA|

**Recommended:** implement missing focus, loading announcements, keyboard patterns and validation consistently; this matrix is not permission to silently change existing components during a documentation task.

## 8. Navigation Patterns

### Super-admin rail

Configured in `src/core/config/layoutConfig.ts`; `useRoleLayout` reads Redux role and falls back to SADMIN. Items: Dashboard, Assigned Farmlands (`/super-admin/farmlands`), Farmlands List, Draft Farmlands, User Management, Pool Buying, Upload. `SIMPLE_MODE` hides Dashboard/User Management/Pool Buying from this item list. Routes remain declared.

Rail appearance: 48px targets,12px radius,22px icons; SVG images opacity80% and filter brightness0 invert0.7; Lucide stroke1.5. Active NavLink uses `#2D3032`, inactive gray and hover `#252729`. There is no expanded/collapsed rail state or mobile drawer. Logout/profile are clickable divs. Parent delegated logout clears credentials; do not copy only the child navigate call as the full logout behavior.

### Maintenance top navigation

Dashboard/Service Requests/Work Orders. Base path is `/maintenance/preview`, `/super-admin/maintenance`, or `/maintenance` depending on current pathname. Active tab is normally an explicit prop. The component defaults activeTab to dashboard, so its fallback pathname detection does not override that default when no prop is supplied. Profile dropdown's My Profile link is hardcoded to `/maintenance/profile`, even from preview/alias routes. This is an existing routing inconsistency.

### Secondary navigation

Document workflows navigate six ordered sections: Customer Information, Legal Documents, Agriculture Report, Land & Boundaries, Valuation, Local Intelligence. Verification root highlights by pathname; section tabs select a report subsection. Customer Information has Owner/Family/Land content. Upload workbench uses related stepper and tabs with its own flow state.

List pages use local pill tabs and filter controls. Maintenance requests switches New Requests/Quotations/Customer Response and persists relevant filter values through URL logic. Pagination varies: farmland pages previous/next; maintenance tables numbered pages/rows-per-page. There is no shared Pagination or Breadcrumb component. Breadcrumb-like labels are sometimes text only (header), sometimes button chains (maintenance detail). BackButton always needs a caller handler; a “Go back” label does not guarantee browser history navigation.

No bottom navigation, hamburger navigation, global search results screen, or universal footer was found.

## 9. Forms & Validation

### Form families and field states

Authentication uses local controlled native inputs and custom wrapper divs rather than shared Input. Forms validate required credentials/email; login requires at least6 password characters in super-admin; password-change validates confirmation and matching. Authentication has five internal screen states per portal: login, forgot-password, forgot-success, update-default, change-password. These are not separate routes. Password visibility is controlled by Eye/EyeOff buttons. Errors use inline text and conditional borders; API failures have local feedback. Announcement/association is not consistently implemented.

Upload owner/family controls include text, tel, email, native date/select and file inputs. Many section-specific amounts use string sanitization to digits/decimal point; contact fields use digits and maxLength10; many free-text section fields use maxLength50. These do not by themselves validate a numeric range, currency precision or valid telephone number. Comments cap at500. Required “Next” readiness is caller-controlled with `isNextEnabled`; verify each section's field conditions.

Current verification is primarily read-only, with reject reason and approval actions. Its displayed DropdownField/RadioGroupField are not operable selects/radios. The legacy family with identical export names is interactive and has different keyboard limitations.

Maintenance quotations use editable vs read-only per-service data. Input fill becomes `#F1F5F9`, text `#475569`, cursor-not-allowed via read-only variants; controls use border `#CBD5E1`, focus `#1877F2`, radius10/12/16px depending on field. Busy save/approve/review actions disable. Organic crop selection is required in its save path. Do not infer server validation from this client guard.

### Upload behavior

`UploadFile.validateFiles` accepts MIME `image/*` or extensions pdf/docx/doc/png/jpg/jpeg, and limits **5 × 1024 × 1024 bytes**; displayed label says5MB. Invalid files produce Sonner errors. Accepted files are repackaged into DataTransfer and passed to the parent. Upload input resets to allow reselecting the same filename. A custom `onUploadClick` can override native file browsing. File grouping separates cover/land/other when enabled. “Uploading” status/progress fields in the data interface do not establish a visible progress bar in FileListItem.

The Choose File button relies on bubbling to the clickable dropzone; preserve that interaction if reproducing. **Recommended:** provide a direct onClick and accessible keyboard-operable drop target as an explicit improvement.

### Validation requirements for new work (Recommended)

Associate labels using htmlFor/id; connect error/helper text with aria-describedby; apply aria-invalid; announce asynchronous results and provide a clear retry path. Use actual form semantics and explicit button types. Add focus styles where outlines are removed. Preserve the existing section spacing/radius/color family while improving semantics. Do not add mock dictation to production features as if it were a working voice-input capability.

## 10. Icons & Assets

### Icon conventions

**Existing:** Lucide outline icons plus inline SVGs and local files. There is no globally imposed stroke width. Rail22px/stroke1.5; header bell16→18→21.6px/stroke1.8; shared BackButton20/24/28px/stroke1.4; common action icons16/18/20px; maintenance icons often stroke2.2 or2.5; success checks stroke3 or4. Icon color is usually currentColor or explicit SVG fill/stroke; imported images use their intrinsic colors or filters.

Containers: rail48px rounded12; header notification40→44→52px circle; maintenance service32px circle with16px icon; pipeline36px rounded12; file icon38px white rounded4. Gaps commonly6/8/10/12px depending on component. LeftIcon/rightIcon slots do not force a universal icon size. Decorative SVGs often lack explicit aria-hidden except selected header illustrations; label icon-only actions explicitly on new screens.

**Recommended:** continue Lucide for new functional icons, preserve the local icon size/stroke of the chosen family, use aria-hidden on decorative icons and an accessible name on the control. Avoid inventing a new icon style to fill a missing token.

### Asset treatments

Farmland photos use object-cover, commonly200px or180px heights in cards. Avatars use object-cover and rounded-full, with borders/rings varying by profile. Hero illustration is object-contain,45% width capped400px, full header height, alt empty and aria-hidden. Login main image is CSS background-cover/background-center with20% black overlay. Maps use MapLibre or SVG/image-backed mock representations depending on screen; a static map asset is not a live map implementation.

`public/` paths are referenced from `/...`; `src/assets/` images are module imports. S3Image is the current helper for remote stored file keys. Asset filenames include spaces and the existing misspelling `sucess.svg`; retain actual paths. Full asset inventory and intrinsic dimensions are in Appendix 18. There is no universal image aspect-ratio or responsive-image srcset policy. External avatars/Unsplash photos and local fallbacks coexist.

## 11. Motion & Interaction

No Framer Motion imports or project-defined CSS @keyframes were found. CSS transitions and Tailwind animation utilities are the actual authored mechanisms. `tw-animate-css` is listed in package.json but not imported. Therefore `animate-in`, `fade-in`, `zoom-in`, `zoom-in-95`, `slide-in-from-*` declare intended effects but their animation keyframes/utilities are not established. Conditional dialogs still render; do not promise their entry animation.

| Trigger / element | Duration | Easing / delay | Properties / behavior | Source / evidence class |
| --- | --- | --- | --- | --- |
| Hover/press/focus shared Button |150ms|ease-in-out; no explicit delay|all, opacity0.85, press scale0.97, focus ring|`button.tsx` Existing classes|
| Hover/press BackButton |200ms|Tailwind default easing; no delay|translateY(-1px)→0, filter drop-shadow|`BackButton.tsx` Existing|
| Rail link hover/active |200ms|default utility easing; no delay|background/text transition-all|`Sidebar.tsx` Existing|
| Header bell |200ms|default utility easing; no delay|transition-all, no distinct hover target declared there|`SuperAdminHeader.tsx`|
| Top performer hover |300ms|default utility easing; no delay|translateY(-8px)|`SuperAdminTopPerformers.tsx`|
| Upload farmland photo hover |500ms|default utility easing; no delay|transform scale1.05|`UploadFarmlandCard.tsx`|
| Maintenance service card hover |200ms|default utility easing; no delay|shadow and title/action color|`ServiceRequestCard.tsx`|
| Pipeline stage hover |200ms|default utility easing; no delay|border/shadow; child icon scale1.05|`PipelineStepper.tsx`|
| Progress-row hover |duration not explicit|utility default; no delay|translateX(4px)|`ProjectsTimelineCard.tsx`|
| Button/file/page spinners |imported default spin1s|linear infinite|rotate360deg|`animate-spin`, inferred Tailwind default|
| Profile skeleton/listening text |imported default pulse2s|cubic-bezier(0.4,0,0.6,1) infinite|opacity pulse|`animate-pulse`, inferred Tailwind default|
| Map fit/fly |1200ms|MapLibre defaults where not set; unverified|camera framing/fly transition|`SuperAdminUploadViewMaps.tsx`|
| Map marker pulse |1200ms|cubic-bezier(0,0,0.2,1), infinite|inline animation `ping`; keyframe emission unverified|map marker HTML string|
| Dialog/notification entry declarations |150/200/300ms where present|unverified because stylesheet unconnected|fade/zoom/slide declared only|per-module class catalog|
| Old global .nav-item |300ms|ease; no delay|all|`index.css:319`, legacy CSS declaration, current use not established|
| Old global .rejection-done-btn |background200ms/transform100ms|ease; no delay|background/press scale|`index.css:854`, legacy CSS declaration|

Tailwind's [default theme](https://tailwindcss.com/docs/theme) explains framework-supplied animation/transition defaults; these are **inferred library defaults**, not project motion tokens. No reduced-motion query, motion-reduce variant, universal page transition, scroll animation system, or shared animated accordion was found. Recommended: add reduced-motion handling and wire or remove unconnected animation declarations in a separate change. Do not add exit animations when existing dialogs immediately unmount.

## 12. Responsive Guidelines

The project imports Tailwind defaults and does not override breakpoint definitions. Inferred framework breakpoints: **sm40rem (640px), md48rem (768px), lg64rem (1024px), xl80rem (1280px), 2xl96rem (1536px)** at16px root. See [Tailwind responsive reference](https://tailwindcss.com/docs/responsive-design). Legacy CSS contains explicit min-width768px and1024px rules; they do not prove current workbenches reflow.

| Component / pattern | Base / mobile | sm / tablet | lg / xl / desktop | Limitation |
| --- | --- | --- | --- | --- |
| Super-admin rail |same76px rail|same|same|no drawer/collapse; reduces mobile content width|
| Header |400px tall; title28px|sm30px; small spacing changes|lg32/xl36/2xl40px; search/bell enlarge|no mobile-specific hero removal|
| Farmland grids |1 column|md2|usually lg3/xl4; some lg4|page-specific rules vary|
| Dashboard charts |1 column|same until xl|xl1.2fr/1fr|widgets may retain min-width|
| Login |photo35vh, min280px over form; scroll|min same|lg side-by-side,90vh, max920px|forms can exceed constrained height|
| Owner upload fields |1 column|md2|lg3|inside fixed-width workbench frame|
| Verification root |280px stepper +320px tabs +flex report|no root stacking|same|**no responsive root implementation**; not phone ready|
| Upload root |280px stepper +320px report tabs for report pages|no root stacking|same|**no responsive root implementation**|
| UploadFile |1 column|same|xl2 unless hideDropzone|responsive inside potentially constrained parent|
| Review report typography |heading16/support12|md18/support14|lg body px40 py24|text adjustment does not fix root overflow|
| Maintenance navbar |brand text hidden; all three links retained|sm text visible, gaps grow|padding grows|no menu or wrap/scroll declared; can overflow|
| Maintenance dashboard |1 column|md2; operations span2|lg12 spans4/3/5|genuine grid adaptation|
| Maintenance tables |horizontal scroll|min-width retained|same schema|not card stacking|
| Pipeline |scroll-x, min860px strip|same|fits if room|intentional horizontal strip|
| Maintenance filter modal |stacked sidebar/content|sm row; sidebar192px|same|calendar keyboard behavior incomplete|
| Maintenance dialogs |w-full, max constraints, p24|sm larger padding/radius/fonts|some lg12 split|not every dialog has max-height/scroll|
| Pool create |map/form stack|same|lg row, form290px|some map interactions pointer-specific|
| Pool created/published |fixed heights/local widths|no module breakpoints|same|do not infer full mobile adaptation|
| Upload map modal |bottom-aligned edge-to-edge|md padded sheet, rounded36|same|map controls remain dense|
| User/agent profiles |stacked|md row/grids|same|some identity widths/min-width retained|

Clamps use viewport width and height, not breakpoints. Keep exact clamp expressions when extending a matching control; do not replace them with arbitrary fixed values. Touch targets vary: rail48px; primary44px minimum; maintenance bell40px; many badges/actions26–38px; close/removal targets can be14–32px. **Recommended:** evaluate WCAG target-size exceptions and adjust insufficient controls as an explicit improvement, while preserving visible icon dimensions.

## 13. Accessibility Guidelines

Reference: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), with AA as the recommendation target. This is a source audit, not a certification or a completed assistive-technology evaluation.

### Verified implementations

- Shared Input generates stable ids and binds its optional label.
- Shared Button supports native disabled and visible keyboard focus ring.
- Profile CustomToggle is a native button with role switch and aria-checked; its thumb is aria-hidden; it supplies focus ring. Its accessible naming must still be checked at usage sites.
- Header notification button has aria-label; hero illustration is decorative via alt empty and aria-hidden.
- Tables use actual table/thead/tr/th/td elements in the inspected table implementations.
- A maintenance quotation all-approved dialog supplies role dialog, aria-modal, aria-labelledby and a labeled close button.
- Many content images supply alt text; S3Image passes through alt but defaults to empty.

### Source-identified issues and recommendations

| Finding / evidence | Consequence | Recommended fix |
| --- | --- | --- |
| Shared Input removes outline; login and many upload fields do likewise | keyboard location not consistently visible | add focus-visible/focus-within ring or contrasting border; verify per background |
| Sidebar logout/profile, stepper rows, legacy selects/radios and pipeline stages use click divs | unavailable via normal keyboard semantics | native button/link; proper accessible names and keyboard patterns |
| Most custom modal overlays lack role/name/focus management | focus can escape; context not announced; return focus absent | shared accessible dialog with trap, Escape, initial focus and restoration |
| Tabs visually active without tablist/tab/aria-selected in many places | selection/arrow-key behavior not exposed | implement proper tab pattern or use normal navigation links with current-page semantics |
| Errors and busy states often lack aria-invalid/describedby/live region | error context and asynchronous updates may be missed | associated error text and announcements |
| Icon-only close, voice, remove, profile and other controls frequently rely on title or no name | inconsistent screen-reader naming | explicit aria-label/visible text; decorative SVG hidden |
| Upload dropzone clickable div; file input display none | broad drop area not keyboard operable | labeled input/button with direct activation; accessible drag alternative |
| Chart meaning primarily graphical; no universal accessible table fallback | data unavailable to some users | equivalent textual totals/table/labels; test Recharts keyboard output |
| Scrollbars hidden universally | scroll affordance lost | visible scrollbars for overflowing workbenches/tables |
| No reduced-motion handling | motion preferences ignored | prefers-reduced-motion for pulses/zoom/translation and map motion |
| Small captions9–11px and small action targets | readability/operability risk | review with zoom, reflow and target-size testing |

### Computed contrast examples

The values below are arithmetic sRGB contrast calculations for **opaque declared color pairs**, not a browser contrast audit. They do not account for gradient positions, overlays, hover opacity, image content, anti-aliasing or fallback fonts. AA normal-text target is4.5:1; large-text target3:1. Recommendations are based on the [WCAG contrast criterion](https://www.w3.org/TR/WCAG22/#contrast-minimum).

| Foreground | Background | Ratio | Context | Interpretation |
| --- | --- | --- | --- | --- |
| #FFFFFF | #2780C4 | 4.22:1 | Shared primary Button | Below normal-text ratio; needs review |
| #FFFFFF | #1E75BB | 4.86:1 | Maintenance navbar/action | Meets opaque normal-text ratio |
| #FFFFFF | #1877F2 | 4.23:1 | Maintenance brighter action | Below normal-text ratio; needs review |
| #10B981 | #E8F8F0 | 2.31:1 | ServiceRequestCard accepted11px badge | Below normal-text ratio; needs review |
| #7A8699 | #F8FAFC | 3.52:1 | Maintenance dashboard supporting text | Below normal-text ratio; needs review |
| #191B1C | #FFFFFF | 17.29:1 | Root primary text | Meets opaque normal-text ratio |
| #2D3409 | #E6EEAD | 10.70:1 | Workflow dark text on lime | Meets opaque normal-text ratio |

Focus contrast, full-page contrast, accessible names, screen-reader behavior, focus order,200%/400% zoom, actual mobile reflow and WCAG target exceptions remain **unverified**. WCAG2.2 AA target minimum is24×24 CSS pixels subject to exceptions;44×44 is a useful stronger recommendation, not the AA target-size threshold.

## 14. Page & Screen Patterns

### Template selection

| Screen family | Composition | Loading / empty / error behavior |
| --- | --- | --- |
| Super-admin dashboard |shell +optional400px header +KPI/status +sales/subscriber/podium cards|mostly supplied mock dashboard data; route Suspense/error boundary available|
| Farmland directories |shell +optional hero +search/filter +responsive land-card grid +local pagination|API spinner and no-results text on API-backed pages; draft page distinguishes loading/error/empty|
| Farmland assigned detail |back/header +large image/status +land/customer/agent data +verification action|fetch spinner/not-found, mutation busy/approved state|
| Public/listed detail |back +property card/details +follow-up interactions|mostly local composition/mock data in places; do not assume API retry semantics|
| User directory/profile |optional hero/list rows or centered identity/detail card|many mock-data directory surfaces; S3Image fallback; editable own profile has skeleton/busy states|
| Pool buying |optional hero +list/grid; create map editor and form; created summary; published confirmation; pool/investor detail|localStorage and route-state/mock compositions; distinct screens, not a general backend contract|
| Upload landing/setup |land-card list→land metadata/parent-child setup→map drawing|API spinner, no-data/pagination; map search/loading/confirmation controls|
| Upload reports |UploadDocsRoot +280px stepper +320px section list +flex report/form/upload/comments +footer|uploaded file empty state; legal page upload overlay; next gating; save draft and submit dialogs|
| Verification reports |standalone root +280px stepper +320px tabs +read-only files/data/comments +approve/reject footer|API-driven section state, download busy, summary pending/rejected/approved; rejection modal|
| Maintenance dashboard |sticky navbar +page title +12-column card composition +pipeline|mock timeline/distribution/pipeline; operations year chart; no shared full-dashboard skeleton|
| Maintenance requests |navbar +title/search +filter pills/stage tabs +table +pagination +dialogs|Loading stage..., No data is available, Reset Filters; busy row verification|
| Maintenance quotation |navbar +breadcrumb +land/request header +service selection +editable/read-only estimate form +approve dialogs|saving/approving/reviewing disabled states; toasts; inline success/all-approved dialogs|
| Maintenance customer response |navbar +breadcrumb +per-service response details +move-to-work-order|customer approval guard; busy move; toasts|
| Maintenance work orders |navbar +title/filter +table/page; id selects in-progress detail|pagination disabled boundaries; progress and publish behavior local to detail component|
| Maintenance profile |back +banner/avatar +grid fields +password/logout modals|local edit controls and password API states; no universal profile skeleton|
| Authentication |responsive photo/form split,5 internal form/result states +security footer|inline field/API errors, busy submit, password reveal and success states|

### Screen-specific exceptions

- `SIMPLE_MODE` suppresses headers and selected filters on several super-admin pages, plus three rail links. `UploadSuperAdmin` retains its header without using SIMPLE_MODE. Hiding a rail item does not remove its route.
- `/super-admin/assigned-farmlands/:id` occurs once as detail and once as verification parent; nested report paths select the verification branch. Preserve route structure; avoid assuming the index of the verification parent renders its first report automatically.
- Upload process parent has no declared index child; callers should navigate to a concrete report path.
- Seven alternative page modules are outside the static entry import graph: dashboard `SuperAdminCustomerInformation`, five `legal-docs/pages/*Flow` modules, upload `LegalUploadDocument`. Their styling is documented for context and reuse analysis, not as reachable screens.
- The confirmation modal inside the current verification pages directory is a component, not an extra routed screen.
- Maintenance preview aliases reuse production page modules; public routing does not imply backend calls succeed without authentication.
- Pool-created and pool-published modules have no breakpoint-prefixed classes; their existence is not evidence of mobile reflow.

The exhaustive route-to-screen ledger and exact per-screen utility specifications follow in Appendix18. A new screen should start from the matching family above, then follow the closest module specification rather than combining unrelated families.

## 15. Design Consistency Audit

The table separates **existing implementation** from **recommended standard**. No recommendation below has been applied to application code.

| Issue | Location | Existing implementation | Suggested standard (Recommended) | Priority |
| --- | --- | --- | --- | --- |
| Fixed three-column workbenches on small viewports | verification/upload `index.tsx`, section lists |280px rail +320px tabs +content +80px margins; root overflow hidden | define stacked/drawer navigation and accessible panel scrolling | High |
| Focus visibility missing | shared Input, login, Comments and local controls | outline-none without replacement in several controls | family-matched focus-visible/focus-within tokens | High |
| Clickable nonsemantic controls | Sidebar, SharedUI stepper, PipelineStepper, legacy FormFields | div onClick/no keyboard handler | native button/link and appropriate selection semantics | High |
| Dialog accessibility fragmented | custom modals across features | mostly no role/trap/Escape/return focus | one accessible dialog foundation retaining each appearance | High |
| Disconnected Tailwind JS aliases | index.css/tailwind.config.js |v4 CSS import without @config or equivalent custom @theme mapping | deliberately wire legacy config or migrate aliases; verify generated CSS | High |
| Missing semantic classes/variable | AppRouter, Card, SuperAdminFarmlandCard |border-primary, text-muted-foreground, text-foreground; undefined border-strong | connect real theme names/aliases and verify computed styles | High |
| Declared entry animations lack stylesheet | modal/notification classes, index.css |tw-animate-css dependency without import | import tested animation CSS or replace with owned keyframes | Medium |
| Font declarations differ from loaded assets | main.tsx, Inter/Outfit/Poppins uses, bold headings | only Jakarta400/500/600, Manrope700 imported | load intended weights/families or explicitly consolidate with approval | High |
| Primary blue differs by feature | Button, maintenance navbar/tables |#2780C4,#1E75BB,#1877F2 and distinct hover values | document feature semantic aliases before consolidation | Medium |
| Multiple olive/success vocabularies | review/upload/legacy/maintenance |#BDD327,#A3C33D,#8DC63F,#16A34A,#10B981 | distinguish workflow accent from semantic success | Medium |
| Token vs current header drift | --header-gradient vs SuperAdminHeader |blue-gray token, green-gray inline gradient | choose explicit current header token in future refactor | Medium |
| Duplicate verification families | legal-docs vs farmLandDocsverification |same named Layout/FormFields/Icons/Modals with different editable behavior | one tested readOnly/editable architecture after route verification | Medium |
| Duplicate auth compositions | both login modules |five-state flows and similar form/photo layout copied | shared auth layout/fields with portal-specific behavior | Medium |
| Repeated field/button/dropdown styles | upload report components, maintenance, pool |8/10/12/16px field radii, various heights and hardcoded classes | consolidate within family; do not force one cross-feature form style | Medium |
| Tiny contrast/target risks | accepted badge, small text, pill/remove actions |11px #10B981 on#E8F8F0;14px remove buttons;24–31px pills | improve contrast and interactive hitboxes after review | High |
| Loading/error/empty handling uneven | list/API screens |some spinners/toasts; many mock-only/empty states; no universal retry | shared status pattern with clear retries and announcements | Medium |
| Hidden scroll affordances | index.css universal rules |scrollbar-width:none, WebKit display:none | preserve visible overflow indicators | Medium |
| Z-index escalation | workflows, image picker, modals |40,50,60,110,9999,99999 | reviewed semantic layer registry; portal dialogs consistently | Medium |
| Inconsistent modal widths/radius/scroll | custom modal families |fixed500/600px vs max-width;24/28/32px; some lack viewport cap | family-specific size variants with max-height and scroll | Medium |
| Current review footer prop mismatch | SharedUI FooterActions |isApproved accepted but not used to disable approve | clarify state contract before reusing | Medium |
| Mock voice input exposed | upload Comments |2s delayed fabricated dictation text | implement actual dictation or remove capability affordance | Medium |
| Demo notification interaction | SuperAdminNotificationsDropdown, MaintenanceNavbar |static data; Refresh button has no handler; some rows no action | explicit real-data/empty/refresh behavior | Low |
| Profile link escapes preview/alias | MaintenanceNavbar |My Profile hardcoded /maintenance/profile | preserve selected basePath | Medium |
| Unused large stylesheet and old pages | index.css, legacy page families |many fixed-coordinate definitions with no current consumer | remove only after build/runtime reachability and visual review | Low |
| Misleading helper token names | --text-muted-strong |0.4 alpha vs muted0.6 | rename by actual contrast role in migration | Low |

No Critical issue is asserted: source-only review is insufficient to establish a catastrophic user impact. High items above are supported implementation/accessibility risks.

## 16. Implementation Guidelines

**Existing patterns to preserve:** `@/` alias; feature-local components under the owning sub-feature; `cn` for conditional classes/overrides; forwardRef on shared input/button primitives; RTK Query data state at screen/container level; native props forwarded by primitives; explicit image fallbacks via S3Image; route-based document flow composition.

**Recommended development policy:**

1. Select the correct screen family and inspect its latest source. Match its container/scroll ownership before styling children.
2. Reuse Button/Input/Typography/Card where their API and actual appearance match. Maintenance and upload native controls are different current patterns; do not silently restyle them to the global primitive during unrelated work.
3. Use existing CSS variables with explicit arbitrary utilities. Do not invent semantic utility names that the compiler does not generate.
4. Prefer the current active verification family. Do not import legacy editable FormFields into read-only review just because names match.
5. Preserve actual component dimensions, type, radii, colors and responsive prefixes. Extend a variant only when existing variants cannot express the requested behavior.
6. Treat data states separately: backend loading, mutation submitting, no results, error, partial data and successful completion. Never present a hardcoded mock response as verified backend behavior.
7. New functionality should include accessible semantics, focus behavior and feedback. Mark any deliberate improvement from this snapshot in its change description and update this document.
8. Do not install animation, icon or component packages merely to reproduce an existing source pattern. Dependencies in the manifest alone are not a reusable API.
9. Keep narrow viewport behavior explicit; the existing workbench has gaps, not a mobile guarantee. New mobile requirements need a concrete reflow design.
10. Update the relevant component/page entry and audit status when changing a visual contract.

### Existing-pattern screen composition example

This is an **illustrative new composition**, not a new existing route or token definition. The wrapper matches multiple current list pages; slots still need screen-specific content and state handling.

```tsx
import { Button } from '@/components/ui/button';
import SuperAdminHeader from '@/features/super-admin/components/SuperAdminHeader';
import { SIMPLE_MODE } from '@/core/config/featureFlags';

export function ExampleListScreen() {
  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {!SIMPLE_MODE && <SuperAdminHeader title="SUPER ADMIN" breadcrumb="Farmlands" />}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight">Farmlands</h2>
        <Button type="button" variant="outline-primary">View All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Existing land cards and screen-specific loading/error/empty branches. */}
      </div>
    </div>
  );
}
```

## 17. New Screen Creation Guidelines

Before implementation, read this document and inspect one routed screen from the same family. Identify the route guard and shell; choose whether the rail belongs on the page; use a concrete workflow child route for document screens. Select card and form families from §7, copy exact spacing/type conventions, and use §3 tokens that are actually defined.

For every new screen, specify:

- Page title and semantic hierarchy; where inherited Manrope h1 should be overridden.
- Container width, height and scroll ownership; grid behavior at actual breakpoints.
- Primary/secondary/destructive actions and exact supported variant/API.
- Label, input, help/error association and disabled/busy behavior.
- Loading, error, retry, empty, partial-data and success branches appropriate to its data source.
- Keyboard operation, visible focus, dialog focus restoration and icon-only action naming.
- Image aspect/height, crop, fallback and meaningful alt text.
- Motion source/duration and reduced-motion behavior for any new effect.
- Small-screen layout, zoom/reflow, horizontal-table scrolling, and touch-target checks.

Recommended verification viewports: narrow phone, tablet, desktop, plus immediately below/above relevant breakpoints (e.g.767/768 and1023/1024). These are a future test plan, not completed runtime checks from this audit. Compare against the closest existing screen at identical viewport and feature mode. Avoid incidental standardization; record intentional deviations and update Design.md.

## 18. Reference Appendix

### 18.1 Route ledger

All explicit route paths in `routes.definitions.tsx` are listed below. `guestRoutes` is guest-guarded, `authRoutes` authenticated, `publicRoutes` includes maintenance preview aliases. The same visual module is intentionally referenced by multiple paths. Parent document paths without index children are workflow shells, not extra leaf screens.

| Path | Element | Access / role | Module |
| --- | --- | --- | --- |
| `/login` | `SuperAdminLogin` | Guest | [src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx) |
| `/super-admin/login` | `SuperAdminLogin` | Guest | [src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx) |
| `/maintenance/login` | `MaintenanceLogin` | Guest | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx) |
| `/super-admin/maintenance/login` | `MaintenanceLogin` | Guest | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx) |
| `/maintenance/dashboard` | `MaintenanceDashboard` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx) |
| `/super-admin/maintenance/dashboard` | `MaintenanceDashboard` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx) |
| `/maintenance/service-requests` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/super-admin/maintenance/service-requests` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/service-requests/new-requests` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/super-admin/maintenance/service-requests/new-requests` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/service-requests/quotations` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/super-admin/maintenance/service-requests/quotations` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/service-requests/customer-response` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/super-admin/maintenance/service-requests/customer-response` | `MaintenanceServiceRequests` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/service-requests/verify/:id` | `MaintenanceVerifyRequest` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx) |
| `/super-admin/maintenance/service-requests/verify/:id` | `MaintenanceVerifyRequest` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx) |
| `/maintenance/service-requests/quotation/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/super-admin/maintenance/service-requests/quotation/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/service-requests/quotations/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/super-admin/maintenance/service-requests/quotations/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/service-requests/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/super-admin/maintenance/service-requests/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/maintenance/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/super-admin/maintenance/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/maintenance/quotation/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/super-admin/maintenance/quotation/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/quotations/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/super-admin/maintenance/quotations/:id` | `MaintenanceQuotationDetails` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/work-orders` | `MaintenanceWorkOrders` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/super-admin/maintenance/work-orders` | `MaintenanceWorkOrders` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/maintenance/work-orders/:id` | `MaintenanceWorkOrders` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/super-admin/maintenance/work-orders/:id` | `MaintenanceWorkOrders` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/maintenance/profile` | `MaintenanceProfile` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx) |
| `/super-admin/maintenance/profile` | `MaintenanceProfile` | Authenticated | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx) |
| `/` | `DashboardRedirect` | Authenticated | [src/app/router/DashboardRedirect.tsx](src/app/router/DashboardRedirect.tsx) |
| `/super-admin/dashboard` | `SuperAdminDashboard` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx) |
| `/super-admin/upload` | `UploadSuperAdmin` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx) |
| `/super-admin/farmlands` | `SuperAdminFarmlands` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx) |
| `/super-admin/assigned-farmlands` | `SuperAdminAssignedFarmlandsList` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx) |
| `/super-admin/farmlands-list` | `SuperAdminFarmlandsListPreview` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx) |
| `/super-admin/draft-farmlands` | `SuperAdminDraftFarmlands` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx) |
| `/super-admin/farmlands-list/all` | `SuperAdminFarmlandsListFull` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx) |
| `/super-admin/users-list` | `SuperAdminUsersListFull` | Authenticated | [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx) |
| `/super-admin/users-list/all` | `SuperAdminUsersListAll` | Authenticated | [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx) |
| `/super-admin/edit-farmland-tag/:id` | `SuperAdminEditFarmlandTag` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx) |
| `/super-admin/assigned-farmlands/:id` | `SuperAdminAssignedFarmlandDetails` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx) |
| `/super-admin/upload/land-details/:id` | `SuperAdminUploadLandDetails` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx) |
| `/super-admin/upload/view-maps/:id` | `SuperAdminUploadViewMaps` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx) |
| `/super-admin/upload/process/:id` | `UploadDocsRoot` | Authenticated | [src/features/super-admin/sub-features/upload-docs/index.tsx](src/features/super-admin/sub-features/upload-docs/index.tsx) |
| `/super-admin/upload/process/:id/customer-information` | `SuperAdminUploadCustomerInformation` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx) |
| `/super-admin/upload/process/:id/legal-documents` | `UploadLegalDocuments` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx) |
| `/super-admin/upload/process/:id/agriculture-report` | `UploadAgricultureReport` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx) |
| `/super-admin/upload/process/:id/land-boundaries` | `UploadLandBoundaries` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx) |
| `/super-admin/upload/process/:id/valuation` | `UploadValuation` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx) |
| `/super-admin/upload/process/:id/local-intelligence` | `UploadLocalIntelligence` | Authenticated | [src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx) |
| `/super-admin/user-profile/:id` | `SuperAdminUserProfile` | Authenticated | [src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx) |
| `/super-admin/top-performers` | `SuperAdminTopPerformers` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx) |
| `/super-admin/farmlands-list/:id` | `SuperAdminFarmlandDetails` | Authenticated | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx) |
| `/super-admin/agent-profile/:id` | `SuperAdminAgentProfile` | Authenticated | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx) |
| `/super-admin/profile` | `SuperAdminProfile` | Authenticated | [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx) |
| `/super-admin/pool-buying` | `SuperAdminPoolBuying` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx) |
| `/super-admin/pool-buying/create` | `SuperAdminPoolCreate` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx) |
| `/super-admin/pool-buying/created` | `SuperAdminPoolCreated` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx) |
| `/super-admin/pool-buying/published` | `SuperAdminPoolPublished` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx) |
| `/super-admin/pool-buying/all` | `SuperAdminPoolBuyingAll` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx) |
| `/super-admin/pool-buying/:id` | `SuperAdminPoolDetails` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx) |
| `/super-admin/pool-buying/:id/investor/:investorId` | `SuperAdminPoolInvestorDetails` | Authenticated | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx) |
| `/super-admin/assigned-farmlands/:id` | `FarmLandDocsVerificationRoot` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/index.tsx](src/features/super-admin/sub-features/farmLandDocsverification/index.tsx) |
| `/super-admin/assigned-farmlands/:id/customer-information` | `SuperAdminCustomerInformation` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx) |
| `/super-admin/assigned-farmlands/:id/legal-documents` | `SuperAdminLegalDocuments` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx) |
| `/super-admin/assigned-farmlands/:id/agriculture-report` | `SuperAdminAgricultureReport` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx) |
| `/super-admin/assigned-farmlands/:id/land-boundaries` | `SuperAdminLandBoundaries` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx) |
| `/super-admin/assigned-farmlands/:id/valuation` | `SuperAdminValuation` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx) |
| `/super-admin/assigned-farmlands/:id/local-intelligence` | `SuperAdminLocalIntelligence` | Authenticated | [src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx) |
| `/maintenance/preview/dashboard` | `MaintenanceDashboard` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx) |
| `/maintenance/preview/service-requests` | `MaintenanceServiceRequests` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/preview/service-requests/new-requests` | `MaintenanceServiceRequests` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/preview/service-requests/quotations` | `MaintenanceServiceRequests` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/preview/service-requests/customer-response` | `MaintenanceServiceRequests` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx) |
| `/maintenance/preview/service-requests/verify/:id` | `MaintenanceVerifyRequest` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx) |
| `/maintenance/preview/service-requests/quotation/:id` | `MaintenanceQuotationDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/preview/service-requests/quotations/:id` | `MaintenanceQuotationDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/preview/service-requests/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/maintenance/preview/customer-response/:id` | `MaintenanceCustomerResponseDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx) |
| `/maintenance/preview/quotation/:id` | `MaintenanceQuotationDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/preview/quotations/:id` | `MaintenanceQuotationDetails` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx) |
| `/maintenance/preview/work-orders` | `MaintenanceWorkOrders` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/maintenance/preview/work-orders/:id` | `MaintenanceWorkOrders` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx) |
| `/maintenance/preview/profile` | `MaintenanceProfile` | Public preview | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx) |

### 18.2 Per-module screen and component specifications

This section is the coverage checklist and exact source-value catalog. Every TSX module is listed once; a check means its source was included in the static UI audit, **not** that it passed browser/accessibility testing. Source-class declarations are grouped by purpose and deduplicated within each module. A utility with a responsive/state prefix applies only under that condition. Read utility sequences together with the listed source snippets: this inventory deliberately does not flatten conflicting classes or claim a computed style.

- **Layout** includes flex/grid, alignment, overflow, positioning and visibility.
- **Size & spacing** includes all discovered width/height/min/max, padding, margin, gap and inset utilities, including arbitrary/clamp values.
- **Type** includes family, size, weight, leading, tracking, alignment and text overflow.
- **Appearance** includes colors, border, radius, shadow, opacity and filters.
- **Interaction / motion** preserves hover, focus, active, disabled, read-only, group-hover and animation classes verbatim. Their existence proves a declaration, not successful CSS generation or keyboard support.
- **State/control evidence** quotes declared disabled/readOnly/validation/ARIA/conditional UI branches with source line references. A component lacking a matching declaration has no explicit custom state verified here; native behavior may still apply.
- **Props** are local interface excerpts where supplied; callbacks and required data come from those source interfaces. No universal dimension/state is inferred when a wrapper delegates to children.

Entries outside the active import graph are labeled explicitly. Related root token values are resolved through §3. Arbitrary utility syntax uses underscores for spaces; do not replace underscores inside JSX classes with literal spaces.

#### Screen modules

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id`.

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx), [src/components/ui/typography.tsx](src/components/ui/typography.tsx), [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 35 | `flex flex-col items-center justify-center w-full min-h-screen bg-[#F9F9F9] text-[#2D3032]` |
| 36 | `w-8 h-8 animate-spin mb-4` |
| 37 | `text-[var(--text-primary)] font-medium` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `items-center`; `justify-center`; `overflow-hidden`; `box-border`; `justify-between`; `object-cover`; `flex-1`; `cursor-not-allowed`; `lg:flex-row`; `items-stretch`; `relative`; `absolute`; `justify-end`; `inline-flex`; `grid-cols-2`; `col-span-2`; `grid` |
| Size & spacing | `w-full`; `min-h-screen`; `w-8`; `h-8`; `mb-4`; `mt-4`; `px-4`; `py-2`; `h-screen`; `p-4`; `lg:p-6`; `gap-2`; `px-5`; `py-2.5`; `gap-4`; `w-10`; `h-10`; `h-full`; `max-w-7xl`; `mx-auto`; `min-h-0`; `px-6`; `lg:gap-6`; `inset-0`; `p-8`; `lg:p-10`; `px-3`; `py-1`; `w-max`; `mb-2`; `gap-1.5`; `lg:w-[25rem]`; `gap-3`; `h-px`; `gap-1`; `p-2.5`; `lg:p-3`; `gap-y-2.5`; `gap-x-3`; `mt-auto`; `mt-1`; `gap-2.5` |
| Type | `font-medium`; `text-lg`; `font-sans`; `text-sm`; `font-bold`; `text-[1.25rem]`; `lg:text-[1.5rem]`; `font-semibold`; `text-xs`; `tracking-wider`; `uppercase`; `text-4xl`; `lg:text-5xl`; `tracking-tight`; `lg:text-base`; `text-[14px]`; `lg:text-[15px]`; `text-[0.625rem]`; `text-[13px]`; `lg:text-[14px]`; `text-[11px]` |
| Appearance | `bg-[#F9F9F9]`; `text-[#2D3032]`; `text-[var(--text-primary)]`; `border`; `rounded-full`; `bg-white`; `border-gray-200`; `shadow-sm`; `text-gray-700`; `text-gray-600`; `bg-gray-200`; `text-gray-900`; `bg-gray-400`; `text-white`; `bg-[#2A3125]`; `rounded-[1.5rem]`; `lg:rounded-[2rem]`; `shadow-md`; `bg-gradient-to-t`; `from-black/80`; `via-black/20`; `to-transparent`; `bg-white/20`; `backdrop-blur-md`; `border-white/30`; `text-white/90`; `rounded-[1.25rem]`; `border-0`; `bg-gray-100`; `rounded-xl`; `border-gray-100`; `bg-[#FAFAFA]`; `text-gray-400`; `text-gray-500` |
| Interaction / motion | `animate-spin`; `hover:bg-gray-50`; `transition-colors`; `disabled:opacity-50`; `hover:bg-gray-400`; `hover:bg-black` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 33 | `if (isLoading) {` |
| 162 | `disabled={isSubmitting \|\| isApproved}` |
| 168 | `{isSubmitting ? "Loading..." : isFromUpload ? 'Upload Documents' : 'View Documents'}` |

**Literal palette:** `#2A3125`, `#2D3032`, `#F9F9F9`, `#FAFAFA`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx).

**Routes:** `/super-admin/assigned-farmlands`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 53 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 55 | `bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6` |
| 61 | `flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `md:flex-row`; `justify-between`; `flex-wrap`; `justify-center`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `xl:grid-cols-4`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-6`; `gap-2`; `px-4`; `py-2`; `gap-4`; `w-full`; `sm:w-[220px]`; `h-9`; `sm:h-10`; `gap-3`; `min-h-[400px]`; `mt-4`; `h-full`; `w-8`; `h-8`; `mb-4`; `mt-6`; `pt-4` |
| Type | `text-sm`; `font-medium`; `text-xs`; `sm:text-sm`; `text-lg` |
| Appearance | `bg-white`; `rounded-[24px]`; `shadow-sm`; `border`; `border-gray-100`; `rounded-full`; `border-gray-200`; `text-[var(--text-primary)]`; `text-gray-400`; `text-gray-700`; `text-[#2D3032]`; `text-red-500`; `border-t`; `text-gray-500`; `rounded-lg` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `animate-spin`; `disabled:opacity-50`; `disabled:cursor-not-allowed` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 101 | `{isLoading ? (` |
| 139 | `disabled={page === 1}` |
| 146 | `disabled={page >= totalPages}` |

**Literal palette:** `#2D3032`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Named declarations:** `SuperAdminCustomerInformation`.

**Composition:** [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 13 | `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm` |
| 14 | `bg-white rounded-[2rem] w-[500px] p-10 flex flex-col items-center shadow-2xl relative` |
| 15 | `font-bold text-2xl mb-8` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `relative`; `absolute`; `z-10`; `pointer-events-none`; `z-0`; `-translate-x-1/2`; `justify-between`; `object-cover`; `box-border`; `lg:overflow-hidden`; `shrink-0`; `hidden`; `sm:block`; `sm:hidden`; `overflow-hidden`; `lg:flex-row`; `flex-1`; `md:flex`; `lg:overflow-y-auto`; `custom-scrollbar`; `cursor-pointer`; `flex-wrap`; `overflow-y-auto`; `grid-cols-1`; `md:grid-cols-2`; `underline`; `overflow-x-auto`; `lg:items-stretch`; `lg:items-end`; `lg:items-start`; `flex-col-reverse`; `justify-end`; `grid` |
| Size & spacing | `inset-0`; `w-[500px]`; `p-10`; `mb-8`; `w-24`; `h-24`; `px-12`; `py-4`; `w-full`; `h-full`; `pt-8`; `w-[700px]`; `h-[500px]`; `p-4`; `w-[220px]`; `w-16`; `h-16`; `-bottom-2`; `left-1/2`; `px-2`; `py-0.5`; `mt-3`; `mt-1`; `mt-[70px]`; `left-[125px]`; `-top-[45px]`; `px-3`; `py-1`; `p-3`; `gap-3`; `w-[180px]`; `ml-[60px]`; `w-12`; `h-12`; `left-[322px]`; `left-[520px]`; `mr-[60px]`; `left-[60px]`; `min-h-screen`; `lg:min-h-0`; `lg:h-screen`; `lg:p-8`; `gap-6`; `px-4`; `md:px-6`; `py-2.5`; `md:py-3`; `gap-2`; `md:gap-3`; `w-5`; `h-5`; `md:gap-4`; `w-10`; `h-10`; `md:w-12`; `md:h-12`; `min-h-0`; `lg:w-[320px]`; `xl:w-[380px]`; `p-8`; `lg:p-10`; `mb-10`; `lg:mb-16`; `pl-2`; `gap-12`; `lg:gap-[80px]`; `left-[22px]`; `top-[14px]`; `bottom-[14px]`; `w-[1px]`; `w-[28px]`; `h-[28px]`; `w-[12px]`; `h-[12px]`; `min-h-[600px]`; `lg:gap-4`; `p-6`; `lg:pt-10`; `lg:pb-6`; `w-[16px]`; `h-[16px]`; `lg:w-[18px]`; `lg:h-[18px]`; `w-3`; `h-3`; `px-6`; `lg:px-[60px]`; `pb-[100px]`; `gap-x-6`; `lg:gap-x-12`; `gap-y-6`; `min-h-[48px]`; `py-2`; `ml-2`; `mt-10`; `gap-4`; `lg:w-[400px]`; `h-[200px]`; `lg:h-[250px]`; `mt-2`; `pb-4`; `min-w-[700px]`; `lg:mb-10`; `gap-8`; `lg:gap-12`; `lg:gap-8`; `gap-1`; `max-w-[250px]`; `max-w-[400px]`; `h-[250px]`; `lg:h-[320px]`; `mt-12`; `lg:mt-16`; `max-w-[850px]`; `mx-auto`; `lg:gap-0`; `w-[150px]`; `lg:w-[200px]`; `h-[75px]`; `lg:h-[100px]`; `bottom-0`; `left-0`; `right-0`; `h-[80px]`; `lg:h-[90px]`; `lg:px-12`; `lg:px-8` |
| Type | `font-bold`; `text-2xl`; `text-center`; `font-medium`; `text-lg`; `leading-snug`; `font-semibold`; `text-[0.6rem]`; `uppercase`; `text-xs`; `text-sm`; `leading-tight`; `font-sans`; `text-[14px]`; `md:text-[15px]`; `text-[16px]`; `lg:text-[18px]`; `text-3xl`; `lg:text-[42px]`; `break-all`; `tracking-wide`; `text-[12px]`; `lg:text-[14px]`; `lg:text-sm`; `break-words`; `text-xl`; `truncate`; `tracking-[0.2em]`; `lg:text-base`; `lg:text-right`; `tracking-wider`; `lg:text-left`; `lg:text-2xl` |
| Appearance | `bg-black/60`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-2xl`; `bg-green-100/50`; `rounded-full`; `bg-[#8DC63F]`; `shadow-lg`; `border-4`; `border-white`; `text-white`; `text-[#1D7ABE]`; `bg-[#2A3125]`; `bg-[#F4F9FF]`; `border`; `border-[#BFDBFE]`; `rounded-[1rem]`; `shadow-sm`; `border-2`; `bg-[#1D7ABE]`; `text-[#1F2937]`; `text-[#3B82F6]`; `bg-[#E0E7FF]`; `text-[#4F46E5]`; `border-gray-200`; `text-gray-500`; `bg-[#F2F2F2]`; `text-[#353535]`; `text-[#2C2C2C]`; `text-gray-900`; `bg-gray-300`; `bg-[#E1E8B0]`; `shadow-[0_0_0_2px_white]`; `bg-[#2B3024]`; `border-b`; `border-gray-100`; `lg:border-none`; `border-[#2A3125]`; `text-gray-600`; `bg-[#A3C33D]`; `bg-[#E5E9D8]`; `border-transparent`; `text-gray-700`; `bg-gray-50`; `rounded-[1.5rem]`; `text-gray-400`; `text-[#A3C33D]`; `text-gray-300`; `opacity-80`; `border-t`; `border-red-200`; `text-red-500` |
| Interaction / motion | `scale-[1.5]`; `hover:bg-black`; `transition-colors`; `hover:bg-gray-50`; `hover:opacity-80`; `transition-opacity`; `hover:bg-[#d8ddc7]`; `hover:bg-red-50` |

| Inline style source line | Exact declaration |
| --- | --- |
| 50 | `style={{ top: '60px' }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1D7ABE`, `#1F2937`, `#2A3125`, `#2B3024`, `#2C2C2C`, `#353535`, `#3B82F6`, `#4F46E5`, `#8DC63F`, `#A3C33D`, `#BFDBFE`, `#D1D5DB`, `#E0E7FF`, `#E1E8B0`, `#E5E9D8`, `#F2F2F2`, `#F4F9FF`, `#d8ddc7`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx).

**Routes:** `/super-admin/dashboard`.

**Composition:** [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx), [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx), [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx), [src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx](src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx), [src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx](src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx), [src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx](src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx), [src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx](src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 18 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 21 | `shrink-0` |
| 27 | `flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `shrink-0`; `items-start`; `justify-between`; `relative`; `z-10`; `grid-cols-1`; `xl:grid-cols-[1.2fr_1fr]`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-4`; `mt-4`; `w-full`; `h-full`; `mt-auto`; `mb-6`; `mt-2` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx).

**Routes:** `/super-admin/draft-farmlands`.

**Composition:** [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 38 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 41 | `flex flex-col gap-1 px-1` |
| 42 | `text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `flex-1`; `justify-center`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `xl:grid-cols-4`; `justify-between`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-1`; `px-1`; `p-1`; `w-fit`; `px-6`; `py-2`; `w-full`; `min-h-[400px]`; `gap-4`; `w-10`; `h-10`; `w-16`; `h-16`; `w-8`; `h-8`; `mt-1`; `gap-2`; `gap-6`; `mt-6`; `pt-4`; `px-4` |
| Type | `text-[1.75rem]`; `font-bold`; `tracking-tight`; `text-[0.875rem]`; `font-medium`; `text-sm`; `text-center`; `font-semibold`; `text-lg` |
| Appearance | `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `bg-white`; `rounded-full`; `border`; `border-gray-200`; `shadow-sm`; `bg-[#2D3319]`; `text-white`; `bg-transparent`; `text-[#2D3032]`; `text-[#BDD327]`; `bg-red-50`; `text-red-400`; `bg-gray-50`; `text-gray-400`; `border-t`; `border-gray-100`; `text-gray-500`; `rounded-lg` |
| Interaction / motion | `transition-all`; `duration-200`; `hover:bg-gray-50`; `animate-spin`; `hover:bg-[#3d4a0d]`; `transition-colors`; `disabled:opacity-50`; `disabled:cursor-not-allowed` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 70 | `{isLoading ? (` |
| 140 | `disabled={page === 1}` |
| 147 | `disabled={page >= totalPages}` |

**Literal palette:** `#2D3032`, `#2D3319`, `#3d4a0d`, `#BDD327`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx).

**Routes:** `/super-admin/edit-farmland-tag/:id`.

**Purpose:** Edit the displayed farmland tag selection.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 39 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 40 | `bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen relative` |
| 43 | `absolute top-6 left-6 z-20` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `-translate-x-1/2`; `-translate-y-1/2`; `box-border`; `flex`; `flex-col`; `relative`; `absolute`; `z-20`; `items-center`; `flex-1`; `overflow-hidden`; `justify-center`; `z-10`; `z-30`; `justify-between` |
| Size & spacing | `top-right`; `bottom-right`; `top-[5%]`; `left-1/2`; `top-[20%]`; `right-[15%]`; `top-1/2`; `right-[5%]`; `bottom-[20%]`; `bottom-[15%]`; `left-[5%]`; `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-8`; `min-h-screen`; `top-6`; `left-6`; `gap-2`; `px-5`; `py-2.5`; `mt-16`; `p-8`; `mb-6`; `mb-2`; `max-w-sm`; `min-h-[500px]`; `w-full`; `max-w-[800px]`; `mx-auto`; `w-[450px]`; `h-[450px]`; `h-[1px]`; `w-[1px]`; `px-4`; `py-2`; `w-[320px]`; `mb-3`; `mb-4`; `my-2`; `mt-3`; `mt-6`; `px-8`; `py-3`; `w-40` |
| Type | `text-sm`; `font-medium`; `text-xl`; `font-bold`; `font-semibold`; `text-[13px]`; `text-[10px]`; `tracking-wider`; `uppercase`; `text-[15px]` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `shadow-sm`; `border-gray-100`; `text-[#8BA3BA]`; `border-dashed`; `border-gray-300`; `border-t`; `border-l`; `border-[#8B9A46]`; `text-[#8B9A46]`; `text-gray-500`; `bg-[#F9FBF9]`; `rounded-[20px]`; `shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]`; `text-gray-800`; `bg-[#2D3319]`; `text-white`; `rounded-xl` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `transition-all`; `duration-200`; `hover:scale-105`; `transform`; `hover:bg-black` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2D3319`, `#8B9A46`, `#8BA3BA`, `#F6F7F6`, `#F9FBF9`, `rgba(0,0,0,0.05)`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx).

**Routes:** `/super-admin/farmlands-list/:id`.

**Composition:** [src/features/super-admin/components/FollowUpModal.tsx](src/features/super-admin/components/FollowUpModal.tsx), [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 19 | `box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-6 relative` |
| 23 | `fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm` |
| 24 | `bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col mx-4 animate-in fade-in zoom-in duration-200` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `overflow-auto`; `custom-scrollbar`; `flex`; `flex-col`; `relative`; `fixed`; `z-50`; `items-center`; `justify-center`; `overflow-hidden`; `absolute`; `shrink-0`; `object-cover`; `grid-cols-2`; `justify-between`; `flex-wrap`; `items-start`; `items-baseline`; `items-end`; `flex-1`; `justify-end`; `group`; `-translate-x-1/2`; `pointer-events-none`; `z-10`; `overflow-x-auto`; `last:border-0`; `cursor-pointer`; `underline`; `underline-offset-4`; `grid` |
| Size & spacing | `min-h-screen`; `p-[clamp(16px,2vw,32px)]`; `gap-6`; `inset-0`; `w-full`; `max-w-md`; `mx-4`; `p-6`; `top-6`; `right-6`; `mb-1`; `pr-6`; `gap-4`; `w-12`; `h-12`; `h-full`; `gap-3`; `px-6`; `py-2`; `max-w-5xl`; `mx-auto`; `gap-2`; `px-4`; `py-2.5`; `p-1`; `p-8`; `md:p-10`; `mb-12`; `w-20`; `h-20`; `gap-1.5`; `w-2`; `h-2`; `gap-1`; `gap-8`; `md:gap-12`; `px-1.5`; `py-0.5`; `px-5`; `ml-4`; `h-px`; `mb-10`; `mb-8`; `w-2.5`; `h-2.5`; `h-[140px]`; `sm:gap-2`; `pb-2`; `gap-0.5`; `-top-10`; `left-1/2`; `py-1`; `px-2`; `mt-2`; `mb-6`; `py-1.5`; `min-w-[800px]`; `pb-3`; `py-4`; `pr-4`; `w-8`; `h-8`; `px-2.5` |
| Type | `text-lg`; `font-semibold`; `text-sm`; `font-bold`; `text-[12px]`; `text-[13px]`; `font-medium`; `text-xl`; `text-[10px]`; `uppercase`; `tracking-widest`; `text-[15px]`; `text-[11px]`; `whitespace-nowrap`; `text-left`; `tracking-wider`; `tracking-wide` |
| Appearance | `bg-[#F6F7F6]`; `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `rounded-3xl`; `shadow-2xl`; `border-b`; `border-gray-100`; `text-gray-400`; `text-[#2D3032]`; `text-gray-500`; `rounded-full`; `border`; `border-gray-200`; `bg-[#F3F6E8]`; `border-[#8BC34A]`; `text-[#3E421B]`; `bg-[#F9FAFB]`; `border-t`; `bg-gray-50/50`; `rounded-xl`; `text-[#8BC34A]`; `bg-[#3E421B]`; `text-white`; `shadow-sm`; `bg-[#2D3012]`; `rounded-[32px]`; `shadow-[0_4px_24px_rgba(0,0,0,0.02)]`; `border-2`; `border-white`; `shadow-md`; `bg-[#8BC34A]`; `text-[#2E7D32]`; `bg-[#E8F5E9]`; `rounded-sm`; `rounded-lg`; `bg-gray-100`; `bg-[#C5E1A5]`; `bg-[#E0E0E0]`; `bg-gray-800`; `rounded`; `opacity-0`; `rounded-t-sm`; `rounded-md`; `border-collapse`; `text-[#78909C]`; `border-gray-50`; `decoration-[#8BC34A]` |
| Interaction / motion | `animate-in`; `fade-in`; `zoom-in`; `duration-200`; `hover:text-gray-600`; `hover:border-gray-300`; `hover:bg-[#F3F6E8]`; `transition-colors`; `hover:bg-[#2D3012]`; `hover:bg-gray-50`; `hover:text-[#2D3032]`; `group-hover:opacity-100`; `transition-opacity`; `hover:bg-[#8BC34A]`; `hover:text-white`; `hover:bg-gray-50/50`; `group-hover:text-[#8BC34A]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 224 | `` style={{ height: `${unlockPct}%` }} `` |
| 226 | `` style={{ height: `${enqPct}%` }} `` |
| 228 | `` style={{ height: `${visitPct}%` }} `` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3012`, `#2D3032`, `#2E7D32`, `#3E421B`, `#78909C`, `#8BC34A`, `#C5E1A5`, `#E0E0E0`, `#E8F5E9`, `#F3F6E8`, `#F6F7F6`, `#F9FAFB`, `rgba(0,0,0,0.02)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx).

**Routes:** `/super-admin/farmlands`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/components/ui/button.tsx](src/components/ui/button.tsx), [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx), [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx), [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 58 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 61 | `shrink-0` |
| 66 | `flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `shrink-0`; `items-start`; `justify-between`; `relative`; `z-10`; `md:flex-row`; `md:items-end`; `self-start`; `md:self-auto`; `items-center`; `xl:flex-row`; `xl:items-center`; `flex-wrap`; `justify-center`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-4`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-4`; `mt-4`; `w-full`; `h-full`; `mt-auto`; `mb-6`; `mt-6`; `gap-6`; `px-6`; `gap-2`; `sm:w-[220px]`; `h-9`; `sm:h-10`; `gap-3`; `px-4`; `py-2`; `min-h-[300px]`; `w-8`; `h-8`; `mb-4` |
| Type | `text-[1.5rem]`; `font-bold`; `tracking-tight`; `text-[0.875rem]`; `font-medium`; `text-xs`; `sm:text-sm`; `text-sm`; `text-lg` |
| Appearance | `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `rounded-full`; `bg-[#2D3032]`; `text-white`; `text-gray-400`; `bg-white`; `border-gray-200`; `border`; `text-gray-700`; `text-[#2D3032]`; `text-red-500` |
| Interaction / motion | `hover:bg-black`; `hover:bg-gray-50`; `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 131 | `{isLoading ? (` |

**Literal palette:** `#2D3032`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx).

**Routes:** `/super-admin/farmlands-list/all`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 32 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 33 | `bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen` |
| 39 | `flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `md:flex-row`; `justify-between`; `shrink-0`; `flex-wrap`; `justify-center`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `xl:grid-cols-4`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-8`; `min-h-screen`; `gap-2`; `px-4`; `py-2`; `gap-4`; `p-1`; `w-fit`; `px-6`; `w-32`; `gap-3`; `w-full`; `md:w-auto`; `h-10`; `sm:w-[220px]`; `h-9`; `sm:h-10`; `min-h-[300px]`; `gap-6` |
| Type | `text-sm`; `font-medium`; `text-xs`; `sm:text-sm`; `text-lg` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `bg-[#2D3319]`; `text-white`; `bg-transparent`; `text-gray-700`; `text-gray-400`; `text-[#2D3032]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#2D3319`, `#F6F7F6`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx).

**Routes:** `/super-admin/farmlands-list`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 31 | `relative h-10 w-[180px] bg-white border border-gray-200 rounded-full flex items-center` |
| 34 | `cursor-pointer w-full h-full flex items-center justify-between px-4` |
| 43 | `absolute top-[calc(100%+8px)] left-0 w-full max-h-[240px] overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2 custom-scrollbar` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `items-center`; `cursor-pointer`; `justify-between`; `absolute`; `overflow-y-auto`; `z-50`; `custom-scrollbar`; `box-border`; `flex-col`; `md:flex-row`; `flex-wrap`; `justify-center`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `xl:grid-cols-4`; `grid` |
| Size & spacing | `h-10`; `w-[180px]`; `w-full`; `h-full`; `px-4`; `top-[calc(100%+8px)]`; `left-0`; `max-h-[240px]`; `py-2`; `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-8`; `min-h-screen`; `gap-2`; `gap-4`; `sm:w-[220px]`; `h-9`; `sm:h-10`; `gap-3`; `min-h-[400px]`; `w-8`; `h-8`; `mb-4`; `gap-6`; `pt-4` |
| Type | `font-[`; `font-medium`; `text-sm`; `text-[1.5rem]`; `font-bold`; `tracking-tight`; `text-[0.875rem]`; `text-xs`; `sm:text-sm`; `text-center`; `text-lg`; `font-['Inter']` |
| Appearance | `bg-white`; `border`; `border-gray-200`; `rounded-full`; `text-gray-400`; `border-gray-100`; `rounded-xl`; `shadow-lg`; `bg-[#F4F9FF]`; `text-[#3B82F6]`; `text-gray-700`; `bg-[#F6F7F6]`; `rounded-[24px]`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `text-[#2D3032]`; `text-red-500`; `border-t`; `text-gray-500`; `rounded-lg` |
| Interaction / motion | `transition-transform`; `duration-200`; `hover:bg-gray-50`; `hover:text-[#3B82F6]`; `transition-colors`; `animate-spin`; `disabled:opacity-50`; `disabled:cursor-not-allowed` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 44 | `{options.length === 0 ? (` |
| 188 | `{isLoading ? (` |
| 226 | `disabled={page === 1}` |
| 233 | `disabled={page >= totalPages}` |

**Literal palette:** `#2D3032`, `#3B82F6`, `#F4F9FF`, `#F6F7F6`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx).

**Routes:** `/super-admin/top-performers`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 19 | `box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-6` |
| 21 | `w-full max-w-5xl mx-auto` |
| 24 | `flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors shadow-sm` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `overflow-auto`; `custom-scrollbar`; `flex`; `flex-col`; `items-center`; `justify-center`; `items-end`; `flex-1`; `cursor-pointer`; `group`; `overflow-hidden`; `object-cover`; `relative`; `justify-between`; `z-10`; `overflow-x-auto`; `last:border-0` |
| Size & spacing | `min-h-screen`; `p-[clamp(16px,2vw,32px)]`; `gap-6`; `w-full`; `max-w-5xl`; `mx-auto`; `gap-2`; `px-4`; `py-2`; `p-8`; `md:p-12`; `min-h-[400px]`; `sm:gap-6`; `md:gap-12`; `max-w-3xl`; `max-w-[200px]`; `mb-6`; `w-8`; `h-8`; `mb-4`; `w-16`; `h-16`; `sm:w-20`; `sm:h-20`; `mb-3`; `h-full`; `h-[120px]`; `pt-4`; `px-2`; `sm:px-4`; `h-1`; `w-[60%]`; `-mt-10`; `w-10`; `h-10`; `w-20`; `h-20`; `sm:w-24`; `sm:h-24`; `h-[160px]`; `pt-6`; `px-3`; `sm:px-5`; `h-1.5`; `w-[85%]`; `h-[100px]`; `pt-3`; `w-[45%]`; `min-w-[600px]`; `pb-4`; `py-4`; `gap-3`; `py-1.5`; `mt-8`; `px-1` |
| Type | `text-sm`; `font-medium`; `font-bold`; `text-[14px]`; `sm:text-[16px]`; `text-center`; `whitespace-nowrap`; `text-[10px]`; `sm:text-[12px]`; `text-[8px]`; `sm:text-[10px]`; `tracking-widest`; `uppercase`; `text-[12px]`; `sm:text-[14px]`; `text-[16px]`; `sm:text-[18px]`; `text-[9px]`; `sm:text-[11px]`; `text-left`; `tracking-wider`; `text-[13px]`; `font-semibold` |
| Appearance | `bg-[#F6F7F6]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `shadow-sm`; `rounded-[32px]`; `bg-gray-100`; `text-gray-400`; `rounded-[16px]`; `text-[#2D3032]`; `bg-gradient-to-b`; `from-gray-100`; `to-gray-50`; `rounded-t-sm`; `shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_-2px_10px_rgba(0,0,0,0.05)]`; `border-t`; `border-x`; `bg-gray-300`; `bg-gray-500`; `bg-[#FFF8E1]`; `border-[#FFECB3]`; `text-[#F57F17]`; `rounded-[20px]`; `border-2`; `border-[#FFE082]`; `shadow-md`; `shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_-4px_15px_rgba(0,0,0,0.1)]`; `bg-gray-200`; `bg-[#F57F17]`; `bg-[#FBE9E7]`; `text-[#D84315]`; `border-[#FFAB91]`; `bg-[#D84315]`; `border-collapse`; `border-b`; `border-gray-100`; `border-gray-50`; `text-gray-500`; `border-[#8BC34A]`; `text-[#8BC34A]`; `rounded-lg`; `bg-[#8BC34A]`; `text-white` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `transition-transform`; `duration-300`; `group-hover:text-[#8BC34A]`; `group-hover:border-[#8BC34A]`; `group-hover:border-[#F57F17]`; `group-hover:text-[#F57F17]`; `group-hover:border-[#D84315]`; `group-hover:text-[#D84315]`; `hover:bg-gray-50/50`; `hover:bg-[#8BC34A]`; `hover:text-white`; `hover:bg-gray-100` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#8BC34A`, `#D84315`, `#F57F17`, `#F6F7F6`, `#FBE9E7`, `#FFAB91`, `#FFE082`, `#FFECB3`, `#FFF8E1`, `rgba(0,0,0,0.05)`, `rgba(0,0,0,0.1)`, `rgba(255,255,255,0.5)`, `rgba(255,255,255,0.8)`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/agriculture-report`.

**Named declarations:** `AgricultureReport`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 174 | `bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] flex flex-col flex-1 h-full min-w-0 overflow-hidden relative` |
| 176 | `px-6 py-6 shrink-0 border-b border-gray-100` |
| 177 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown`; `flex`; `flex-col`; `flex-1`; `overflow-hidden`; `relative`; `shrink-0`; `items-center`; `justify-center`; `overflow-y-auto` |
| Size & spacing | `h-full`; `min-w-0`; `px-6`; `py-6`; `m-0`; `mt-1`; `h-8`; `w-8`; `ml-3`; `gap-6`; `w-[max-content]`; `mb-2`; `mb-5`; `gap-4`; `py-4`; `w-full`; `h-[140px]`; `lg:px-10`; `lg:py-6` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-medium`; `text-lg`; `text-sm`; `whitespace-nowrap`; `font-semibold`; `leading-relaxed`; `text-[22px]` |
| Appearance | `bg-white`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `border-gray-100`; `text-black`; `text-[#8C9088]`; `rounded-full`; `border-b-2`; `border-gray-900`; `text-gray-500`; `text-red-500`; `text-gray-400`; `text-[#3A8EE6]`; `text-gray-900`; `border-t` |
| Interaction / motion | `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 184 | `{isLoading ? (` |

**Literal palette:** `#3A8EE6`, `#8C9088`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInfoConfirmationModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInfoConfirmationModal.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInfoConfirmationModal.tsx).

**Route:** no direct route declaration; imported confirmation/modal component.

**Purpose:** Confirm completion of customer-information review.

**Named declarations:** `ConfirmationModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 8 | `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm` |
| 9 | `bg-white rounded-[2rem] w-[500px] p-10 flex flex-col items-center shadow-2xl relative` |
| 10 | `font-bold text-2xl mb-8 text-gray-900` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `relative`; `absolute`; `z-10` |
| Size & spacing | `inset-0`; `w-[500px]`; `p-10`; `mb-8`; `w-24`; `h-24`; `px-12`; `py-4` |
| Type | `font-bold`; `text-2xl`; `text-center`; `font-medium`; `text-lg`; `leading-snug`; `font-semibold` |
| Appearance | `bg-black/60`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-2xl`; `text-gray-900`; `bg-green-100/50`; `rounded-full`; `bg-[#8DC63F]`; `shadow-lg`; `border-4`; `border-white`; `text-white`; `text-gray-800`; `text-[#1D7ABE]`; `bg-[#2A3125]` |
| Interaction / motion | `scale-[1.5]`; `hover:bg-black`; `transition-colors` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1D7ABE`, `#2A3125`, `#8DC63F`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/customer-information`.

**Purpose:** Review owner, family tree and land tabs before advancing verification.

**Named declarations:** `CustomerInformation`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInfoConfirmationModal.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInfoConfirmationModal.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/OwnerDetailsTab.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/OwnerDetailsTab.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/LandDetailsTab.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/LandDetailsTab.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 20 | `z-10 bg-[#F4F9FF] border border-[#BFDBFE] rounded-[1rem] p-6 flex flex-col items-center w-[250px] shadow-sm shrink-0` |
| 21 | `relative` |
| 23 | `w-20 h-20 rounded-full border-4 border-[#FBBF24] shadow-sm object-cover` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `z-10`; `flex`; `flex-col`; `items-center`; `shrink-0`; `relative`; `object-cover`; `justify-center`; `absolute`; `-translate-x-1/2`; `-translate-y-1/2`; `z-20`; `overflow-hidden`; `justify-start`; `overflow-x-auto`; `custom-scrollbar`; `flex-row`; `items-start`; `flex-1`; `flex-wrap`; `overflow-y-auto`; `justify-end`; `cursor-not-allowed` |
| Size & spacing | `p-6`; `w-[250px]`; `w-20`; `h-20`; `w-10`; `h-10`; `-bottom-2`; `left-1/2`; `px-3`; `py-1`; `mt-5`; `w-full`; `mt-1`; `gap-0`; `w-0.5`; `h-6`; `top-1/2`; `p-3`; `gap-3`; `w-[220px]`; `w-12`; `h-12`; `w-6`; `h-[500px]`; `h-8`; `w-8`; `ml-3`; `h-full`; `py-6`; `min-w-max`; `px-12`; `h-0.5`; `w-[calc(100%-220px)]`; `gap-12`; `min-w-0`; `lg:gap-4`; `p-4`; `lg:py-6`; `w-[16px]`; `h-[16px]`; `lg:w-[18px]`; `lg:h-[18px]`; `w-3`; `h-3`; `px-6`; `lg:px-[40px]`; `pb-[80px]`; `pb-4`; `min-w-[700px]`; `bottom-0`; `left-0`; `right-0`; `h-[80px]`; `lg:h-[90px]`; `lg:px-12`; `gap-4`; `lg:px-8`; `py-2.5` |
| Type | `text-[0.6rem]`; `font-bold`; `uppercase`; `tracking-wider`; `truncate`; `text-center`; `text-xs`; `font-medium`; `text-sm`; `leading-tight`; `text-lg`; `font-semibold`; `lg:text-sm` |
| Appearance | `bg-[#F4F9FF]`; `border`; `border-[#BFDBFE]`; `rounded-[1rem]`; `shadow-sm`; `rounded-full`; `border-4`; `border-[#FBBF24]`; `bg-gray-200`; `text-gray-500`; `bg-[#3B82F6]`; `text-white`; `text-[#1F2937]`; `text-[#3B82F6]`; `bg-[#E0E7FF]`; `text-[#4F46E5]`; `border-white`; `bg-white`; `border-gray-100`; `shadow-[0_4px_12px_rgba(0,0,0,0.05)]`; `border-b-2`; `border-gray-900`; `text-gray-300`; `border-t`; `border-gray-200`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `lg:border-none`; `bg-[#2A3125]`; `border-[#2A3125]`; `text-gray-600`; `bg-[#A3C33D]`; `bg-[#E5E9D8]`; `border-transparent`; `rounded-b-[2rem]`; `text-gray-400`; `border-gray-300`; `text-gray-700` |
| Interaction / motion | `animate-spin`; `hover:bg-gray-50`; `hover:bg-[#d8ddc7]`; `hover:bg-black`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 64 | `const FamilyTreeTab: React.FC<{ familyData?: FamilyTreeOwner, isLoading?: boolean }> = ({ familyData, isLoading }) => {` |
| 126 | `if (isLoading) {` |
| 135 | `if (!familyData \|\| (familyData.relatives && familyData.relatives.length === 0 && !familyData.first_name)) {` |
| 321 | `disabled={activeTab === 'owner'}` |

**Literal palette:** `#1F2937`, `#2A3125`, `#3B82F6`, `#4F46E5`, `#A3C33D`, `#BFDBFE`, `#E0E7FF`, `#E5E9D8`, `#F4F9FF`, `#FBBF24`, `#d8ddc7`, `rgba(0,0,0,0.05)`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/land-boundaries`.

**Named declarations:** `LandBoundaries`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 270 | `text-[16px] font-bold text-gray-900 mb-4` |
| 271 | `flex flex-col gap-4 mb-8` |
| 285 | `text-gray-400 text-sm py-4` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `overflow-hidden`; `relative`; `shrink-0`; `items-center`; `justify-center`; `overflow-y-auto`; `flex-row`; `object-cover`; `block`; `cursor-pointer` |
| Size & spacing | `mb-4`; `gap-4`; `mb-8`; `py-4`; `h-full`; `min-w-0`; `px-6`; `py-6`; `m-0`; `mt-1`; `h-8`; `w-8`; `ml-3`; `gap-6`; `mt-8`; `mb-6`; `w-full`; `gap-3`; `h-[72px]`; `px-4`; `w-[42px]`; `h-[42px]`; `gap-2`; `p-1.5`; `py-2`; `mt-4`; `h-[140px]`; `lg:px-10`; `lg:py-6` |
| Type | `text-[16px]`; `font-bold`; `text-sm`; `font-sans`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-medium`; `text-lg`; `text-[20px]`; `text-[22px]`; `text-[18px]`; `truncate`; `text-[15px]`; `leading-[20px]`; `text-[12px]` |
| Appearance | `text-gray-900`; `text-gray-400`; `bg-white`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `border-gray-100`; `text-black`; `text-[#8C9088]`; `rounded-full`; `border-b-2`; `border-gray-900`; `text-gray-500`; `text-red-500`; `bg-[#EEF5FA]`; `rounded-[12px]`; `rounded-[8px]`; `border`; `shadow-sm`; `bg-transparent`; `rounded`; `border-none`; `border-t` |
| Interaction / motion | `animate-spin`; `hover:bg-gray-200`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 319 | `{isLoading ? (` |

**Literal palette:** `#4B5563`, `#8C9088`, `#EEF5FA`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/legal-documents`.

**Named declarations:** `LegalDocuments`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 173 | `bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] flex flex-col flex-1 h-full min-w-0 overflow-hidden relative` |
| 175 | `px-6 py-6 shrink-0 border-b border-gray-100` |
| 176 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `overflow-hidden`; `relative`; `shrink-0`; `items-center`; `justify-center`; `overflow-y-auto` |
| Size & spacing | `h-full`; `min-w-0`; `px-6`; `py-6`; `m-0`; `mt-1`; `h-8`; `w-8`; `ml-3`; `gap-6`; `mb-4`; `p-4`; `mb-3`; `gap-4`; `py-4`; `w-full`; `h-[140px]`; `lg:px-10`; `lg:py-6` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-medium`; `text-lg`; `text-sm`; `font-semibold`; `text-[14px]`; `break-all` |
| Appearance | `bg-white`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `border-gray-100`; `text-black`; `text-[#8C9088]`; `rounded-full`; `border-b-2`; `border-gray-900`; `text-gray-500`; `text-red-500`; `text-gray-400`; `text-gray-900`; `bg-[#F0F4F8]`; `rounded-2xl`; `text-[#1D7ABE]`; `border-t` |
| Interaction / motion | `animate-spin`; `hover:underline` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 183 | `{isLoading ? (` |

**Literal palette:** `#1D7ABE`, `#8C9088`, `#F0F4F8`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/local-intelligence`.

**Named declarations:** `LocalIntelligence`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 428 | `text-[22px] font-bold text-gray-900 mb-6` |
| 429 | `flex flex-col gap-4 mb-8` |
| 443 | `text-gray-400 text-sm py-4` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown`; `flex`; `flex-col`; `fixed`; `items-center`; `justify-center`; `z-[110]`; `shrink-0`; `flex-wrap`; `overflow-y-auto`; `inline-flex`; `flex-1`; `overflow-hidden`; `relative` |
| Size & spacing | `mb-6`; `gap-4`; `mb-8`; `py-4`; `inset-0`; `p-8`; `max-w-lg`; `w-full`; `mx-4`; `mb-2`; `py-10`; `gap-3`; `h-10`; `w-10`; `w-12`; `h-12`; `px-6`; `py-2`; `gap-2`; `mb-3`; `w-2.5`; `h-2.5`; `max-h-[200px]`; `pr-1`; `gap-1.5`; `px-3`; `py-1.5`; `w-1.5`; `h-1.5`; `py-8`; `mb-4`; `w-14`; `h-14`; `w-7`; `h-7`; `max-w-[160px]`; `py-3`; `h-full`; `min-w-0`; `py-6`; `m-0`; `mt-1`; `h-8`; `w-8`; `ml-3`; `gap-6`; `mt-8`; `h-[140px]`; `lg:px-10`; `lg:py-6` |
| Type | `text-[22px]`; `font-bold`; `text-sm`; `text-2xl`; `text-center`; `font-medium`; `text-xl`; `font-semibold`; `text-xs`; `text-base`; `font-sans`; `md:text-lg`; `leading-tight`; `md:text-sm`; `text-lg` |
| Appearance | `text-gray-900`; `text-gray-400`; `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.1)]`; `shadow-[0px_8px_32px_rgba(0,0,0,0.18)]`; `rounded-[24px]`; `text-gray-500`; `rounded-full`; `border-[3px]`; `border-gray-200`; `border-t-[#2A3125]`; `bg-red-100`; `text-red-500`; `border-red-300`; `text-red-600`; `bg-red-500`; `text-gray-800`; `bg-red-50`; `border-red-200`; `text-red-700`; `bg-green-100`; `text-green-600`; `border-gray-300`; `text-gray-700`; `bg-red-600`; `text-white`; `bg-[#2A3125]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `border-gray-100`; `text-black`; `text-[#8C9088]`; `border-b-2`; `border-gray-900`; `border-t` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `animate-spin`; `hover:bg-red-50`; `transition-colors`; `hover:bg-gray-50`; `disabled:opacity-50`; `hover:bg-red-700`; `hover:bg-black` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 532 | `disabled={isReverting \|\| isSubmitting}` |
| 541 | `disabled={isReverting}` |
| 549 | `disabled={isSubmitting}` |
| 552 | `{isSubmitting ? 'Submitting...' : 'Submit'}` |
| 583 | `{isLoading ? (` |

**Literal palette:** `#2A3125`, `#8C9088`, `rgba(0,0,0,0.1)`, `rgba(0,0,0,0.18)`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id/valuation`.

**Named declarations:** `Valuation`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 251 | `bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] flex flex-col flex-1 h-full min-w-0 overflow-hidden relative` |
| 253 | `px-6 py-6 shrink-0 border-b border-gray-100` |
| 254 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `overflow-hidden`; `relative`; `shrink-0`; `overflow-y-auto` |
| Size & spacing | `h-full`; `min-w-0`; `px-6`; `py-6`; `m-0`; `mt-1`; `gap-6`; `mb-6`; `p-6`; `min-h-[160px]`; `gap-4`; `w-full`; `h-[140px]`; `lg:px-10`; `py-4`; `lg:py-6` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `text-[22px]`; `text-[15px]`; `leading-relaxed` |
| Appearance | `bg-white`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-b`; `border-gray-100`; `text-black`; `text-[#8C9088]`; `text-gray-900`; `bg-[#EFF6FF]`; `rounded-2xl`; `text-gray-700`; `text-gray-500`; `border-t` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 170 | `if (error) {` |

**Literal palette:** `#8C9088`, `#EFF6FF`, `rgba(0,49,50,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/pages/AgricultureReportFlow.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/pages/AgricultureReportFlow.tsx](src/features/super-admin/sub-features/legal-docs/pages/AgricultureReportFlow.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 96 | `min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border` |
| 119 | `flex flex-col lg:flex-row gap-6 flex-1` |
| 128 | `flex-1 flex flex-col gap-6 min-w-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown`; `flex`; `flex-col`; `box-border`; `lg:flex-row`; `flex-1`; `xl:flex-row` |
| Size & spacing | `min-h-screen`; `p-4`; `lg:p-8`; `gap-6`; `min-w-0`; `p-6`; `lg:p-10`; `gap-8`; `xl:gap-10`; `pr-2`; `mb-6`; `gap-4` |
| Type | `font-sans`; `text-[22px]`; `font-bold` |
| Appearance | `bg-[#F9FAFB]`; `bg-white`; `shadow-sm`; `rounded-[2rem]`; `text-gray-900` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#F9FAFB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/pages/LandBoundariesFlow.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/pages/LandBoundariesFlow.tsx](src/features/super-admin/sub-features/legal-docs/pages/LandBoundariesFlow.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 101 | `min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border` |
| 123 | `flex flex-col lg:flex-row gap-6 flex-1` |
| 132 | `flex-1 flex flex-col gap-6 min-w-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `box-border`; `lg:flex-row`; `flex-1`; `xl:flex-row`; `block` |
| Size & spacing | `min-h-screen`; `p-4`; `lg:p-8`; `gap-6`; `min-w-0`; `p-6`; `lg:p-10`; `gap-8`; `xl:gap-10`; `pr-2`; `mb-6`; `gap-4`; `mb-4`; `mb-3`; `gap-3`; `mb-8`; `mt-2`; `mb-5`; `mb-2`; `mt-4` |
| Type | `font-sans`; `text-[22px]`; `font-bold`; `text-[18px]`; `text-[14px]`; `font-medium`; `text-[20px]`; `text-[13px]` |
| Appearance | `bg-[#F9FAFB]`; `bg-white`; `shadow-sm`; `rounded-[2rem]`; `text-gray-900`; `text-gray-800`; `text-gray-500` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#F9FAFB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/pages/LocalIntelligenceFlow.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/pages/LocalIntelligenceFlow.tsx](src/features/super-admin/sub-features/legal-docs/pages/LocalIntelligenceFlow.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 44 | `fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm` |
| 45 | `bg-white rounded-[2rem] w-[500px] p-8 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative` |
| 46 | `flex justify-between items-center mb-6` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `relative`; `justify-between`; `block`; `resize-none`; `absolute`; `items-start`; `justify-end`; `z-10`; `box-border`; `lg:flex-row`; `flex-1`; `xl:flex-row` |
| Size & spacing | `inset-0`; `w-[500px]`; `p-8`; `mb-6`; `p-2`; `mb-2`; `w-full`; `h-[120px]`; `p-4`; `bottom-4`; `right-4`; `w-8`; `h-8`; `mb-8`; `gap-2`; `px-4`; `py-2`; `gap-1`; `px-8`; `py-2.5`; `py-10`; `w-[109px]`; `h-[109px]`; `mb-10`; `max-w-[360px]`; `px-[50px]`; `py-[14px]`; `min-h-screen`; `lg:p-8`; `gap-6`; `min-w-0`; `p-6`; `lg:p-10`; `gap-8`; `xl:gap-10`; `pr-2`; `mt-2`; `gap-4` |
| Type | `font-bold`; `text-[24px]`; `text-[14px]`; `text-[13px]`; `font-medium`; `font-semibold`; `text-[15px]`; `text-center`; `text-[17px]`; `leading-[1.6]`; `font-sans`; `text-[22px]` |
| Appearance | `bg-white/40`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-[0_10px_40px_rgba(0,0,0,0.08)]`; `text-gray-900`; `rounded-full`; `text-gray-600`; `bg-[#F5F5F5]`; `border`; `border-transparent`; `rounded-2xl`; `text-gray-800`; `outline-none`; `bg-[#3E4A35]`; `text-white`; `text-gray-500`; `border-gray-200`; `rounded-xl`; `text-gray-400`; `bg-[#2A3125]`; `bg-[#F3F4F6]`; `rounded-[25%]`; `bg-[#A3C33D]`; `text-[#1D7ABE]`; `bg-[#F9FAFB]`; `shadow-sm` |
| Interaction / motion | `hover:bg-gray-100`; `transition-colors`; `focus:border-gray-300`; `hover:opacity-90`; `hover:bg-gray-50`; `hover:text-yellow-400`; `focus:outline-none`; `hover:bg-black`; `rotate-0`; `rotate-30`; `rotate-60`; `rotate-15`; `rotate-45`; `rotate-75` |

| Inline style source line | Exact declaration |
| --- | --- |
| 116 | `style={{ width: 140, height: 140, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1D7ABE`, `#2A3125`, `#3E4A35`, `#A3C33D`, `#F3F4F6`, `#F5F5F5`, `#F9FAFB`, `rgba(0,0,0,0.08)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/pages/ValuationFlow.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/pages/ValuationFlow.tsx](src/features/super-admin/sub-features/legal-docs/pages/ValuationFlow.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 87 | `min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border` |
| 107 | `flex flex-col lg:flex-row gap-6 flex-1` |
| 116 | `flex-1 flex flex-col gap-6 min-w-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `box-border`; `lg:flex-row`; `flex-1`; `xl:flex-row` |
| Size & spacing | `min-h-screen`; `p-4`; `lg:p-8`; `gap-6`; `min-w-0`; `p-6`; `lg:p-10`; `gap-8`; `xl:gap-10`; `pr-2`; `mb-6`; `min-h-[160px]`; `mt-8`; `mb-4`; `gap-4` |
| Type | `font-sans`; `text-[22px]`; `font-bold`; `text-[15px]`; `leading-relaxed`; `text-[16px]` |
| Appearance | `bg-[#F9FAFB]`; `bg-white`; `shadow-sm`; `rounded-[2rem]`; `text-gray-900`; `bg-[#EFF6FF]`; `border`; `border-[#BDE0FE]`; `rounded-2xl`; `text-gray-700` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#BDE0FE`, `#EFF6FF`, `#F9FAFB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/pages/VerificationFlow.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/pages/VerificationFlow.tsx](src/features/super-admin/sub-features/legal-docs/pages/VerificationFlow.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 142 | `min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border` |
| 164 | `flex flex-col lg:flex-row gap-6 flex-1` |
| 174 | `flex-1 flex flex-col gap-6 min-w-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `growth-corridor`; `flex`; `flex-col`; `box-border`; `lg:flex-row`; `flex-1`; `xl:flex-row` |
| Size & spacing | `min-h-screen`; `p-4`; `lg:p-8`; `gap-6`; `min-w-0`; `p-6`; `lg:p-10`; `gap-8`; `xl:gap-10`; `pr-2`; `mb-6`; `mb-5`; `gap-4` |
| Type | `font-sans`; `text-[22px]`; `font-bold`; `text-[14px]`; `font-medium`; `break-all` |
| Appearance | `bg-[#F9FAFB]`; `bg-white`; `shadow-sm`; `rounded-[2rem]`; `text-gray-900`; `bg-[#F0F4F8]`; `rounded-2xl`; `text-[#1D7ABE]` |
| Interaction / motion | `hover:underline` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1D7ABE`, `#F0F4F8`, `#F9FAFB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx).

**Routes:** `/maintenance/service-requests/customer-response/:id`, `/super-admin/maintenance/service-requests/customer-response/:id`, `/maintenance/customer-response/:id`, `/super-admin/maintenance/customer-response/:id`, `/maintenance/preview/service-requests/customer-response/:id`, `/maintenance/preview/customer-response/:id`.

**Purpose:** Inspect per-service customer response and move eligible services to work orders.

**Named declarations:** `MaintenanceCustomerResponseDetails`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 512 | `min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']` |
| 515 | `flex-1 w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col gap-6` |
| 517 | `flex items-center gap-2 text-xs font-semibold text-[#64748B]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceCustomerResponseDetailsProps {
  item?: ServiceRequestPipelineItem;
  onBack?: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `items-center`; `cursor-pointer`; `lg:flex-row`; `lg:items-center`; `lg:justify-between`; `flex-wrap`; `inline-flex`; `cursor-not-allowed`; `md:flex-row`; `md:items-center`; `justify-between`; `justify-center`; `shrink-0`; `block`; `self-start`; `md:self-auto`; `grid-cols-1`; `sm:grid-cols-2`; `lg:grid-cols-4`; `grid` |
| Size & spacing | `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-12`; `py-6`; `sm:py-8`; `gap-6`; `gap-2`; `p-0`; `gap-4`; `m-0`; `mt-1`; `gap-1.5`; `sm:gap-2`; `gap-3`; `px-3.5`; `py-1.5`; `w-2`; `h-2`; `px-5`; `py-2`; `w-4`; `h-4`; `p-4`; `sm:p-5`; `gap-3.5`; `w-11`; `h-11`; `mb-0.5`; `px-2.5`; `py-0.5`; `gap-5`; `sm:gap-8`; `pt-3`; `md:pt-0`; `px-4.5`; `w-2.5`; `h-2.5`; `p-6`; `sm:p-8`; `py-10`; `pt-2`; `py-2.5`; `w-3.5`; `h-3.5`; `px-3`; `py-1`; `mt-0.5`; `py-3`; `w-10`; `h-10`; `w-5`; `h-5`; `p-4.5`; `p-3.5`; `pr-2` |
| Type | `font-[`; `text-xs`; `font-semibold`; `font-bold`; `text-[24px]`; `sm:text-[28px]`; `font-extrabold`; `tracking-tight`; `sm:text-sm`; `font-normal`; `text-sm`; `text-[10px]`; `uppercase`; `tracking-wider`; `sm:text-base`; `text-[11px]`; `font-medium`; `text-center`; `text-base`; `sm:text-lg`; `text-xl`; `sm:text-2xl`; `text-[10.5px]`; `leading-relaxed`; `truncate`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#FDFDFE]`; `text-[#64748B]`; `border-none`; `bg-transparent`; `text-[#1E293B]`; `text-[#111827]`; `rounded-full`; `bg-[#DCFCE7]`; `text-[#15803D]`; `border`; `border-[#86EFAC]/60`; `shadow-2xs`; `bg-[#15803D]`; `bg-[#FEE2E2]`; `text-[#DC2626]`; `border-[#FCA5A5]/60`; `bg-[#DC2626]`; `bg-[#FEF9C3]`; `text-[#854D0E]`; `border-[#FDE047]/60`; `bg-[#EAB308]`; `text-white`; `shadow-sm`; `bg-[#94A3B8]`; `opacity-85`; `bg-white`; `rounded-[20px]`; `border-[#93C5FD]`; `bg-[#DBEAFE]`; `text-[#1D4ED8]`; `text-[#0284C7]`; `bg-[#E0F2FE]`; `border-t`; `md:border-t-0`; `border-gray-100`; `text-[#334155]`; `bg-[#0A2540]`; `shadow-xs`; `stroke-[3]`; `bg-[#EF4444]`; `bg-[#38BDF8]`; `bg-[#F1F5F9]`; `border-gray-200`; `rounded-[24px]`; `border-[#E2E8F0]`; `border-[#F1F5F9]`; `border-[#CBD5E1]`; `bg-[#F0FDF4]`; `border-[#BBF7D0]`; `bg-[#FEF2F2]`; `border-[#FECACA]`; `bg-[#FFF7ED]`; `border-[#FED7AA]`; `border-[#86EFAC]`; `border-[#FCA5A5]`; `text-[#EA580C]`; `border-[#FDBA74]`; `text-[#0F172A]`; `rounded-[16px]`; `rounded-xl`; `bg-[#EBF3FC]`; `text-[#1877F2]`; `text-[#0A2540]`; `bg-[#F8FAFC]`; `text-[#94A3B8]`; `rounded-[14px]`; `text-[#475569]`; `text-[#B91C1C]`; `bg-[#FEF3C7]`; `text-[#92400E]`; `border-[#FCD34D]/60` |
| Interaction / motion | `hover:text-[#1877F2]`; `transition-colors`; `hover:bg-[#166534]`; `transition-all`; `active:scale-98`; `disabled:opacity-70`; `disabled:cursor-not-allowed`; `hover:bg-[#BBF7D0]`; `hover:bg-[#FECACA]`; `hover:bg-gray-200`; `hover:bg-gray-50` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 233 | `if (!resolvedFarmlandId \|\| backendItemIds.length === 0) return;` |
| 460 | `if (!resolvedFarmlandId \|\| approvedServices.length === 0) {` |
| 582 | `disabled={isMovingToWorkOrder}` |
| 829 | `{activeService.components.length === 0 && (` |

**Literal palette:** `#0284C7`, `#0A2540`, `#0F172A`, `#111827`, `#15803D`, `#166534`, `#1877F2`, `#1D4ED8`, `#1E293B`, `#334155`, `#38BDF8`, `#475569`, `#64748B`, `#854D0E`, `#86EFAC`, `#92400E`, `#93C5FD`, `#94A3B8`, `#B91C1C`, `#BBF7D0`, `#CBD5E1`, `#DBEAFE`, `#DC2626`, `#DCFCE7`, `#E0F2FE`, `#E2E8F0`, `#EA580C`, `#EAB308`, `#EBF3FC`, `#EF4444`, `#F0FDF4`, `#F1F5F9`, `#F8FAFC`, `#FCA5A5`, `#FCD34D`, `#FDBA74`, `#FDE047`, `#FDFDFE`, `#FECACA`, `#FED7AA`, `#FEE2E2`, `#FEF2F2`, `#FEF3C7`, `#FEF9C3`, `#FFF7ED`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx).

**Routes:** `/maintenance/dashboard`, `/super-admin/maintenance/dashboard`, `/maintenance/preview/dashboard`.

**Named declarations:** `MaintenanceDashboard`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx), [src/features/super-admin/sub-features/maintenance/components/ProjectsTimelineCard.tsx](src/features/super-admin/sub-features/maintenance/components/ProjectsTimelineCard.tsx), [src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx](src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx), [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx), [src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx](src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 27 | `min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans']` |
| 32 | `flex-1 w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 flex flex-col` |
| 34 | `mb-6 sm:mb-8` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-12`; `items-stretch`; `lg:col-span-4`; `lg:col-span-3`; `md:col-span-2`; `lg:col-span-5`; `grid` |
| Size & spacing | `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-10`; `xl:px-12`; `py-6`; `sm:py-8`; `mb-6`; `sm:mb-8`; `m-0`; `mt-1`; `gap-6`; `h-full` |
| Type | `font-[`; `font-extrabold`; `text-[24px]`; `sm:text-[30px]`; `leading-tight`; `text-[14px]`; `sm:text-[15px]`; `font-normal`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#F8FAFC]`; `text-[#1A1C1D]`; `text-[#7A8699]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1A1C1D`, `#7A8699`, `#F8FAFC`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx).

**Routes:** `/maintenance/login`, `/super-admin/maintenance/login`.

**Named declarations:** `MaintenanceLogin`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 24 | `w-full max-w-[454px] mx-auto xl:mx-0 flex items-center gap-[8px] lg:gap-[16px] mt-8 xl:mt-auto pt-4` |
| 25 | `text-[#006D3A] w-[16px] h-[20px] shrink-0` |
| 26 | `font-['Plus_Jakarta_Sans'] font-normal text-[10px] lg:text-[12px] leading-[14px] lg:leading-[16px] text-[#3D4949]/80` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `shrink-0`; `flex-1`; `flex-col`; `justify-center`; `placeholder:text-[#6D7A7A]/40`; `cursor-pointer`; `object-contain`; `relative`; `overflow-y-auto`; `lg:overflow-hidden`; `lg:flex-row`; `lg:justify-start`; `lg:flex-1`; `overflow-hidden`; `justify-between`; `absolute`; `z-10` |
| Size & spacing | `w-full`; `max-w-[454px]`; `mx-auto`; `xl:mx-0`; `gap-[8px]`; `lg:gap-[16px]`; `mt-8`; `xl:mt-auto`; `pt-4`; `w-[16px]`; `h-[20px]`; `gap-[28px]`; `gap-3`; `m-0`; `gap-6`; `gap-2`; `h-[16px]`; `mt-1`; `p-0`; `w-[18px]`; `h-[18px]`; `mt-[4px]`; `h-[52px]`; `mt-[8px]`; `py-4`; `w-[120px]`; `h-[120px]`; `lg:w-[150px]`; `lg:h-[150px]`; `max-w-[200px]`; `gap-4`; `mt-4`; `mt-2`; `py-8`; `w-16`; `h-16`; `w-8`; `h-8`; `min-h-screen`; `lg:p-4`; `max-w-[1440px]`; `lg:min-h-0`; `lg:h-[90vh]`; `lg:max-h-[920px]`; `lg:m-4`; `xl:m-6`; `h-[38vh]`; `min-h-[290px]`; `lg:h-[calc(100%-2rem)]`; `xl:h-[calc(100%-3rem)]`; `inset-0`; `p-6`; `lg:p-[32px]`; `w-[100px]`; `lg:w-[134px]`; `mt-auto`; `mb-8`; `lg:mb-[60px]`; `px-4`; `h-full`; `py-[32px]`; `lg:py-[40px]`; `px-6`; `lg:px-[40px]`; `xl:px-0`; `xl:pl-[60px]`; `xl:pr-[60px]` |
| Type | `font-[`; `font-normal`; `text-[10px]`; `lg:text-[12px]`; `leading-[14px]`; `lg:leading-[16px]`; `font-bold`; `text-[32px]`; `lg:text-[40px]`; `leading-[1.2]`; `lg:leading-[50px]`; `tracking-[-0.9px]`; `text-[14px]`; `lg:text-[16px]`; `leading-[1.5]`; `lg:leading-[26px]`; `font-semibold`; `leading-[20px]`; `text-[16px]`; `text-sm`; `text-right`; `font-medium`; `text-center`; `lg:text-[18px]`; `leading-[1.4]`; `text-[18px]`; `text-[28px]`; `lg:text-[42px]`; `lg:leading-[52px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#006D3A]`; `text-[#3D4949]/80`; `text-[#1A1C1D]`; `text-[#3D4949]`; `border-red-500`; `border-black/10`; `text-[#6D7A7A]`; `bg-transparent`; `border-none`; `outline-hidden`; `text-red-500`; `rounded-[48px]`; `text-white`; `shadow-md`; `bg-white`; `rounded-full`; `bg-[#E5F0EB]`; `bg-[#ffffff]`; `lg:rounded-[32px]`; `bg-cover`; `bg-center`; `rounded-b-[32px]`; `lg:rounded-[24px]`; `bg-gradient-to-b`; `from-black/40`; `via-transparent`; `to-black/70` |
| Interaction / motion | `hover:underline`; `disabled:opacity-50`; `disabled:cursor-not-allowed`; `transition-all`; `hover:opacity-95`; `hover:shadow-lg`; `transition-opacity`; `hover:opacity-90`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 567 | `` style={{ backgroundImage: `url('${TractorBg}')` }} `` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 183 | `disabled={isLoggingIn}` |
| 262 | `{error && (` |
| 269 | `disabled={isSendingPassword}` |
| 525 | `disabled={isUpdatingPw}` |

**Literal palette:** `#006D3A`, `#1664A2`, `#1A1C1D`, `#1E75BB`, `#3D4949`, `#6D7A7A`, `#E5F0EB`, `#F3F3F5`, `#ffffff`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx).

**Routes:** `/maintenance/profile`, `/super-admin/maintenance/profile`, `/maintenance/preview/profile`.

**Named declarations:** `MaintenanceProfile`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceLogoutModal.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceLogoutModal.tsx), [src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 46 | `min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']` |
| 47 | `flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col` |
| 49 | `mb-6` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `items-center`; `cursor-pointer`; `overflow-hidden`; `relative`; `object-cover`; `object-center`; `sm:flex-row`; `sm:items-end`; `justify-between`; `items-end`; `shrink-0`; `self-end`; `sm:self-center`; `justify-center`; `grid-cols-1`; `sm:grid-cols-2`; `lg:grid-cols-3`; `absolute`; `-translate-y-1/2`; `inline-flex`; `grid` |
| Size & spacing | `min-h-screen`; `w-full`; `max-w-[1240px]`; `mx-auto`; `px-4`; `sm:px-6`; `lg:px-8`; `py-6`; `sm:py-8`; `mb-6`; `gap-2`; `p-0`; `w-4`; `h-4`; `p-4`; `sm:p-6`; `lg:p-8`; `gap-6`; `h-40`; `sm:h-52`; `md:h-60`; `h-full`; `px-6`; `sm:px-8`; `pb-6`; `pt-2`; `gap-4`; `-mt-14`; `w-24`; `h-24`; `sm:w-28`; `sm:h-28`; `mb-1`; `m-0`; `mt-0.5`; `w-10`; `h-10`; `w-6`; `h-6`; `p-6`; `sm:p-7`; `gap-5`; `sm:gap-5`; `gap-1.5`; `py-2.5`; `pl-4`; `pr-10`; `right-3`; `top-1/2`; `p-1`; `w-11`; `py-2`; `w-3.5`; `h-3.5` |
| Type | `font-[`; `text-sm`; `font-bold`; `text-[20px]`; `sm:text-[22px]`; `tracking-tight`; `text-xs`; `sm:text-sm`; `font-normal`; `text-[17px]`; `font-semibold`; `font-medium`; `tracking-widest`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#FDFDFE]`; `text-[#1F2937]`; `bg-transparent`; `border-none`; `stroke-[2.5]`; `bg-[#F8F9FA]`; `rounded-[32px]`; `border`; `border-[#E9EDF0]`; `shadow-2xs`; `bg-white`; `rounded-[24px]`; `border-[#ECEFF2]`; `shadow-xs`; `bg-gray-100`; `rounded-full`; `border-4`; `border-white`; `bg-orange-400`; `shadow-md`; `text-[#111827]`; `text-[#64748B]`; `bg-[#1E75BB]`; `text-white`; `stroke-[2.2]`; `border-[#E2E8F0]`; `rounded-xl`; `outline-hidden`; `text-gray-500`; `bg-[#FFF1F2]`; `text-[#EF4444]`; `border-[#FECDD3]` |
| Interaction / motion | `hover:text-[#1E75BB]`; `transition-colors`; `transform`; `transition-transform`; `hover:bg-[#FEE2E2]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#1E75BB`, `#1F2937`, `#64748B`, `#E2E8F0`, `#E9EDF0`, `#ECEFF2`, `#EF4444`, `#F8F9FA`, `#FDFDFE`, `#FECDD3`, `#FEE2E2`, `#FFF1F2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx).

**Routes:** `/maintenance/service-requests/quotation/:id`, `/super-admin/maintenance/service-requests/quotation/:id`, `/maintenance/service-requests/quotations/:id`, `/super-admin/maintenance/service-requests/quotations/:id`, `/maintenance/quotation/:id`, `/super-admin/maintenance/quotation/:id`, `/maintenance/quotations/:id`, `/super-admin/maintenance/quotations/:id`, `/maintenance/preview/service-requests/quotation/:id`, `/maintenance/preview/service-requests/quotations/:id`, `/maintenance/preview/quotation/:id`, `/maintenance/preview/quotations/:id`.

**Purpose:** Review/edit service-specific quotation inputs and approve or forward the request.

**Named declarations:** `MaintenanceQuotationDetails`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 1231 | `min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']` |
| 1234 | `flex-1 w-full px-6 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col gap-6` |
| 1236 | `flex items-center gap-2 text-xs font-semibold text-[#64748B]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceQuotationDetailsProps {
  item?: ServiceRequestPipelineItem;
  onBack?: () => void;
  onApproveSuccess?: (item: ServiceRequestPipelineItem, approvedService: string, totalAmount: number) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `items-center`; `cursor-pointer`; `sm:flex-row`; `sm:items-center`; `sm:justify-between`; `flex-wrap`; `self-start`; `sm:self-auto`; `inline-flex`; `justify-center`; `md:flex-row`; `md:items-center`; `justify-between`; `md:self-auto`; `shrink-0`; `block`; `grid-cols-1`; `md:grid-cols-3`; `relative`; `resize-y`; `fixed`; `z-50`; `z-10`; `absolute`; `underline`; `overflow-y-auto`; `grid` |
| Size & spacing | `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-12`; `py-6`; `sm:py-8`; `gap-6`; `gap-2`; `p-0`; `gap-4`; `m-0`; `mt-1`; `gap-1.5`; `sm:gap-2`; `px-3.5`; `py-1`; `w-2`; `h-2`; `gap-3`; `px-4.5`; `py-2`; `w-4`; `h-4`; `w-2.5`; `h-2.5`; `w-3.5`; `h-3.5`; `p-6`; `sm:p-8`; `p-5`; `sm:p-6`; `px-5`; `py-3`; `gap-3.5`; `w-10`; `h-10`; `w-5`; `h-5`; `sm:gap-6`; `mb-1.5`; `px-4`; `py-2.5`; `p-4`; `gap-2.5`; `pr-2`; `px-2`; `py-0.5`; `pt-2`; `inset-0`; `max-w-[480px]`; `top-5`; `right-5`; `w-8`; `h-8`; `w-16`; `h-16`; `mb-4`; `mb-5`; `max-w-sm`; `p-4.5`; `mb-6`; `sm:w-1/2`; `mt-3`; `max-w-[520px]`; `max-h-[90vh]`; `min-w-0`; `pt-2.5` |
| Type | `font-[`; `text-xs`; `font-semibold`; `font-bold`; `text-[24px]`; `sm:text-[28px]`; `font-extrabold`; `tracking-tight`; `sm:text-sm`; `font-normal`; `text-[10px]`; `font-black`; `leading-none`; `text-base`; `sm:text-lg`; `uppercase`; `tracking-wider`; `text-xl`; `sm:text-2xl`; `text-[11px]`; `truncate`; `leading-relaxed`; `text-center`; `sm:text-[22px]`; `text-left`; `font-medium`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#FDFDFE]`; `text-[#64748B]`; `border-none`; `bg-transparent`; `text-[#1E293B]`; `text-[#111827]`; `rounded-full`; `bg-[#FEF9C3]`; `text-[#A16207]`; `border`; `border-[#FDE047]/50`; `shadow-2xs`; `bg-[#EAB308]`; `bg-[#0A2540]`; `text-white`; `shadow-xs`; `bg-white/20`; `bg-[#38BDF8]`; `bg-[#DCFCE7]`; `text-[#15803D]`; `border-[#86EFAC]/60`; `bg-[#15803D]`; `stroke-[3]`; `bg-[#FEE2E2]`; `text-[#991B1B]`; `border-[#FCA5A5]/50`; `bg-[#EF4444]`; `bg-white`; `rounded-[24px]`; `border-[#E2E8F0]`; `shadow-sm`; `bg-[#F0F7FF]`; `rounded-[20px]`; `border-[#D0E4FA]`; `text-[#0F172A]`; `rounded-[16px]`; `rounded-xl`; `bg-[#EBF3FC]`; `text-[#1877F2]`; `text-[#0A2540]`; `text-[#334155]`; `border-[#CBD5E1]`; `rounded-[12px]`; `outline-none`; `bg-[#F8FAFC]`; `text-[#1C5F9D]`; `bg-[#EBF5FF]`; `border-[#BFDBFE]`; `rounded-[10px]`; `text-[#94A3B8]`; `border-t`; `border-[#F1F5F9]`; `stroke-[2.5]`; `bg-black/50`; `backdrop-blur-xs`; `rounded-[28px]`; `shadow-2xl`; `text-gray-400`; `rounded-[18px]` |
| Interaction / motion | `hover:text-[#1877F2]`; `transition-colors`; `transition-all`; `hover:bg-[#BBF7D0]`; `hover:bg-[#FECACA]`; `focus:border-[#1877F2]`; `read-only:bg-[#F1F5F9]`; `read-only:text-[#475569]`; `read-only:cursor-not-allowed`; `disabled:bg-[#F1F5F9]`; `disabled:text-[#475569]`; `disabled:cursor-not-allowed`; `hover:bg-gray-50`; `disabled:opacity-60`; `hover:bg-[#166534]`; `active:scale-98`; `hover:bg-[#07192C]`; `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `hover:text-[#0F172A]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 515 | `if (farmlandServiceItems.length === 0) return;` |
| 533 | `if (approvedTabKeys.length === 0) return;` |
| 536 | `if (pending.length === 0) return prev;` |
| 574 | `if (otherServiceKeys.length === 0) return;` |
| 583 | `if (missing.length === 0) return prev;` |
| 733 | `if (farmlandServiceItems.length === 0) return;` |
| 1140 | `if (isFinalStep && otherPendingKeys.length === 0) {` |
| 1391 | `readOnly={isActiveServiceReadOnly}` |
| 1406 | `readOnly={isActiveServiceReadOnly}` |
| 1419 | `readOnly={isActiveServiceReadOnly}` |
| 1449 | `disabled={isActiveServiceReadOnly}` |
| 1479 | `readOnly={isActiveServiceReadOnly}` |
| 1498 | `readOnly={isActiveServiceReadOnly}` |
| 1519 | `disabled={isSaving \|\| isApproving \|\| isActiveServiceReadOnly}` |
| 1538 | `disabled={isSaving \|\| isApproving}` |
| 1668 | `role="dialog"` |
| 1669 | `aria-modal="true"` |
| 1670 | `aria-labelledby="all-approved-title"` |
| 1676 | `aria-label="Close"` |
| 1741 | `disabled={isConfirmingReview}` |

**Literal palette:** `#07192C`, `#0A2540`, `#0F172A`, `#111827`, `#15803D`, `#166534`, `#1877F2`, `#1C5F9D`, `#1E293B`, `#334155`, `#38BDF8`, `#475569`, `#64748B`, `#86EFAC`, `#94A3B8`, `#991B1B`, `#A16207`, `#BBF7D0`, `#BFDBFE`, `#CBD5E1`, `#D0E4FA`, `#DCFCE7`, `#E2E8F0`, `#EAB308`, `#EBF3FC`, `#EBF5FF`, `#EF4444`, `#F0F7FF`, `#F1F5F9`, `#F8FAFC`, `#FCA5A5`, `#FDE047`, `#FDFDFE`, `#FECACA`, `#FEE2E2`, `#FEF9C3`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx).

**Routes:** `/maintenance/service-requests`, `/super-admin/maintenance/service-requests`, `/maintenance/service-requests/new-requests`, `/super-admin/maintenance/service-requests/new-requests`, `/maintenance/service-requests/quotations`, `/super-admin/maintenance/service-requests/quotations`, `/maintenance/service-requests/customer-response`, `/super-admin/maintenance/service-requests/customer-response`, `/maintenance/preview/service-requests`, `/maintenance/preview/service-requests/new-requests`, `/maintenance/preview/service-requests/quotations`, `/maintenance/preview/service-requests/customer-response`.

**Purpose:** Search/filter/paginate New Requests, Quotations and Customer Response tables and launch workflow dialogs.

**Named declarations:** `MaintenanceServiceRequests`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx), [src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx](src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx), [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx), [src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx](src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx), [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx), [src/features/super-admin/sub-features/maintenance/components/UnderVerificationDetailsModal.tsx](src/features/super-admin/sub-features/maintenance/components/UnderVerificationDetailsModal.tsx), [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 594 | `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0284C7] uppercase` |
| 601 | `inline-flex items-center gap-1.5` |
| 602 | `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFEDD5] text-[#C2410C] uppercase` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `inline-flex`; `items-center`; `flex`; `flex-col`; `flex-1`; `md:flex-row`; `md:items-center`; `md:justify-between`; `relative`; `absolute`; `-translate-y-1/2`; `placeholder:text-gray-400`; `lg:flex-row`; `lg:items-center`; `lg:justify-between`; `flex-wrap`; `cursor-pointer`; `justify-center`; `self-start`; `lg:self-auto`; `overflow-hidden`; `overflow-x-auto`; `divide-y`; `divide-gray-100/80`; `block`; `shrink-0`; `sm:flex-row`; `justify-between` |
| Size & spacing | `px-2.5`; `py-0.5`; `gap-1.5`; `px-1.5`; `py-0.2`; `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-12`; `py-6`; `sm:py-8`; `gap-4`; `mb-6`; `gap-3`; `m-0`; `gap-1`; `w-3`; `h-3`; `mt-1`; `sm:w-80`; `w-4`; `h-4`; `left-4`; `top-1/2`; `pl-10`; `pr-4`; `py-2.5`; `gap-2`; `px-4`; `py-2`; `w-3.5`; `h-3.5`; `w-2`; `h-2`; `p-0`; `p-1`; `px-5`; `p-12`; `w-8`; `h-8`; `mb-3`; `my-auto`; `mt-4`; `min-w-[760px]`; `py-4.5`; `px-8`; `w-[14%]`; `w-[18%]`; `w-[16%]`; `w-[15%]`; `w-[13%]`; `w-[24%]`; `w-[11%]`; `w-[9%]`; `max-w-xs`; `md:max-w-sm`; `px-3`; `py-1`; `py-4`; `px-2`; `py-1.5` |
| Type | `text-[11px]`; `font-bold`; `uppercase`; `text-[10px]`; `font-[`; `font-extrabold`; `text-[24px]`; `sm:text-[28px]`; `tracking-tight`; `font-medium`; `text-sm`; `font-normal`; `text-xs`; `font-semibold`; `text-center`; `text-left`; `text-[12px]`; `tracking-wider`; `whitespace-nowrap`; `sm:text-sm`; `truncate`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `rounded-full`; `bg-[#E0F2FE]`; `text-[#0284C7]`; `bg-[#FFEDD5]`; `text-[#C2410C]`; `bg-white`; `text-gray-500`; `border`; `border-gray-200`; `bg-[#F3E8FF]`; `text-[#7E22CE]`; `bg-[#DCFCE7]`; `text-[#15803D]`; `bg-[#FDFDFE]`; `text-[#1A1C1D]`; `text-blue-600`; `bg-blue-50`; `text-[#7A8699]`; `text-gray-400`; `bg-[#F8F9FB]`; `border-[#E2E8F0]`; `text-gray-900`; `outline-hidden`; `shadow-2xs`; `text-[#1877F2]`; `bg-[#1877F2]`; `bg-[#F3F4F6]`; `text-[#374151]`; `bg-transparent`; `border-none`; `border-gray-300`; `border-transparent`; `bg-[#F1F4F7]`; `shadow-xs`; `rounded-[24px]`; `border-gray-100`; `text-gray-800`; `border-[#ECEFF2]`; `text-white`; `border-gray-100/90`; `border-collapse`; `bg-[#F4F6F8]`; `text-[#64748B]`; `border-b`; `bg-[#F1F5F9]`; `text-[#475569]`; `bg-[#E8F1FD]`; `text-[#4B5563]`; `bg-[#DBEAFE]`; `text-[#1D4ED8]`; `bg-[#1D4ED8]`; `bg-[#C2410C]`; `bg-[#FEF08A]`; `text-[#854D0E]`; `bg-[#854D0E]`; `bg-[#15803D]`; `bg-[#FEE2E2]`; `text-[#DC2626]`; `bg-[#DC2626]`; `bg-[#DCFCE7]/80`; `border-t`; `bg-[#F8F9FA]`; `rounded-lg`; `text-gray-700`; `outline-none`; `text-gray-600` |
| Interaction / motion | `animate-pulse`; `animate-spin`; `focus:border-[#1877F2]`; `focus:bg-white`; `transition-all`; `hover:bg-gray-50`; `transition-colors`; `hover:text-gray-700`; `hover:text-gray-800`; `hover:bg-[#166FE5]`; `hover:bg-gray-50/60`; `disabled:opacity-75`; `hover:shadow-xs`; `active:scale-98`; `hover:bg-gray-100`; `disabled:opacity-40`; `disabled:hover:bg-transparent`; `disabled:cursor-not-allowed` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 93 | `if (withInfo.length === 0) return undefined;` |
| 470 | `} else if (isError) {` |
| 1003 | `{(isApiLoading \|\| isApiFetching) && filteredRequests.length === 0 ? (` |
| 1188 | `disabled={verifyingFarmlandId === item.id}` |
| 1249 | `disabled={currentPage === 1}` |
| 1272 | `disabled={currentPage === totalPages \|\| totalPages === 0}` |

**Literal palette:** `#0284C7`, `#15803D`, `#166FE5`, `#1877F2`, `#1A1C1D`, `#1D4ED8`, `#374151`, `#475569`, `#4B5563`, `#64748B`, `#7A8699`, `#7E22CE`, `#854D0E`, `#C2410C`, `#DBEAFE`, `#DC2626`, `#DCFCE7`, `#E0F2FE`, `#E2E8F0`, `#E8F1FD`, `#ECEFF2`, `#F1F4F7`, `#F1F5F9`, `#F3E8FF`, `#F3F4F6`, `#F4F6F8`, `#F8F9FA`, `#F8F9FB`, `#FDFDFE`, `#FEE2E2`, `#FEF08A`, `#FFEDD5`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx).

**Routes:** `/maintenance/service-requests/verify/:id`, `/super-admin/maintenance/service-requests/verify/:id`, `/maintenance/preview/service-requests/verify/:id`.

**Purpose:** Select request services and field-officer assignment in a page/embedded verification view.

**Named declarations:** `MaintenanceVerifyRequest`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx), [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 81 | `w-4 h-4 text-[#388E3C] stroke-[2.2]` |
| 83 | `w-4 h-4 text-[#388E3C] stroke-[2.2]` |
| 85 | `w-4 h-4 text-[#388E3C] stroke-[2.2]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceVerifyRequestProps {
  requestItem?: ServiceRequestPipelineItem;
  onBack?: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-1`; `items-center`; `justify-center`; `cursor-pointer`; `grid-cols-1`; `lg:grid-cols-12`; `items-start`; `lg:col-span-6`; `divide-y`; `divide-[#E9ECEF]`; `grid-cols-12`; `col-span-4`; `col-span-8`; `justify-between`; `relative`; `shrink-0`; `placeholder:text-[#94A3B8]`; `placeholder:font-normal`; `absolute`; `z-30`; `overflow-y-auto`; `grid` |
| Size & spacing | `w-4`; `h-4`; `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-10`; `xl:px-12`; `py-6`; `sm:py-8`; `gap-3.5`; `mb-6`; `w-8`; `h-8`; `p-0`; `w-5`; `h-5`; `m-0`; `gap-8`; `p-7`; `sm:p-9`; `gap-4`; `pb-4.5`; `py-4.5`; `pt-0.5`; `gap-2.5`; `ml-6.5`; `mt-0.5`; `pt-4.5`; `min-h-[360px]`; `mt-1`; `mt-6`; `gap-3`; `p-1`; `w-3.5`; `h-3.5`; `top-[calc(100%+6px)]`; `left-0`; `right-0`; `p-2`; `max-h-72`; `gap-1`; `p-4`; `sm:p-5`; `p-3.5`; `sm:p-4`; `w-9`; `h-9`; `mt-8`; `h-[48px]` |
| Type | `font-[`; `text-[24px]`; `sm:text-[27px]`; `font-normal`; `tracking-tight`; `text-[13.5px]`; `font-medium`; `text-[14px]`; `font-bold`; `tracking-wide`; `leading-relaxed`; `text-[11.5px]`; `text-[16px]`; `sm:text-[17px]`; `text-[13px]`; `text-center`; `text-xs`; `text-left`; `text-[11px]`; `leading-tight`; `text-[12px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#388E3C]`; `stroke-[2.2]`; `bg-[#FFFFFF]`; `rounded-full`; `bg-transparent`; `border-none`; `text-[#1F2937]`; `text-[#111827]`; `bg-[#F8F9FA]`; `rounded-[24px]`; `border`; `border-[#ECEFF2]`; `shadow-2xs`; `text-[#64748B]`; `text-[#374151]`; `bg-white`; `border-[#EBEFF3]`; `shadow-[0_2px_12px_rgba(0,0,0,0.02)]`; `border-[#1E75BB]`; `ring-2`; `ring-[#1E75BB]/10`; `border-dashed`; `border-[#CBD5E1]`; `text-[#94A3B8]`; `outline-hidden`; `text-gray-400`; `rounded-2xl`; `shadow-xl`; `border-gray-100`; `bg-[#F8FAFC]`; `border-[#E2E8F0]`; `rounded-xl`; `border-gray-200`; `text-gray-500`; `bg-[#DCFCE7]`; `text-[#15803D]`; `bg-[#F1F5F9]`; `text-[#1E293B]`; `bg-blue-50/70`; `text-[#1E75BB]`; `text-gray-800`; `stroke-[2.5]`; `bg-[#1E75BB]`; `text-white`; `shadow-xs`; `bg-[#DCE4EC]`; `text-[#7A8C9E]` |
| Interaction / motion | `hover:bg-gray-100`; `transition-colors`; `hover:border-[#1E75BB]/60`; `hover:text-gray-600`; `animate-in`; `fade-in`; `zoom-in-95`; `hover:bg-[#E2E8F0]`; `hover:bg-[#1864A0]`; `hover:shadow-md`; `hover:bg-[#D5DFE8]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 271 | `{filteredOfficers.length === 0 ? (` |

**Literal palette:** `#111827`, `#15803D`, `#1864A0`, `#1E293B`, `#1E75BB`, `#1F2937`, `#374151`, `#388E3C`, `#64748B`, `#7A8C9E`, `#94A3B8`, `#CBD5E1`, `#D5DFE8`, `#DCE4EC`, `#DCFCE7`, `#E2E8F0`, `#E9ECEF`, `#EBEFF3`, `#ECEFF2`, `#F1F5F9`, `#F8F9FA`, `#F8FAFC`, `#FFFFFF`, `rgba(0,0,0,0.02)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx).

**Routes:** `/maintenance/work-orders`, `/super-admin/maintenance/work-orders`, `/maintenance/work-orders/:id`, `/super-admin/maintenance/work-orders/:id`, `/maintenance/preview/work-orders`, `/maintenance/preview/work-orders/:id`.

**Purpose:** Filter/paginate work orders and show selected in-progress detail.

**Named declarations:** `MaintenanceWorkOrders`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx), [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx), [src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx](src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 235 | `flex items-center gap-1.5` |
| 240 | `px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]` |
| 251 | `min-h-screen bg-[#FDFDFE] flex flex-col font-['Plus_Jakarta_Sans']` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `flex-col`; `flex-1`; `md:flex-row`; `md:items-center`; `md:justify-between`; `relative`; `absolute`; `-translate-y-1/2`; `placeholder:text-gray-400`; `sm:flex-row`; `items-stretch`; `sm:items-center`; `justify-between`; `cursor-pointer`; `self-start`; `sm:self-auto`; `overflow-hidden`; `overflow-x-auto`; `divide-y`; `divide-[#F1F3F5]`; `inline-flex`; `shrink-0`; `appearance-none`; `pointer-events-none` |
| Size & spacing | `gap-1.5`; `px-2.5`; `py-0.5`; `px-1.5`; `min-h-screen`; `w-full`; `px-6`; `sm:px-8`; `lg:px-10`; `xl:px-12`; `py-6`; `sm:py-8`; `gap-4`; `mb-6`; `m-0`; `mt-1`; `sm:w-80`; `w-4`; `h-4`; `left-4`; `top-1/2`; `pl-10`; `pr-4`; `py-2.5`; `gap-2`; `px-4`; `py-2`; `w-3.5`; `h-3.5`; `p-1`; `px-5`; `py-4`; `py-12`; `gap-2.5`; `py-1`; `w-1.5`; `h-1.5`; `px-3.5`; `w-2`; `h-2`; `px-4.5`; `py-1.5`; `pl-2`; `pr-6`; `right-1.5`; `gap-1` |
| Type | `text-[11px]`; `font-bold`; `tracking-wide`; `text-[10px]`; `font-[`; `font-extrabold`; `text-[24px]`; `sm:text-[28px]`; `tracking-tight`; `text-xs`; `sm:text-sm`; `font-normal`; `font-semibold`; `text-left`; `uppercase`; `tracking-wider`; `text-right`; `text-center`; `font-medium`; `whitespace-nowrap`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#E0F2FE]`; `text-[#0284C7]`; `bg-[#FFEDD5]`; `text-[#C2410C]`; `bg-[#F3E8FF]`; `text-[#9333EA]`; `bg-[#DCFCE7]`; `text-[#16A34A]`; `rounded-full`; `bg-[#F1F5F9]`; `text-[#64748B]`; `bg-[#FDFDFE]`; `text-[#1A1C1D]`; `text-[#7A8699]`; `text-gray-400`; `bg-[#F4F5F7]`; `border-none`; `text-gray-900`; `outline-hidden`; `bg-white`; `border`; `border-[#E2E8F0]`; `text-[#1E75BB]`; `shadow-2xs`; `bg-[#F1F4F8]`; `shadow-xs`; `bg-transparent`; `rounded-[24px]`; `border-[#ECEFF2]`; `border-collapse`; `bg-[#F8F9FA]`; `border-b`; `border-[#EEF2F6]`; `bg-[#F1F3F5]`; `text-[#334155]`; `rounded-md`; `bg-[#FEECEC]`; `text-[#EF4444]`; `bg-[#EF4444]`; `bg-[#16A34A]`; `text-[#111827]`; `text-[#1E293B]`; `bg-[#1E293B]`; `bg-[#1E75BB]`; `text-white`; `border-t`; `border-gray-200`; `rounded-lg`; `text-gray-700`; `text-gray-500`; `text-gray-600` |
| Interaction / motion | `focus:ring-2`; `focus:ring-[#1E75BB]/20`; `hover:bg-gray-50`; `transition-colors`; `hover:text-[#1A1C1D]`; `hover:bg-gray-50/60`; `hover:bg-[#1864A0]`; `focus:border-[#1E75BB]`; `hover:text-[#111827]`; `disabled:opacity-40`; `disabled:cursor-not-allowed`; `hover:bg-gray-100` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 356 | `{paginatedOrders.length === 0 ? (` |
| 484 | `disabled={currentPage === 1}` |
| 509 | `disabled={currentPage === totalPages}` |

**Literal palette:** `#0284C7`, `#111827`, `#16A34A`, `#1864A0`, `#1A1C1D`, `#1E293B`, `#1E75BB`, `#334155`, `#64748B`, `#7A8699`, `#9333EA`, `#C2410C`, `#DCFCE7`, `#E0F2FE`, `#E2E8F0`, `#ECEFF2`, `#EEF2F6`, `#EF4444`, `#F1F3F5`, `#F1F4F8`, `#F1F5F9`, `#F3E8FF`, `#F4F5F7`, `#F8F9FA`, `#FDFDFE`, `#FEECEC`, `#FFEDD5`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx).

**Routes:** `/super-admin/pool-buying`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/components/ui/button.tsx](src/components/ui/button.tsx), [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx), [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx), [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx), [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 20 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 23 | `shrink-0` |
| 29 | `flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `shrink-0`; `items-start`; `justify-between`; `relative`; `z-10`; `md:flex-row`; `md:items-end`; `items-center`; `flex-1`; `justify-center`; `xl:flex-row`; `xl:items-center`; `flex-wrap`; `grid-cols-1`; `md:grid-cols-2`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-4`; `mt-4`; `w-full`; `h-full`; `mt-auto`; `mb-6`; `mt-6`; `gap-6`; `gap-3`; `px-6`; `gap-2`; `xl:w-[320px]`; `h-10`; `px-4`; `py-2` |
| Type | `text-[1.5rem]`; `font-bold`; `tracking-tight`; `text-[0.875rem]`; `font-medium`; `text-sm` |
| Appearance | `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `rounded-full`; `bg-[#2D3032]`; `text-white`; `text-gray-400`; `bg-white`; `border-gray-200`; `border`; `text-gray-700` |
| Interaction / motion | `hover:bg-black`; `hover:bg-gray-50` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx).

**Routes:** `/super-admin/pool-buying/all`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/components/ui/button.tsx](src/components/ui/button.tsx), [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 22 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 23 | `bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-6 min-h-screen` |
| 26 | `flex items-center justify-between` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `justify-between`; `flex-1`; `justify-center`; `xl:flex-row`; `xl:items-center`; `flex-wrap`; `grid-cols-1`; `md:grid-cols-2`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-6`; `min-h-screen`; `gap-2`; `px-4`; `py-2`; `gap-3`; `px-6`; `gap-4`; `w-full`; `xl:w-[260px]`; `h-10` |
| Type | `text-sm`; `font-medium` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `bg-[#2D3032]`; `text-white`; `text-gray-400`; `text-gray-700` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `hover:bg-black` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#F6F7F6`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx).

**Routes:** `/super-admin/pool-buying/create`.

**Purpose:** Draw/edit/split SVG polygons and configure an investment pool with undo/redo and view controls.

**Named declarations:** `SuperAdminPoolCreate`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 424 | `min-h-screen bg-[#f0f0f0] font-sans` |
| 425 | `px-8 py-7 pb-10 max-w-[1320px] mx-auto` |
| 426 | `inline-flex items-center gap-1.5 bg-white border border-[#e0e0e0] rounded-[22px] px-4 py-[7px] text-[13px] font-medium text-[#222] cursor-pointer mb-5 hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `inline-flex`; `items-center`; `cursor-pointer`; `flex`; `flex-col`; `lg:flex-row`; `items-start`; `flex-1`; `overflow-hidden`; `relative`; `select-none`; `absolute`; `pointer-events-none`; `z-10`; `-translate-x-1/2`; `justify-center`; `shrink-0`; `overflow-y-auto`; `custom-scrollbar`; `justify-between`; `box-border`; `cursor-not-allowed`; `block`; `appearance-none`; `-translate-y-1/2` |
| Size & spacing | `min-h-screen`; `px-8`; `py-7`; `pb-10`; `max-w-[1320px]`; `mx-auto`; `gap-1.5`; `px-4`; `py-[7px]`; `mb-5`; `m-0`; `gap-5`; `min-w-0`; `w-full`; `h-[680px]`; `inset-0`; `h-full`; `top-4`; `right-4`; `px-[18px]`; `py-3`; `mt-1.5`; `mt-0.5`; `left-1/2`; `gap-2`; `py-2`; `left-4`; `p-3`; `min-w-[170px]`; `gap-0.5`; `px-1.5`; `pt-0.5`; `pb-1.5`; `px-2`; `mt-2`; `pt-2`; `bottom-[60px]`; `px-3.5`; `py-1.5`; `bottom-[64px]`; `w-9`; `h-9`; `p-0`; `bottom-4`; `lg:w-[290px]`; `gap-4`; `max-h-[calc(100vh-180px)]`; `pr-0.5`; `p-5`; `pb-4`; `mb-4`; `p-0.5`; `py-[9px]`; `px-3`; `mt-px`; `py-[13px]`; `mb-2`; `gap-2.5`; `p-2`; `mb-1`; `w-2.5`; `h-2.5`; `ml-auto`; `mb-3.5`; `mb-1.5`; `pl-3`; `pr-9`; `right-2.5`; `top-1/2` |
| Type | `font-sans`; `text-[13px]`; `font-medium`; `text-[28px]`; `font-bold`; `tracking-tight`; `text-[17px]`; `font-extrabold`; `tracking-[-0.3px]`; `text-[9px]`; `font-semibold`; `tracking-[0.8px]`; `uppercase`; `tracking-[1px]`; `text-left`; `text-[12px]`; `whitespace-nowrap`; `text-[15px]`; `text-[14px]`; `leading-tight`; `text-[11px]`; `tracking-[0.1px]`; `text-[11.5px]` |
| Appearance | `bg-[#f0f0f0]`; `bg-white`; `border`; `border-[#e0e0e0]`; `rounded-[22px]`; `text-[#222]`; `text-[#111]`; `rounded-2xl`; `shadow-[0_2px_12px_rgba(0,0,0,0.12)]`; `rounded-xl`; `shadow-[0_2px_12px_rgba(0,0,0,0.15)]`; `text-[#888]`; `border-none`; `rounded-lg`; `text-[#333]`; `shadow-[0_1px_6px_rgba(0,0,0,0.15)]`; `shadow-[0_2px_10px_rgba(0,0,0,0.15)]`; `bg-transparent`; `rounded-md`; `text-[#555]`; `border-t`; `border-[#f0f0f0]`; `bg-black/75`; `text-white`; `bg-black/85`; `border-white/20`; `shadow-[0_1px_6px_rgba(0,0,0,0.07)]`; `text-[#666]`; `border-[1.5px]`; `border-[#e8e8e8]`; `outline-none`; `bg-gray-50`; `text-gray-500`; `bg-[#2a2f1e]`; `rounded-sm`; `bg-[#a3d628]/90`; `border-[#555]`; `text-[#bbb]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `transition-opacity`; `hover:bg-black`; `hover:text-black`; `focus:border-[#8fbc2a]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 437 | `style={{ background: mapBg, cursor: getCursor() }}` |
| 470 | `style={{ cursor: activeTool === "delete" ? "not-allowed" : activeTool === "edit" ? "default" : "pointer" }}` |
| 482 | `style={{ cursor: "grab", pointerEvents: "all" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 113 | `if (points.length === 0) return "";` |
| 199 | `if (r.length === 0) return r;` |
| 542 | `disabled={history.length <= 1}` |
| 547 | `` className={`inline-flex items-center gap-1.5 bg-white border-none rounded-lg px-4 py-2 text-[13px] font-medium text-[#333] cursor-pointer shadow-[0_1px_6px_rgba(0,0,0,0.15)] transition-opacity ${redoStack.length === 0 ? "opacity-40" : "opacity-100 hover:bg-gray-50"}`} `` |
| 549 | `disabled={redoStack.length === 0}` |
| 603 | `{activeTool === "draw" && inProgressPoints.length === 0 && "Click to start drawing a polygon"}` |
| 607 | `{activeTool === "split" && splitPoints.length === 0 && "Click start point of split line"}` |

**Literal palette:** `#111`, `#222`, `#2244cc`, `#22cc44`, `#2a2`, `#2a2f1e`, `#2c5f8a`, `#333`, `#3a7bd5`, `#4a8f4a`, `#555`, `#666`, `#888`, `#8fbc2a`, `#8fbc5a`, `#a3d628`, `#b8d4a0`, `#bbb`, `#c00`, `#c8ddb0`, `#c9a84c`, `#ccc`, `#d4e8c2`, `#dde8c8`, `#e0e0e0`, `#e53535`, `#e8e8e8`, `#e8f0d8`, `#f0f0f0`, `#f0f4ff`, `#f5f5f5`, `#f90`, `#ffeaea`, `rgba(0,0,0,0.07)`, `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.15)`, `rgba(100,180,40,0.55)`, `rgba(163,214,40,0.72)`, `rgba(20,20,20,0.7)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx).

**Routes:** `/super-admin/pool-buying/created`.

**Purpose:** Review locally stored created pools, selected boundary image and investment summary.

**Named declarations:** `SuperAdminPoolCreated`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 58 | `min-h-screen bg-[#f0f0f0] font-sans box-border p-4` |
| 59 | `bg-white rounded-[20px] pt-6 px-7 pb-9 min-h-[calc(100vh-32px)] box-border flex flex-col` |
| 62 | `inline-flex items-center gap-1.5 bg-white border border-[#e5e7eb] rounded-[22px] py-[7px] px-4 text-[13px] font-medium text-[#1f2937] cursor-pointer mb-[18px] w-fit hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `inline-flex`; `items-center`; `cursor-pointer`; `relative`; `overflow-hidden`; `shrink-0`; `object-cover`; `block`; `absolute`; `pointer-events-none`; `-translate-x-1/2`; `-translate-y-1/2`; `z-10`; `justify-center`; `grid-cols-[350px_1fr]`; `items-start`; `flex-1`; `overflow-y-auto`; `grid-cols-3`; `grid-cols-1`; `grid-cols-2`; `grid-cols-4`; `self-end`; `justify-between`; `cursor-default`; `grid` |
| Size & spacing | `min-h-screen`; `p-4`; `pt-6`; `px-7`; `pb-9`; `min-h-[calc(100vh-32px)]`; `gap-1.5`; `py-[7px]`; `px-4`; `mb-[18px]`; `w-fit`; `m-0`; `w-full`; `h-[360px]`; `mb-5`; `h-full`; `inset-0`; `top-1/2`; `left-1/2`; `py-1.5`; `right-3.5`; `bottom-3.5`; `w-[38px]`; `h-[38px]`; `p-0`; `gap-5`; `mb-3`; `gap-2`; `max-h-[460px]`; `pr-1`; `gap-2.5`; `p-3`; `w-3`; `h-3`; `min-w-0`; `p-6`; `pb-2`; `gap-3`; `h-px`; `my-5`; `gap-x-4`; `gap-y-3`; `p-5`; `py-3.5`; `px-0`; `w-[30%]`; `mt-1`; `px-3.5`; `py-2.5`; `min-h-[20px]`; `px-3`; `w-8`; `h-8` |
| Type | `font-sans`; `text-[13px]`; `font-medium`; `text-[24px]`; `font-bold`; `tracking-tight`; `text-[20px]`; `font-light`; `font-semibold`; `text-[14px]`; `text-[13.5px]`; `truncate`; `text-[12px]`; `text-[18px]`; `tracking-wide`; `text-[11px]`; `uppercase`; `tracking-wider`; `whitespace-nowrap` |
| Appearance | `bg-[#f0f0f0]`; `bg-white`; `rounded-[20px]`; `border`; `border-[#e5e7eb]`; `rounded-[22px]`; `text-[#1f2937]`; `text-[#111]`; `rounded-2xl`; `text-white`; `bg-white/70`; `backdrop-blur-sm`; `rounded-md`; `text-[#333]`; `rounded-[10px]`; `shadow-lg`; `bg-black/85`; `border-none`; `border-t`; `border-white/15`; `border-[#eef0f2]`; `rounded-xl`; `rounded-full`; `border-b`; `border-[#f0f0f0]`; `bg-[#eef0f2]`; `bg-[#2a2f1e]`; `shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]`; `text-[#555]`; `bg-[#f9fafa]`; `rounded-lg`; `text-[#222]`; `bg-[#f0f4e3]`; `text-[#777]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `hover:bg-black` |

| Inline style source line | Exact declaration |
| --- | --- |
| 96 | `style={{ left:pos.x, top:pos.y }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#111`, `#1f2937`, `#222`, `#2a2f1e`, `#333`, `#555`, `#6b7c45`, `#777`, `#888`, `#8fbc2a`, `#9ca3af`, `#d1d5db`, `#e5e7eb`, `#eef0f2`, `#f0f0f0`, `#f0f4e3`, `#f5faeb`, `#f9fafa`, `rgba(0,0,0,0.12)`, `rgba(100,150,30,0.5)`, `rgba(140,190,50,0.35)`, `rgba(140,190,50,0.45)`, `rgba(140,190,50,0.55)`, `rgba(160,210,60,0.4)`, `rgba(170,220,70,0.55)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx).

**Routes:** `/super-admin/pool-buying/:id`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 109 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 110 | `bg-[#F6F7F6] rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 min-h-screen` |
| 116 | `flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `justify-between`; `xl:flex-row`; `items-stretch`; `flex-1`; `overflow-hidden`; `relative`; `absolute`; `z-10`; `object-cover`; `justify-center`; `cursor-pointer`; `shrink-0`; `last:border-b-0` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `lg:p-8`; `gap-6`; `min-h-screen`; `gap-2`; `px-5`; `py-2.5`; `px-3`; `py-1`; `h-[550px]`; `top-4`; `left-4`; `py-2`; `gap-1.5`; `w-2.5`; `h-2.5`; `right-4`; `px-4`; `w-full`; `h-full`; `inset-0`; `w-5`; `h-5`; `px-2`; `w-4`; `h-4`; `py-3`; `mx-auto`; `mb-1`; `mt-0.5`; `xl:w-[300px]`; `gap-5`; `mb-4`; `gap-3`; `w-9`; `h-9`; `px-6`; `py-4`; `py-16`; `mb-3` |
| Type | `text-sm`; `font-medium`; `text-[1.75rem]`; `font-bold`; `tracking-tight`; `text-xs`; `font-inter`; `text-[0.6875rem]`; `uppercase`; `tracking-wide`; `text-base`; `text-lg`; `font-light`; `text-[0.5rem]`; `font-semibold`; `leading-tight`; `whitespace-nowrap`; `text-[0.45rem]`; `text-center`; `text-[10px]`; `text-[1.125rem]`; `text-[1rem]`; `text-left`; `text-[0.625rem]`; `tracking-[0.1em]`; `text-[0.875rem]` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `rounded-[20px]`; `bg-white/90`; `backdrop-blur-sm`; `rounded-xl`; `shadow-sm`; `bg-[#3B82F6]`; `bg-[#86EFAC]`; `text-gray-500`; `text-gray-900`; `text-white`; `bg-white/95`; `rounded-lg`; `text-[var(--text-muted)]`; `text-gray-400`; `text-[#1B3A2D]`; `bg-[#F0F7E4]`; `border-b`; `border-gray-100`; `border-gray-50`; `text-gray-300` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `hover:bg-white`; `hover:bg-gray-50/50` |

| Inline style source line | Exact declaration |
| --- | --- |
| 131 | `style={{ background: createdPool.active ? "#e8f5e9" : "#fff3e0", color: createdPool.active ? "#2e7d32" : "#e65100", }}` |
| 176 | `style={{ opacity: 0.4 }}` |
| 205 | `style={{ top: marker.top, left: marker.left, transform: "translate(-50%, -50%)" }}` |
| 227 | `style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}` |
| 243 | `style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1B3A2D`, `#2e7d32`, `#3B82F6`, `#86EFAC`, `#F0F7E4`, `#F6F7F6`, `#e65100`, `#e8f5e9`, `#fff3e0`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx).

**Routes:** `/super-admin/pool-buying/:id/investor/:investorId`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 26 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 27 | `bg-[#F6F7F6] rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 min-h-screen` |
| 33 | `flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `relative`; `object-cover`; `absolute`; `xl:flex-row`; `flex-1`; `overflow-hidden`; `justify-center`; `shrink-0`; `justify-between`; `last:border-b-0`; `items-start`; `grid-cols-1`; `md:grid-cols-2`; `object-contain`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `lg:p-8`; `gap-6`; `min-h-screen`; `gap-2`; `px-5`; `py-2.5`; `gap-4`; `w-14`; `h-14`; `bottom-0.5`; `right-0.5`; `w-3`; `h-3`; `gap-3`; `mt-0.5`; `gap-0.5`; `w-full`; `h-[350px]`; `h-full`; `inset-0`; `px-2`; `py-1`; `w-5`; `h-5`; `bottom-4`; `right-4`; `gap-1`; `w-9`; `h-9`; `xl:w-[320px]`; `gap-0`; `mb-3`; `py-3`; `px-3`; `py-4`; `mb-6`; `gap-x-12`; `gap-y-5`; `py-2`; `w-8`; `h-8`; `w-4`; `h-4` |
| Type | `text-sm`; `font-medium`; `font-inter`; `font-bold`; `text-[1.5rem]`; `leading-tight`; `text-[0.8125rem]`; `text-[1.125rem]`; `text-[0.6875rem]`; `font-semibold`; `text-lg`; `font-light`; `text-[0.875rem]`; `text-[0.75rem]`; `uppercase`; `tracking-wide`; `leading-relaxed` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `border-2`; `border-white`; `shadow-sm`; `bg-green-500`; `text-[var(--text-muted)]`; `text-gray-300`; `rounded-[20px]`; `rounded-[16px]`; `border-gray-100`; `bg-[#C5D654]/40`; `border-[#C5D654]`; `rounded-md`; `bg-white/90`; `rounded`; `text-white/60`; `rounded-xl`; `shadow-md`; `border-b`; `bg-[#1B3A2D]`; `text-white`; `bg-[#F0F7E4]`; `border-[#D4E8B0]`; `text-[#1B3A2D]`; `text-[#3D5A1E]`; `bg-gray-100` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 92 | `style={{ opacity: 0.35 }}` |
| 104 | `style={{ top: "35%", left: "30%", width: "20%", height: "25%" }}` |
| 122 | `style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1B3A2D`, `#3D5A1E`, `#C5D654`, `#D4E8B0`, `#F0F7E4`, `#F6F7F6`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx).

**Routes:** `/super-admin/pool-buying/published`.

**Purpose:** Confirm pool publication with a completion surface.

**Named declarations:** `SuperAdminPoolPublished`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 46 | `min-h-screen bg-[#f0f0f0] font-sans flex flex-col p-4 box-border` |
| 48 | `flex-1 bg-white rounded-[20px] flex flex-col overflow-hidden` |
| 50 | `flex items-center justify-between px-7 py-5` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `box-border`; `flex-1`; `overflow-hidden`; `items-center`; `justify-between`; `inline-flex`; `cursor-pointer`; `object-cover`; `justify-center` |
| Size & spacing | `min-h-screen`; `p-4`; `px-7`; `py-5`; `gap-1.5`; `px-[18px]`; `py-[8px]`; `gap-3`; `p-1.5`; `w-9`; `h-9`; `py-[60px]`; `px-5`; `pt-[40px]`; `px-[48px]`; `pb-[36px]`; `w-full`; `max-w-[420px]`; `m-0`; `mb-6`; `mb-7`; `py-[14px]`; `px-[64px]`; `max-w-[240px]` |
| Type | `font-sans`; `text-[13px]`; `font-medium`; `text-[20px]`; `font-bold`; `text-center`; `tracking-tight`; `text-[14px]`; `leading-[1.6]`; `text-[15px]`; `font-semibold`; `tracking-wide` |
| Appearance | `bg-[#f0f0f0]`; `bg-white`; `rounded-[20px]`; `border`; `border-[#e0e0e0]`; `rounded-full`; `text-[#222]`; `bg-transparent`; `border-none`; `rounded-lg`; `bg-[#eee]`; `border-[#ebebeb]`; `shadow-[0_2px_20px_rgba(0,0,0,0.06)]`; `text-[#111]`; `text-[#666]`; `bg-[#2a2f1e]`; `text-white` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `hover:bg-gray-100`; `hover:bg-black` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#111`, `#222`, `#2a2f1e`, `#555`, `#666`, `#8fbc2a`, `#8fbc5a`, `#d0e8a0`, `#e0e0e0`, `#e8f5d0`, `#ebebeb`, `#eee`, `#f0f0f0`, `rgba(0,0,0,0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx](src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx).

**Route:** no direct route declaration; alternative page outside the current routed composition.

**Purpose:** Alternative standalone multi-report upload composition; not in active entry graph.

**Named declarations:** `LegalUploadDocument`.

**Composition:** [src/components/ui/BackButton.tsx](src/components/ui/BackButton.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 882 | `min-h-screen bg-[#F2F2F2] flex justify-center items-center font-sans p-4` |
| 894 | `text-[#0052cc] hover:underline cursor-pointer` |
| 912 | `fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown`; `flex`; `justify-center`; `items-center`; `cursor-pointer`; `fixed`; `z-[110]`; `box-sizing-border-box`; `flex-col`; `justify-between`; `relative`; `shrink-0`; `overflow-hidden`; `absolute`; `upload-files-card`; `select-none` |
| Size & spacing | `min-h-screen`; `p-4`; `inset-0`; `p-8`; `mt-2`; `w-[clamp(6rem,12.5vw,11.25rem)]`; `h-[clamp(6rem,12.5vw,11.25rem)]`; `w-[clamp(4.2rem,8.75vw,7.875rem)]`; `h-[clamp(4.2rem,8.75vw,7.875rem)]`; `w-full`; `h-full`; `max-w-[320px]`; `w-[clamp(13.27rem,27.64vw,24.875rem)]`; `h-[clamp(1.87rem,3.89vw,3.5rem)]`; `mb-2`; `max-w-[120rem]`; `space-between` |
| Type | `font-sans`; `font-[`; `font-semibold`; `text-[clamp(0.8rem,1.67vw,1.5rem)]`; `text-center`; `text-[clamp(0.58rem,1.2vw,1.25rem)]`; `leading-snug`; `font-normal`; `text-[clamp(0.6rem,1.25vw,1.125rem)]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#F2F2F2]`; `text-[#0052cc]`; `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.2)]`; `shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)]`; `rounded-[24px]`; `text-black`; `bg-[#2A3008]/[0.08]`; `rounded-full`; `text-[#BDD327]`; `text-[#3D4949]`; `text-white`; `rounded-[57px]`; `shadow-lg`; `rounded-[2rem]`; `shadow-[0px_20px_40px_rgba(0,0,0,0.02)]`; `border-box` |
| Interaction / motion | `hover:underline`; `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:scale-105`; `active:scale-95`; `slide-in-from-bottom-5`; `duration-300` |

| Inline style source line | Exact declaration |
| --- | --- |
| 915 | `style={{ width: "clamp(17.97rem, 37.43vw, 33.6875rem)", height: "clamp(16.5rem, 34.38vw, 30.9375rem)", }}` |
| 941 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |
| 956 | `style={{ height: activeTabId === "survey-report" ? (surveyReportTypeStore[targetId] === "both" ? "clamp(93rem, 47rem + 71.8vw, 133rem)" : "clamp(72.5rem, 27rem + 71vw, 112.5rem)") : "clamp(36.13rem, 75.27vw, 90.3rem)", }}` |
| 968 | `style={{ position: "absolute", left: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max top: "clamp(1.07rem, 2.22vw, 2.67rem)", // 32px base -> 22.7px min to 42.7px max zIndex: 10, }}` |
| 978 | `style={{ position: "absolute", right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max top: "clamp(1.13rem, 2.36vw, 2.83rem)", // 34px base -> 24.2px min to 45.3px max }}` |
| 989 | `style={{ position: "absolute", left: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max top: "clamp(4rem, 8.33vw, 10rem)", // 120px base -> 85.3px min to 160px max width: "clamp(13.67rem, 28.47vw, 34.16rem)", // 410px base -> 291.5px min to 546.6px max height: "clamp(14.76rem, 30.76vw, 36.9rem)", // 443px base -> 315px min to 590.6px max background: "#FFFFFF", borderRadius: "24px", boxShadow: "none", border: "none", }}` |
| 1008 | `style={{ position: "absolute", left: "clamp(15.53rem, 32.36vw, 38.8rem)", // 466px base -> 331.4px min to 621.3px max right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px base -> 28.4px min to 53.3px max width: "auto", top: "clamp(3.8rem, 7.92vw, 9.5rem)", // 114px base -> 81px min to 152px max height: "clamp(14.76rem, 30.76vw, 36.9rem)", // 443px base -> 315px min to 590.6px max background: "#FFFFFF", borderRadius: "24px", boxShadow: "none", }}` |
| 1479 | `style={{ boxSizing: "border-box", position: "absolute", width: "clamp(14.8rem, 30.83vw, 37.0rem)", // 444px height: "clamp(2.67rem, 5.56vw, 6.67rem)", // 80px right: "clamp(1.33rem, 2.78vw, 3.33rem)", // 40px bottom: "clamp(1rem, 2.08vw, 2.5rem)", // 30px background: "#FFFFFF", border: "1px solid #CBDBAF", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(0.8rem, 1.67vw, 2.0rem)", // 24px zIndex: 100, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)", }}` |
| 1499 | `style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "clamp(0.33rem, 0.69vw, 0.83rem)", // 10px }}` |
| 1508 | `style={{ width: "clamp(1.07rem, 2.22vw, 2.67rem)", // 32px height: "clamp(1.07rem, 2.22vw, 2.67rem)", borderRadius: "50%", background: "#2D3509", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, }}` |
| 1526 | `style={{ width: "clamp(0.53rem, 1.11vw, 1.33rem)", // 16px height: "clamp(0.53rem, 1.11vw, 1.33rem)", color: "#FFFFFF", }}` |
| 1538 | `style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "clamp(0.53rem, 1.11vw, 1.33rem)", // 16px lineHeight: "clamp(0.8rem, 1.67vw, 2.0rem)", // 24px color: "#000000", }}` |
| 1554 | `style={{ width: "clamp(1rem, 2.08vw, 2.5rem)", // 30px height: "clamp(1rem, 2.08vw, 2.5rem)", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0, }}` |
| 1574 | `style={{ width: "clamp(0.5rem, 1.04vw, 1.25rem)", // 15px height: "clamp(0.5rem, 1.04vw, 1.25rem)", color: "#000000", }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#000000`, `#0052cc`, `#2A3008`, `#2D3509`, `#3D4949`, `#3D4A0D`, `#BDD327`, `#CBDBAF`, `#F2F2F2`, `#FFFFFF`, `rgba(0, 0, 0, 0.05)`, `rgba(0,0,0,0.02)`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.2)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx).

**Routes:** `/super-admin/upload/process/:id/customer-information`.

**Named declarations:** `SuperAdminUploadCustomerInformation`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 21 | `flex-1 min-w-0 h-full w-full flex flex-col relative overflow-hidden` |
| 26 | `h-full w-full overflow-y-auto` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex-1`; `flex`; `flex-col`; `relative`; `overflow-hidden`; `overflow-y-auto` |
| Size & spacing | `min-w-0`; `h-full`; `w-full` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx).

**Routes:** `/super-admin/upload/land-details/:id`.

**Purpose:** Edit land metadata and configure parent/child land setup.

**Named declarations:** `CHILD_COLORS_LIST`, `calculateArea`, `lerpCoord`, `bilinearInterpolate`, `divideParentLand`, `calculateChildQuadrants`, `createDefaultChildLands`, `SuperAdminUploadLandDetails`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 241 | `relative w-full h-full flex items-center` |
| 244 | `cursor-pointer w-full h-full flex items-center justify-between px-3.5` |
| 253 | `absolute top-[calc(100%+8px)] left-0 w-full max-h-[240px] overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 py-2 custom-scrollbar` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `items-center`; `cursor-pointer`; `justify-between`; `absolute`; `overflow-y-auto`; `z-50`; `custom-scrollbar`; `flex-direction:`; `justify-content:`; `overflow-hidden`; `select-none`; `pointer-events-none`; `justify-center`; `z-20`; `z-10`; `flex-col`; `justify-start`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-4`; `cursor-not-allowed`; `lg:grid-cols-2`; `resize-none`; `justify-end`; `shrink-0`; `grid-cols-2`; `grid` |
| Size & spacing | `w-full`; `h-full`; `px-3.5`; `top-[calc(100%+8px)]`; `left-0`; `max-h-[240px]`; `py-2`; `px-5`; `py-3`; `inset-0`; `gap-3`; `px-4`; `px-6`; `py-2.5`; `min-h-screen`; `py-4`; `md:px-8`; `max-w-7xl`; `p-5`; `lg:p-6`; `gap-4`; `gap-5`; `gap-6`; `gap-1.5`; `h-[48px]`; `h-[200px]`; `p-3.5`; `-mt-1`; `px-1`; `pt-4`; `mt-2`; `gap-2`; `px-2.5`; `py-0.5`; `p-4`; `pb-2`; `py-1`; `p-2.5`; `w-5`; `h-5`; `max-h-72`; `pr-1`; `p-3`; `pb-1.5`; `w-3`; `h-3`; `px-2`; `py-1.5`; `py-0.2`; `gap-1`; `min-h-[160px]`; `px-8` |
| Type | `font-sans`; `font-normal`; `text-sm`; `font-medium`; `font-weight:`; `font-size:`; `font-family:`; `font-[`; `font-semibold`; `text-lg`; `text-center`; `font-bold`; `text-xl`; `lg:text-2xl`; `leading-none`; `text-xs`; `text-base`; `uppercase`; `tracking-wider`; `font-extrabold`; `font-mono`; `text-[10px]`; `truncate`; `text-[11px]`; `text-[9px]`; `font-['Plus_Jakarta_Sans']`; `font-['Manrope']`; `font-['Outfit']` |
| Appearance | `text-[#363434]/60`; `bg-white`; `border`; `border-gray-100`; `rounded-xl`; `shadow-[0_8px_30px_rgb(0,0,0,0.12)]`; `text-gray-400`; `bg-[#F4F9FF]`; `text-[#3B82F6]`; `text-[#191C1E]`; `fill-color`; `fill-outline-color`; `fill-opacity`; `filter:`; `border-radius:`; `border-[rgba(0,0,0,0.12)]`; `shadow-sm`; `bg-gray-900`; `bg-black/40`; `text-white`; `rounded-full`; `shadow-md`; `bg-[#2A3008]`; `bg-[#F2F2F2]`; `rounded-2xl`; `text-[#1A1C1D]`; `text-[#3E4A3D]`; `border-[#E1E5EF]`; `bg-[#F8F9FA]`; `text-gray-500`; `text-black`; `border-t`; `bg-[#E5E9D8]`; `text-[#3D4A0D]`; `border-gray-200/80`; `border-b`; `border-gray-200`; `rounded-lg`; `shadow-2xs`; `bg-red-100`; `text-red-700`; `border-red-300`; `text-gray-800`; `border-gray-200/90`; `rounded-md`; `bg-gray-50`; `rounded`; `text-gray-700` |
| Interaction / motion | `transition-transform`; `duration-200`; `hover:bg-[#F8F9FA]`; `hover:text-[#3B82F6]`; `hover:border-[#3D4A0D]/50`; `transition-all`; `hover:scale-105`; `active:scale-95`; `hover:bg-[#3D4A0D]`; `focus:outline-none`; `focus:border-[#3E4A3D]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 951 | `style={{ backgroundColor: colorObj.hex, borderColor: colorObj.stroke, }}` |
| 970 | `style={{ backgroundColor: colorObj.stroke }}` |
| 1002 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 254 | `{options.length === 0 ? (` |
| 811 | `maxLength={100}` |
| 826 | `maxLength={100}` |
| 871 | `maxLength={500}` |

**Literal palette:** `#06B6D4`, `#0E7490`, `#121820`, `#15803D`, `#191C1E`, `#1A1C1D`, `#1D4ED8`, `#22C55E`, `#2A3008`, `#363434`, `#3B82F6`, `#3D4A0D`, `#3E4A3D`, `#7E22CE`, `#A855F7`, `#B91C1C`, `#CA8A04`, `#E1E5EF`, `#E5E9D8`, `#EAB308`, `#EF4444`, `#F2F2F2`, `#F4F9FF`, `#F8F9FA`, `#FBBF24`, `rgb(0,0,0,0.12)`, `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.5)`, `rgba(0,0,0,0.8)`, `rgba(100, 200, 100, 0.45)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx).

**Routes:** `/super-admin/upload/view-maps/:id`.

**Purpose:** Draw parent/child land boundaries with MapLibre, search, snapping and confirmation.

**Named declarations:** `CHILD_COLORS_LIST`, `lerpCoord`, `buildGeoJsonPayload`, `calculateArea`, `SuperAdminUploadViewMaps`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 1109 | `h-screen w-full bg-[#F2F2F2] flex flex-col justify-start items-center py-4 px-4 md:px-8 font-sans overflow-hidden` |
| 1110 | `w-full max-w-7xl h-full flex flex-col gap-4 min-h-0` |
| 1112 | `flex flex-row justify-between items-center w-full shrink-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `pointer-events-none`; `hidden`; `justify-content:`; `box-shadow:`; `flex`; `flex-col`; `items-center`; `cursor-pointer`; `select-none`; `flex-direction:`; `cursor-move`; `justify-start`; `overflow-hidden`; `flex-row`; `justify-between`; `shrink-0`; `flex-1`; `relative`; `absolute`; `-translate-x-1/2`; `z-30`; `z-20`; `overflow-y-auto`; `justify-center`; `flex-wrap`; `divide-y`; `divide-gray-100`; `items-start`; `z-10`; `fixed`; `z-50`; `items-end`; `self-center`; `block`; `grid-cols-2`; `items-baseline`; `grid` |
| Size & spacing | `h-screen`; `w-full`; `py-4`; `px-4`; `md:px-8`; `max-w-7xl`; `h-full`; `gap-4`; `min-h-0`; `gap-2`; `px-3`; `py-1`; `p-4`; `lg:p-5`; `top-4`; `left-1/2`; `px-3.5`; `py-1.5`; `left-4`; `p-3.5`; `gap-3`; `w-80`; `max-h-[calc(100%-2rem)]`; `pb-2`; `gap-1.5`; `px-2`; `py-0.5`; `p-2`; `gap-1`; `p-2.5`; `w-3`; `h-3`; `p-1.5`; `pt-1`; `pt-2`; `max-h-36`; `pr-0.5`; `px-2.5`; `w-2.5`; `h-2.5`; `p-1`; `right-4`; `py-2`; `mt-2`; `max-h-56`; `py-3`; `gap-2.5`; `mt-0.5`; `bottom-4`; `py-2.5`; `w-10`; `h-10`; `mt-1`; `px-8`; `inset-0`; `p-0`; `md:p-6`; `max-w-lg`; `p-6`; `md:p-8`; `gap-6`; `h-1`; `mb-1`; `mb-0.5`; `mb-2`; `w-4/5`; `py-3.5` |
| Type | `font-weight:`; `font-size:`; `font-family:`; `font-sans`; `text-xs`; `font-bold`; `font-[`; `uppercase`; `tracking-wider`; `text-[10px]`; `text-[11px]`; `font-medium`; `leading-tight`; `font-semibold`; `text-[9px]`; `truncate`; `text-[9.5px]`; `md:text-sm`; `text-left`; `leading-snug`; `text-center`; `font-normal`; `text-sm`; `tracking-[1.5px]`; `font-extrabold`; `text-2xl`; `md:text-3xl`; `text-right`; `font-['Plus_Jakarta_Sans']`; `font-['Outfit']`; `font-['Manrope']` |
| Appearance | `border-radius:`; `fill-color`; `fill-opacity`; `filter:`; `bg-[#F2F2F2]`; `bg-[#E5E9D8]`; `text-[#3D4A0D]`; `border-[#CBD796]`; `bg-amber-100`; `text-amber-900`; `border-amber-300`; `rounded-full`; `text-gray-600`; `bg-white`; `border`; `border-gray-200`; `shadow-sm`; `rounded-3xl`; `bg-[#FFFFFF]`; `border-[rgba(0,0,0,0.12)]`; `rounded-2xl`; `bg-[#10B981]`; `text-white`; `shadow-lg`; `bg-white/95`; `backdrop-blur-md`; `border-gray-200/90`; `shadow-2xl`; `border-b`; `border-gray-100`; `text-[#1A1C1D]`; `bg-gray-50`; `rounded-xl`; `text-[#10B981]`; `text-gray-400`; `text-gray-700`; `bg-gray-200`; `text-gray-500`; `bg-blue-50/70`; `border-blue-100`; `text-blue-900`; `text-gray-800`; `rounded-lg`; `shadow-xs`; `border-t`; `border-gray-200/60`; `border-[#047857]`; `rounded-md`; `text-red-500`; `shadow-2xs`; `shadow-[0px_4px_16px_rgba(0,0,0,0.18)]`; `border-black/10`; `bg-transparent`; `outline-none`; `bg-black/60`; `border-white/10`; `bg-[#2A3008]`; `backdrop-blur-xs`; `bg-[#F8F9FA]`; `rounded-t-[36px]`; `md:rounded-[36px]`; `bg-gray-300`; `text-[#576400]`; `text-[#3E4A3D]`; `text-gray-900`; `bg-[#576400]`; `border-2`; `border-[#3D4A0D]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `animate-in`; `fade-in`; `zoom-in-95`; `duration-150`; `animate-bounce`; `slide-in-from-left-4`; `duration-300`; `hover:bg-gray-300`; `transition-all`; `disabled:opacity-40`; `disabled:cursor-not-allowed`; `hover:text-red-600`; `hover:bg-gray-200`; `hover:border-gray-400`; `hover:bg-gray-100`; `hover:bg-[#CBD796]`; `hover:underline`; `animate-spin`; `hover:bg-black/80`; `hover:bg-white/15`; `active:bg-white/30`; `transition-transform`; `hover:scale-105`; `active:scale-95`; `disabled:opacity-50`; `disabled:scale-100`; `duration-200`; `hover:scale-[1.01]`; `active:scale-[0.99]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 1225 | `style={{ backgroundColor: currentActiveColor.hex, borderColor: currentActiveColor.stroke, }}` |
| 1247 | `style={{ backgroundColor: currentActiveColor.stroke, }}` |
| 1338 | `style={{ borderColor: colorObj.stroke }}` |
| 1343 | `style={{ backgroundColor: colorObj.hex }}` |
| 1377 | `style={{ width: "clamp(12.4rem, 25vw, 24rem)", }}` |
| 1621 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 612 | `if (prev.length === 0 && childLandsRef.current.length === 0 && pinsRef.current.length > 0) {` |
| 902 | `} catch (error) {` |
| 965 | `if (childLands.length === 0) return;` |
| 1245 | `disabled={activeChildPins.length < 3}` |
| 1443 | `disabled={` |
| 1456 | `disabled={` |
| 1525 | `disabled={pins.length < 3 \|\| isConfirming}` |

**Literal palette:** `#047857`, `#06B6D4`, `#0E7490`, `#10B981`, `#121820`, `#15803D`, `#1A1C1D`, `#1D4ED8`, `#22C55E`, `#2A3008`, `#3B82F6`, `#3D4A0D`, `#3E4A3D`, `#576400`, `#5FBF5F`, `#7E22CE`, `#A855F7`, `#B91C1C`, `#BE185D`, `#C2410C`, `#CA8A04`, `#CBD796`, `#E5E9D8`, `#EAB308`, `#EC4899`, `#EF4444`, `#F2F2F2`, `#F59E0B`, `#F8F9FA`, `#F97316`, `#FFFFFF`, `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.18)`, `rgba(0,0,0,0.2)`, `rgba(0,0,0,0.3)`, `rgba(0,0,0,0.5)`, `rgba(16, 185, 129, 0.25)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx).

**Routes:** `/super-admin/upload/process/:id/agriculture-report`.

**Named declarations:** `UploadAgricultureReport`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 460 | `w-[320px] shrink-0` |
| 464 | `upload-files-card` |
| 510 | `text-[#0052cc] hover:underline cursor-pointer` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown`; `grown.`; `shrink-0`; `upload-files-card`; `cursor-pointer` |
| Size & spacing | `w-[320px]` |
| Appearance | `text-[#0052cc]` |
| Interaction / motion | `hover:underline` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 298 | `if (currentTabFiles.length === 0) return showErrorToast("Please upload at least one file.");` |
| 302 | `if (filesToUpload.length === 0) {` |
| 447 | `} catch (error) {` |

**Literal palette:** `#0052cc`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx).

**Routes:** `/super-admin/upload/process/:id/land-boundaries`.

**Named declarations:** `UploadLandBoundaries`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 567 | `w-[320px] shrink-0` |
| 571 | `upload-files-card` |
| 635 | `text-[#0052cc] hover:underline cursor-pointer` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `shrink-0`; `upload-files-card`; `cursor-pointer` |
| Size & spacing | `w-[320px]` |
| Appearance | `text-[#0052cc]` |
| Interaction / motion | `hover:underline` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 554 | `} catch (error) {` |

**Literal palette:** `#0052cc`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx).

**Routes:** `/super-admin/upload/process/:id/legal-documents`.

**Named declarations:** `UploadLegalDocuments`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 259 | `w-[320px] shrink-0` |
| 263 | `absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]` |
| 264 | `bg-black/80 text-white px-6 py-3 rounded-full font-sans shadow-lg flex items-center gap-3` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `shrink-0`; `absolute`; `z-50`; `flex`; `items-center`; `justify-center`; `upload-files-card`; `cursor-pointer` |
| Size & spacing | `w-[320px]`; `inset-0`; `px-6`; `py-3`; `gap-3`; `h-5`; `w-5` |
| Type | `font-sans` |
| Appearance | `bg-white/50`; `backdrop-blur-[2px]`; `rounded-[2rem]`; `bg-black/80`; `text-white`; `rounded-full`; `shadow-lg`; `opacity-25`; `opacity-75`; `text-[#0052cc]` |
| Interaction / motion | `animate-spin`; `hover:underline` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 244 | `} catch (error) {` |
| 262 | `{isUploading && (` |

**Literal palette:** `#0052cc`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx).

**Routes:** `/super-admin/upload/process/:id/local-intelligence`.

**Named declarations:** `UploadLocalIntelligence`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 343 | `w-[320px] shrink-0` |
| 347 | `upload-files-card` |
| 424 | `fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `shrink-0`; `upload-files-card`; `fixed`; `flex`; `items-center`; `justify-center`; `z-[110]`; `box-sizing-border-box`; `flex-col`; `justify-between`; `relative`; `cursor-pointer` |
| Size & spacing | `w-[320px]`; `inset-0`; `p-8`; `mt-2`; `w-[clamp(6rem,12.5vw,11.25rem)]`; `h-[clamp(6rem,12.5vw,11.25rem)]`; `w-[clamp(4.2rem,8.75vw,7.875rem)]`; `h-[clamp(4.2rem,8.75vw,7.875rem)]`; `w-full`; `h-full`; `max-w-[320px]`; `w-[clamp(13.27rem,27.64vw,24.875rem)]`; `h-[clamp(1.87rem,3.89vw,3.5rem)]`; `mb-2` |
| Type | `font-[`; `font-semibold`; `text-[clamp(0.8rem,1.67vw,1.5rem)]`; `text-center`; `text-[clamp(0.58rem,1.2vw,1.25rem)]`; `leading-snug`; `font-normal`; `text-[clamp(0.6rem,1.25vw,1.125rem)]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.2)]`; `shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)]`; `rounded-[24px]`; `text-black`; `bg-[#2A3008]/[0.08]`; `rounded-full`; `text-[#BDD327]`; `text-[#3D4949]`; `text-[#0052cc]`; `text-white`; `rounded-[57px]`; `shadow-lg` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:scale-105`; `active:scale-95` |

| Inline style source line | Exact declaration |
| --- | --- |
| 427 | `style={{ width: "clamp(17.97rem, 37.43vw, 33.6875rem)", height: "clamp(16.5rem, 34.38vw, 30.9375rem)", }}` |
| 453 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 328 | `} catch (error) {` |
| 414 | `} catch (error) {` |

**Literal palette:** `#0052cc`, `#2A3008`, `#3D4949`, `#3D4A0D`, `#BDD327`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.2)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx).

**Routes:** `/super-admin/upload`.

**Composition:** [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx), [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx), [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 36 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 39 | `shrink-0` |
| 45 | `flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `shrink-0`; `items-start`; `justify-between`; `relative`; `z-10`; `items-center`; `justify-center`; `flex-row`; `flex-wrap`; `placeholder:text-[#767676]`; `absolute`; `-translate-y-1/2`; `justify-end`; `appearance-none`; `cursor-pointer`; `pointer-events-none`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `xl:grid-cols-4`; `fixed`; `z-[100]`; `overflow-hidden`; `md:flex-row`; `z-20`; `flex-1`; `select-none`; `aspect-[4/3]`; `object-cover`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-4`; `mt-4`; `w-full`; `h-full`; `mt-auto`; `mb-6`; `gap-[clamp(0.96rem,2vw,1.5rem)]`; `mt-[clamp(0.96rem,2vw,1.5rem)]`; `px-[clamp(0.25rem,1.5vw,0.75rem)]`; `gap-[clamp(0.12rem,0.25vw,0.25rem)]`; `gap-[clamp(0.24rem,0.5vw,0.375rem)]`; `h-[clamp(1.2rem,2.5vw,2.75rem)]`; `px-[clamp(0.72rem,1.5vw,1.25rem)]`; `gap-[clamp(0.72rem,1.5vw,1.25rem)]`; `w-[clamp(8.64rem,18vw,22.0rem)]`; `max-w-full`; `h-[clamp(1.2rem,2.5vw,2.6rem)]`; `pl-[clamp(2rem,2.5rem,2.75rem)]`; `pr-[1rem]`; `left-[1.125rem]`; `top-1/2`; `gap-[clamp(0.48rem,1vw,0.75rem)]`; `h-[clamp(1.1rem,2.3vw,2.4rem)]`; `pl-[clamp(1rem,1.5rem,1.75rem)]`; `pr-[clamp(2rem,2.5rem,2.75rem)]`; `right-[1rem]`; `min-h-[400px]`; `w-8`; `h-8`; `mb-4`; `gap-6`; `pt-4`; `gap-2`; `px-4`; `py-2`; `inset-0`; `p-[1rem]`; `max-w-[95vw]`; `max-h-[95vh]`; `right-[clamp(0.8rem,1.67vw,2.0rem)]`; `top-[clamp(0.72rem,1.5vw,1.8rem)]`; `p-1`; `p-[clamp(1.33rem,2.78vw,3.0rem)]`; `gap-[clamp(0.4rem,0.83vw,1.0rem)]`; `pl-[clamp(1rem,2.2vw,2.5rem)]`; `my-[clamp(0.96rem,2vw,2.5rem)]`; `w-[1px]`; `gap-[clamp(1.34rem,2.8vw,3.5rem)]`; `gap-[clamp(0.6rem,1.25vw,1.5rem)]`; `w-[9px]`; `h-[9px]`; `md:w-[clamp(10.67rem,22.22vw,22.0rem)]`; `pt-[clamp(1.92rem,4vw,5.0rem)]`; `pb-[clamp(1.33rem,2.78vw,3.0rem)]`; `p-[clamp(0.62rem,1.3vw,1.5rem)]`; `gap-[clamp(0.29rem,0.6vw,0.8rem)]`; `w-[clamp(8rem,16.67vw,17.0rem)]`; `h-[clamp(7.48rem,15.59vw,16.0rem)]`; `w-[60%]`; `h-[clamp(0.24rem,0.5vw,0.6rem)]`; `mt-1`; `w-[40%]`; `my-[clamp(0.48rem,1vw,1.5rem)]`; `w-[clamp(7.66rem,15.95vw,17.0rem)]`; `h-[clamp(1.32rem,2.76vw,3.25rem)]` |
| Type | `font-[`; `font-extrabold`; `text-[clamp(1.06rem,2.2vw,3.0rem)]`; `leading-tight`; `font-semibold`; `text-[clamp(0.58rem,1.2vw,1.6rem)]`; `leading-normal`; `font-normal`; `text-[clamp(0.48rem,1vw,1.35rem)]`; `leading-none`; `text-center`; `text-[clamp(0.43rem,0.9vw,1.25rem)]`; `font-medium`; `text-lg`; `text-sm`; `font-bold`; `text-[clamp(1.07rem,2.22vw,2.5rem)]`; `leading-[clamp(1.33rem,2.78vw,3.0rem)]`; `tracking-[-0.01em]`; `text-[clamp(0.47rem,0.97vw,1.1rem)]`; `leading-[clamp(0.6rem,1.25vw,1.4rem)]`; `text-[12px]`; `leading-[16px]`; `tracking-[0.6px]`; `text-[clamp(0.43rem,0.9vw,1.1rem)]`; `font-['Plus_Jakarta_Sans']`; `font-['Outfit']` |
| Appearance | `bg-[#FFFFFF]`; `border-none`; `shadow-sm`; `text-[#131600]`; `text-[#45474C]`; `rounded-[clamp(1.2rem,2.5vw,2.18rem)]`; `text-white`; `bg-white`; `border`; `border-[#EBEBEB]`; `rounded-[clamp(2rem,4rem,4.04rem)]`; `text-[#767676]`; `shadow-[0px_2.3rem_0.95rem_rgba(0,0,0,0.01)]`; `text-[#5A5C5E]`; `text-[#2D3032]`; `text-red-500`; `border-t`; `border-gray-100`; `text-gray-500`; `border-gray-200`; `rounded-lg`; `text-[var(--text-primary)]`; `bg-[#0F1011]/60`; `backdrop-blur-sm`; `shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]`; `text-[#000000]`; `opacity-60`; `rounded-full`; `border-r`; `border-[#C6C8BA]/30`; `text-[#191C1B]`; `text-[#45483E]`; `bg-[#2C2C2C]/25`; `bg-[#CED2B4]`; `border-[1.5px]`; `border-[#CCDB99]/80`; `shadow-[0_0_0_3px_rgba(189,211,39,0.38)]`; `bg-[#C0C2B7]`; `text-[#2A3008]`; `text-[#808277]`; `bg-[#F3F4F1]`; `border-[#C6C8BA]/20`; `shadow-[0px_4px_16px_rgba(0,0,0,0.06)]`; `rounded-[clamp(0.8rem,1.67vw,1.8rem)]`; `rounded-[clamp(0.4rem,0.83vw,1.0rem)]`; `bg-[#EDEEEB]`; `shadow-[0px_4px_12px_rgba(42,48,8,0.2)]`; `rounded-[35px]` |
| Interaction / motion | `transition-transform`; `hover:scale-[1.02]`; `focus:outline-none`; `focus:border-gray-400`; `hover:bg-gray-50`; `animate-spin`; `disabled:opacity-50`; `disabled:cursor-not-allowed`; `transition-opacity`; `animate-in`; `fade-in`; `zoom-in`; `duration-200`; `hover:opacity-100`; `hover:bg-black/5`; `transition-all`; `duration-300`; `hover:scale-[1.03]`; `active:scale-[0.98]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 80 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |
| 180 | `style={{ width: "clamp(22.4rem, 46.67vw, 48rem)", height: "clamp(21.87rem, 45.56vw, 46rem)", borderRadius: "clamp(1.07rem, 2.22vw, 2.5rem)", }}` |
| 207 | `style={{ left: "calc(clamp(1rem, 2.2vw, 2.5rem) + 4px)", top: "clamp(0.48rem, 1vw, 1.25rem)", bottom: "clamp(0.48rem, 1vw, 1.25rem)" }}` |
| 249 | `style={{ transform: "rotate(2deg)" }}` |
| 264 | `style={{ width: "212px" }}` |
| 275 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 118 | `{isLoading ? (` |
| 154 | `disabled={page === 1}` |
| 161 | `disabled={page >= totalPages}` |

**Literal palette:** `#000000`, `#0F1011`, `#131600`, `#191C1B`, `#2A3008`, `#2C2C2C`, `#2D3032`, `#3D4A0D`, `#45474C`, `#45483E`, `#5A5C5E`, `#767676`, `#808277`, `#C0C2B7`, `#C6C8BA`, `#CCDB99`, `#CED2B4`, `#EBEBEB`, `#EDEEEB`, `#F3F4F1`, `#FFFFFF`, `rgba(0,0,0,0.01)`, `rgba(0,0,0,0.06)`, `rgba(0,0,0,0.25)`, `rgba(189,211,39,0.38)`, `rgba(42,48,8,0.2)`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx).

**Routes:** `/super-admin/upload/process/:id/valuation`.

**Named declarations:** `UploadValuation`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 387 | `w-[320px] shrink-0` |
| 391 | `upload-files-card` |
| 435 | `text-[#0052cc] hover:underline cursor-pointer` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `shrink-0`; `upload-files-card`; `cursor-pointer` |
| Size & spacing | `w-[320px]` |
| Appearance | `text-[#0052cc]` |
| Interaction / motion | `hover:underline` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 372 | `} catch (error) {` |

**Literal palette:** `#0052cc`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx).

**Routes:** `/super-admin/agent-profile/:id`.

**Composition:** [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 26 | `box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col gap-8 items-center` |
| 29 | `w-full max-w-6xl` |
| 32 | `flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[#2D3032] hover:bg-gray-50 transition-colors shadow-sm w-fit` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `overflow-auto`; `custom-scrollbar`; `flex`; `flex-col`; `items-center`; `md:flex-row`; `justify-between`; `relative`; `overflow-hidden`; `md:items-end`; `z-10`; `hidden`; `md:flex`; `flex-1`; `absolute`; `object-cover`; `overflow-x-auto`; `group`; `inline-flex` |
| Size & spacing | `min-h-screen`; `p-[clamp(16px,2vw,32px)]`; `gap-8`; `w-full`; `max-w-6xl`; `gap-2`; `px-5`; `py-2.5`; `w-fit`; `p-10`; `md:p-14`; `gap-12`; `min-w-[140px]`; `pr-12`; `mt-1`; `w-28`; `h-28`; `mb-6`; `inset-0`; `h-full`; `mb-1`; `mb-4`; `gap-1.5`; `px-3`; `py-1.5`; `mb-8`; `mt-2`; `mb-3`; `min-w-[240px]`; `pl-12`; `gap-1`; `h-1.5`; `mt-4`; `px-2`; `py-2`; `p-8`; `pb-2`; `min-w-[800px]`; `pb-4`; `px-4`; `py-5` |
| Type | `text-sm`; `font-medium`; `text-4xl`; `font-black`; `tracking-tight`; `text-[10px]`; `font-bold`; `uppercase`; `tracking-widest`; `text-xl`; `text-[13px]`; `text-[11px]`; `text-[64px]`; `leading-none`; `tracking-tighter`; `text-[12px]`; `font-semibold`; `text-[14px]`; `text-left`; `capitalize`; `tracking-wide` |
| Appearance | `bg-[#F6F7F6]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[#2D3032]`; `shadow-sm`; `rounded-[40px]`; `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`; `border-r`; `border-gray-100`; `text-gray-400`; `shadow-lg`; `border-4`; `border-white`; `bg-gradient-to-b`; `from-[#B2EBF2]`; `to-[#E0F7FA]`; `opacity-50`; `text-gray-500`; `bg-[#F3F6E8]`; `text-[#8BC34A]`; `fill-[#8BC34A]`; `text-[#3E421B]`; `text-[#2E7D32]`; `border-l`; `bg-gray-100`; `bg-[#8BC34A]`; `bg-[#374151]`; `rounded-xl`; `border-[#8BC34A]`; `rounded-[32px]`; `shadow-[0_4px_24px_rgba(0,0,0,0.02)]`; `border-collapse`; `border-b`; `border-gray-50/80`; `bg-[#E8F5E9]`; `rounded-lg`; `text-[#4CAF50]`; `text-[#F57C00]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `rotate-135`; `hover:bg-[#F3F6E8]`; `hover:bg-gray-50/50` |

| Inline style source line | Exact declaration |
| --- | --- |
| 91 | `` style={{ width: `${data.closeRatio}%` }} `` |
| 104 | `style={{ width: '40%' }}` |
| 117 | `style={{ width: '60%' }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#2E7D32`, `#374151`, `#3E421B`, `#4CAF50`, `#8BC34A`, `#B2EBF2`, `#E0F7FA`, `#E8F5E9`, `#F3F6E8`, `#F57C00`, `#F6F7F6`, `rgb(0,0,0,0.04)`, `rgba(0,0,0,0.02)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx).

**Routes:** `/login`, `/super-admin/login`.

**Named declarations:** `SuperAdminLogin`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 25 | `w-full max-w-[454px] mx-auto xl:mx-0 flex items-center gap-[8px] lg:gap-[16px] mt-8 xl:mt-auto pt-4` |
| 26 | `text-[#006D3A] w-[16px] h-[20px] flex-shrink-0` |
| 27 | `font-['Plus_Jakarta_Sans'] font-normal text-[10px] lg:text-[12px] leading-[14px] lg:leading-[16px] text-[#3D4949]/80` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `flex-shrink-0`; `flex-1`; `flex-col`; `justify-center`; `placeholder:text-[#6D7A7A]/30`; `cursor-pointer`; `object-contain`; `relative`; `overflow-y-auto`; `lg:overflow-hidden`; `lg:flex-row`; `lg:justify-start`; `lg:flex-1`; `overflow-hidden`; `justify-between`; `shrink-0`; `absolute`; `z-10` |
| Size & spacing | `w-full`; `max-w-[454px]`; `mx-auto`; `xl:mx-0`; `gap-[8px]`; `lg:gap-[16px]`; `mt-8`; `xl:mt-auto`; `pt-4`; `w-[16px]`; `h-[20px]`; `gap-[28px]`; `gap-3`; `m-0`; `gap-6`; `gap-2`; `h-[56px]`; `px-6`; `gap-[18px]`; `h-[16px]`; `mt-1`; `p-0`; `w-[18px]`; `h-[18px]`; `mt-[4px]`; `h-[52px]`; `mt-[8px]`; `py-4`; `w-[120px]`; `h-[120px]`; `lg:w-[150px]`; `lg:h-[150px]`; `max-w-[200px]`; `gap-4`; `mt-4`; `mt-2`; `py-8`; `w-16`; `h-16`; `w-8`; `h-8`; `min-h-screen`; `lg:p-4`; `max-w-[1440px]`; `lg:min-h-0`; `lg:h-[90vh]`; `lg:max-h-[920px]`; `lg:m-4`; `xl:m-6`; `h-[35vh]`; `min-h-[280px]`; `lg:h-[calc(100%-2rem)]`; `xl:h-[calc(100%-3rem)]`; `inset-0`; `p-6`; `lg:p-[32px]`; `w-[100px]`; `lg:w-[134px]`; `mt-auto`; `mb-8`; `lg:mb-[60px]`; `h-full`; `py-[32px]`; `lg:py-[40px]`; `lg:px-[40px]`; `xl:px-0`; `xl:pl-[60px]`; `xl:pr-[60px]` |
| Type | `font-[`; `font-normal`; `text-[10px]`; `lg:text-[12px]`; `leading-[14px]`; `lg:leading-[16px]`; `font-bold`; `text-[32px]`; `lg:text-[40px]`; `leading-[1.2]`; `lg:leading-[50px]`; `tracking-[-0.9px]`; `text-[14px]`; `lg:text-[16px]`; `leading-[1.5]`; `lg:leading-[26px]`; `font-semibold`; `leading-[20px]`; `text-[16px]`; `text-sm`; `text-right`; `font-medium`; `text-center`; `lg:text-[18px]`; `leading-[1.4]`; `text-[18px]`; `text-[28px]`; `lg:text-[42px]`; `lg:leading-[52px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#006D3A]`; `text-[#3D4949]/80`; `text-[#1A1C1D]`; `text-[#3D4949]`; `bg-[#F3F3F5]`; `border`; `rounded-[32px]`; `text-[#6D7A7A]`; `bg-transparent`; `border-none`; `outline-none`; `text-red-500`; `rounded-[48px]`; `text-white`; `shadow-md`; `bg-white`; `rounded-full`; `bg-[#E5F0EB]`; `bg-[#ffffff]`; `lg:rounded-[32px]`; `bg-cover`; `bg-center`; `rounded-b-[32px]`; `lg:rounded-[24px]`; `bg-black/20` |
| Interaction / motion | `hover:underline`; `disabled:opacity-50`; `disabled:cursor-not-allowed`; `transition-opacity`; `hover:opacity-90`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 439 | `` style={{ backgroundImage: `url('${MainLoginBg}')` }} `` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 150 | `disabled={loading}` |
| 154 | `{loading ? 'Logging in...' : 'Login'}` |
| 204 | `` <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${error ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}> `` |
| 214 | `{error && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{error}</span>}` |
| 219 | `disabled={isLoading}` |
| 223 | `{isLoading ? 'Sending...' : 'Send Password'}` |
| 402 | `disabled={isLoading}` |
| 406 | `{isLoading ? 'Updating...' : 'Update Password'}` |

**Literal palette:** `#006D3A`, `#1A1C1D`, `#2A3008`, `#3D4949`, `#3D4A0D`, `#6D7A7A`, `#E5F0EB`, `#F3F3F5`, `#ffffff`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx).

**Routes:** `/super-admin/profile`.

**Composition:** [src/components/ui/typography.tsx](src/components/ui/typography.tsx), [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 171 | `box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col items-center` |
| 172 | `w-full max-w-[1000px] flex flex-col gap-6` |
| 178 | `flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `inline-flex`; `shrink-0`; `cursor-pointer`; `pointer-events-none`; `inline-block`; `box-border`; `overflow-auto`; `custom-scrollbar`; `flex`; `flex-col`; `items-center`; `justify-between`; `grid-cols-1`; `md:grid-cols-3`; `overflow-hidden`; `object-cover`; `absolute`; `group`; `justify-center`; `hidden`; `flex-1`; `cursor-default`; `cursor-not-allowed`; `-translate-y-1/2`; `md:grid-cols-2`; `fixed`; `z-[100]`; `items-start`; `object-contain`; `select-none`; `grid` |
| Size & spacing | `h-6`; `w-11`; `h-5`; `w-5`; `min-h-screen`; `p-[clamp(16px,2vw,32px)]`; `w-full`; `max-w-[1000px]`; `gap-6`; `gap-2`; `px-5`; `py-3`; `p-4`; `md:p-8`; `h-[180px]`; `px-8`; `pb-8`; `pt-4`; `w-32`; `h-32`; `-mt-20`; `ml-[140px]`; `w-48`; `h-4`; `w-24`; `p-8`; `mb-4`; `gap-x-6`; `gap-y-6`; `h-11`; `h-full`; `min-h-[80px]`; `-top-16`; `left-8`; `w-16`; `h-16`; `inset-0`; `w-6`; `mb-1`; `px-4`; `py-2`; `gap-3`; `min-w-[80px]`; `w-4`; `pr-10`; `right-3`; `top-1/2`; `gap-8`; `gap-1`; `p-6`; `px-6`; `py-2.5`; `max-w-[600px]`; `py-10`; `top-6`; `right-6`; `p-2`; `h-14`; `mb-8`; `h-12`; `left-4`; `pl-12`; `pr-12`; `right-4`; `mt-4` |
| Type | `text-sm`; `font-medium`; `text-[10px]`; `leading-tight`; `font-bold`; `text-[1.5rem]`; `text-[0.875rem]`; `text-[1.25rem]`; `text-[0.8125rem]`; `text-[1.125rem]`; `text-left`; `text-[1rem]` |
| Appearance | `rounded-full`; `border-2`; `border-transparent`; `bg-[#4CAF50]`; `bg-gray-200`; `bg-white`; `shadow`; `ring-0`; `bg-[#F6F7F6]`; `shadow-[0_2px_10px_rgba(0,0,0,0.05)]`; `text-[var(--text-primary)]`; `rounded-[32px]`; `shadow-sm`; `rounded-[24px]`; `bg-gray-300`; `border-4`; `border-white`; `rounded`; `border`; `border-gray-200`; `bg-gray-100`; `rounded-xl`; `opacity-50`; `text-gray-400`; `bg-black/40`; `opacity-0`; `text-white`; `text-[#2D3032]`; `text-gray-500`; `rounded-lg`; `text-gray-600`; `bg-[#2A3008]`; `bg-transparent`; `bg-gray-50`; `text-gray-300`; `bg-[#FFF0F0]`; `text-[#FF4B4B]`; `backdrop-blur-sm`; `shadow-2xl`; `border-none`; `outline-none` |
| Interaction / motion | `transition-colors`; `duration-200`; `ease-in-out`; `focus:outline-none`; `focus:ring-2`; `focus:ring-[#4CAF50]`; `focus:ring-offset-2`; `transform`; `transition`; `translate-x-5`; `translate-x-0`; `hover:bg-gray-50`; `animate-pulse`; `group-hover:opacity-100`; `transition-opacity`; `animate-spin`; `hover:bg-[#3f470d]`; `disabled:opacity-50`; `disabled:cursor-not-allowed`; `focus:ring-1`; `focus:ring-gray-300`; `hover:text-gray-600`; `hover:bg-[#FFE5E5]`; `animate-in`; `fade-in`; `zoom-in-95`; `hover:bg-gray-100`; `focus-within:ring-1`; `focus-within:ring-gray-300`; `transition-shadow` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 19 | `role="switch"` |
| 20 | `aria-checked={checked}` |
| 27 | `aria-hidden="true"` |
| 108 | `} catch (error) {` |
| 129 | `} catch (error) {` |
| 237 | `disabled={isUploadingImage}` |
| 254 | `accept="image/*"` |
| 306 | `disabled={isSaveDisabled}` |
| 323 | `readOnly={!isEditing}` |
| 324 | `maxLength={50}` |
| 335 | `readOnly={!isEditing}` |
| 336 | `maxLength={50}` |
| 347 | `readOnly={!isEditing}` |
| 529 | `disabled={isUpdatingPassword}` |

**Literal palette:** `#2A3008`, `#2D3032`, `#3f470d`, `#4CAF50`, `#F6F7F6`, `#FF4B4B`, `#FFE5E5`, `#FFF0F0`, `rgba(0,0,0,0.05)`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx).

**Routes:** `/super-admin/user-profile/:id`.

**Composition:** [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 15 | `box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar` |
| 19 | `flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors mb-6 shadow-sm` |
| 26 | `bg-white rounded-[32px] p-8 md:p-12 shadow-sm max-w-4xl mx-auto flex flex-col items-center` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `overflow-auto`; `custom-scrollbar`; `flex`; `items-center`; `flex-col`; `relative`; `overflow-hidden`; `object-cover`; `flex-wrap`; `justify-center`; `md:justify-around`; `sm:flex-row`; `sm:items-center`; `justify-between`; `sm:items-end` |
| Size & spacing | `min-h-screen`; `p-[clamp(16px,2vw,32px)]`; `gap-2`; `px-4`; `py-2`; `mb-6`; `p-8`; `md:p-12`; `max-w-4xl`; `mx-auto`; `mb-10`; `mb-4`; `w-24`; `h-24`; `p-1`; `w-full`; `h-full`; `mb-2`; `px-2`; `py-0.5`; `mb-1`; `h-px`; `gap-8`; `md:gap-16`; `w-6`; `h-0.5`; `gap-4`; `p-4`; `sm:p-5`; `gap-1.5`; `sm:mb-0`; `w-1`; `h-1` |
| Type | `text-sm`; `font-medium`; `text-2xl`; `font-bold`; `text-xs`; `font-semibold`; `tracking-widest`; `text-[10px]`; `tracking-wider`; `text-4xl`; `leading-none`; `uppercase`; `text-[14px]`; `text-[12px]`; `text-[11px]` |
| Appearance | `bg-[#F6F7F6]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `shadow-sm`; `rounded-[32px]`; `border-4`; `border-[#E8F5E9]`; `shadow-inner`; `text-[#2D3032]`; `text-gray-500`; `bg-[#E8F5E9]`; `text-[#2E7D32]`; `text-gray-400`; `bg-gray-100`; `text-[#545E6A]`; `bg-[#8BC34A]`; `rounded-[16px]`; `border-gray-100`; `shadow-[0_2px_8px_rgba(0,0,0,0.02)]`; `border-l-4`; `bg-gray-300`; `text-[#8BC34A]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#2E7D32`, `#545E6A`, `#8BC34A`, `#E8F5E9`, `#F6F7F6`, `rgba(0,0,0,0.02)`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx).

**Routes:** `/super-admin/users-list/all`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 25 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 26 | `bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen` |
| 32 | `flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `md:flex-row`; `justify-between`; `flex-wrap` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `p-6`; `gap-8`; `min-h-screen`; `gap-2`; `px-4`; `py-2`; `gap-4`; `w-full`; `md:w-[320px]`; `h-10`; `gap-3` |
| Type | `text-sm`; `font-medium` |
| Appearance | `bg-[#F6F7F6]`; `rounded-[24px]`; `rounded-full`; `border`; `border-gray-200`; `bg-white`; `text-[var(--text-primary)]`; `text-gray-400`; `text-gray-700` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#F6F7F6`.

**Related CSS tokens:** `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx).

**Routes:** `/super-admin/users-list`.

**Composition:** [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx), [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx), [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx), [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]` |
| 33 | `shrink-0` |
| 38 | `flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `shrink-0`; `items-start`; `justify-between`; `relative`; `z-10`; `md:flex-row`; `md:items-end`; `xl:flex-row`; `xl:items-center`; `items-center`; `absolute`; `z-50` |
| Size & spacing | `min-h-full`; `gap-[clamp(12px,0.5vw,16px)]`; `p-[clamp(6px,0.83vw,12px)]`; `py-[clamp(16px,1.5vw,32px)]`; `gap-4`; `mt-4`; `w-full`; `h-full`; `mt-auto`; `mb-6`; `mt-6`; `gap-6`; `xl:w-[320px]`; `h-10`; `gap-2`; `px-4`; `py-2`; `right-0`; `mt-2`; `w-40` |
| Type | `text-[1.5rem]`; `lg:text-[1.75rem]`; `font-bold`; `tracking-tight`; `text-[0.875rem]`; `font-medium`; `text-sm`; `text-left` |
| Appearance | `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `text-gray-400`; `rounded-full`; `bg-white`; `border-gray-200`; `border`; `text-gray-700`; `rounded-[1rem]`; `shadow-lg`; `border-gray-100` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

#### Reusable component modules

##### src/components/common/RouteErrorBoundary.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/common/RouteErrorBoundary.tsx](src/components/common/RouteErrorBoundary.tsx).

**Purpose:** Present route failure recovery and expandable technical details.

**Named declarations:** `RouteErrorBoundary`.

**Composition:** [src/components/ui/button.tsx](src/components/ui/button.tsx), [src/components/ui/typography.tsx](src/components/ui/typography.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 25 | `flex min-h-screen flex-col items-center justify-center bg-[color:var(--surface-page)] px-6 py-12 font-[family-name:var(--font-sans)]` |
| 26 | `relative w-full max-w-xl rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-8 shadow-[0_20px_50px_rgba(0,49,50,0.08)]` |
| 28 | `absolute -top-12 -left-12 h-40 w-40 rounded-full bg-red-500/10 blur-[60px]` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `items-center`; `justify-center`; `relative`; `absolute`; `sm:flex-row`; `justify-between`; `overflow-x-auto`; `overflow-y-auto` |
| Size & spacing | `min-h-screen`; `px-6`; `py-12`; `w-full`; `max-w-xl`; `p-8`; `-top-12`; `-left-12`; `h-40`; `w-40`; `-bottom-12`; `-right-12`; `h-16`; `w-16`; `mb-6`; `h-8`; `w-8`; `mb-2`; `mb-8`; `max-w-md`; `gap-3`; `h-4`; `w-4`; `sm:w-auto`; `h-11`; `gap-2`; `pt-6`; `mt-4`; `p-4`; `max-h-60`; `mb-1`; `mt-2` |
| Type | `font-[family-name:var(--font-sans)]`; `text-center`; `font-[family-name:var(--font-heading)]`; `font-bold`; `!text-2xl`; `text-sm`; `font-medium`; `text-left`; `text-xs`; `font-semibold`; `uppercase`; `tracking-wider`; `font-mono`; `text-[11px]`; `leading-relaxed`; `whitespace-pre-wrap` |
| Appearance | `bg-[color:var(--surface-page)]`; `rounded-2xl`; `border`; `border-[color:var(--border-soft)]`; `bg-[color:var(--surface-card)]`; `shadow-[0_20px_50px_rgba(0,49,50,0.08)]`; `rounded-full`; `bg-red-500/10`; `blur-[60px]`; `bg-amber-500/10`; `text-red-500`; `border-red-500/20`; `text-[color:var(--text-heading)]`; `text-[color:var(--text-secondary)]`; `rounded-xl`; `bg-transparent`; `border-t`; `rounded-lg`; `bg-red-950/5`; `text-red-700`; `opacity-80` |
| Interaction / motion | `animate-spin-hover`; `hover:bg-black/5`; `hover:text-[color:var(--text-primary)]`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `rgba(0,49,50,0.08)`.

**Related CSS tokens:** `--border-soft`, `--font-heading`, `--font-sans`, `--surface-card`, `--surface-page`, `--text-heading`, `--text-primary`, `--text-secondary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/common/S3Image.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Purpose:** Resolve S3 image keys and apply caller-selected fallbacks.

**Named declarations:** `S3Image`.

<details><summary>Props / reusable interface</summary>

```tsx
interface S3ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackType?: 'avatar' | 'cover' | 'none';
  customFallback?: string;
}
```

</details>

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/common/layouts/RootLayout.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/common/layouts/RootLayout.tsx](src/components/common/layouts/RootLayout.tsx).

**Named declarations:** `RootLayout`.

**Composition:** [src/components/common/layouts/SuperAdminLayout.tsx](src/components/common/layouts/SuperAdminLayout.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/common/layouts/SuperAdminLayout.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/common/layouts/SuperAdminLayout.tsx](src/components/common/layouts/SuperAdminLayout.tsx).

**Named declarations:** `SuperAdminLayout`.

**Composition:** [src/features/super-admin/components/layout/Sidebar.tsx](src/features/super-admin/components/layout/Sidebar.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `flex h-screen overflow-hidden` |
| 48 | `flex-1 overflow-auto` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `overflow-hidden`; `flex-1`; `overflow-auto` |
| Size & spacing | `h-screen` |

| Inline style source line | Exact declaration |
| --- | --- |
| 31 | `style={{ background: "var(--surface-page)" }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Related CSS tokens:** `--surface-page`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/ui/BackButton.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/ui/BackButton.tsx](src/components/ui/BackButton.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 88 | `flex items-center justify-center shrink-0` |
| 114 | `truncate` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `inline-flex`; `flex-row`; `items-center`; `cursor-pointer`; `flex`; `justify-center`; `shrink-0` |
| Size & spacing | `w-fit`; `min-w-[clamp(8rem,13.8vw,12.5rem)]`; `h-auto`; `min-h-[clamp(2rem,2.9vw,2.625rem)]`; `px-[clamp(0.6rem,1.1vw,1rem)]`; `py-[clamp(0.4rem,0.9vw,0.875rem)]`; `gap-[clamp(0.2rem,0.4vw,0.375rem)]`; `min-w-[clamp(10rem,16.6vw,15rem)]`; `min-h-[clamp(2.2rem,3.6vw,3.25rem)]`; `px-[clamp(0.7rem,1.38vw,1.25rem)]`; `py-[clamp(0.4rem,1vw,1.1875rem)]`; `gap-[clamp(0.3rem,0.55vw,0.5rem)]`; `min-w-[clamp(12rem,19.4vw,17.5rem)]`; `min-h-[clamp(2.6rem,4.1vw,3.75rem)]`; `px-[clamp(0.9rem,1.6vw,1.5rem)]`; `py-[clamp(0.6rem,1.5vw,1.375rem)]`; `gap-[clamp(0.4rem,0.69vw,0.625rem)]` |
| Type | `font-[var(--font-inter)]`; `font-normal`; `leading-[110%]`; `text-[clamp(0.7rem,0.97vw,0.875rem)]`; `text-[clamp(0.75rem,1.1vw,1rem)]`; `text-[clamp(0.85rem,1.25vw,1.125rem)]`; `truncate` |
| Appearance | `border-none`; `bg-[var(--surface-card)]`; `text-[var(--text-button)]`; `bg-[var(--surface-sidebar)]`; `text-[var(--surface-sidebar-text)]`; `bg-[var(--brand-500)]`; `text-[var(--surface-card)]`; `bg-[var(--brand-tint)]`; `text-[var(--brand-500)]`; `border`; `border-[var(--btn-outline-square-border)]`; `rounded-[var(--btn-radius-pill-sm)]`; `rounded-[var(--btn-radius-pill)]` |
| Interaction / motion | `transition-all`; `duration-200`; `active:translate-y-0` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.18)`.

**Related CSS tokens:** `--brand-500`, `--brand-tint`, `--btn-outline-square-border`, `--btn-radius-pill`, `--btn-radius-pill-sm`, `--font-inter`, `--surface-card`, `--surface-sidebar`, `--surface-sidebar-text`, `--text-button`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/ui/button.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/ui/button.tsx](src/components/ui/button.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 182 | `shrink-0 animate-spin` |
| 235 | `flex items-center justify-center shrink-0 bg-white rounded-[20px] w-7 h-7 lg:w-8 lg:h-8 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9` |
| 242 | `shrink-0 rounded-full w-[12px] h-[12px] bg-[var(--brand-400)] border-[2px] border-[var(--pie-1)]` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label */
  rightIcon?: React.ReactNode;
  /** `navy` variant only — rendered inside the white circular badge */
  badgeIcon?: React.ReactNode;
  /** `dark` variant only — shows the blue dot indicator */
  showDot?: boolean;
  /** Stretches to full container width */
  fullWidth?: boolean;
  /** Disables interaction and shows a spinner */
  loading?: boolean;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `inline-flex`; `flex-row`; `items-center`; `justify-center`; `select-none`; `shrink-0`; `flex` |
| Size & spacing | `px-6`; `lg:px-7`; `xl:px-8`; `2xl:px-10`; `h-[44px]`; `lg:h-[48px]`; `xl:h-[52px]`; `2xl:h-[56px]`; `px-3`; `lg:px-4`; `h-[26px]`; `lg:h-[28px]`; `xl:h-[30px]`; `2xl:h-[31px]`; `h-[36px]`; `lg:h-[38px]`; `xl:h-[40px]`; `2xl:h-[44px]`; `gap-2`; `lg:px-3.5`; `xl:h-[50px]`; `px-4`; `h-[24px]`; `lg:h-[26px]`; `xl:h-[27px]`; `2xl:h-[29px]`; `gap-2.5`; `lg:px-[18px]`; `h-[32px]`; `lg:h-[34px]`; `xl:h-[36px]`; `2xl:h-[38px]`; `lg:px-5`; `h-[34px]`; `lg:h-[36px]`; `xl:h-[38px]`; `2xl:h-[40px]`; `2xl:h-[42px]`; `gap-1.5`; `h-[30px]`; `lg:h-[32px]`; `xl:h-[34px]`; `2xl:h-[36px]`; `px-8`; `lg:px-9`; `xl:px-10`; `h-[40px]`; `lg:h-[42px]`; `xl:h-[44px]`; `2xl:h-[48px]`; `h-[28px]`; `lg:h-[29px]`; `2xl:h-[32px]`; `w-full`; `w-7`; `h-7`; `lg:w-8`; `lg:h-8`; `xl:w-8`; `xl:h-8`; `2xl:w-9`; `2xl:h-9`; `w-[12px]`; `h-[12px]` |
| Type | `whitespace-nowrap`; `font-[family-name:var(--btn-font-primary)]`; `font-semibold`; `uppercase`; `tracking-[0.7px]`; `text-[11px]`; `lg:text-[12px]`; `xl:text-[13px]`; `2xl:text-[14px]`; `font-[family-name:var(--font-inter)]`; `font-bold`; `text-[9px]`; `lg:text-[10px]`; `xl:text-[10px]`; `2xl:text-[11px]`; `font-medium`; `text-[13px]`; `lg:text-[14px]`; `xl:text-[16px]`; `2xl:text-[18px]`; `font-[family-name:var(--btn-font-poppins)]`; `font-normal`; `text-[10px]`; `lg:text-[11px]`; `xl:text-[11px]`; `2xl:text-[12px]`; `tracking-[0.4px]`; `xl:text-[12px]`; `2xl:text-[13px]` |
| Appearance | `outline-primary`; `outline-dark`; `outline-danger`; `outline-square`; `bg-[var(--brand-500)]`; `text-[var(--surface-card)]`; `border-none`; `rounded-[var(--btn-radius-pill)]`; `rounded-[24px]`; `bg-[var(--btn-secondary)]`; `text-[var(--text-primary)]`; `bg-[var(--btn-navy)]`; `text-white`; `rounded-[73px]`; `bg-[var(--btn-purple)]`; `rounded-[30px]`; `bg-[var(--btn-dark)]`; `border`; `border-black`; `rounded-[var(--btn-radius-pill-sm)]`; `bg-[var(--btn-lime)]`; `rounded-[20px]`; `bg-transparent`; `text-[var(--btn-outline-primary-text)]`; `border-[var(--btn-outline-primary-border)]`; `text-[var(--btn-outline-dark-text)]`; `border-[var(--btn-outline-dark-border)]`; `text-[var(--btn-outline-danger-text)]`; `border-[var(--btn-outline-danger-border)]`; `text-[var(--brand-500)]`; `border-[var(--btn-outline-square-border)]`; `rounded-[var(--radius-dropdown)]`; `text-[var(--brand-400)]`; `border-[var(--brand-400)]`; `rounded-[var(--btn-radius-rounded)]`; `bg-[linear-gradient(135deg,var(--btn-gradient-blue-from)_0%,var(--btn-gradient-blue-to)_100%)]`; `rounded-[var(--btn-radius-circle)]`; `shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.10),0px_2px_4px_-2px_rgba(0,0,0,0.10)]`; `bg-[radial-gradient(50%_50%_at_50%_50%,var(--btn-gradient-dark-from)_0%,var(--btn-gradient-dark-to)_100%)]`; `rounded-[69px]`; `bg-white`; `rounded-full`; `bg-[var(--brand-400)]`; `border-[2px]`; `border-[var(--pie-1)]` |
| Interaction / motion | `transition-all`; `duration-150`; `ease-in-out`; `hover:opacity-85`; `active:scale-[0.97]`; `disabled:opacity-45`; `disabled:cursor-not-allowed`; `focus-visible:outline-none`; `focus-visible:ring-2`; `focus-visible:ring-[var(--brand-500)]`; `focus-visible:ring-offset-2`; `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 224 | `disabled={disabled \|\| loading}` |
| 251 | `{loading && <Spinner />}` |

**Literal palette:** `rgba(0,0,0,0.10)`.

**Related CSS tokens:** `--brand-400`, `--brand-500`, `--btn-dark`, `--btn-font-poppins`, `--btn-font-primary`, `--btn-gradient-blue-from`, `--btn-gradient-blue-to`, `--btn-gradient-dark-from`, `--btn-gradient-dark-to`, `--btn-lime`, `--btn-navy`, `--btn-outline-danger-border`, `--btn-outline-danger-text`, `--btn-outline-dark-border`, `--btn-outline-dark-text`, `--btn-outline-primary-border`, `--btn-outline-primary-text`, `--btn-outline-square-border`, `--btn-purple`, `--btn-radius-circle`, `--btn-radius-pill`, `--btn-radius-pill-sm`, `--btn-radius-rounded`, `--btn-secondary`, `--font-inter`, `--pie-1`, `--radius-dropdown`, `--surface-card`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/ui/card.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/ui/card.tsx](src/components/ui/card.tsx).

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `items-center` |
| Size & spacing | `space-y-1.5`; `p-6`; `pt-0` |
| Type | `font-semibold`; `leading-none`; `tracking-tight`; `text-sm` |
| Appearance | `rounded`; `bg-white`; `text-foreground`; `shadow-[var(--shadow-card)]`; `text-muted` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Related CSS tokens:** `--shadow-card`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/ui/input.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/ui/input.tsx](src/components/ui/input.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 79 | `flex justify-between items-center h-[clamp(16px,1.95vh,26px)]` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  labelRightElement?: React.ReactNode;
  variant?: "default" | "white" | "form";
  containerClassName?: string;
  wrapperClassName?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `items-center`; `shrink-0`; `box-border`; `login-input`; `flex-col`; `justify-between`; `absolute`; `-translate-y-1/2`; `pointer-events-none`; `justify-center` |
| Size & spacing | `h-[clamp(36px,2.9vw,40px)]`; `h-[clamp(42px,5.47vh,73px)]`; `w-full`; `h-full`; `pl-[clamp(34px,2.5vw,42px)]`; `pr-[clamp(12px,1vw,16px)]`; `px-[clamp(12px,1vw,16px)]`; `px-[clamp(34px,3.33vw,63px)]`; `gap-[clamp(6px,0.5vh,10px)]`; `gap-[clamp(6px,0.78vh,10px)]`; `h-[clamp(16px,1.95vh,26px)]`; `top-1/2`; `left-[clamp(10px,0.9vw,14px)]`; `left-[clamp(13px,1.11vw,21px)]`; `right-[clamp(10px,0.9vw,14px)]`; `right-[clamp(13px,1.11vw,21px)]` |
| Type | `font-sans`; `text-[clamp(12px,0.9vw,14px)]`; `text-[clamp(11px,1.11vw,21px)]`; `font-medium`; `leading-none`; `text-[clamp(12px,0.97vw,16px)]`; `text-[clamp(10px,0.97vw,18px)]` |
| Appearance | `bg-[var(--surface-card)]`; `border`; `border-[var(--border-default)]`; `rounded-[var(--radius-dropdown)]`; `rounded-full`; `bg-[var(--input)]`; `border-none`; `outline-none`; `bg-transparent`; `text-[var(--profile-text)]`; `text-[var(--text-primary)]`; `text-[var(--label-color)]`; `text-[var(--text-muted)]`; `opacity-40` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Related CSS tokens:** `--border-default`, `--input`, `--label-color`, `--profile-text`, `--radius-dropdown`, `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/components/ui/typography.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/components/ui/typography.tsx](src/components/ui/typography.tsx).

| Specification | Existing declarations |
| --- | --- |
| Layout | `scroll-m-20`; `first:mt-0` |
| Type | `text-4xl`; `font-extrabold`; `tracking-tight`; `lg:text-5xl`; `text-3xl`; `font-bold`; `text-2xl`; `font-semibold`; `text-xl`; `leading-7`; `text-base` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/components/FollowUpModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/components/FollowUpModal.tsx](src/features/super-admin/components/FollowUpModal.tsx).

**Purpose:** Show a deal/user follow-up timeline and completion action.

**Named declarations:** `FollowUpModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 13 | `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4` |
| 14 | `bg-white rounded-[2rem] w-[600px] overflow-hidden shadow-2xl flex flex-col font-sans relative` |
| 17 | `p-8 pb-6 border-b border-gray-100 flex justify-between items-center` |

<details><summary>Props / reusable interface</summary>

```tsx
interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // We can pass the user object here to populate some details
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `overflow-hidden`; `flex-col`; `relative`; `justify-between`; `object-cover`; `grid-cols-4`; `absolute`; `z-10`; `flex-1`; `grid-cols-2`; `grid` |
| Size & spacing | `inset-0`; `p-4`; `w-[600px]`; `p-8`; `pb-6`; `gap-4`; `w-[60px]`; `h-[60px]`; `px-4`; `py-1.5`; `gap-2`; `w-2`; `h-2`; `px-8`; `py-5`; `gap-1`; `py-6`; `left-[39px]`; `top-[24px]`; `bottom-[24px]`; `w-px`; `gap-8`; `gap-6`; `w-4`; `h-4`; `mt-1`; `mb-1`; `pr-8`; `w-[50px]`; `h-[50px]`; `gap-x-12`; `gap-y-4`; `py-2.5` |
| Type | `font-sans`; `font-bold`; `text-[18px]`; `text-sm`; `font-medium`; `text-xs`; `text-[10px]`; `uppercase`; `tracking-wider`; `text-[13px]`; `text-[14px]`; `text-[12px]`; `leading-relaxed`; `text-[16px]`; `font-semibold` |
| Appearance | `bg-black/60`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-2xl`; `border-b`; `border-gray-100`; `rounded-full`; `shadow-sm`; `text-gray-900`; `text-gray-500`; `bg-[#F0FDF4]`; `border`; `border-[#8BC34A]/30`; `bg-[#8BC34A]`; `text-gray-800`; `bg-gray-300`; `border-l`; `border-dashed`; `border-gray-400`; `border-2`; `border-[#8BC34A]`; `text-[#8BC34A]`; `text-gray-400`; `border-4`; `border-[#E8F5E9]`; `bg-gray-50`; `border-t`; `bg-[#2A3125]`; `text-white`; `rounded-xl` |
| Interaction / motion | `hover:bg-black`; `transition-colors` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2A3125`, `#8BC34A`, `#E8F5E9`, `#F0FDF4`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/components/SuperAdminHeader.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/components/SuperAdminHeader.tsx](src/features/super-admin/components/SuperAdminHeader.tsx).

**Purpose:** Compose dashboard hero, breadcrumb label, search, bell and optional metric slots.

**Composition:** [src/components/ui/typography.tsx](src/components/ui/typography.tsx), [src/components/ui/input.tsx](src/components/ui/input.tsx), [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 74 | `absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0` |
| 77 | `absolute inset-0 w-full h-full` |
| 86 | `absolute w-[clamp(80px,8vw,126px)] h-[clamp(80px,8vw,126px)] bg-[#F2FFDB] blur-[60px] rounded-full` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface SuperAdminHeaderProps {
  /** Main title displayed in the header, e.g. "SUPER ADMIN" */
  title: string;
  /** Subtitle text below the title */
  subtitle?: string;
  /** Breadcrumb label, e.g. "Dashboard" */
  breadcrumb?: string;
  /** Custom icon for the breadcrumb — defaults to LayoutGrid */
  breadcrumbIcon?: React.ReactNode;
  /** Whether to show the search bar — defaults to true */
  showSearch?: boolean;
  /** Whether to show the notification bell — defaults to true */
  showNotification?: boolean;
  /** Callback when search input changes */
  onSearch?: (query: string) => void;
  /** Optional content to render on the right side of the header */
  rightContent?: React.ReactNode;
  /** Optional hero illustration URL (renders on the right of the header) */
  heroImage?: string;
  /** Slot for extra content inside the header (below title) */
  children?: React.ReactNode;
  /** Additional className for the container */
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `flex-col`; `justify-start`; `shrink-0`; `z-50`; `absolute`; `overflow-hidden`; `pointer-events-none`; `z-0`; `-translate-x-1/2`; `items-center`; `justify-center`; `object-contain`; `items-start`; `justify-between`; `flex-1`; `justify-end`; `placeholder:text-[var(--text-muted-strong)]`; `z-10` |
| Size & spacing | `w-full`; `px-4`; `py-3`; `sm:px-5`; `sm:py-3.5`; `lg:px-6`; `lg:py-4`; `xl:px-[1.625rem]`; `xl:py-[1.125rem]`; `2xl:px-8`; `2xl:py-5`; `h-[400px]`; `gap-2.5`; `inset-0`; `h-full`; `w-[clamp(80px,8vw,126px)]`; `h-[clamp(80px,8vw,126px)]`; `w-[1657px]`; `h-[23px]`; `left-1/2`; `w-[45%]`; `max-w-[400px]`; `gap-4`; `gap-1.5`; `min-w-fit`; `gap-2`; `lg:gap-3`; `max-w-[18rem]`; `md:max-w-xs`; `lg:max-w-sm`; `xl:max-w-[23.25rem]`; `2xl:max-w-[26rem]`; `h-10`; `lg:h-11`; `xl:h-[3.25rem]`; `w-10`; `lg:w-11`; `xl:w-[3.25rem]`; `w-4`; `h-4`; `lg:w-[1.125rem]`; `lg:h-[1.125rem]`; `xl:w-[1.35rem]`; `xl:h-[1.35rem]`; `top-[0.78rem]`; `right-[0.78rem]`; `xl:top-[0.95rem]`; `xl:right-[0.95rem]`; `w-1.5`; `h-1.5`; `xl:gap-2`; `-mt-1`; `!m-0`; `-mt-2`; `max-w-[95%]`; `sm:max-w-[28rem]`; `xl:max-w-[29.375rem]` |
| Type | `font-inter`; `font-normal`; `whitespace-nowrap`; `leading-5`; `text-[0.75rem]`; `sm:text-[0.8125rem]`; `xl:text-sm`; `text-[0.8125rem]`; `lg:text-sm`; `xl:text-base`; `font-medium`; `uppercase`; `leading-[120%]`; `tracking-[-0.02em]`; `text-[1.75rem]`; `sm:text-[1.875rem]`; `lg:text-[2rem]`; `xl:text-[2.25rem]`; `2xl:text-[2.5rem]`; `leading-4`; `xl:leading-[1.125rem]` |
| Appearance | `rounded-[24px]`; `bg-[#F2FFDB]`; `blur-[60px]`; `rounded-full`; `bg-[#F2FFDA]`; `blur-[40px]`; `text-white`; `text-[var(--text-muted-strong)]`; `bg-[var(--surface-card)]`; `shadow-sm`; `text-[var(--text-primary)]`; `bg-[var(--status-danger)]`; `text-[var(--text-strong)]`; `text-[var(--text-muted)]` |
| Interaction / motion | `transition-all`; `duration-200` |

| Inline style source line | Exact declaration |
| --- | --- |
| 78 | `style={{ background: "linear-gradient(94.23deg, #B1BCB3 -8.84%, #DBE3DA 51.66%, #B1BCB3 108.77%)", }}` |
| 87 | `style={{ left: "-37px", top: "70%" }}` |
| 91 | `style={{ bottom: "-10px" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 100 | `aria-hidden="true"` |
| 153 | `aria-label="Notifications"` |
| 167 | `aria-hidden="true"` |

**Literal palette:** `#B1BCB3`, `#DBE3DA`, `#F2FFDA`, `#F2FFDB`.

**Related CSS tokens:** `--status-danger`, `--surface-card`, `--text-muted`, `--text-muted-strong`, `--text-primary`, `--text-strong`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx).

**Purpose:** Show static notification cards with an outside-click dismissal layer.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 66 | `fixed inset-0 z-40` |
| 71 | `absolute top-[calc(100%+12px)] right-0 w-[380px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200` |
| 74 | `flex items-center justify-between px-6 py-5 border-b border-gray-100` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  isOpen: boolean;
  onClose: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-40`; `absolute`; `z-50`; `overflow-hidden`; `flex`; `flex-col`; `items-center`; `justify-between`; `overflow-y-auto`; `custom-scrollbar`; `relative`; `cursor-pointer`; `group`; `items-start`; `shrink-0` |
| Size & spacing | `inset-0`; `top-[calc(100%+12px)]`; `right-0`; `w-[380px]`; `px-6`; `py-5`; `max-h-[480px]`; `p-6`; `mb-1`; `gap-2`; `w-2`; `h-2`; `mt-1`; `gap-1.5`; `mb-2`; `w-1`; `h-1`; `pr-8`; `bottom-6`; `right-6`; `top-6` |
| Type | `text-base`; `font-bold`; `text-[13px]`; `text-[11px]`; `font-medium`; `text-[12px]`; `leading-relaxed`; `text-[10px]` |
| Appearance | `bg-white`; `rounded-3xl`; `shadow-[0_10px_40px_rgba(0,0,0,0.12)]`; `border`; `border-gray-100`; `border-b`; `text-[#2D3032]`; `text-gray-400`; `border-gray-50/80`; `text-[#78909C]`; `rounded-full`; `bg-[#2196F3]`; `bg-[#B0BEC5]`; `text-[#90A4AE]`; `text-gray-500`; `text-[#B0BEC5]`; `bg-blue-100/50`; `rounded-l-full`; `opacity-0` |
| Interaction / motion | `animate-in`; `fade-in`; `slide-in-from-top-2`; `duration-200`; `hover:text-gray-600`; `transition-colors`; `hover:bg-gray-50/50`; `group-hover:opacity-100`; `transition-opacity` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2196F3`, `#2D3032`, `#78909C`, `#90A4AE`, `#B0BEC5`, `rgba(0,0,0,0.12)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/components/layout/Sidebar.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/components/layout/Sidebar.tsx](src/features/super-admin/components/layout/Sidebar.tsx).

**Purpose:** Navigate super-admin areas using the compact icon rail.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 14 | `w-[76px] bg-[#191B1C] rounded-[24px] flex flex-col justify-between p-3.5 box-border shrink-0 ml-4 mt-4 mb-4 h-[calc(100vh-32px)]` |
| 16 | `flex flex-col gap-9 w-full items-center` |
| 18 | `w-12 h-12 bg-[#0F1011] rounded-2xl flex justify-center items-center shrink-0 overflow-hidden` |

<details><summary>Props / reusable interface</summary>

```tsx
interface SidebarProps {
  navItems?: NavItem[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `justify-between`; `box-border`; `shrink-0`; `items-center`; `justify-center`; `overflow-hidden`; `object-contain`; `cursor-pointer` |
| Size & spacing | `w-[76px]`; `p-3.5`; `ml-4`; `mt-4`; `mb-4`; `h-[calc(100vh-32px)]`; `gap-9`; `w-full`; `w-12`; `h-12`; `w-[60%]`; `h-[60%]`; `gap-3`; `w-[22px]`; `h-[22px]`; `gap-4` |
| Appearance | `bg-[#191B1C]`; `rounded-[24px]`; `bg-[#0F1011]`; `rounded-2xl`; `bg-[#2D3032]`; `text-white`; `text-[#8E9093]`; `opacity-80`; `rounded-xl`; `bg-[#252729]` |
| Interaction / motion | `hover:bg-[#252729]`; `hover:text-white`; `transition-all`; `duration-200`; `hover:bg-[#2D3032]`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 45 | `style={{ filter: 'brightness(0) invert(0.7)' }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#0F1011`, `#191B1C`, `#252729`, `#2D3032`, `#8E9093`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx](src/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 24 | `flex flex-col items-center gap-0.5 pr-4 lg:pr-6` |
| 25 | `font-inter font-bold text-[1.375rem] lg:text-[1.625rem] xl:text-[1.75rem] text-[var(--text-primary)] leading-tight` |
| 28 | `font-inter font-medium text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  stats: FarmlandStats;
  bgClass?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `divide-x`; `divide-[var(--border-soft)]`; `justify-center`; `self-start`; `shrink-0`; `flex-col` |
| Size & spacing | `gap-0`; `px-4`; `lg:px-5`; `py-3`; `lg:py-4`; `w-[301px]`; `h-[92px]`; `gap-0.5`; `pr-4`; `lg:pr-6`; `pl-4`; `lg:pl-6` |
| Type | `font-inter`; `font-bold`; `text-[1.375rem]`; `lg:text-[1.625rem]`; `xl:text-[1.75rem]`; `leading-tight`; `font-medium`; `text-[0.5625rem]`; `lg:text-[0.625rem]`; `xl:text-[0.6875rem]`; `uppercase`; `tracking-wider` |
| Appearance | `bg-white/20`; `backdrop-blur-md`; `border`; `border-white/30`; `rounded-[20px]`; `shadow-sm`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Related CSS tokens:** `--border-soft`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 37 | `w-[200px] min-h-[260px] shrink-0 ` |
| 41 | `w-full h-full object-cover ` |
| 46 | `flex flex-col flex-1 py-4 pr-5 pl-1 justify-between` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: PoolBuyingCardData;
  onViewDetails?: (id: string) => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-row`; `overflow-hidden`; `shrink-0`; `object-cover`; `flex-col`; `flex-1`; `justify-between`; `grid-cols-2`; `items-end`; `block`; `grid` |
| Size & spacing | `w-[200px]`; `min-h-[260px]`; `w-full`; `h-full`; `py-4`; `pr-5`; `pl-1`; `gap-4`; `w-[90%]`; `mx-auto`; `gap-x-8`; `gap-y-4`; `gap-0.5`; `gap-2`; `mt-3`; `h-[6px]`; `py-2.5`; `mt-2` |
| Type | `font-inter`; `font-semibold`; `text-[0.625rem]`; `uppercase`; `tracking-[0.08em]`; `text-[0.875rem]`; `leading-tight`; `font-bold`; `text-[1.125rem]`; `text-[0.9375rem]`; `text-[0.5625rem]`; `font-medium`; `text-[0.8125rem]` |
| Appearance | `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-sm`; `border`; `border-[var(--border-soft)]`; `text-[var(--text-muted)]`; `text-[var(--text-primary)]`; `bg-gray-200`; `rounded-full`; `bg-[#1B3A2D]`; `text-[#1B3A2D]`; `bg-[#2D3319]`; `text-white` |
| Interaction / motion | `transition-all`; `duration-500`; `hover:bg-[#1a1f0f]`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 93 | `` style={{ width: `${progressPercent}%` }} `` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1B3A2D`, `#1a1f0f`, `#2D3319`.

**Related CSS tokens:** `--border-soft`, `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx](src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 34 | `bg-[#2D3032] rounded-xl px-3 py-2 shadow-lg border border-white/10` |
| 35 | `font-inter font-semibold text-xs text-white mb-1` |
| 39 | `flex items-center gap-2` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: SalesReportDataPoint[];
  period?: string;
  onPeriodChange?: (period: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `flex-col`; `box-border`; `justify-between`; `items-start`; `shrink-0`; `cursor-pointer`; `appearance-none`; `flex-wrap`; `flex-1` |
| Size & spacing | `px-3`; `py-2`; `mb-1`; `gap-2`; `w-2`; `h-2`; `px-2`; `py-0.5`; `w-full`; `min-h-[468px]`; `h-full`; `pt-[24px]`; `pr-[32px]`; `pb-[24px]`; `pl-[32px]`; `gap-[10px]`; `mb-3`; `gap-1`; `m-0`; `py-1.5`; `gap-4`; `gap-1.5`; `min-h-[200px]` |
| Type | `font-inter`; `font-semibold`; `text-xs`; `text-[11px]`; `text-[10px]`; `whitespace-nowrap`; `text-[clamp(0.875rem,1.2vw,1.125rem)]`; `font-normal`; `text-[clamp(0.625rem,0.85vw,0.75rem)]`; `text-[0.75rem]`; `text-[0.625rem]`; `lg:text-[0.6875rem]` |
| Appearance | `bg-[#2D3032]`; `rounded-xl`; `shadow-lg`; `border`; `border-white/10`; `text-white`; `rounded-full`; `text-white/80`; `bg-[#8B9A46]`; `rounded-lg`; `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-[var(--shadow-card)]`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `bg-[var(--surface-page)]`; `border-[var(--border-soft)]`; `outline-none` |

| Inline style source line | Exact declaration |
| --- | --- |
| 42 | `style={{ background: entry.color }}` |
| 165 | `style={{ background: item.color }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#3B3B3B`, `#8B9A46`, `#C5D654`, `#E88B5A`.

**Related CSS tokens:** `--border-soft`, `--shadow-card`, `--surface-card`, `--surface-page`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx](src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 32 | `flex gap-3 lg:gap-4` |
| 58 | `w-5 h-5 lg:w-6 lg:h-6` |
| 63 | `flex flex-col gap-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  cards: StatusCardItem[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `flex-1`; `justify-center`; `shrink-0`; `flex-col` |
| Size & spacing | `gap-3`; `lg:gap-4`; `px-4`; `lg:px-5`; `xl:px-6`; `py-3`; `lg:py-4`; `min-w-[120px]`; `w-10`; `h-10`; `lg:w-11`; `lg:h-11`; `xl:w-12`; `xl:h-12`; `w-5`; `h-5`; `lg:w-6`; `lg:h-6`; `gap-0` |
| Type | `font-inter`; `font-bold`; `text-[1.125rem]`; `lg:text-[1.25rem]`; `xl:text-[1.375rem]`; `leading-tight`; `font-normal`; `text-[0.6875rem]`; `lg:text-[0.75rem]` |
| Appearance | `bg-[#F3F4F6]`; `bg-[var(--surface-card)]`; `rounded-2xl`; `shadow-sm`; `rounded-full`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#F3F4F6`.

**Related CSS tokens:** `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx](src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `flex justify-between items-start mb-2 shrink-0` |
| 31 | `flex flex-col gap-1 flex-1 pr-2` |
| 32 | `m-0 font-inter font-semibold text-[clamp(0.875rem,1.2vw,1.125rem)] text-[var(--text-primary)]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: SubscriberGrowthData;
  period?: string;
  onPeriodChange?: (period: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `box-border`; `justify-between`; `items-start`; `shrink-0`; `flex-1`; `cursor-pointer`; `appearance-none`; `items-center`; `justify-center`; `relative`; `aspect-square`; `absolute`; `pointer-events-none` |
| Size & spacing | `w-full`; `min-h-[267px]`; `h-full`; `p-[20px]`; `gap-[13px]`; `mb-2`; `gap-1`; `pr-2`; `m-0`; `px-3`; `py-1.5`; `min-h-[160px]`; `w-[clamp(140px,14vw,200px)]`; `inset-0`; `gap-4`; `mt-2`; `gap-1.5`; `w-2`; `h-2` |
| Type | `font-inter`; `font-semibold`; `text-[clamp(0.875rem,1.2vw,1.125rem)]`; `font-normal`; `text-[clamp(0.5625rem,0.8vw,0.6875rem)]`; `leading-snug`; `text-[0.75rem]`; `text-[clamp(0.5rem,0.7vw,0.625rem)]`; `uppercase`; `tracking-wider`; `font-bold`; `text-[clamp(1rem,1.5vw,1.5rem)]`; `text-[clamp(0.625rem,0.9vw,0.8125rem)]`; `text-[0.625rem]`; `lg:text-[0.6875rem]` |
| Appearance | `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-[var(--shadow-card)]`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `bg-[var(--surface-page)]`; `border`; `border-[var(--border-soft)]`; `rounded-lg`; `outline-none`; `rounded-full` |

| Inline style source line | Exact declaration |
| --- | --- |
| 123 | `style={{ background: segment.color }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#ffffff`.

**Related CSS tokens:** `--border-soft`, `--shadow-card`, `--surface-card`, `--surface-page`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx), [src/components/ui/typography.tsx](src/components/ui/typography.tsx), [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 22 | `flex flex-col p-4 lg:p-6 gap-4` |
| 24 | `flex flex-wrap gap-2` |
| 26 | `px-3 py-1 bg-[#F2F4F7] text-[var(--text-primary)] rounded-full font-inter font-medium text-[0.625rem] lg:text-[0.6875rem] uppercase tracking-wide` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: FarmlandData;
  imagePosition?: "top" | "bottom";
  onViewDetails?: (id: number | string) => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `flex-wrap`; `items-center`; `justify-between`; `object-cover`; `shrink-0`; `overflow-hidden` |
| Size & spacing | `p-4`; `lg:p-6`; `gap-4`; `gap-2`; `px-3`; `py-1`; `gap-1.5`; `px-2`; `py-0.5`; `mt-1`; `w-6`; `h-6`; `lg:w-8`; `lg:h-8`; `px-4`; `py-1.5`; `w-full`; `h-[200px]`; `h-full` |
| Type | `font-inter`; `font-medium`; `text-[0.625rem]`; `lg:text-[0.6875rem]`; `uppercase`; `tracking-wide`; `font-bold`; `text-[1.125rem]`; `lg:text-[1.25rem]`; `font-normal`; `text-[0.75rem]`; `lg:text-[0.8125rem]`; `text-[0.6875rem]`; `lg:text-[0.75rem]` |
| Appearance | `bg-[#F2F4F7]`; `text-[var(--text-primary)]`; `rounded-full`; `bg-[#E6EEAD]`; `text-[#2A3125]`; `border`; `border-[#D5DF96]`; `text-[var(--text-muted)]`; `border-gray-200`; `border-[var(--border-strong)]`; `bg-white`; `bg-gray-100`; `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-sm`; `border-[var(--border-soft)]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2A3125`, `#D5DF96`, `#E6EEAD`, `#F2F4F7`.

**Related CSS tokens:** `--border-soft`, `--border-strong`, `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandsListCard.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx), [src/components/ui/typography.tsx](src/components/ui/typography.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 40 | `w-full h-[180px] shrink-0 p-3 pb-0` |
| 44 | `w-full h-full object-cover rounded-[16px]` |
| 49 | `flex flex-col p-4 lg:p-6 gap-4` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: FarmlandListCardData;
  onViewDetails?: (id: string) => void;
  onEditTag?: (id: string) => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `overflow-hidden`; `shrink-0`; `object-cover`; `items-center`; `justify-between`; `grid-cols-2`; `grid` |
| Size & spacing | `w-full`; `h-[180px]`; `p-3`; `pb-0`; `h-full`; `p-4`; `lg:p-6`; `gap-4`; `gap-2`; `gap-1.5`; `px-3`; `py-1`; `h-px`; `my-1`; `w-6`; `h-6`; `lg:w-8`; `lg:h-8`; `px-4`; `py-1.5` |
| Type | `font-bold`; `text-[1.125rem]`; `lg:text-[1.25rem]`; `font-inter`; `font-medium`; `text-[0.6875rem]`; `lg:text-[0.75rem]`; `font-semibold`; `text-[0.625rem]`; `lg:text-[0.6875rem]`; `uppercase`; `tracking-wide`; `text-[0.875rem]`; `lg:text-[1rem]` |
| Appearance | `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-sm`; `border`; `border-[var(--border-soft)]`; `rounded-[16px]`; `text-[var(--text-primary)]`; `rounded-full`; `border-gray-200`; `bg-white`; `text-[#8B9A46]`; `text-[var(--text-muted)]`; `bg-gray-100`; `border-[var(--border-strong)]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#8B9A46`.

**Related CSS tokens:** `--border-soft`, `--border-strong`, `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 121 | `w-full overflow-x-auto bg-white rounded-2xl border border-gray-100` |
| 122 | `w-full min-w-[900px] text-left border-collapse` |
| 124 | `border-b border-gray-200` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `overflow-x-auto`; `flex`; `items-center`; `relative`; `justify-center`; `absolute`; `inline-block`; `z-50` |
| Size & spacing | `w-full`; `min-w-[900px]`; `py-4`; `px-6`; `py-5`; `mb-1`; `gap-2`; `w-3.5`; `h-3.5`; `w-2`; `h-2`; `w-8`; `h-8`; `right-0`; `top-10`; `w-32`; `py-1.5`; `px-4`; `py-2` |
| Type | `text-left`; `font-semibold`; `text-sm`; `font-bold`; `text-[13px]`; `font-medium` |
| Appearance | `text-[#16A34A]`; `bg-[#16A34A]`; `text-[#3B82F6]`; `text-[#EAB308]`; `bg-[#EAB308]`; `text-[#6B7280]`; `bg-[#9CA3AF]`; `bg-white`; `rounded-2xl`; `border`; `border-gray-100`; `border-collapse`; `border-b`; `border-gray-200`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `rounded-full`; `opacity-20`; `border-gray-300`; `text-gray-600`; `rounded-xl`; `shadow-lg` |
| Interaction / motion | `hover:bg-gray-50/50`; `transition-colors`; `hover:bg-gray-50` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#16A34A`, `#3B82F6`, `#6B7280`, `#9CA3AF`, `#EAB308`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx).

**Composition:** [src/components/ui/typography.tsx](src/components/ui/typography.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 39 | `flex items-center gap-4 lg:gap-5 xl:gap-6 min-w-0 w-[18rem] lg:w-[22rem] shrink-0` |
| 40 | `relative rounded-full overflow-hidden w-12 h-12 lg:w-14 lg:h-14 shrink-0` |
| 44 | `w-full h-full object-cover` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  data: SuperAdminUserCardData;
  onViewProfile?: (id: string) => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-between`; `shrink-0`; `relative`; `overflow-hidden`; `object-cover`; `flex-col`; `justify-center`; `flex-1`; `justify-end` |
| Size & spacing | `w-full`; `px-[1.25rem]`; `lg:px-[1.5rem]`; `xl:px-[2rem]`; `h-[5rem]`; `lg:h-[5.5rem]`; `xl:h-[6rem]`; `gap-4`; `lg:gap-5`; `xl:gap-6`; `min-w-0`; `w-[18rem]`; `lg:w-[22rem]`; `w-12`; `h-12`; `lg:w-14`; `lg:h-14`; `h-full`; `gap-1`; `gap-3`; `lg:gap-4`; `px-3`; `lg:px-4`; `py-1`; `lg:py-1.5`; `w-6`; `h-6`; `lg:w-7`; `lg:h-7`; `gap-6`; `lg:gap-8`; `min-w-[12rem]`; `lg:min-w-[14rem]`; `gap-2`; `px-4`; `lg:px-5`; `py-2`; `lg:py-2.5` |
| Type | `font-[family-name:var(--font-heading)]`; `font-bold`; `leading-none`; `truncate`; `!text-[1rem]`; `font-[family-name:var(--font-sans)]`; `text-[0.75rem]`; `lg:text-[0.8125rem]`; `font-inter`; `font-medium`; `text-[0.625rem]`; `lg:text-[0.6875rem]`; `tracking-wide`; `text-[0.6875rem]`; `lg:text-[0.75rem]` |
| Appearance | `bg-[color:var(--surface-card)]`; `rounded-[1.5rem]`; `lg:rounded-[2rem]`; `shadow-sm`; `border`; `border-[var(--border-soft)]`; `rounded-full`; `text-[color:var(--text-heading)]`; `text-[color:var(--text-secondary)]`; `bg-[#F3F4F6]`; `text-[#4B5563]`; `bg-[#ECFDF5]`; `text-[#059669]`; `bg-[#FEF2F2]`; `text-[#DC2626]`; `bg-white`; `border-gray-100`; `fill-current`; `text-[#D4AF37]`; `text-[#1E3A8A]`; `opacity-70`; `bg-[#1A1A1A]`; `text-white` |
| Interaction / motion | `transition-shadow`; `duration-200`; `hover:shadow-[0px_24px_48px_rgba(0,49,50,0.10)]`; `hover:bg-black`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#059669`, `#1A1A1A`, `#1E3A8A`, `#4B5563`, `#D4AF37`, `#DC2626`, `#ECFDF5`, `#F3F4F6`, `#FEF2F2`, `rgba(0,49,50,0.10)`.

**Related CSS tokens:** `--border-soft`, `--font-heading`, `--font-sans`, `--surface-card`, `--text-heading`, `--text-secondary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx](src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx).

**Composition:** [src/components/ui/card.tsx](src/components/ui/card.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 26 | `m-0 font-inter font-semibold text-[clamp(0.875rem,1.2vw,1.125rem)] text-[var(--text-primary)] mb-4 w-full text-left` |
| 31 | `flex items-end justify-center w-full gap-3 lg:gap-6 overflow-x-auto pb-2` |
| 54 | `w-full h-full object-cover` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  performers: TopPerformer[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `justify-center`; `items-center`; `box-border`; `overflow-hidden`; `cursor-pointer`; `items-end`; `overflow-x-auto`; `shrink-0`; `relative`; `object-cover` |
| Size & spacing | `w-full`; `min-h-[294px]`; `h-full`; `p-[16px]`; `gap-[8px]`; `m-0`; `mb-4`; `gap-3`; `lg:gap-6`; `pb-2`; `w-[120px]`; `h-[180px]`; `pt-4`; `pb-3`; `px-2`; `w-[100px]`; `h-[145px]`; `w-16`; `h-16`; `lg:w-[4.5rem]`; `lg:h-[4.5rem]`; `w-12`; `h-12`; `lg:w-14`; `lg:h-14`; `py-0.5` |
| Type | `font-inter`; `font-semibold`; `text-[clamp(0.875rem,1.2vw,1.125rem)]`; `text-left`; `text-sm`; `text-center`; `leading-tight`; `text-[0.75rem]`; `lg:text-[0.8125rem]`; `font-normal`; `text-[0.6875rem]`; `lg:text-[0.75rem]`; `font-bold`; `text-[0.875rem]`; `lg:text-[1rem]`; `text-[0.5rem]`; `lg:text-[0.5625rem]`; `uppercase`; `tracking-wider` |
| Appearance | `bg-[color:var(--surface-card)]`; `rounded-[24px]`; `shadow-[var(--shadow-card)]`; `text-[var(--text-primary)]`; `bg-[#F5F5F5]`; `rounded-full`; `ring-3`; `ring-[#8B9A46]`; `ring-offset-2`; `bg-[#E8EAE0]`; `text-[var(--text-muted)]`; `bg-[#2D3032]`; `text-white`; `rounded-md` |
| Interaction / motion | `hover:shadow-md`; `transition-shadow`; `transition-transform`; `duration-200` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2D3032`, `#8B9A46`, `#E8EAE0`, `#F5F5F5`.

**Related CSS tokens:** `--shadow-card`, `--surface-card`, `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 15 | `flex gap-3 lg:gap-4 shrink-0` |
| 25 | `flex items-center justify-between` |
| 26 | `font-inter font-medium text-[0.8125rem] lg:text-sm text-[var(--text-primary)]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  visitors: VisitorStats;
  totalSales: TotalSales;
  bgClass?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `shrink-0`; `flex-col`; `justify-center`; `items-center`; `justify-between`; `items-end`; `overflow-hidden`; `flex-1` |
| Size & spacing | `gap-3`; `lg:gap-4`; `gap-2`; `p-4`; `lg:p-5`; `w-[206px]`; `h-[147px]`; `gap-4`; `lg:gap-6`; `mt-1`; `gap-1`; `w-full`; `w-[81px]`; `h-[20px]`; `h-full`; `px-2`; `py-0.5`; `gap-[2px]`; `h-6` |
| Type | `font-inter`; `font-medium`; `text-[0.8125rem]`; `lg:text-sm`; `font-normal`; `text-[0.625rem]`; `lg:text-[0.6875rem]`; `font-bold`; `text-[1.375rem]`; `lg:text-[1.625rem]`; `xl:text-[1.75rem]`; `leading-none` |
| Appearance | `bg-white/20`; `backdrop-blur-md`; `border`; `border-white/30`; `rounded-2xl`; `shadow-sm`; `text-[var(--text-primary)]`; `text-[var(--text-muted)]`; `opacity-70`; `bg-gray-200/50`; `rounded-[20px]`; `bg-[#8B9A46]`; `bg-[#C5D654]`; `bg-[#F0F7E4]`; `rounded-full`; `text-[#6B8A2E]`; `rounded-t-sm`; `bg-[#C5D654]/60` |

| Inline style source line | Exact declaration |
| --- | --- |
| 42 | `` style={{ width: `${visitors.nriPercentage}%` }} `` |
| 57 | `` style={{ width: `${visitors.localPercentage}%` }} `` |
| 101 | `` style={{ height: `${heightPercent}%`, minWidth: "3px" }} `` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#6B8A2E`, `#8B9A46`, `#C5D654`, `#F0F7E4`.

**Related CSS tokens:** `--text-muted`, `--text-primary`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/FormFields.tsx).

**Purpose:** Supply the directory-specific display/edit form-field family; see current-vs-legacy distinction in §7.6.

**Named declarations:** `DropdownField`, `TextField`, `MultiTagField`, `DualTextField`, `RadioGroupField`, `InputTextField`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 8 | `mb-6 relative` |
| 9 | `text-[22px] font-bold text-gray-900 mb-6` |
| 11 | `flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 cursor-default` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `items-center`; `justify-between`; `cursor-default`; `flex-1`; `last:mb-0`; `flex-wrap`; `justify-center`; `shrink-0`; `select-none` |
| Size & spacing | `mb-6`; `px-5`; `py-4`; `gap-2`; `px-4`; `py-3.5`; `px-3`; `py-1`; `mb-8`; `mb-4`; `gap-4`; `w-[18px]`; `h-[18px]`; `w-[10px]`; `h-[10px]`; `w-full` |
| Type | `text-[22px]`; `font-bold`; `text-[15px]`; `font-medium`; `text-[13px]`; `font-semibold`; `text-[16px]` |
| Appearance | `text-gray-900`; `bg-gray-50`; `border`; `border-gray-200`; `rounded-2xl`; `text-gray-500`; `bg-white`; `text-gray-800`; `bg-[#A3C33D]`; `text-white`; `rounded-lg`; `opacity-80`; `bg-[#2A3125]`; `border-[#2A3125]`; `opacity-90`; `rounded-full`; `border-[1.5px]`; `border-gray-300`; `text-gray-600`; `outline-none` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2A3125`, `#A3C33D`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx).

**Purpose:** Supply inline document/status icons and file-row presentation for this workflow family.

**Named declarations:** `PdfIcon`, `WarningIcon`, `RejectedIcon`, `PendingDotIcon`, `CheckIcon`, `ChevronDownIcon`, `FileRow`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 63 | `relative w-full shrink-0 h-[60px] bg-[#F6F9E2] rounded-[12px] mb-2 flex items-center justify-between px-3 box-border` |
| 64 | `flex items-center gap-3 w-[70%]` |
| 65 | `flex items-center justify-center bg-white w-9 h-9 rounded-[4px] shrink-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `shrink-0`; `flex`; `items-center`; `justify-between`; `box-border`; `justify-center`; `flex-col`; `block`; `cursor-pointer` |
| Size & spacing | `w-full`; `h-[60px]`; `mb-2`; `px-3`; `gap-3`; `w-[70%]`; `w-9`; `h-9`; `w-5`; `h-5`; `min-w-0`; `mt-0.5`; `w-8`; `h-8`; `h-4`; `w-4` |
| Type | `truncate`; `font-[`; `font-normal`; `text-[14px]`; `leading-tight`; `text-[10px]`; `font-['Inter',_sans-serif]` |
| Appearance | `bg-[#F6F9E2]`; `rounded-[12px]`; `bg-white`; `rounded-[4px]`; `text-black`; `text-[rgba(0,0,0,0.7)]`; `rounded-full`; `border-b-2`; `border-[#BDD327]`; `text-[rgba(0,0,0,0.82)]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `disabled:opacity-50`; `animate-spin` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 62 | `export const FileRow: React.FC<{ file: UploadedFile, onDownload?: () => void, isDownloading?: boolean }> = ({ file, onDownload, isDownloading }) => (` |
| 83 | `disabled={isDownloading}` |
| 86 | `{isDownloading ? (` |

**Literal palette:** `#6B7280`, `#8CB43A`, `#9CA3AF`, `#BDD327`, `#D1D5DB`, `#EF4444`, `#F59E0B`, `#F6F9E2`, `#FEE2E2`, `#fff`, `rgba(0,0,0,0.7)`, `rgba(0,0,0,0.82)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/LandDetailsTab.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/LandDetailsTab.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/LandDetailsTab.tsx).

**Purpose:** Display current land details in verification customer information.

**Named declarations:** `LandDetailsTab`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 11 | `w-full h-full min-h-[500px] flex items-center justify-center` |
| 12 | `animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900` |
| 13 | `ml-3 text-gray-500 font-medium` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `flex-col`; `lg:flex-row`; `flex-1`; `lg:items-end`; `shrink-0`; `object-cover`; `lg:items-start` |
| Size & spacing | `w-full`; `h-full`; `min-h-[500px]`; `h-8`; `w-8`; `ml-3`; `h-[500px]`; `mb-8`; `lg:mb-10`; `gap-6`; `lg:gap-8`; `max-w-4xl`; `mx-auto`; `gap-4`; `lg:gap-6`; `gap-1`; `max-w-[250px]`; `max-w-[280px]`; `mx-4`; `h-[200px]`; `lg:h-[240px]` |
| Type | `font-medium`; `text-center`; `font-bold`; `tracking-[0.2em]`; `text-sm`; `lg:text-base`; `lg:text-right`; `text-xs`; `tracking-wider`; `uppercase`; `font-semibold`; `text-base`; `lg:text-lg`; `break-words`; `lg:text-left`; `text-lg` |
| Appearance | `rounded-full`; `border-b-2`; `border-gray-900`; `text-gray-500`; `text-gray-400`; `text-[#A3C33D]`; `rounded-[1.5rem]`; `shadow-sm` |
| Interaction / motion | `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 5 | `export const LandDetailsTab: React.FC<{ landDetailsData: any, isLoading?: boolean }> = ({ landDetailsData, isLoading }) => {` |
| 9 | `if (isLoading \|\| locationNames.isLoading) {` |

**Literal palette:** `#A3C33D`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx).

**Purpose:** Supply StarBadge, rejection reason modal and proceed confirmation for this workflow family.

**Named declarations:** `StarBadge`, `RejectModal`, `ProceedModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 9 | `absolute inset-0` |
| 10 | `absolute inset-0` |
| 11 | `absolute inset-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `absolute`; `z-10`; `fixed`; `z-50`; `items-center`; `justify-center`; `flex-col`; `resize-none`; `justify-end` |
| Size & spacing | `inset-0`; `w-[500px]`; `p-8`; `mb-6`; `w-full`; `h-[150px]`; `p-4`; `gap-4`; `px-6`; `py-2.5`; `py-10`; `px-8`; `mb-8`; `mb-10`; `max-w-[360px]`; `px-[50px]`; `py-[14px]` |
| Type | `text-2xl`; `font-bold`; `text-sm`; `font-semibold`; `text-[24px]`; `text-center`; `font-medium`; `text-[17px]`; `leading-[1.6]` |
| Appearance | `bg-black/60`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-2xl`; `text-gray-900`; `bg-gray-50`; `border`; `border-gray-200`; `rounded-2xl`; `outline-none`; `rounded-full`; `border-gray-300`; `text-gray-700`; `bg-red-500`; `text-white`; `bg-white/40`; `shadow-[0_10px_40px_rgba(0,0,0,0.08)]`; `text-gray-800`; `text-[#1D7ABE]`; `bg-[#2A3125]` |
| Interaction / motion | `focus:border-red-400`; `hover:bg-red-600`; `transition-colors`; `hover:bg-black` |

| Inline style source line | Exact declaration |
| --- | --- |
| 8 | `style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}` |
| 9 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(0deg)' }}` |
| 10 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(30deg)' }}` |
| 11 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(60deg)' }}` |
| 12 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(15deg)' }}` |
| 13 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(45deg)' }}` |
| 14 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(75deg)' }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1D7ABE`, `#2A3125`, `#A3C33D`, `#F3F4F6`, `rgba(0,0,0,0.08)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/OwnerDetailsTab.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/OwnerDetailsTab.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/OwnerDetailsTab.tsx).

**Purpose:** Display current owner details from fetched farmland data.

**Named declarations:** `OwnerDetailsTab`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 6 | `w-full h-full min-h-[500px] flex items-center justify-center` |
| 7 | `animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900` |
| 8 | `ml-3 text-gray-500 font-medium` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `flex-col`; `grid-cols-1`; `md:grid-cols-2`; `justify-between`; `grid` |
| Size & spacing | `w-full`; `h-full`; `min-h-[500px]`; `h-8`; `w-8`; `ml-3`; `gap-x-6`; `lg:gap-x-12`; `gap-y-6`; `gap-2`; `min-h-[48px]`; `px-4`; `py-2` |
| Type | `font-medium`; `font-semibold`; `text-sm`; `break-words`; `break-all` |
| Appearance | `rounded-full`; `border-b-2`; `border-gray-900`; `text-gray-500`; `text-gray-700`; `bg-gray-50`; `border`; `border-gray-200`; `rounded-[1rem]`; `text-gray-900`; `bg-white` |
| Interaction / motion | `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 3 | `export const OwnerDetailsTab: React.FC<{ ownerDetailsData: any, isLoading?: boolean }> = ({ ownerDetailsData, isLoading }) => {` |
| 4 | `if (isLoading) {` |

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx).

**Purpose:** Supply current verification page header, stepper, section tabs, read-only comments and approval footer.

**Named declarations:** `PageHeader`, `StepperSidebar`, `TabsCard`, `CommentsSection`, `FooterActions`.

**Composition:** [src/components/ui/BackButton.tsx](src/components/ui/BackButton.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 81 | `fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200` |
| 82 | `bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col p-[clamp(1.5rem,3.125vw,2.5rem)] max-w-sm w-full mx-4 text-center` |
| 83 | `font-['Manrope'] font-bold text-xl text-[#1A1C1D] mb-4` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `flex`; `items-center`; `justify-center`; `z-[110]`; `flex-col`; `flex-1`; `relative`; `box-border`; `select-none`; `shrink-0`; `overflow-y-auto`; `absolute`; `flex-row`; `z-10`; `cursor-pointer`; `overflow-hidden`; `z-[0]`; `z-[1]`; `justify-between`; `inline-flex`; `cursor-not-allowed` |
| Size & spacing | `inset-0`; `p-[clamp(1.5rem,3.125vw,2.5rem)]`; `max-w-sm`; `w-full`; `mx-4`; `mb-4`; `mb-8`; `gap-4`; `py-[clamp(0.6rem,1.25vw,1rem)]`; `px-8`; `py-10`; `w-[280px]`; `h-full`; `gap-1`; `left-[9px]`; `top-[14px]`; `bottom-[14px]`; `w-0`; `gap-6`; `py-[22px]`; `w-[18px]`; `h-[18px]`; `w-[20px]`; `h-[20px]`; `w-[10px]`; `h-[10px]`; `mt-16`; `py-4`; `w-[320px]`; `px-6`; `py-6`; `m-0`; `mt-1`; `py-2`; `gap-3`; `py-3.5`; `w-5`; `h-5`; `w-4`; `h-4`; `w-[40%]`; `h-[40%]`; `ml-auto`; `h-[140px]`; `mb-3`; `px-1`; `left-0`; `top-0`; `p-4`; `mt-auto`; `pt-6`; `gap-1.5`; `px-4`; `w-2`; `h-2`; `max-w-md`; `gap-5` |
| Type | `text-center`; `font-[`; `font-bold`; `text-xl`; `font-medium`; `text-[0.85rem]`; `leading-tight`; `text-[1.6rem]`; `break-all`; `text-[0.8rem]`; `tracking-wide`; `text-sm`; `uppercase`; `font-sans`; `text-base`; `md:text-lg`; `text-xs`; `md:text-sm`; `text-left`; `font-semibold`; `leading-none`; `text-[14px]`; `leading-relaxed`; `truncate`; `font-['Manrope']`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.2)]`; `shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)]`; `rounded-[24px]`; `text-[#1A1C1D]`; `text-[#5A5C5E]`; `rounded-full`; `border-[#D1D5DB]`; `text-white`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `border-l`; `border-[rgba(44,44,44,0.15)]`; `bg-[#BDD327]`; `bg-[#2D3409]`; `border-[2px]`; `border-[rgba(122,_149,_28,_0.8)]`; `shadow-[0_0_0_4px_rgba(189,_211,_39,_0.38)]`; `bg-[#E5E9D8]`; `border-transparent`; `shadow-[0_0_0_2px_rgba(255,_255,_255,_1)]`; `opacity-60`; `text-[#2B3024]`; `bg-[#E1E8B0]`; `rounded-3xl`; `shadow-[0px_20px_40px_rgba(0,_49,_50,_0.06)]`; `border-b`; `border-gray-100`; `text-[#BDD327]`; `bg-red-100`; `text-red-600`; `text-[#2D3409]`; `text-gray-900`; `bg-[rgba(230,238,173,0.2)]`; `border-[#E6EEAD]`; `rounded-[12px]`; `text-black`; `border-t`; `bg-red-50`; `border-red-200`; `text-red-700`; `shadow-sm`; `bg-red-500`; `opacity-50` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `hover:bg-gray-50`; `transition-colors`; `transition-opacity`; `hover:opacity-90`; `disabled:opacity-50`; `hover:opacity-80`; `hover:shadow-md`; `transition-all`; `hover:bg-red-50`; `hover:text-red-700`; `hover:border-red-300` |

| Inline style source line | Exact declaration |
| --- | --- |
| 101 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |
| 351 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 63 | `} catch (error) {` |
| 99 | `disabled={isDrafting}` |
| 338 | `disabled={isSubmitting}` |
| 347 | `disabled={isSubmitting}` |
| 355 | `{isSubmitting ? "PROCESSING..." : "APPROVE"}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2B3024`, `#2D3409`, `#3D4A0D`, `#5A5C5E`, `#BDD327`, `#C0C2B7`, `#D1D5DB`, `#E1E5EF`, `#E1E8B0`, `#E5E9D8`, `#E6EEAD`, `#F4F7E6`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.2)`, `rgba(0,49,50,0.06)`, `rgba(0,_49,_50,_0.06)`, `rgba(122,_149,_28,_0.8)`, `rgba(189,_211,_39,_0.38)`, `rgba(230,238,173,0.2)`, `rgba(255,_255,_255,_1)`, `rgba(44,44,44,0.15)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx).

**Named declarations:** `VerificationSummaryModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 229 | `fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200` |
| 230 | `bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_8px_32px_rgba(0,0,0,0.18)] rounded-[24px] flex flex-col p-8 max-w-lg w-full mx-4` |
| 231 | `font-bold text-2xl text-gray-900 mb-2 text-center` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `flex`; `items-center`; `justify-center`; `z-[110]`; `flex-col`; `shrink-0`; `flex-wrap`; `overflow-y-auto`; `inline-flex`; `flex-1`; `cursor-not-allowed` |
| Size & spacing | `inset-0`; `p-8`; `max-w-lg`; `w-full`; `mx-4`; `mb-2`; `mb-6`; `py-10`; `gap-3`; `h-10`; `w-10`; `gap-4`; `w-12`; `h-12`; `px-6`; `py-2`; `p-4`; `w-2`; `h-2`; `gap-2`; `mb-3`; `w-2.5`; `h-2.5`; `max-h-[200px]`; `pr-1`; `gap-1.5`; `px-3`; `py-1.5`; `w-1.5`; `h-1.5`; `mb-4`; `p-3`; `max-w-[160px]`; `py-3`; `w-4`; `h-4`; `py-6`; `w-16`; `h-16`; `w-8`; `h-8`; `mt-1` |
| Type | `font-bold`; `text-2xl`; `text-center`; `text-sm`; `font-medium`; `text-xl`; `font-semibold`; `text-xs`; `text-lg` |
| Appearance | `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.1)]`; `shadow-[0px_8px_32px_rgba(0,0,0,0.18)]`; `rounded-[24px]`; `text-gray-900`; `text-gray-500`; `rounded-full`; `border-[3px]`; `border-gray-200`; `border-t-[#2A3125]`; `bg-red-100`; `text-red-500`; `border-red-300`; `text-red-600`; `bg-yellow-50`; `border-yellow-200`; `rounded-xl`; `bg-yellow-500`; `text-yellow-800`; `bg-red-500`; `text-gray-800`; `bg-red-50`; `border-red-200`; `text-red-700`; `rounded-lg`; `border-gray-300`; `text-gray-700`; `bg-red-200`; `bg-red-600`; `text-white`; `border-2`; `border-white/30`; `border-t-white`; `bg-green-100`; `shadow-[0_0_0_8px_rgba(220,252,231,0.5)]`; `text-green-500`; `bg-[#E1E8B0]`; `text-[#2B3024]`; `opacity-50`; `border-[#2B3024]/30`; `border-t-[#2B3024]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `animate-spin`; `hover:bg-red-50`; `transition-colors`; `hover:bg-gray-50`; `disabled:opacity-50`; `hover:bg-red-700`; `hover:shadow-lg`; `hover:opacity-90` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 296 | `disabled={isReverting \|\| isSubmitting}` |
| 304 | `disabled={isReverting \|\| isSubmitting \|\| totalPending > 0}` |
| 341 | `disabled={isReverting \|\| isSubmitting}` |
| 349 | `disabled={isReverting \|\| isSubmitting \|\| totalPending > 0}` |
| 356 | `{isSubmitting && (` |

**Literal palette:** `#2A3125`, `#2B3024`, `#E1E8B0`, `rgba(0,0,0,0.1)`, `rgba(0,0,0,0.18)`, `rgba(220,252,231,0.5)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/components/FormFields.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/components/FormFields.tsx](src/features/super-admin/sub-features/legal-docs/components/FormFields.tsx).

**Purpose:** Supply the directory-specific display/edit form-field family; see current-vs-legacy distinction in §7.6.

**Named declarations:** `DropdownField`, `TextField`, `MultiTagField`, `DualTextField`, `RadioGroupField`, `InputTextField`.

**Composition:** [src/features/super-admin/sub-features/legal-docs/components/Icons.tsx](src/features/super-admin/sub-features/legal-docs/components/Icons.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 11 | `mb-6 relative` |
| 12 | `text-[22px] font-bold text-gray-900 mb-6` |
| 17 | `text-[15px] text-gray-800 font-medium` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `items-center`; `justify-between`; `cursor-pointer`; `absolute`; `z-50`; `flex-1`; `last:mb-0`; `flex-wrap`; `justify-center`; `shrink-0`; `select-none` |
| Size & spacing | `mb-6`; `px-5`; `py-4`; `top-full`; `left-0`; `right-0`; `mt-2`; `py-2`; `py-3`; `gap-2`; `px-4`; `py-3.5`; `px-3`; `py-1`; `mb-8`; `mb-4`; `gap-4`; `w-[18px]`; `h-[18px]`; `w-[10px]`; `h-[10px]`; `w-full` |
| Type | `text-[22px]`; `font-bold`; `text-[15px]`; `font-medium`; `text-[13px]`; `font-semibold`; `text-[16px]` |
| Appearance | `text-gray-900`; `bg-white`; `border`; `rounded-2xl`; `text-gray-800`; `border-gray-200`; `shadow-lg`; `bg-[#A3C33D]`; `text-white`; `rounded-lg`; `bg-[#2A3125]`; `border-[#2A3125]`; `border-gray-300`; `rounded-full`; `bg-[#529CFA]`; `border-[1.5px]`; `border-gray-400`; `outline-none` |
| Interaction / motion | `hover:border-gray-300`; `transition-colors`; `transition-transform`; `duration-200`; `hover:bg-gray-50`; `hover:border-gray-400`; `transition-all`; `focus:border-[#A3C33D]` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2A3125`, `#529CFA`, `#A3C33D`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/components/Icons.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/components/Icons.tsx](src/features/super-admin/sub-features/legal-docs/components/Icons.tsx).

**Purpose:** Supply inline document/status icons and file-row presentation for this workflow family.

**Named declarations:** `PdfIcon`, `WarningIcon`, `CheckIcon`, `ChevronDownIcon`, `FileRow`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 45 | `flex items-center gap-4 bg-[#F0F4F8] rounded-2xl p-4 transition-colors hover:bg-[#e6ebf1]` |
| 47 | `flex-1 flex flex-col` |
| 48 | `text-[14px] font-bold text-gray-900 leading-tight` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `flex-1`; `flex-col` |
| Size & spacing | `gap-4`; `p-4`; `mt-0.5`; `p-2` |
| Type | `text-[14px]`; `font-bold`; `leading-tight`; `text-[12px]`; `font-medium` |
| Appearance | `bg-[#F0F4F8]`; `rounded-2xl`; `text-gray-900`; `text-gray-400`; `rounded-full`; `text-gray-600` |
| Interaction / motion | `transition-colors`; `hover:bg-[#e6ebf1]`; `hover:bg-white` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#6B7280`, `#8CB43A`, `#EF4444`, `#F0F4F8`, `#F59E0B`, `#FEE2E2`, `#e6ebf1`, `#fff`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/components/Layout.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/components/Layout.tsx](src/features/super-admin/sub-features/legal-docs/components/Layout.tsx).

**Purpose:** Supply older standalone legal-docs header, stepper, tabs, comments and footer.

**Named declarations:** `PageHeader`, `StepperSidebar`, `TabsCard`, `CommentsSection`, `FooterActions`.

**Composition:** [src/features/super-admin/sub-features/legal-docs/components/Icons.tsx](src/features/super-admin/sub-features/legal-docs/components/Icons.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 13 | `flex justify-between items-center bg-transparent mb-6 shrink-0 w-full` |
| 17 | `bg-white rounded-full flex items-center px-5 py-3 gap-3 cursor-pointer border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors` |
| 19 | `w-5 h-5 text-[#353535] shrink-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `justify-between`; `items-center`; `shrink-0`; `cursor-pointer`; `hidden`; `sm:block`; `justify-center`; `overflow-hidden`; `object-cover`; `flex-col`; `md:flex`; `lg:overflow-y-auto`; `custom-scrollbar`; `relative`; `absolute`; `z-10`; `flex-wrap`; `justify-end`; `cursor-not-allowed` |
| Size & spacing | `mb-6`; `w-full`; `px-5`; `py-3`; `gap-3`; `w-5`; `h-5`; `w-10`; `h-10`; `md:w-[52px]`; `md:h-[52px]`; `md:w-6`; `md:h-6`; `h-full`; `lg:w-[320px]`; `xl:w-[380px]`; `p-6`; `lg:p-10`; `mt-1`; `mb-10`; `lg:mb-16`; `pl-2`; `gap-12`; `lg:gap-[80px]`; `left-[22px]`; `top-[14px]`; `bottom-[14px]`; `w-[1px]`; `gap-6`; `w-[28px]`; `h-[28px]`; `w-[12px]`; `h-[12px]`; `gap-4`; `gap-2`; `min-h-[160px]`; `gap-5`; `mt-8`; `pt-6`; `px-10`; `py-3.5` |
| Type | `font-medium`; `text-[15px]`; `text-[16px]`; `lg:text-[18px]`; `text-3xl`; `lg:text-[42px]`; `break-all`; `leading-tight`; `font-semibold`; `tracking-wide`; `text-[12px]`; `lg:text-[14px]`; `text-[14px]`; `text-[22px]`; `font-bold`; `leading-relaxed` |
| Appearance | `bg-transparent`; `bg-white`; `rounded-full`; `border`; `border-gray-200`; `shadow-sm`; `text-[#353535]`; `text-[#2C2C2C]`; `rounded-[2rem]`; `text-gray-900`; `bg-gray-300`; `bg-[#E1E8B0]`; `shadow-[0_0_0_2px_white]`; `bg-[#2B3024]`; `bg-[#2A3125]`; `bg-[#F9FAFB]`; `text-white`; `text-gray-700`; `border-[#2A3125]`; `border-[#8CB43A]`; `border-gray-100`; `bg-[#EFF6FF]`; `rounded-2xl`; `border-red-400`; `text-red-500`; `bg-gray-400` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `hover:opacity-80`; `transition-opacity`; `transition-all`; `hover:opacity-90`; `hover:bg-red-50`; `hover:bg-black` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 137 | `disabled={isApproved}` |

**Literal palette:** `#2A3125`, `#2B3024`, `#2C2C2C`, `#353535`, `#8CB43A`, `#E1E8B0`, `#EFF6FF`, `#F9FAFB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/legal-docs/components/Modals.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/legal-docs/components/Modals.tsx](src/features/super-admin/sub-features/legal-docs/components/Modals.tsx).

**Purpose:** Supply StarBadge, rejection reason modal and proceed confirmation for this workflow family.

**Named declarations:** `StarBadge`, `RejectModal`, `ProceedModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 9 | `absolute inset-0` |
| 10 | `absolute inset-0` |
| 11 | `absolute inset-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `absolute`; `z-10`; `fixed`; `z-50`; `items-center`; `justify-center`; `flex-col`; `resize-none`; `justify-end` |
| Size & spacing | `inset-0`; `w-[500px]`; `p-8`; `mb-6`; `w-full`; `h-[150px]`; `p-4`; `gap-4`; `px-6`; `py-2.5`; `py-10`; `px-8`; `mb-8`; `mb-10`; `max-w-[360px]`; `px-[50px]`; `py-[14px]` |
| Type | `text-2xl`; `font-bold`; `text-sm`; `font-semibold`; `text-[24px]`; `text-center`; `font-medium`; `text-[17px]`; `leading-[1.6]` |
| Appearance | `bg-black/60`; `backdrop-blur-sm`; `bg-white`; `rounded-[2rem]`; `shadow-2xl`; `text-gray-900`; `bg-gray-50`; `border`; `border-gray-200`; `rounded-2xl`; `outline-none`; `rounded-full`; `border-gray-300`; `text-gray-700`; `bg-red-500`; `text-white`; `bg-white/40`; `shadow-[0_10px_40px_rgba(0,0,0,0.08)]`; `text-gray-800`; `text-[#1D7ABE]`; `bg-[#2A3125]` |
| Interaction / motion | `focus:border-red-400`; `hover:bg-red-600`; `transition-colors`; `hover:bg-black` |

| Inline style source line | Exact declaration |
| --- | --- |
| 8 | `style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}` |
| 9 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(0deg)' }}` |
| 10 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(30deg)' }}` |
| 11 | `style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(60deg)' }}` |
| 12 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(15deg)' }}` |
| 13 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(45deg)' }}` |
| 14 | `style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(75deg)' }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1D7ABE`, `#2A3125`, `#A3C33D`, `#F3F4F6`, `rgba(0,0,0,0.08)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx).

**Named declarations:** `AssignFieldOfficerModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 171 | `w-4 h-4 text-[#10B981] stroke-[2.2]` |
| 173 | `w-4 h-4 text-[#10B981] stroke-[2.2]` |
| 175 | `w-4 h-4 text-[#10B981] stroke-[2.2]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface AssignFieldOfficerModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onAssignSuccess: (item: ServiceRequestPipelineItem, officerName: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `flex-col`; `overflow-y-auto`; `items-start`; `justify-between`; `block`; `cursor-pointer`; `shrink-0`; `grid-cols-1`; `lg:grid-cols-12`; `lg:col-span-6`; `inline-flex`; `overflow-hidden`; `object-cover`; `hidden`; `sm:inline-block`; `justify-end`; `z-60`; `absolute`; `grid` |
| Size & spacing | `w-4`; `h-4`; `inset-0`; `p-4`; `max-w-4xl`; `w-full`; `p-6`; `sm:p-8`; `max-h-[92vh]`; `pb-5`; `mb-1`; `m-0`; `mt-1`; `w-8`; `h-8`; `w-5`; `h-5`; `gap-8`; `pt-6`; `gap-4.5`; `pb-6`; `lg:pb-0`; `lg:pr-8`; `px-3`; `py-1`; `gap-3.5`; `gap-4`; `max-w-[260px]`; `gap-2`; `pl-1`; `gap-2.5`; `gap-1.5`; `p-3.5`; `mt-0.5`; `mb-5`; `py-10`; `w-7`; `h-7`; `mb-2`; `gap-3`; `max-h-[260px]`; `pr-1`; `p-0.5`; `w-2.5`; `h-2.5`; `w-10`; `h-10`; `h-full`; `px-3.5`; `py-2.5`; `mb-4`; `w-9`; `h-9`; `gap-1`; `py-1.5`; `w-3.5`; `h-3.5`; `max-w-[190px]`; `px-4`; `py-2`; `pt-8`; `mt-auto`; `px-6`; `max-w-[380px]`; `sm:p-7`; `top-4`; `right-4`; `w-14`; `h-14`; `mb-3.5`; `px-2` |
| Type | `text-[11px]`; `font-bold`; `uppercase`; `tracking-wider`; `font-[`; `font-extrabold`; `text-[20px]`; `sm:text-[22px]`; `leading-tight`; `text-xs`; `sm:text-sm`; `font-normal`; `text-right`; `font-medium`; `leading-relaxed`; `tracking-wide`; `font-semibold`; `text-sm`; `text-center`; `text-[18px]`; `leading-snug`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#10B981]`; `stroke-[2.2]`; `bg-black/45`; `backdrop-blur-xs`; `bg-white`; `rounded-[24px]`; `sm:rounded-[28px]`; `shadow-2xl`; `border`; `border-gray-100`; `border-b`; `text-gray-500`; `text-[#1A1C1D]`; `rounded-full`; `text-gray-400`; `border-none`; `bg-transparent`; `stroke-[2]`; `lg:border-b-0`; `lg:border-r`; `bg-[#E8F8F3]`; `border-gray-50`; `text-gray-700`; `rounded-md`; `bg-[#FEF7EC]`; `text-[#D97706]`; `border-[#FDE68A]`; `text-gray-800`; `bg-[#F9FAFB]`; `rounded-xl`; `text-[#1877F2]`; `border-[#1877F2]`; `bg-[#F8FAFC]`; `border-gray-200`; `border-2`; `bg-[#1877F2]`; `bg-[#EBF5FA]`; `text-[#DC2626]`; `bg-[#FEF2F2]`; `border-[#FEE2E2]`; `border-[#10B981]/30`; `bg-[#F0FDF4]`; `rounded-2xl`; `shadow-2xs`; `bg-[#DCFCE7]`; `stroke-[3]`; `bg-gray-50`; `bg-[#F1F5F9]`; `text-[#334155]`; `text-white`; `stroke-[2.5]`; `bg-[#10B981]`; `shadow-xs`; `text-[#111827]`; `border-[#10B981]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `transition-colors`; `animate-spin`; `hover:border-gray-300`; `hover:bg-gray-200`; `hover:bg-gray-50`; `hover:bg-[#166FE5]`; `disabled:opacity-75`; `disabled:cursor-not-allowed`; `hover:shadow-xs`; `active:scale-98`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 525 | `disabled={isAssigning}` |

**Literal palette:** `#10B981`, `#111827`, `#166FE5`, `#1877F2`, `#1A1C1D`, `#334155`, `#D97706`, `#DC2626`, `#DCFCE7`, `#E8F8F3`, `#EBF5FA`, `#F0FDF4`, `#F1F5F9`, `#F8FAFC`, `#F9FAFB`, `#FDE68A`, `#FEE2E2`, `#FEF2F2`, `#FEF7EC`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx).

**Named declarations:** `AssignmentSuccessModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 76 | `fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200` |
| 77 | `bg-white rounded-[24px] sm:rounded-[28px] max-w-[440px] w-full p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-gray-100` |
| 82 | `absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer transition-colors` |

<details><summary>Props / reusable interface</summary>

```tsx
interface AssignmentSuccessModalProps {
  isOpen: boolean;
  officerName?: string;
  address?: string;
  preferredVisitDate?: string;
  servicesList?: ServiceRequestItemDetail[];
  onClose?: () => void;
  onReturn: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `flex-col`; `absolute`; `cursor-pointer`; `shrink-0`; `inline-flex` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[440px]`; `w-full`; `p-6`; `sm:p-8`; `top-5`; `right-5`; `w-8`; `h-8`; `w-5`; `h-5`; `w-12`; `h-12`; `mb-4.5`; `mt-1`; `w-6`; `h-6`; `m-0`; `mb-1.5`; `mb-5`; `gap-2.5`; `mb-4`; `w-4`; `h-4`; `p-5`; `gap-2`; `w-10`; `h-10`; `mt-0.5`; `gap-1`; `px-2.5`; `py-0.5`; `w-3`; `h-3` |
| Type | `text-center`; `font-[`; `font-bold`; `text-[18px]`; `sm:text-[20px]`; `leading-snug`; `text-[13px]`; `leading-relaxed`; `font-normal`; `text-left`; `font-semibold`; `truncate`; `text-[14px]`; `text-[14.5px]`; `text-[11px]`; `text-[12.5px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-xs`; `bg-white`; `rounded-[24px]`; `sm:rounded-[28px]`; `shadow-2xl`; `border`; `border-gray-100`; `rounded-full`; `text-gray-400`; `border-none`; `bg-transparent`; `stroke-[2]`; `rounded-2xl`; `bg-[#E8F8F0]`; `text-[#10B981]`; `stroke-[2.5]`; `text-[#111827]`; `text-[#64748B]`; `bg-[#F8FAFC]`; `border-[#F1F5F9]`; `text-[#1E293B]`; `text-[#1E75BB]`; `text-[#94A3B8]`; `bg-[#F2FBF6]`; `border-[#E0F2E9]`; `bg-[#D96B27]`; `text-white`; `shadow-2xs`; `bg-[#DCFCE7]`; `text-[#15803D]`; `stroke-[3]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `transition-colors` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#15803D`, `#1E293B`, `#1E75BB`, `#64748B`, `#94A3B8`, `#D96B27`, `#DCFCE7`, `#E0F2E9`, `#E8F8F0`, `#F1F5F9`, `#F2FBF6`, `#F8FAFC`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx](src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx).

**Named declarations:** `EstimationSuccessModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 20 | `fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 21 | `fixed inset-0` |
| 22 | `relative bg-white rounded-[28px] max-w-[390px] w-full p-6 sm:p-7 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface EstimationSuccessModalProps {
  isOpen: boolean;
  itemCode?: string;
  onReturn: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-60`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `cursor-pointer` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[390px]`; `w-full`; `p-6`; `sm:p-7`; `w-14`; `h-14`; `mb-4`; `w-7`; `h-7`; `m-0`; `mb-2`; `mb-6`; `px-2`; `py-2.5` |
| Type | `font-[`; `text-center`; `text-[18px]`; `sm:text-[20px]`; `font-bold`; `tracking-tight`; `text-xs`; `leading-relaxed`; `font-normal`; `font-semibold`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/45`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `rounded-full`; `bg-[#1877F2]`; `text-white`; `shadow-sm`; `stroke-[3]`; `text-[#111827]`; `text-[#64748B]`; `text-[#10B981]`; `border-none`; `shadow-2xs` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-[#166FE5]`; `hover:shadow-xs`; `transition-all`; `active:scale-98` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#166FE5`, `#1877F2`, `#64748B`, `#ECEFF2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx).

**Named declarations:** `GeneratedEstimationModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 48 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 49 | `fixed inset-0` |
| 50 | `relative bg-white rounded-[28px] max-w-[620px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface GeneratedEstimationModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onApprove: (
    item: ServiceRequestPipelineItem,
    estimationData: { landSize: string; estimatedCost: string; description: string }
  ) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `flex-wrap`; `grid-cols-3`; `divide-x`; `divide-[#E5E7EB]`; `block`; `shrink-0`; `grid-cols-1`; `sm:grid-cols-2`; `placeholder:text-gray-400`; `resize-none`; `justify-between`; `cursor-pointer`; `grid` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[620px]`; `w-full`; `p-6`; `sm:p-8`; `gap-5`; `gap-3`; `m-0`; `gap-2`; `sm:p-4.5`; `pr-3`; `mb-1`; `px-3`; `sm:px-4`; `pl-3`; `sm:pl-4`; `gap-1`; `w-3.5`; `h-3.5`; `gap-4.5`; `gap-4`; `mb-2`; `h-[46px]`; `px-4`; `min-h-[110px]`; `pt-2`; `p-0`; `px-6`; `py-2.5` |
| Type | `font-[`; `text-[20px]`; `sm:text-[22px]`; `font-bold`; `tracking-tight`; `text-[10px]`; `uppercase`; `tracking-wider`; `text-[14px]`; `truncate`; `text-[12.5px]`; `font-medium`; `text-xs`; `leading-relaxed`; `font-semibold`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/45`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `text-[#111827]`; `bg-[#1877F2]`; `text-white`; `shadow-2xs`; `bg-[#F1F5F9]`; `text-gray-700`; `bg-[#F8F9FB]`; `rounded-[18px]`; `text-[#7A8699]`; `text-[#10B981]`; `text-[#4B5563]`; `bg-[#F8FAFC]`; `rounded-xl`; `border-[#E2E8F0]`; `outline-hidden`; `rounded-2xl`; `border-none`; `bg-transparent`; `rounded-full` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-200`; `focus:border-[#1877F2]`; `focus:bg-white`; `transition-all`; `hover:text-[#111827]`; `transition-colors`; `hover:bg-[#166FE5]`; `hover:shadow-xs`; `active:scale-98` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#166FE5`, `#1877F2`, `#4B5563`, `#7A8699`, `#E2E8F0`, `#E5E7EB`, `#ECEFF2`, `#F1F5F9`, `#F8F9FB`, `#F8FAFC`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/MaintenanceLogoutModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceLogoutModal.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceLogoutModal.tsx).

**Named declarations:** `MaintenanceLogoutModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 18 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 19 | `fixed inset-0` |
| 20 | `relative bg-white rounded-[28px] max-w-[380px] w-full p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `cursor-pointer` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[380px]`; `w-full`; `p-8`; `w-14`; `h-14`; `mb-4`; `w-6`; `h-6`; `m-0`; `mb-2`; `mb-6`; `max-w-[260px]`; `gap-4`; `px-6`; `py-2.5`; `px-8` |
| Type | `font-[`; `text-center`; `text-[19px]`; `sm:text-[20px]`; `font-bold`; `tracking-tight`; `text-xs`; `sm:text-[13px]`; `leading-relaxed`; `font-normal`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/35`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `rounded-full`; `bg-[#FEE2E2]`; `text-[#EF4444]`; `shadow-2xs`; `stroke-[2.2]`; `text-[#111827]`; `text-[#64748B]`; `border-none`; `bg-transparent`; `border-[#1E75BB]`; `text-[#1E75BB]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `translate-x-0.5`; `hover:text-[#111827]`; `hover:bg-gray-100`; `transition-colors`; `hover:bg-[#1E75BB]`; `hover:text-white`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#111827`, `#1E75BB`, `#64748B`, `#ECEFF2`, `#EF4444`, `#FEE2E2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx).

**Named declarations:** `MaintenanceNavbar`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 47 | `w-full bg-white border-b border-[#EAEAEA] sticky top-0 z-40 px-6 sm:px-8 lg:px-10 xl:px-12 py-3.5 flex items-center justify-between shadow-xs` |
| 49 | `flex items-center gap-3` |
| 50 | `flex items-center gap-3 no-underline group` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceNavbarProps {
  activeTab?: "dashboard" | "service-requests" | "work-orders";
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `sticky`; `z-40`; `flex`; `items-center`; `justify-between`; `no-underline`; `group`; `object-contain`; `hidden`; `sm:flex`; `flex-col`; `relative`; `justify-center`; `cursor-pointer`; `absolute`; `z-50`; `overflow-hidden`; `object-cover`; `inline-block` |
| Size & spacing | `w-full`; `top-0`; `px-6`; `sm:px-8`; `lg:px-10`; `xl:px-12`; `py-3.5`; `gap-3`; `h-10`; `w-auto`; `gap-1`; `sm:gap-3`; `px-5`; `py-2`; `w-10`; `w-[18px]`; `h-[18px]`; `top-2`; `right-2`; `w-2`; `h-2`; `right-0`; `mt-2`; `w-72`; `p-3`; `px-2`; `py-1.5`; `pb-2`; `py-0.5`; `gap-2`; `p-2`; `p-1`; `h-full`; `w-56`; `px-3`; `mt-1`; `py-1`; `w-3.5`; `h-3.5` |
| Type | `font-[`; `font-bold`; `text-[14px]`; `leading-tight`; `tracking-tight`; `text-[10px]`; `font-medium`; `tracking-wider`; `uppercase`; `text-[13px]`; `font-semibold`; `text-xs`; `text-[11px]`; `text-left`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `border-b`; `border-[#EAEAEA]`; `shadow-xs`; `text-[#1A1C1D]`; `text-[#7A8699]`; `rounded-full`; `bg-[#1E75BB]`; `text-white`; `text-[#4B5563]`; `border`; `border-[#E5E7EB]`; `bg-[#EF4444]`; `ring-2`; `ring-white`; `rounded-2xl`; `shadow-xl`; `border-gray-100`; `text-gray-900`; `text-blue-600`; `bg-blue-50`; `rounded-lg`; `text-gray-700`; `text-gray-500`; `text-gray-400`; `border-2`; `border-orange-300`; `ring-orange-100`; `text-blue-700`; `rounded-md`; `text-red-600`; `border-none`; `bg-transparent` |
| Interaction / motion | `transition-transform`; `group-hover:scale-105`; `transition-all`; `duration-200`; `hover:text-[#1A1C1D]`; `hover:bg-gray-100/50`; `hover:bg-gray-50`; `transition-colors`; `animate-in`; `fade-in`; `zoom-in-95`; `duration-150`; `hover:bg-gray-100`; `hover:bg-red-50` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1A1C1D`, `#1E75BB`, `#4B5563`, `#7A8699`, `#E5E7EB`, `#EAEAEA`, `#EF4444`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx](src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx).

**Named declarations:** `MaintenanceUpdatePasswordModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 66 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 67 | `fixed inset-0` |
| 68 | `relative bg-white rounded-[28px] max-w-[420px] w-full p-7 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface MaintenanceUpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `absolute`; `cursor-pointer`; `object-contain`; `-translate-y-1/2`; `placeholder:text-gray-400`; `shrink-0` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[420px]`; `w-full`; `p-7`; `sm:p-8`; `top-5`; `right-5`; `p-1`; `w-4`; `h-4`; `mb-5`; `h-11`; `w-auto`; `mb-1`; `m-0`; `mb-1.5`; `gap-4`; `gap-1.5`; `left-3.5`; `top-1/2`; `pl-10`; `pr-10`; `py-2.5`; `right-3`; `p-0`; `h-[46px]`; `mt-2`; `gap-2`; `mt-5` |
| Type | `font-[`; `text-[9.5px]`; `font-bold`; `tracking-wider`; `uppercase`; `text-[7.5px]`; `tracking-widest`; `text-left`; `text-[18px]`; `sm:text-[20px]`; `tracking-tight`; `text-xs`; `leading-relaxed`; `font-normal`; `font-semibold`; `text-[11px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `text-gray-400`; `bg-transparent`; `border-none`; `rounded-full`; `text-[#1E75BB]`; `text-[#7A8699]`; `text-[#111827]`; `text-[#64748B]`; `text-[#1F2937]`; `bg-[#F8F9FB]`; `border-[#E2E8F0]`; `rounded-xl`; `text-gray-900`; `outline-hidden`; `text-red-500`; `bg-[#1E75BB]`; `text-white`; `shadow-xs`; `text-[#10B981]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:text-gray-700`; `hover:bg-gray-100`; `transition-colors`; `focus:border-[#1E75BB]`; `focus:bg-white`; `transition-all`; `hover:text-gray-600`; `hover:bg-[#1864A0]`; `hover:shadow-md`; `disabled:opacity-50`; `disabled:cursor-not-allowed`; `animate-spin` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 158 | `disabled={isLoading}` |
| 161 | `{isLoading ? (` |

**Literal palette:** `#10B981`, `#111827`, `#1864A0`, `#1E75BB`, `#1F2937`, `#64748B`, `#7A8699`, `#E2E8F0`, `#ECEFF2`, `#F8F9FB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx).

**Named declarations:** `OperationsOverviewCard`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 35 | `bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]` |
| 37 | `flex items-center justify-between mb-4` |
| 38 | `font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface OperationsOverviewCardProps {
  initialYear?: number;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `justify-between`; `items-center`; `relative`; `cursor-pointer`; `absolute`; `z-30`; `inline-flex`; `items-end` |
| Size & spacing | `p-6`; `h-full`; `min-h-[380px]`; `mb-4`; `m-0`; `gap-2`; `gap-1.5`; `px-3`; `py-1`; `w-3`; `h-3`; `right-0`; `mt-1`; `w-32`; `w-3.5`; `h-3.5`; `w-28`; `px-1`; `mb-2`; `w-4`; `h-4`; `w-full`; `h-[180px]`; `mt-auto`; `py-1.5` |
| Type | `font-[`; `font-extrabold`; `text-[15px]`; `tracking-[0.05em]`; `uppercase`; `text-[12px]`; `font-semibold`; `font-bold`; `text-[26px]`; `sm:text-[30px]`; `leading-none`; `text-[10px]`; `tracking-wider`; `text-[11px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[24px]`; `border`; `border-[#ECEFF2]`; `shadow-xs`; `text-[#1E252B]`; `border-[#E2E8F0]`; `rounded-full`; `text-[#4A5568]`; `text-gray-400`; `rounded-xl`; `shadow-lg`; `border-gray-100`; `text-[#1E75BB]`; `bg-blue-50/50`; `text-gray-700`; `text-gray-500`; `stroke-[3]`; `text-[#7A8699]`; `text-[#8CC63F]`; `bg-white/95`; `backdrop-blur-xs`; `text-gray-300` |
| Interaction / motion | `hover:bg-[#F4F6F8]`; `transition-colors`; `animate-in`; `fade-in`; `zoom-in-95` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1E252B`, `#1E75BB`, `#4A5568`, `#7A8699`, `#8CC63F`, `#94A3B8`, `#E2E8F0`, `#ECEFF2`, `#F1F3F5`, `#F4F6F8`, `#fff`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/PipelineDetailModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/PipelineDetailModal.tsx](src/features/super-admin/sub-features/maintenance/components/PipelineDetailModal.tsx).

**Named declarations:** `PipelineDetailModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 48 | `fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200` |
| 49 | `bg-white rounded-[24px] max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden` |
| 51 | `flex items-center justify-between pb-4 border-b border-gray-100` |

<details><summary>Props / reusable interface</summary>

```tsx
interface PipelineDetailModalProps {
  stage: PipelineStage | null;
  onClose: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `overflow-hidden`; `justify-between`; `cursor-pointer`; `overflow-y-auto`; `items-end` |
| Size & spacing | `inset-0`; `p-4`; `max-w-2xl`; `w-full`; `p-6`; `max-h-[85vh]`; `pb-4`; `gap-3`; `w-10`; `h-10`; `m-0`; `w-8`; `h-8`; `w-5`; `h-5`; `py-4`; `gap-1`; `gap-2`; `px-2`; `py-0.5`; `mt-0.5`; `w-3`; `h-3`; `pt-4`; `px-5`; `py-2` |
| Type | `font-bold`; `text-lg`; `font-[`; `text-xs`; `font-medium`; `font-semibold`; `text-[11px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-xs`; `bg-white`; `rounded-[24px]`; `shadow-2xl`; `border`; `border-gray-100`; `border-b`; `rounded-xl`; `text-gray-900`; `text-gray-500`; `rounded-full`; `border-none`; `bg-transparent`; `text-gray-400`; `bg-gray-50/60`; `text-blue-600`; `bg-blue-50`; `rounded-md`; `text-gray-800`; `text-gray-600`; `bg-red-100`; `text-red-700`; `bg-amber-100`; `text-amber-800`; `bg-blue-100`; `text-blue-800`; `text-emerald-600`; `border-t`; `bg-[#1E75BB]`; `text-white` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `hover:bg-gray-100`; `hover:text-gray-700`; `hover:bg-gray-50`; `transition-colors`; `hover:bg-[#1864A0]` |

| Inline style source line | Exact declaration |
| --- | --- |
| 55 | `style={{ backgroundColor: stage.iconBgColor, color: stage.iconColor }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1864A0`, `#1E75BB`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx](src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx).

**Named declarations:** `PipelineStepper`.

**Composition:** [src/features/super-admin/sub-features/maintenance/components/PipelineDetailModal.tsx](src/features/super-admin/sub-features/maintenance/components/PipelineDetailModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 32 | `w-full mt-8` |
| 34 | `mb-4` |
| 35 | `font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] sm:text-[22px] leading-tight text-[#1A1C1D] m-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface PipelineStepperProps {
  stages: PipelineStage[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `overflow-x-auto`; `flex`; `items-center`; `justify-between`; `flex-1`; `cursor-pointer`; `relative`; `group`; `flex-col`; `justify-center`; `shrink-0` |
| Size & spacing | `w-5`; `h-5`; `w-full`; `mt-8`; `mb-4`; `m-0`; `mt-1`; `p-4`; `sm:p-5`; `min-w-[860px]`; `gap-2`; `min-w-[160px]`; `h-[100px]`; `w-9`; `h-9`; `w-6`; `h-6`; `mt-2`; `mt-0.5`; `px-1` |
| Type | `font-[`; `font-extrabold`; `text-[20px]`; `sm:text-[22px]`; `leading-tight`; `text-[13px]`; `sm:text-[14px]`; `font-normal`; `font-bold`; `text-[11px]`; `font-medium`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#1A1C1D]`; `text-[#7A8699]`; `bg-white`; `rounded-[24px]`; `border`; `border-[#ECEFF2]`; `shadow-xs`; `rounded-[18px]`; `border-[#E9ECEF]`; `rounded-xl`; `rounded-full`; `bg-[#1E75BB]`; `text-white`; `text-[#D1D5DB]`; `stroke-[2.5]` |
| Interaction / motion | `hover:border-[#1E75BB]/40`; `transition-all`; `duration-200`; `hover:shadow-md`; `transition-transform`; `group-hover:scale-105`; `group-hover:text-[#1E75BB]`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 61 | `style={{ backgroundColor: stage.iconBgColor }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1A1C1D`, `#1E75BB`, `#7A8699`, `#D1D5DB`, `#E9ECEF`, `#ECEFF2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx](src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx).

**Named declarations:** `ProjectDistributionCard`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 23 | `bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]` |
| 25 | `mb-2` |
| 26 | `font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface ProjectDistributionCardProps {
  totalProjects: number;
  categories: ProjectDistributionCategory[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `justify-between`; `relative`; `items-center`; `justify-center`; `cursor-pointer`; `absolute`; `pointer-events-none`; `shrink-0` |
| Size & spacing | `p-6`; `h-full`; `min-h-[380px]`; `mb-2`; `m-0`; `w-full`; `h-[190px]`; `my-auto`; `px-3`; `py-1.5`; `inset-0`; `gap-2.5`; `pt-2`; `w-2.5`; `h-2.5` |
| Type | `font-[`; `font-extrabold`; `text-[15px]`; `tracking-[0.05em]`; `uppercase`; `text-xs`; `font-medium`; `font-bold`; `text-[28px]`; `leading-tight`; `text-[12px]`; `text-[13px]`; `text-[14px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[24px]`; `border`; `border-[#ECEFF2]`; `shadow-xs`; `text-[#1E252B]`; `bg-gray-900`; `text-white`; `rounded-lg`; `shadow-lg`; `text-blue-300`; `text-[#1A1C1D]`; `text-[#7A8699]`; `border-t`; `border-[#F1F3F5]`; `bg-gray-50`; `rounded-full`; `text-[#374151]` |
| Interaction / motion | `transition-all`; `duration-300`; `hover:bg-gray-50/50` |

| Inline style source line | Exact declaration |
| --- | --- |
| 66 | `style={{ filter: activeIndex === index ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.15))" : "none", transform: activeIndex === index ? "scale(1.04)" : "scale(1)", transformOrigin: "center center", }}` |
| 103 | `style={{ backgroundColor: category.color }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1A1C1D`, `#1E252B`, `#374151`, `#7A8699`, `#ECEFF2`, `#F1F3F5`, `rgba(0,0,0,0.15)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/ProjectsTimelineCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/ProjectsTimelineCard.tsx](src/features/super-admin/sub-features/maintenance/components/ProjectsTimelineCard.tsx).

**Named declarations:** `ProjectsTimelineCard`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 14 | `bg-white rounded-[24px] border border-[#ECEFF2] p-6 shadow-xs flex flex-col justify-between h-full min-h-[380px]` |
| 16 | `mb-5` |
| 17 | `font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] tracking-[0.05em] text-[#1E252B] uppercase m-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface ProjectsTimelineCardProps {
  items: ProjectTimelineItem[];
  onProjectClick?: (item: ProjectTimelineItem) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `justify-between`; `flex-1`; `justify-around`; `group`; `cursor-pointer`; `items-center`; `shrink-0`; `overflow-hidden`; `object-cover` |
| Size & spacing | `p-6`; `h-full`; `min-h-[380px]`; `mb-5`; `m-0`; `gap-4`; `gap-1.5`; `w-full`; `max-w-[340px]`; `sm:max-w-[380px]`; `lg:max-w-[420px]`; `h-[44px]`; `px-2`; `py-1`; `gap-2.5`; `-space-x-2`; `pl-1`; `w-7`; `h-7` |
| Type | `font-[`; `font-extrabold`; `text-[15px]`; `tracking-[0.05em]`; `uppercase`; `text-[12px]`; `font-medium`; `font-bold`; `text-[13px]`; `tracking-tight`; `whitespace-nowrap`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[24px]`; `border`; `border-[#ECEFF2]`; `shadow-xs`; `text-[#1E252B]`; `bg-[#1E75BB]`; `text-white`; `bg-[#8CC63F]`; `text-[#7A8699]`; `rounded-full`; `border-2`; `border-white`; `bg-gray-200` |
| Interaction / motion | `transition-transform`; `hover:translate-x-1`; `transition-all`; `group-hover:shadow-md` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1E252B`, `#1E75BB`, `#7A8699`, `#8CC63F`, `#ECEFF2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx).

**Named declarations:** `QuotationStatusDetailsModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 36 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 37 | `fixed inset-0` |
| 38 | `relative bg-white rounded-[28px] max-w-[620px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface QuotationStatusDetailsModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
  onMoveToWorkOrder?: (item: ServiceRequestPipelineItem) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `items-start`; `justify-between`; `cursor-pointer`; `flex-wrap`; `grid-cols-1`; `sm:grid-cols-2`; `block`; `inline-flex`; `grid-cols-2`; `shrink-0`; `justify-end`; `grid` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[620px]`; `w-full`; `p-6`; `sm:p-8`; `gap-5`; `gap-1`; `m-0`; `gap-2`; `mt-0.5`; `w-3.5`; `h-3.5`; `w-8`; `h-8`; `w-5`; `h-5`; `-mt-2`; `p-5`; `mb-2.5`; `gap-1.5`; `mb-1`; `mb-1.5`; `gap-3`; `px-3`; `py-1`; `w-1.5`; `h-1.5`; `gap-y-4`; `gap-x-6`; `py-0.5`; `gap-2.5`; `w-4`; `h-4`; `px-4`; `py-2.5`; `w-3`; `h-3`; `pt-2`; `p-0`; `px-7` |
| Type | `font-[`; `text-[20px]`; `sm:text-[22px]`; `font-bold`; `tracking-tight`; `text-xs`; `font-medium`; `text-[10px]`; `uppercase`; `tracking-wider`; `font-semibold`; `text-[17px]`; `text-[11px]`; `font-normal`; `text-[13.5px]`; `text-[14px]`; `text-[13px]`; `text-[12px]`; `leading-relaxed`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/45`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `text-[#111827]`; `text-[#64748B]`; `rounded-full`; `text-gray-400`; `border-none`; `bg-transparent`; `bg-[#1877F2]`; `text-white`; `shadow-2xs`; `bg-[#F1F5F9]`; `text-gray-700`; `bg-[#F8F9FB]`; `rounded-[18px]`; `text-[#7A8699]`; `text-[#15803D]`; `text-[#10B981]`; `bg-[#FEF08A]`; `text-[#854D0E]`; `bg-[#854D0E]`; `bg-[#FEE2E2]`; `text-[#DC2626]`; `bg-[#DC2626]`; `bg-[#DCFCE7]`; `bg-[#15803D]`; `bg-[#F0FDF4]`; `border-[#BBF7D0]`; `rounded-2xl`; `stroke-[3]`; `text-[#166534]`; `bg-[#FEF2F2]`; `border-[#FECACA]/60`; `rounded-xl`; `text-[#1F2937]`; `border-red-100/80`; `rounded-lg`; `text-[#4B5563]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `transition-colors`; `hover:bg-gray-200`; `hover:text-[#111827]`; `hover:bg-[#166FE5]`; `hover:shadow-xs`; `transition-all`; `active:scale-98` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#15803D`, `#166534`, `#166FE5`, `#1877F2`, `#1F2937`, `#4B5563`, `#64748B`, `#7A8699`, `#854D0E`, `#BBF7D0`, `#DC2626`, `#DCFCE7`, `#ECEFF2`, `#F0FDF4`, `#F1F5F9`, `#F8F9FB`, `#FECACA`, `#FEE2E2`, `#FEF08A`, `#FEF2F2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx).

**Named declarations:** `ServiceRequestCard`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 18 | `w-8 h-8 rounded-full bg-[#EBF7EE] text-[#48A760] flex items-center justify-center shrink-0` |
| 19 | `w-4 h-4 fill-[#48A760]/20 stroke-[2.2]` |
| 24 | `w-8 h-8 rounded-full bg-[#EBF5FA] text-[#1E75BB] flex items-center justify-center shrink-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface ServiceRequestCardProps {
  item: ServiceRequestPipelineItem;
  onVerify: (item: ServiceRequestPipelineItem, actionType?: "approve" | "view-details" | "verify-now") => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `shrink-0`; `inline-flex`; `flex-col`; `justify-between`; `group`; `cursor-pointer` |
| Size & spacing | `w-8`; `h-8`; `w-4`; `h-4`; `gap-1.5`; `px-2.5`; `py-0.5`; `w-fit`; `w-2`; `h-2`; `p-5`; `h-[255px]`; `gap-0.5`; `my-auto`; `m-0`; `mx-0.5`; `p-2.5`; `mt-2`; `mb-1`; `mt-1`; `w-full`; `h-[38px]` |
| Type | `font-bold`; `text-[11px]`; `font-[`; `tracking-wide`; `text-[15px]`; `leading-tight`; `text-[12px]`; `font-medium`; `font-semibold`; `text-[9.5px]`; `uppercase`; `tracking-wider`; `font-normal`; `line-clamp-2`; `leading-relaxed`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `rounded-full`; `bg-[#EBF7EE]`; `text-[#48A760]`; `fill-[#48A760]/20`; `stroke-[2.2]`; `bg-[#EBF5FA]`; `text-[#1E75BB]`; `bg-[#F3F0FA]`; `text-[#7C5CBF]`; `bg-[#E8F8F3]`; `text-[#10B981]`; `bg-[#E8F8F0]`; `bg-[#10B981]`; `bg-[#FEE2E2]`; `text-[#EF4444]`; `bg-[#EF4444]`; `bg-[#FEF9C3]`; `text-[#CA8A04]`; `bg-[#EAB308]`; `bg-white`; `rounded-[22px]`; `border`; `border-[#EAEFF4]`; `shadow-xs`; `text-[#4A5568]`; `bg-[#F1F3F5]`; `text-[#1A1C1D]`; `text-[#64748B]`; `text-gray-300`; `bg-[#F8F9FB]`; `rounded-xl`; `border-[#ECEFF2]`; `text-[#7A8699]`; `bg-[#FEF08A]`; `text-[#111827]`; `bg-[#16A34A]`; `bg-[#DCFCE7]`; `text-[#15803D]`; `bg-[#1E75BB]`; `text-white`; `border-none`; `shadow-2xs` |
| Interaction / motion | `hover:shadow-md`; `transition-all`; `duration-200`; `group-hover:text-[#1E75BB]`; `transition-colors`; `hover:bg-[#1864A0]`; `hover:shadow-sm` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#10B981`, `#111827`, `#15803D`, `#16A34A`, `#1864A0`, `#1A1C1D`, `#1E75BB`, `#48A760`, `#4A5568`, `#64748B`, `#7A8699`, `#7C5CBF`, `#CA8A04`, `#DCFCE7`, `#E8F8F0`, `#E8F8F3`, `#EAB308`, `#EAEFF4`, `#EBF5FA`, `#EBF7EE`, `#ECEFF2`, `#EF4444`, `#F1F3F5`, `#F3F0FA`, `#F8F9FB`, `#FEE2E2`, `#FEF08A`, `#FEF9C3`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx](src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx).

**Named declarations:** `ServiceRequestFilterModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 164 | `fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150` |
| 165 | `bg-white rounded-[24px] max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150` |
| 167 | `flex items-center justify-between px-6 py-4 border-b border-gray-100` |

<details><summary>Props / reusable interface</summary>

```tsx
interface ServiceRequestFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: string[];
  selectedDateRange: { start: string; end: string } | null;
  onApply: (services: string[], dateRange: { start: string; end: string } | null) => void;
  onClear: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `overflow-hidden`; `justify-between`; `cursor-pointer`; `sm:flex-row`; `block`; `flex-1`; `grid-cols-7`; `grid` |
| Size & spacing | `inset-0`; `p-4`; `max-w-2xl`; `w-full`; `px-6`; `py-4`; `m-0`; `w-8`; `h-8`; `w-5`; `h-5`; `min-h-[360px]`; `sm:w-48`; `gap-2`; `gap-2.5`; `px-4`; `py-2.5`; `w-4`; `h-4`; `mt-4`; `pt-4`; `gap-1.5`; `px-2`; `mb-1`; `mt-3`; `mt-0.5`; `p-6`; `gap-3`; `p-3.5`; `w-3.5`; `h-3.5`; `mb-4`; `gap-1`; `w-7`; `h-7`; `mb-2`; `p-0`; `py-2` |
| Type | `font-[`; `font-extrabold`; `text-[18px]`; `text-[10px]`; `uppercase`; `tracking-wider`; `font-bold`; `text-xs`; `font-semibold`; `text-sm`; `text-base`; `text-center`; `text-[11px]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-xs`; `bg-white`; `rounded-[24px]`; `shadow-2xl`; `border`; `border-gray-100`; `border-b`; `text-[#1E75BB]`; `rounded-full`; `border-none`; `bg-transparent`; `text-gray-400`; `bg-[#F8FAFC]`; `border-r`; `rounded-xl`; `bg-[#1E75BB]`; `text-white`; `shadow-sm`; `text-gray-600`; `border-t`; `border-gray-200/60`; `bg-blue-50`; `rounded-2xl`; `text-gray-800`; `border-[#1E75BB]`; `border-gray-300`; `stroke-[3]`; `border-[#1E75BB]/30`; `bg-blue-50/40`; `text-gray-900`; `border-gray-200`; `text-gray-300`; `bg-blue-100/70`; `rounded-md`; `text-gray-700`; `bg-[#FAFBFD]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-150`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `hover:bg-gray-200/60`; `hover:bg-gray-50`; `transition-colors`; `hover:underline`; `hover:bg-[#1864A0]`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1864A0`, `#1E75BB`, `#F8FAFC`, `#FAFBFD`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/UnderVerificationDetailsModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/UnderVerificationDetailsModal.tsx](src/features/super-admin/sub-features/maintenance/components/UnderVerificationDetailsModal.tsx).

**Named declarations:** `UnderVerificationDetailsModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 28 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 29 | `fixed inset-0` |
| 30 | `relative bg-white rounded-[28px] max-w-[580px] w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col gap-5 animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UnderVerificationDetailsModalProps {
  isOpen: boolean;
  item: ServiceRequestPipelineItem | null;
  onClose: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `justify-between`; `cursor-pointer`; `grid-cols-3`; `divide-x`; `divide-[#E5E7EB]`; `block`; `shrink-0`; `grid-cols-2`; `justify-end`; `grid` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[580px]`; `w-full`; `p-6`; `sm:p-8`; `gap-5`; `m-0`; `w-8`; `h-8`; `w-5`; `h-5`; `sm:p-4.5`; `pr-3`; `mb-1`; `px-3`; `sm:px-4`; `pl-3`; `sm:pl-4`; `gap-1`; `w-3.5`; `h-3.5`; `gap-3`; `py-1`; `gap-y-3.5`; `gap-x-6`; `mb-0.5`; `p-3.5`; `gap-2.5`; `w-4`; `h-4`; `pt-1`; `px-8`; `py-2.5` |
| Type | `font-[`; `text-[20px]`; `sm:text-[22px]`; `font-bold`; `tracking-tight`; `text-[10px]`; `uppercase`; `tracking-wider`; `text-[14px]`; `truncate`; `text-[13.5px]`; `text-[11px]`; `font-medium`; `text-xs`; `font-semibold`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/45`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `text-[#111827]`; `rounded-full`; `text-gray-400`; `border-none`; `bg-transparent`; `bg-[#F8F9FB]`; `rounded-[18px]`; `text-[#7A8699]`; `text-[#10B981]`; `bg-[#FEF2F2]`; `border-[#FEE2E2]`; `rounded-2xl`; `text-[#DC2626]`; `bg-[#1877F2]`; `text-white`; `shadow-2xs` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-gray-100`; `hover:text-gray-700`; `transition-colors`; `hover:bg-[#166FE5]`; `hover:shadow-xs`; `transition-all`; `active:scale-98` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#166FE5`, `#1877F2`, `#7A8699`, `#DC2626`, `#E5E7EB`, `#ECEFF2`, `#F8F9FB`, `#FEE2E2`, `#FEF2F2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/WorkOrderCompletedDetail.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/maintenance/components/WorkOrderCompletedDetail.tsx](src/features/super-admin/sub-features/maintenance/components/WorkOrderCompletedDetail.tsx).

**Named declarations:** `WorkOrderCompletedDetail`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `w-full flex flex-col font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 32 | `flex items-center gap-1.5 text-xs text-[#7A8699] mb-4` |
| 36 | `text-[#7A8699] hover:text-[#1E75BB] font-medium bg-transparent border-none cursor-pointer p-0 transition-colors` |

<details><summary>Props / reusable interface</summary>

```tsx
interface WorkOrderCompletedDetailProps {
  item: WorkOrderPipelineItem;
  onBack: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `items-center`; `cursor-pointer`; `justify-center`; `justify-between`; `overflow-hidden`; `grid-cols-1`; `lg:grid-cols-12`; `items-stretch`; `lg:col-span-6`; `inline-flex`; `grid-cols-2`; `block`; `sm:grid-cols-3`; `group`; `grid` |
| Size & spacing | `w-full`; `gap-1.5`; `mb-4`; `p-0`; `gap-3`; `mb-6`; `m-0`; `mt-0.5`; `p-8`; `sm:p-10`; `w-14`; `h-14`; `w-7`; `h-7`; `max-w-[660px]`; `my-3`; `max-w-[720px]`; `mt-3`; `mb-1.5`; `h-2.5`; `h-full`; `gap-6`; `p-7`; `gap-5`; `gap-2.5`; `w-9`; `h-9`; `w-4`; `h-4`; `gap-1`; `px-2.5`; `py-0.5`; `w-3`; `h-3`; `p-4`; `gap-4`; `mb-1`; `gap-2`; `w-10`; `h-10`; `w-5`; `h-5`; `py-2.5`; `px-4` |
| Type | `font-[`; `text-xs`; `font-medium`; `font-semibold`; `font-extrabold`; `text-[24px]`; `sm:text-[28px]`; `tracking-tight`; `text-sm`; `font-normal`; `text-center`; `text-[22px]`; `sm:text-[26px]`; `font-bold`; `sm:text-[13px]`; `leading-relaxed`; `text-[11px]`; `tracking-wider`; `uppercase`; `text-[16px]`; `text-[20px]`; `text-[10px]`; `line-clamp-2`; `leading-tight`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#7A8699]`; `bg-transparent`; `border-none`; `text-[#CBD5E1]`; `text-[#1A1C1D]`; `text-[#111827]`; `bg-[#F9FAFB]`; `rounded-[28px]`; `border`; `border-[#ECEFF2]`; `shadow-2xs`; `rounded-full`; `bg-[#1E75BB]`; `text-white`; `shadow-sm`; `stroke-[3]`; `text-[#64748B]`; `text-[#1E75BB]`; `bg-blue-100`; `bg-white`; `rounded-[24px]`; `shadow-xs`; `rounded-xl`; `bg-[#E8F8F0]`; `text-[#10B981]`; `bg-[#F8F9FB]`; `rounded-2xl`; `border-dashed`; `border-[#CBD5E1]`; `bg-[#F1F5F9]`; `bg-[#FAFAFA]`; `border-gray-100`; `bg-[#FEE2E2]`; `text-[#EF4444]`; `text-[#166534]`; `text-[#16A34A]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `hover:text-[#1E75BB]`; `transition-colors`; `hover:bg-gray-50`; `group-hover:scale-105`; `transition-transform` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#10B981`, `#111827`, `#166534`, `#16A34A`, `#1A1C1D`, `#1E75BB`, `#64748B`, `#7A8699`, `#CBD5E1`, `#E8F8F0`, `#ECEFF2`, `#EF4444`, `#F1F5F9`, `#F8F9FB`, `#F9FAFB`, `#FAFAFA`, `#FEE2E2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx).

**Named declarations:** `WorkOrderInProgressDetail`.

**Composition:** [src/components/common/S3Image.tsx](src/components/common/S3Image.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 178 | `w-full flex flex-col font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 180 | `flex items-center gap-1.5 text-xs text-[#7A8699] mb-4` |
| 184 | `text-[#7A8699] hover:text-[#1E75BB] font-medium bg-transparent border-none cursor-pointer p-0 transition-colors` |

<details><summary>Props / reusable interface</summary>

```tsx
interface WorkOrderInProgressDetailProps {
  item: WorkOrderPipelineItem;
  // getFarmlandById has finished; the work order stages are loaded after it (defaults to true)
  isFarmlandDetailsLoaded?: boolean;
  onBack: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `items-center`; `cursor-pointer`; `md:flex-row`; `md:items-end`; `md:justify-between`; `justify-center`; `shrink-0`; `table`; `flex-wrap`; `self-start`; `md:self-auto`; `relative`; `appearance-none`; `absolute`; `-translate-y-1/2`; `pointer-events-none`; `grid-cols-1`; `lg:grid-cols-12`; `items-start`; `lg:col-span-6`; `inline-block`; `justify-between`; `overflow-hidden`; `grid-cols-2`; `group`; `object-cover`; `grid` |
| Size & spacing | `w-full`; `gap-1.5`; `mb-4`; `p-0`; `gap-4`; `mb-6`; `gap-3`; `w-9`; `h-9`; `w-5`; `h-5`; `m-0`; `mt-1`; `gap-1`; `h-[42px]`; `pl-4`; `pr-9`; `min-w-[200px]`; `w-4`; `h-4`; `right-3`; `top-1/2`; `gap-6`; `p-6`; `sm:p-7`; `gap-5`; `px-2.5`; `py-1`; `mb-2`; `pt-1`; `w-11`; `h-11`; `mt-0.5`; `w-3`; `h-3`; `gap-2`; `h-2`; `gap-2.5`; `p-3`; `w-4.5`; `h-4.5`; `py-10`; `gap-3.5`; `h-[150px]`; `sm:h-[180px]`; `h-full`; `bottom-2.5`; `left-2.5`; `px-2`; `py-0.5`; `p-4`; `w-8`; `h-8` |
| Type | `font-[`; `text-xs`; `font-medium`; `font-semibold`; `font-extrabold`; `text-[24px]`; `sm:text-[28px]`; `tracking-tight`; `sm:text-sm`; `font-normal`; `text-[11px]`; `font-bold`; `text-[10px]`; `uppercase`; `tracking-wider`; `text-[20px]`; `sm:text-[22px]`; `text-[14px]`; `text-right`; `text-center`; `text-[18px]`; `sm:text-[20px]`; `text-[9.5px]`; `leading-relaxed`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#7A8699]`; `bg-transparent`; `border-none`; `text-[#CBD5E1]`; `text-[#1A1C1D]`; `rounded-full`; `bg-white`; `border`; `border-[#E2E8F0]`; `shadow-2xs`; `stroke-[2.2]`; `bg-[#F4F5F7]`; `text-[#111827]`; `rounded-xl`; `border-transparent`; `outline-hidden`; `text-gray-500`; `rounded-[24px]`; `border-[#ECEFF2]`; `bg-[#DCFCE7]`; `text-[#15803D]`; `bg-[#E9ECEF]`; `bg-[#22C55E]`; `bg-[#86EFAC]`; `bg-[#F8FAFC]`; `text-[#64748B]`; `bg-[#15803D]`; `text-white`; `stroke-[3]`; `text-[#374151]`; `bg-[#F2FBF4]`; `border-[#DCFCE7]/60`; `border-1.5`; `border-[#15803D]`; `text-[#9CA3AF]`; `rounded-2xl`; `bg-gray-100`; `bg-black/60`; `backdrop-blur-xs`; `rounded-md`; `shadow-xs`; `bg-[#F4FBF7]`; `text-[#4B5563]` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `hover:text-[#1E75BB]`; `transition-colors`; `hover:bg-gray-100`; `disabled:cursor-not-allowed`; `hover:bg-gray-50/70`; `group-hover:scale-105`; `transition-transform`; `duration-300` |

| Inline style source line | Exact declaration |
| --- | --- |
| 299 | `` style={{ width: `${effectiveProgress}%` }} `` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 224 | `disabled={workOrderServices.length === 0}` |
| 227 | `{workOrderServices.length === 0 ? (` |
| 311 | `{effectivePhases.length === 0 && (` |
| 392 | `{sitePhotos.length === 0 && (` |

**Literal palette:** `#111827`, `#15803D`, `#1A1C1D`, `#1E75BB`, `#22C55E`, `#374151`, `#4B5563`, `#64748B`, `#7A8699`, `#86EFAC`, `#9CA3AF`, `#CBD5E1`, `#DCFCE7`, `#E2E8F0`, `#E9ECEF`, `#ECEFF2`, `#F2FBF4`, `#F4F5F7`, `#F4FBF7`, `#F8FAFC`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/maintenance/components/WorkOrderPublishSuccessModal.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/maintenance/components/WorkOrderPublishSuccessModal.tsx](src/features/super-admin/sub-features/maintenance/components/WorkOrderPublishSuccessModal.tsx).

**Named declarations:** `WorkOrderPublishSuccessModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 20 | `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200` |
| 21 | `fixed inset-0` |
| 22 | `relative bg-white rounded-[28px] max-w-[440px] w-full p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center text-center animate-in zoom-in-95 duration-200` |

<details><summary>Props / reusable interface</summary>

```tsx
interface WorkOrderPublishSuccessModalProps {
  isOpen: boolean;
  customerName?: string;
  phaseName?: string;
  onClose: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `relative`; `z-10`; `flex-col`; `cursor-pointer` |
| Size & spacing | `inset-0`; `p-4`; `max-w-[440px]`; `w-full`; `p-8`; `w-16`; `h-16`; `mb-5`; `w-8`; `h-8`; `m-0`; `mb-3`; `mb-7`; `h-[48px]` |
| Type | `font-[`; `text-center`; `text-[20px]`; `sm:text-[22px]`; `font-bold`; `tracking-tight`; `text-[13.5px]`; `leading-relaxed`; `font-normal`; `font-semibold`; `text-sm`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-xs`; `bg-white`; `rounded-[28px]`; `shadow-2xl`; `border`; `border-[#ECEFF2]`; `rounded-full`; `bg-[#1E75BB]`; `text-white`; `shadow-md`; `stroke-[3]`; `text-[#111827]`; `text-[#4B5563]`; `rounded-xl`; `border-none`; `shadow-xs` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:bg-[#1864A0]`; `hover:shadow-md`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#111827`, `#1864A0`, `#1E75BB`, `#4B5563`, `#ECEFF2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx).

**Named declarations:** `AgricultureReportUploadFile`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 129 | `px-6 py-6 shrink-0` |
| 130 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |
| 133 | `text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1` |

<details><summary>Props / reusable interface</summary>

```tsx
interface AgricultureReportUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // Agriculture specific states
  selectedSoilType?: string;
  onSoilTypeChange?: (val: string) => void;
  selectedCropType?: string;
  onCropTypeChange?: (val: string) => void;
  waterLevelValue?: string;
  onWaterLevelChange?: (val: string) => void;
  selectedFutureCrops?: string;
  onFutureCropsChange?: (val: string) => void;
  yieldCostValue?: string;
  onYieldCostChange?: (val: string) => void;
  yieldReturnsValue?: string;
  onYieldReturnsChange?: (val: string) => void;
  cultivationTypeValue?: string;
  onCultivationTypeChange?: (val: string) => void;
  cultivationNameValue?: string;
  onCultivationNameChange?: (val: string) => void;
  cultivationContactValue?: string;
  onCultivationContactChange?: (val: string) => void;
  maintenanceCropValue?: string;
  onMaintenanceCropChange?: (val: string) => void;
  maintenanceReturnsValue?: string;
  onMaintenanceReturnsChange?: (val: string) => void;
  advantagesValue?: string;
  onAdvantagesChange?: (val: string) => void;
  disadvantagesValue?: string;
  onDisadvantagesChange?: (val: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `select-none`; `flex`; `flex-col`; `overflow-hidden`; `shrink-0`; `flex-1`; `overflow-y-auto`; `relative`; `items-center`; `justify-between`; `cursor-pointer`; `flex-wrap`; `justify-center`; `flex-shrink-0`; `absolute`; `z-[1010]`; `grid-cols-2`; `sm:grid-cols-3`; `flex-row`; `grown`; `justify-end`; `box-border`; `grid` |
| Size & spacing | `w-full`; `h-full`; `px-6`; `py-6`; `m-0`; `mt-1`; `md:px-8`; `md:py-8`; `gap-8`; `gap-6`; `gap-3`; `min-h-[48px]`; `px-4`; `gap-2`; `py-2`; `px-2`; `py-1`; `w-3`; `h-3`; `w-2`; `h-2`; `py-3`; `top-[100%]`; `left-0`; `right-0`; `p-4`; `max-h-[300px]`; `gap-4`; `h-[40px]`; `mr-2`; `pr-2`; `w-4`; `h-4`; `w-2.5`; `h-2.5`; `h-[48px]`; `h-[250px]`; `max-h-[250px]`; `mt-4`; `py-4`; `md:py-6`; `w-28`; `md:w-32`; `min-h-11`; `md:min-h-12` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-semibold`; `text-[16px]`; `text-[12px]`; `text-[14px]`; `truncate`; `font-medium`; `text-sm`; `md:text-base` |
| Appearance | `bg-white`; `rounded-3xl`; `text-black`; `text-[#8C9088]`; `border-t`; `border-gray-100`; `border`; `border-[rgba(0,0,0,0.3)]`; `rounded-[8px]`; `outline-none`; `border-[#E5E385]`; `rounded`; `bg-[#2D3409]`; `rounded-sm`; `text-gray-700`; `text-gray-400`; `text-gray-500`; `border-gray-300`; `shadow-lg`; `rounded-full`; `border-none`; `bg-transparent`; `text-[#3A8EE6]`; `border-2`; `border-[rgba(0,0,0,0.1)]`; `bg-[#3A8EE6]`; `text-[#1A1C1D]`; `border-[#D0D5DD]`; `text-white`; `bg-[#2A3008]` |
| Interaction / motion | `focus:border-[#BDD327]`; `transition-all`; `hover:bg-gray-50`; `active:scale-95` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 180 | `<input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} maxLength={50} className="w-full h-full border-none outline-none bg-transparent font-sans text-[14px] text-black" />` |
| 210 | `<input type="text" placeholder="Enter Amount" value={maintenanceReturnsValue} onChange={(e) => onMaintenanceReturnsChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 249 | `<input type="text" placeholder="Enter Name" value={cultivationNameValue} onChange={(e) => onCultivationNameChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 254 | `<input type="tel" placeholder="Enter Contact Details" value={cultivationContactValue} onChange={(e) => onCultivationContactChange?.(e.target.value.replace(/[^0-9]/g, ''))} maxLength={10} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 261 | `<input type="text" placeholder="10,000.00" value={yieldCostValue} onChange={(e) => onYieldCostChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 265 | `<input type="text" placeholder="10,000.00" value={yieldReturnsValue} onChange={(e) => onYieldReturnsChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 272 | `<input type="text" placeholder="Better soil" value={advantagesValue} onChange={(e) => onAdvantagesChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 276 | `<input type="text" placeholder="Road side land" value={disadvantagesValue} onChange={(e) => onDisadvantagesChange?.(e.target.value)} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 364 | `<input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} maxLength={50} className="w-full h-full border-none outline-none bg-transparent font-sans text-[14px] text-black" />` |
| 394 | `<input type="text" placeholder="Enter depth" value={waterLevelValue} onChange={(e) => onWaterLevelChange?.(e.target.value.replace(/[^0-9.]/g, ''))} maxLength={50} className="w-full h-[48px] bg-white border border-[rgba(0,0,0,0.3)] rounded-[8px] px-4 font-sans text-[14px] text-black outline-none focus:border-[#BDD327]" />` |
| 438 | `disabled={!isNextEnabled}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2D3409`, `#3A8EE6`, `#8C9088`, `#BDD327`, `#D0D5DD`, `#E5E385`, `#E5F1F9`, `#FFFFFF`, `rgba(0, 0, 0, 0.4)`, `rgba(0,0,0,0.1)`, `rgba(0,0,0,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/Comments.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Named declarations:** `Comments`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `relative w-full h-[150px] bg-[rgba(230,238,173,0.3)] border border-[#E6EEAD] rounded-[18px] p-4 flex flex-col` |
| 36 | `bg-transparent resize-none border-none outline-none text-black placeholder-[rgba(0,0,0,0.4)] font-sans text-[16px] leading-[24px] w-full flex-1` |
| 38 | `flex justify-end mt-2` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface CommentsProps {
  commentValue: string;
  onCommentChange: (val: string) => void;
  activeTabLabel: string;
  mockDictationSuffix?: string; // e.g. " Survey Report."
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `flex`; `flex-col`; `resize-none`; `flex-1`; `justify-end` |
| Size & spacing | `w-full`; `h-[150px]`; `p-4`; `mt-2`; `w-5`; `h-5` |
| Type | `font-sans`; `text-[16px]`; `leading-[24px]` |
| Appearance | `bg-[rgba(230,238,173,0.3)]`; `border`; `border-[#E6EEAD]`; `rounded-[18px]`; `bg-transparent`; `border-none`; `outline-none`; `text-black`; `bg-red-600`; `bg-[#2D3509]`; `text-white` |
| Interaction / motion | `animate-pulse`; `hover:opacity-90` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 35 | `maxLength={500}` |

**Literal palette:** `#2D3509`, `#E6EEAD`, `rgba(0,0,0,0.4)`, `rgba(230,238,173,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx).

**Named declarations:** `LandAndBoundariesUploadFile`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 221 | `w-full bg-white shadow-sm rounded-xl p-4 border border-gray-100` |
| 238 | `flex flex-col gap-2 w-full mt-2` |
| 239 | `font-semibold text-[16px] text-black` |

<details><summary>Props / reusable interface</summary>

```tsx
interface LandAndBoundariesUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  hasCoverImage?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // LandShape
  landShapeValue?: string;
  onLandShapeChange?: (val: string) => void;

  // Facilities
  facilityAvailabilityValue?: string;
  onFacilityAvailabilityChange?: (val: string) => void;
  waterFacilityValue?: string;
  onWaterFacilityChange?: (val: string) => void;
  electricityFacilityValue?: string;
  onElectricityFacilityChange?: (val: string) => void;

  // Trees
  treesAvailabilityValue?: string;
  onTreesAvailabilityChange?: (val: string) => void;
  treesCountValue?: string;
  onTreesCountChange?: (val: string) => void;

  // Survey Reports
  surveyReportTypeValue?: string;
  onSurveyReportTypeChange?: (val: string) => void;
  privateSurveyFiles?: UploadedFileItem[];
  onPrivateSurveyFileUpload?: (files: FileList) => void;
  onPrivateSurveyFileDelete?: (fileId: string) => void;
  privateSurveyCommentValue?: string;
  onPrivateSurveyCommentChange?: (val: string) => void;
  governmentSurveyFiles?: UploadedFileItem[];
  onGovernmentSurveyFileUpload?: (files: FileList) => void;
  onGovernmentSurveyFileDelete?: (fileId: string) => void;
  governmentSurveyCommentValue?: string;
  onGovernmentSurveyCommentChange?: (val: string) => void;

  // Boundaries
  boundaryTypeValue?: string;
  onBoundaryTypeChange?: (val: string) => void;
  boundaryOwnerNameValue?: string;
  onBoundaryOwnerNameChange?: (val: string) => void;
  boundaryOwnerAgeValue?: string;
  onBoundaryOwnerAgeChange?: (val: string) => void;
  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;
  boundaryTreesCountValue?: string;
  onBoundaryTreesCountChange?: (val: string) => void;
  shapeOfTheLandOptions?: any[];
  treesCountOptions?: any[];
  boundariesOptions?: any[];
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `select-none`; `overflow-hidden`; `z-[99999]`; `fixed`; `items-center`; `justify-center`; `box-border`; `relative`; `justify-start`; `flex-row`; `absolute`; `cursor-pointer`; `hidden`; `shrink-0`; `flex-1`; `overflow-y-auto`; `flex-wrap`; `justify-between`; `z-[1010]`; `grid-cols-1`; `md:grid-cols-2`; `items-end`; `block`; `group`; `justify-end`; `grid` |
| Size & spacing | `w-full`; `p-4`; `gap-2`; `mt-2`; `h-full`; `inset-0`; `max-w-lg`; `p-8`; `mb-8`; `gap-8`; `w-[200px]`; `h-[200px]`; `top-4`; `w-[50px]`; `h-[50px]`; `w-[40px]`; `h-[40px]`; `w-[20px]`; `h-[20px]`; `bottom-4`; `px-6`; `py-2`; `py-6`; `m-0`; `mt-1`; `md:px-8`; `md:py-8`; `gap-6`; `gap-4`; `px-4`; `w-3`; `h-3`; `mt-4`; `pt-8`; `gap-3`; `h-[48px]`; `top-[100%]`; `left-0`; `right-0`; `max-h-[250px]`; `py-3`; `gap-5`; `h-[72px]`; `w-[42px]`; `h-[42px]`; `w-[22px]`; `h-[26px]`; `top-0`; `w-0`; `h-0`; `py-[2px]`; `mx-[2px]`; `mb-[2px]`; `min-w-0`; `p-1.5`; `py-4`; `md:py-6`; `w-28`; `md:w-32`; `min-h-11`; `md:min-h-12` |
| Type | `font-semibold`; `text-[16px]`; `font-[`; `text-[22px]`; `font-medium`; `text-[14px]`; `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `text-[18px]`; `text-[6px]`; `text-center`; `tracking-wide`; `truncate`; `text-[15px]`; `leading-[20px]`; `text-[12px]`; `text-sm`; `md:text-base`; `font-['Plus_Jakarta_Sans',_sans-serif]` |
| Appearance | `bg-white`; `shadow-sm`; `rounded-xl`; `border`; `border-gray-100`; `text-black`; `rounded-3xl`; `bg-black/40`; `shadow-xl`; `rounded-[24px]`; `shadow-md`; `rounded-[12px]`; `rounded-full`; `bg-[#E6EEAD]`; `bg-[#2A3008]`; `text-white`; `border-none`; `text-[#8C9088]`; `border-t`; `border-2`; `border-[rgba(0,0,0,0.3)]`; `rounded-[8px]`; `outline-none`; `text-gray-500`; `border-gray-200`; `shadow-lg`; `text-gray-600`; `border-[rgba(0,0,0,0.15)]`; `border-[rgba(0,0,0,0.1)]`; `text-gray-400`; `bg-[#EEF5FA]`; `bg-[#F2F4F7]`; `rounded-sm`; `border-l-[6px]`; `border-l-transparent`; `border-t-[6px]`; `border-t-white`; `bg-[#E33B32]`; `bg-transparent`; `rounded`; `text-[#1A1C1D]`; `border-[#D0D5DD]` |
| Interaction / motion | `hover:scale-105`; `active:scale-95`; `transition-all`; `hover:bg-gray-50`; `focus:border-[#BDD327]`; `hover:opacity-90`; `transition-opacity`; `hover:bg-gray-200`; `transition-colors`; `hover:bg-red-100`; `group-hover:text-red-500` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 282 | `` <button type="button" onClick={() => !hasCoverImage && coverImageInputRef.current?.click()} className={`absolute bottom-4 px-6 py-2 bg-[#2A3008] text-white rounded-full font-medium text-[14px] border-none ${hasCoverImage ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 transition-all cursor-pointer"}`} disabled={hasCoverImage}> `` |
| 309 | `<input ref={coverImageInputRef} type="file" multiple onChange={handleCoverImageChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*" />` |
| 310 | `<input ref={landImagesInputRef} type="file" multiple onChange={handleLandImagesChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*" />` |
| 665 | `disabled={!isNextEnabled}` |

**Literal palette:** `#1A1C1D`, `#2780C4`, `#2A3008`, `#2B2D2F`, `#2D3409`, `#4B5563`, `#5CA2D3`, `#85BFE5`, `#8C9088`, `#BDD327`, `#D0D5DD`, `#E33B32`, `#E5F1F9`, `#E6EEAD`, `#EEF5FA`, `#F2F4F7`, `rgba(0,0,0,0.1)`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/LegalUploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/LegalUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LegalUploadFile.tsx).

**Named declarations:** `LegalUploadFile`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 52 | `px-6 py-6 shrink-0` |
| 53 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |
| 56 | `text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1` |

<details><summary>Props / reusable interface</summary>

```tsx
interface LegalUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep?: boolean;
  isNextEnabled?: boolean;
  coordinatesValue?: string;
  onCoordinatesChange?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `select-none`; `flex`; `flex-col`; `overflow-hidden`; `shrink-0`; `flex-1`; `overflow-y-auto`; `flex-row`; `justify-end`; `items-center`; `justify-center`; `cursor-pointer`; `box-border` |
| Size & spacing | `w-full`; `h-full`; `px-6`; `py-6`; `m-0`; `mt-1`; `md:px-8`; `md:py-8`; `gap-8`; `gap-4`; `min-h-12`; `px-4`; `py-4`; `md:py-6`; `w-28`; `md:w-32`; `min-h-11`; `md:min-h-12` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-semibold`; `text-sm`; `md:text-base` |
| Appearance | `bg-white`; `rounded-3xl`; `text-black`; `text-[#8C9088]`; `border-t`; `border-gray-100`; `border`; `border-[rgba(0,0,0,0.3)]`; `rounded-lg`; `text-blue-600`; `outline-none`; `text-[#1A1C1D]`; `border-[#D0D5DD]`; `rounded-full`; `text-white`; `bg-[#2A3008]`; `border-none` |
| Interaction / motion | `focus:border-blue-500`; `hover:bg-gray-50`; `active:scale-95`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 114 | `disabled={!isNextEnabled}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#8C9088`, `#D0D5DD`, `rgba(0,0,0,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx).

**Named declarations:** `LocalIntelligenceUploadFile`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 102 | `px-6 py-6 shrink-0` |
| 103 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |
| 106 | `text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1` |

<details><summary>Props / reusable interface</summary>

```tsx
interface LocalIntelligenceUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  anyIssuesTypeValue?: string;
  onAnyIssuesTypeChange?: (val: string) => void;
  localLiabilitiesTypeValue?: string;
  onLocalLiabilitiesTypeChange?: (val: string) => void;
  pendingLoansTypeValue?: string;
  onPendingLoansTypeChange?: (val: string) => void;
  pendingLoansAmountValue?: string;
  onPendingLoansAmountChange?: (val: string) => void;
  ownerMindsetValue?: string;
  onOwnerMindsetChange?: (val: string) => void;
  sourcePersonTypeValue?: string;
  onSourcePersonTypeChange?: (val: string) => void;
  sourcePersonNameValue?: string;
  onSourcePersonNameChange?: (val: string) => void;
  sourcePersonMobileValue?: string;
  onSourcePersonMobileChange?: (val: string) => void;
  agreementPaperValue?: string;
  onAgreementPaperChange?: (val: string) => void;
  agreementTypeValue?: string;
  onAgreementTypeChange?: (val: string) => void;
  agreementPriceValue?: string;
  onAgreementPriceChange?: (val: string) => void;
  prevTransactionsTypeValue?: string;
  onPrevTransactionsTypeChange?: (val: string) => void;
  prevTransactionsPriceValue?: string;
  onPrevTransactionsPriceChange?: (val: string) => void;
  ownerMindsetOptions?: any[];
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `select-none`; `flex`; `flex-col`; `overflow-hidden`; `shrink-0`; `flex-1`; `overflow-y-auto`; `flex-row`; `items-center`; `box-border`; `relative`; `appearance-none`; `cursor-pointer`; `absolute`; `-translate-y-1/2`; `pointer-events-none`; `justify-end`; `justify-center` |
| Size & spacing | `w-full`; `h-full`; `px-6`; `py-6`; `m-0`; `mt-1`; `md:px-8`; `md:py-8`; `gap-8`; `gap-4`; `gap-3`; `gap-6`; `h-[48px]`; `px-4`; `right-4`; `top-1/2`; `pb-2`; `gap-2`; `mt-4`; `py-4`; `md:py-6`; `w-28`; `md:w-32`; `min-h-11`; `md:min-h-12` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-semibold`; `text-[16px]`; `text-[14px]`; `text-sm`; `md:text-base` |
| Appearance | `bg-white`; `rounded-3xl`; `text-black`; `text-[#8C9088]`; `border-t`; `border-gray-100`; `border-[#2B2D2F]`; `bg-[#2B2D2F]`; `text-white`; `border-gray-300`; `border-white`; `bg-[#BDD327]`; `border-[#BDD327]`; `border`; `border-[rgba(0,0,0,0.3)]`; `rounded-[8px]`; `outline-none`; `border-b`; `text-[#1A1C1D]`; `border-[#D0D5DD]`; `rounded-full`; `bg-[#2A3008]`; `border-none` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `focus:border-[#BDD327]`; `focus:outline-none`; `hover:bg-gray-50`; `active:scale-95`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 231 | `maxLength={50}` |
| 301 | `maxLength={50}` |
| 312 | `maxLength={10}` |
| 423 | `maxLength={50}` |
| 543 | `disabled={!isNextEnabled}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2B2D2F`, `#363434`, `#8C9088`, `#BDD327`, `#D0D5DD`, `rgba(0,0,0,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx).

**Purpose:** Compose owner/family/land tabs and customer workflow actions.

**Named declarations:** `UploadCustomerInformationCard`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 127 | `flex flex-col md:flex-row justify-between items-start md:items-center w-full px-6 py-4 md:px-8 md:py-6 border-b border-gray-100 shrink-0 gap-4 md:gap-6` |
| 131 | `flex flex-row items-center gap-4 md:gap-6 shrink-0` |
| 134 | `bg-[#E6EEAD] border-4 border-[#F9F9FB] shadow-sm rounded-full flex items-center justify-center relative shrink-0 w-16 h-16 md:w-20 md:h-20` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadCustomerInformationCardProps {
  farmlandId: string;
  onSubmit?: (data: any) => void;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `overflow-hidden`; `md:flex-row`; `justify-between`; `items-start`; `md:items-center`; `shrink-0`; `flex-row`; `items-center`; `justify-center`; `relative`; `hidden`; `md:block`; `flex-1`; `justify-start`; `md:justify-end`; `overflow-x-auto`; `no-scrollbar`; `cursor-pointer` |
| Size & spacing | `w-full`; `h-full`; `px-6`; `py-4`; `md:px-8`; `md:py-6`; `gap-4`; `md:gap-6`; `w-16`; `h-16`; `md:w-20`; `md:h-20`; `m-0`; `sm:gap-6`; `md:w-auto`; `gap-2`; `px-4`; `py-2`; `w-4`; `h-4`; `md:w-5`; `md:h-5`; `w-2.5`; `h-2.5`; `md:w-3`; `md:h-3`; `min-h-0` |
| Type | `font-sans`; `font-bold`; `text-2xl`; `md:text-3xl`; `leading-none`; `text-xl`; `md:text-2xl`; `leading-tight`; `font-semibold`; `text-xs`; `md:text-sm`; `whitespace-nowrap` |
| Appearance | `bg-white`; `shadow-sm`; `rounded-3xl`; `border-b`; `border-gray-100`; `bg-[#E6EEAD]`; `border-4`; `border-[#F9F9FB]`; `rounded-full`; `text-[#2D3409]`; `text-[#1A1C1D]`; `bg-[#BDD327]`; `text-[#FFFCEE]` |
| Interaction / motion | `transition-all`; `hover:scale-[1.03]`; `animate-in`; `zoom-in`; `duration-200` |

| Inline style source line | Exact declaration |
| --- | --- |
| 160 | `style={{ backgroundColor: activeTab === "owner" ? "#FFFFFF" : "#F9F9F9", border: activeTab === "owner" ? "1px solid #E6EEAD" : "1px solid transparent", color: activeTab === "owner" ? "#2A3008" : "#5A5C5E", }}` |
| 170 | `style={{ backgroundColor: "#2D3409", border: "4px solid #E6EEAD", }}` |
| 195 | `style={{ backgroundColor: activeTab === "family" ? "#FFFFFF" : "#F9F9F9", border: activeTab === "family" ? "1px solid #E6EEAD" : "1px solid transparent", color: activeTab === "family" ? "#2A3008" : "#5A5C5E", }}` |
| 205 | `style={{ backgroundColor: "#2D3409", border: "4px solid #E6EEAD", }}` |
| 221 | `style={{ backgroundColor: "#C0C2B7", border: "4px solid #E6EEAD", }}` |
| 237 | `style={{ backgroundColor: activeTab === "land" ? "#FFFFFF" : "#F9F9F9", border: activeTab === "land" ? "1px solid #E6EEAD" : "1px solid transparent", color: activeTab === "land" ? "#2A3008" : "#5A5C5E", }}` |
| 247 | `style={{ backgroundColor: "#2D3409", border: "4px solid #E6EEAD", }}` |
| 255 | `style={{ backgroundColor: "#C0C2B7", border: "4px solid #E6EEAD", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 101 | `} catch (error) {` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2D3409`, `#5A5C5E`, `#BDD327`, `#C0C2B7`, `#E6EEAD`, `#F9F9F9`, `#F9F9FB`, `#FFFCEE`, `#FFFFFF`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadDocumentsTabsCard.tsx).

**Named declarations:** `UploadDocumentsTabsCard`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 31 | `px-6 py-6 border-b border-gray-100 shrink-0` |
| 32 | `font-sans font-bold text-base md:text-lg text-[#1A1C1D] leading-tight m-0` |
| 36 | `font-sans text-xs md:text-sm text-[#5A5C5E] mt-1 m-0` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadDocumentsTabsCardProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  isTabComplete: (tabId: string) => boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `select-none`; `shrink-0`; `overflow-hidden`; `box-border`; `flex-1`; `overflow-y-auto`; `items-center`; `cursor-pointer`; `justify-center` |
| Size & spacing | `h-full`; `px-6`; `py-6`; `m-0`; `mt-1`; `py-2`; `gap-3`; `py-3.5`; `w-5`; `h-5`; `w-[40%]`; `h-[40%]`; `w-4`; `h-4`; `ml-auto` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `text-left`; `font-semibold`; `leading-none`; `text-sm` |
| Appearance | `bg-white`; `rounded-3xl`; `shadow-[0px_20px_40px_rgba(0,_49,_50,_0.06)]`; `border-b`; `border-gray-100`; `text-[#1A1C1D]`; `text-[#5A5C5E]`; `text-[#BDD327]`; `rounded-full`; `text-[#2D3409]` |
| Interaction / motion | `transition-all`; `duration-200` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1A1C1D`, `#2D3409`, `#5A5C5E`, `#BDD327`, `#C0C2B7`, `#E1E5EF`, `#E6EEAD`, `#F4F7E6`, `rgba(0,_49,_50,_0.06)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx).

**Named declarations:** `UploadFamilyTreeTab`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 161 | `w-10 h-10 rounded-full bg-[#F1F5F9] overflow-hidden flex items-center justify-center shrink-0` |
| 163 | `w-full h-full object-cover` |
| 165 | `w-5 h-5 text-[#94A3B8]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  farmlandData?: any;
  farmlandId: number;
  onBack: () => void;
  onNext: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-start`; `relative`; `z-10`; `overflow-hidden`; `justify-center`; `shrink-0`; `object-cover`; `flex-col`; `flex-1`; `items-start`; `absolute`; `-translate-x-1/2`; `z-20`; `overflow-x-auto`; `overflow-y-auto`; `custom-scrollbar`; `cursor-pointer`; `flex-wrap`; `flex-row`; `justify-end` |
| Size & spacing | `p-3`; `w-[200px]`; `gap-3`; `w-10`; `h-10`; `w-full`; `h-full`; `w-5`; `h-5`; `min-w-0`; `mt-8`; `px-4`; `-top-4`; `h-[1.5px]`; `w-[1.5px]`; `h-4`; `left-1/2`; `mb-2`; `px-3`; `py-1`; `h-8`; `-bottom-8`; `px-6`; `py-6`; `md:px-8`; `md:py-8`; `w-max`; `min-w-full`; `gap-4`; `pb-12`; `top-0`; `right-0`; `px-5`; `py-2`; `gap-1.5`; `w-4`; `min-w-[800px]`; `mt-6`; `mt-4`; `p-6`; `w-[240px]`; `-top-3`; `w-16`; `h-16`; `mb-3`; `w-8`; `m-0`; `mt-1`; `mt-12`; `pt-8`; `mb-6`; `py-2.5`; `gap-2`; `mb-0.5`; `gap-6`; `py-4`; `md:py-6`; `px-8`; `py-3`; `min-w-[120px]` |
| Type | `text-left`; `text-[13px]`; `font-bold`; `truncate`; `text-[12px]`; `text-[9px]`; `uppercase`; `tracking-widest`; `font-plus-jakarta`; `font-sans`; `text-sm`; `font-medium`; `text-center`; `text-[10px]`; `tracking-wider`; `text-[17px]`; `leading-tight`; `text-[24px]`; `leading-none`; `text-[15px]`; `text-xs`; `text-[16px]`; `md:text-sm`; `font-normal`; `md:text-base` |
| Appearance | `bg-white`; `border`; `border-[#E2E8F0]`; `rounded-[16px]`; `shadow-[0_2px_8px_rgba(0,0,0,0.04)]`; `rounded-full`; `bg-[#F1F5F9]`; `text-[#94A3B8]`; `text-[#1A1C1D]`; `text-[#64748B]`; `bg-[#CBD5E1]`; `bg-[#EAEFF5]`; `rounded-[100px]`; `shadow-sm`; `border-white`; `bg-[#2D3409]`; `text-white`; `border-none`; `bg-[#F9F9F9]`; `border-[#E6EEAD]`; `bg-[#BDD327]`; `text-[#2D3409]`; `border-[2px]`; `border-[3px]`; `bg-gray-100`; `bg-[#E2E8F0]`; `bg-[#E6EEAD]`; `border-t`; `border-dashed`; `text-gray-400`; `border-gray-100`; `text-black`; `bg-transparent`; `shadow-lg` |
| Interaction / motion | `hover:bg-[#3D4A0D]`; `transition-colors`; `transition-all`; `duration-300`; `hover:bg-[#F0F4D4]`; `hover:underline`; `hover:scale-105`; `active:scale-95` |

| Inline style source line | Exact declaration |
| --- | --- |
| 335 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2D3409`, `#3D4A0D`, `#64748B`, `#94A3B8`, `#BDD327`, `#CBD5E1`, `#E2E8F0`, `#E6EEAD`, `#EAEFF5`, `#F0F4D4`, `#F1F5F9`, `#F9F9F9`, `rgba(0,0,0,0.04)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandCard.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandCard.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandCard.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 42 | `w-full h-[clamp(5.64rem,11.75vw,13.0rem)] rounded-[clamp(0.72rem,1.5vw,1.25rem)] overflow-hidden shrink-0` |
| 46 | `w-full h-full object-cover transition-transform duration-500 hover:scale-105` |
| 51 | `flex flex-col gap-[clamp(0.48rem,1vw,0.8rem)]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadFarmlandCardProps {
  data: UploadFarmlandData;
  onResume?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `shrink-0`; `overflow-hidden`; `object-cover`; `items-center`; `justify-between`; `relative`; `justify-center` |
| Size & spacing | `gap-[clamp(0.72rem,1.5vw,1.25rem)]`; `p-[clamp(0.72rem,1.5vw,1.25rem)]`; `w-[clamp(10.32rem,21.5vw,23.0rem)]`; `w-full`; `h-[clamp(5.64rem,11.75vw,13.0rem)]`; `h-full`; `gap-[clamp(0.48rem,1vw,0.8rem)]`; `py-[clamp(0.38rem,0.8vw,0.75rem)]`; `gap-[clamp(0.12rem,0.25vw,0.25rem)]`; `w-1/2`; `pt-[clamp(0.24rem,0.5vw,0.45rem)]`; `gap-[clamp(0.24rem,0.5vw,0.45rem)]`; `min-w-0`; `w-[clamp(0.72rem,1.5vw,1.25rem)]`; `h-[clamp(0.72rem,1.5vw,1.25rem)]`; `h-[clamp(1.06rem,2.2vw,1.9rem)]`; `px-[clamp(0.72rem,1.5vw,1.25rem)]`; `h-[clamp(0.96rem,2vw,1.75rem)]`; `px-[clamp(0.58rem,1.2vw,1.0rem)]` |
| Type | `font-[`; `font-extrabold`; `text-[clamp(0.62rem,1.3vw,1.875rem)]`; `leading-snug`; `tracking-tight`; `font-bold`; `text-[clamp(0.34rem,0.7vw,0.875rem)]`; `leading-none`; `tracking-wider`; `uppercase`; `text-[clamp(0.48rem,1vw,1.25rem)]`; `leading-normal`; `font-medium`; `text-[clamp(0.38rem,0.8vw,1.125rem)]`; `truncate`; `font-semibold`; `text-center`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `border`; `border-[#F1F5F9]`; `rounded-[clamp(0.96rem,2vw,1.56rem)]`; `shadow-[0px_0.05rem_0.1rem_rgba(0,0,0,0.05)]`; `rounded-[clamp(0.72rem,1.5vw,1.25rem)]`; `text-[#262C00]`; `border-y`; `text-[#94A3B8]`; `text-[#334155]`; `rounded-full`; `text-[#64748B]`; `rounded-[clamp(1.2rem,2.5vw,2.0rem)]`; `text-white`; `border-[#E2E8F0]`; `text-[#475569]` |
| Interaction / motion | `transition-all`; `duration-300`; `hover:shadow-lg`; `transition-transform`; `duration-500`; `hover:scale-105`; `transition-opacity`; `hover:opacity-90`; `hover:bg-gray-50`; `transition-colors` |

| Inline style source line | Exact declaration |
| --- | --- |
| 102 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#262C00`, `#2A3008`, `#334155`, `#3D4A0D`, `#475569`, `#64748B`, `#94A3B8`, `#E2E8F0`, `#F1F5F9`, `rgba(0,0,0,0.05)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx).

**Purpose:** Show land/agent metadata and continue to upload verification.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 42 | `box-border flex min-h-full flex-col gap-[clamp(0.72rem,1.5vw,1.5rem)] px-[clamp(0.5rem,1.5vw,1rem)] py-[clamp(0.96rem,2vw,2.0rem)] text-[#1A1C1D]` |
| 44 | `flex items-center justify-between w-full` |
| 48 | `flex items-center gap-[clamp(0.38rem,0.8vw,0.75rem)]` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface UploadFarmlandDetailsProps {
  farmland: {
    id: string;
    title: string;
    acres: string;
    uploadedAt?: string;
    image: string;
    status: "draft" | "completed";
    uploader: {
      name: string;
      avatar: string;
    };
    soilType?: string;
  };
  onBack: () => void;
  onActionComplete?: (id: string, action: "resume" | "view") => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `box-border`; `flex`; `flex-col`; `items-center`; `justify-between`; `relative`; `justify-center`; `absolute`; `overflow-hidden`; `shrink-0`; `object-cover`; `md:flex-row`; `items-stretch`; `flex-1`; `aspect-[4/3]`; `md:aspect-auto`; `self-start`; `flex-row`; `grid-cols-1`; `md:grid-cols-2`; `justify-end`; `grid` |
| Size & spacing | `min-h-full`; `gap-[clamp(0.72rem,1.5vw,1.5rem)]`; `px-[clamp(0.5rem,1.5vw,1rem)]`; `py-[clamp(0.96rem,2vw,2.0rem)]`; `w-full`; `gap-[clamp(0.38rem,0.8vw,0.75rem)]`; `w-[clamp(1.56rem,3.25vw,3.5rem)]`; `h-[clamp(1.56rem,3.25vw,3.5rem)]`; `top-[clamp(0.38rem,0.8vw,0.9rem)]`; `right-[clamp(0.38rem,0.8vw,0.9rem)]`; `w-[clamp(0.24rem,0.5vw,0.5rem)]`; `h-[clamp(0.24rem,0.5vw,0.5rem)]`; `h-full`; `mt-[clamp(0.5rem,1.5vw,1rem)]`; `min-w-[clamp(18rem,50%,36rem)]`; `md:w-[clamp(17.47rem,36.39vw,36.0rem)]`; `md:h-[clamp(13.63rem,28.4vw,32.0rem)]`; `inset-0`; `bottom-[clamp(0.96rem,2vw,2.25rem)]`; `left-[clamp(0.96rem,2vw,2.25rem)]`; `gap-[clamp(0.29rem,0.6vw,0.6rem)]`; `px-[clamp(0.33rem,0.69vw,1.0rem)]`; `py-[clamp(0.18rem,0.375vw,0.5rem)]`; `p-[clamp(1.1rem,2.29vw,2.5rem)]`; `md:w-[clamp(18rem,37.5vw,39.0rem)]`; `gap-[clamp(0.8rem,1.67vw,2.2rem)]`; `pb-[clamp(0.48rem,1vw,1.0rem)]`; `gap-[clamp(0.58rem,1.2vw,1.25rem)]`; `mt-[clamp(0.48rem,1vw,1.0rem)]`; `p-[clamp(0.8rem,1.67vw,2.0rem)]`; `h-[clamp(3.27rem,6.81vw,8.0rem)]`; `gap-[clamp(0.12rem,0.25vw,0.25rem)]`; `p-[clamp(1.1rem,2.29vw,3.0rem)]`; `min-h-[clamp(11.73rem,24.44vw,28.0rem)]`; `gap-[clamp(1.5rem,3.33vw,4.5rem)]`; `mt-[clamp(0.24rem,0.5vw,0.5rem)]`; `h-[clamp(1.47rem,3.06vw,3.5rem)]`; `gap-[clamp(0.14rem,0.3vw,0.375rem)]`; `mt-[clamp(0.48rem,1vw,1.5rem)]`; `h-[clamp(1.27rem,2.64vw,3.125rem)]`; `w-[clamp(6.7rem,13.96vw,15.0rem)]`; `gap-2`; `w-4`; `h-4` |
| Type | `font-[`; `font-extrabold`; `text-[clamp(0.93rem,1.94vw,2.25rem)]`; `leading-[clamp(1.6rem,3.33vw,3.75rem)]`; `tracking-[-1.2px]`; `font-bold`; `text-[clamp(0.33rem,0.69vw,0.875rem)]`; `tracking-[0.6px]`; `uppercase`; `leading-none`; `text-[clamp(1.07rem,2.22vw,2.75rem)]`; `leading-[clamp(1.6rem,3.33vw,4.0rem)]`; `text-[clamp(0.67rem,1.39vw,1.6rem)]`; `leading-[clamp(0.93rem,1.94vw,2.2rem)]`; `font-semibold`; `text-[clamp(0.4rem,0.83vw,1.0rem)]`; `font-medium`; `text-[clamp(0.6rem,1.25vw,1.5rem)]`; `font-normal`; `text-[clamp(0.53rem,1.11vw,1.375rem)]`; `leading-[clamp(0.8rem,1.67vw,2.0rem)]`; `tracking-[0.5px]`; `text-[clamp(0.47rem,0.97vw,1.125rem)]`; `leading-[clamp(0.67rem,1.39vw,1.75rem)]`; `leading-[clamp(0.6rem,1.25vw,1.5rem)]`; `text-center`; `font-['Manrope']`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#1A1C1D]`; `bg-white`; `border`; `border-[#F1F5F9]`; `rounded-full`; `shadow-sm`; `text-[#2C2C2C]`; `bg-[#EF4646]`; `rounded-[clamp(1.07rem,2.22vw,2.75rem)]`; `bg-gradient-to-t`; `from-black/60`; `via-transparent`; `to-transparent`; `bg-white/20`; `border-white/10`; `backdrop-blur-md`; `text-white`; `border-[#BCC9C9]/15`; `shadow-[0px_20px_40px_rgba(0,49,50,0.02)]`; `border-b`; `border-[#EEEEF0]`; `bg-[#F9F9FB]`; `border-[#E2E2E4]`; `text-[#3D4949]`; `text-black`; `rounded-[clamp(1.1rem,2.29vw,2.75rem)]`; `border-2`; `border-white`; `border-t-transparent` |
| Interaction / motion | `hover:bg-gray-50`; `transition-colors`; `transition-all`; `disabled:opacity-50`; `animate-spin` |

| Inline style source line | Exact declaration |
| --- | --- |
| 94 | `style={{ width: isDraft ? "clamp(3.77rem,7.85vw,9.0rem)" : "clamp(4.53rem,9.44vw,11.0rem)" }}` |
| 208 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 206 | `disabled={isVerifying}` |

**Literal palette:** `#000000`, `#1A1C1D`, `#2A3008`, `#2C2C2C`, `#3D4949`, `#3D4A0D`, `#BCC9C9`, `#E2E2E4`, `#EEEEF0`, `#EF4646`, `#F1F5F9`, `#F9F9FB`, `rgba(0,49,50,0.02)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx).

**Named declarations:** `UploadFile`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 30 | `relative w-full shrink-0 min-h-[70px] bg-[#F6F9E2] rounded-[12px] mb-[4px] group flex flex-row items-center px-4 py-3 gap-4` |
| 31 | `flex items-center justify-center bg-white w-[38px] h-[38px] rounded-[4px] shrink-0` |
| 32 | `w-[20px] h-[20px]` |

<details><summary>Props / reusable interface</summary>

```tsx
export interface UploadFileProps {
  uploadedFiles: UploadedFileItem[];
  onFileUpload: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
  onUploadClick?: () => void; // Optional custom click handler
  groupByImageType?: boolean; // Optional flag to group files by imageType
  hideDropzone?: boolean; // Optional flag to hide the drag-and-drop zone
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `shrink-0`; `group`; `flex`; `flex-row`; `items-center`; `justify-center`; `flex-col`; `flex-1`; `block`; `cursor-pointer`; `grid-cols-1`; `items-start`; `hidden`; `absolute`; `overflow-y-auto` |
| Size & spacing | `w-full`; `min-h-[70px]`; `mb-[4px]`; `px-4`; `py-3`; `gap-4`; `w-[38px]`; `h-[38px]`; `w-[20px]`; `h-[20px]`; `min-w-0`; `mt-1`; `gap-2`; `w-[34px]`; `h-[34px]`; `h-3`; `w-3`; `gap-6`; `w-[50px]`; `h-[50px]`; `mb-3`; `w-[36px]`; `h-[36px]`; `w-[18px]`; `h-[18px]`; `mb-1`; `max-w-[250px]`; `mb-4`; `px-6`; `py-2`; `mb-6`; `bottom-3`; `left-4`; `gap-1`; `w-[12px]`; `h-[12px]`; `right-4`; `m-0`; `gap-3`; `max-h-[300px]`; `pr-2` |
| Type | `truncate`; `font-[`; `font-normal`; `text-[16px]`; `leading-[20px]`; `text-[12px]`; `font-sans`; `font-bold`; `text-lg`; `text-xs`; `text-center`; `font-medium`; `text-sm`; `text-[11px]`; `font-semibold`; `capitalize`; `font-['Inter',_sans-serif]` |
| Appearance | `bg-[#F6F9E2]`; `rounded-[12px]`; `bg-white`; `rounded-[4px]`; `text-black`; `text-[rgba(0,0,0,0.7)]`; `rounded`; `border-none`; `rounded-full`; `border-b-2`; `border-blue-500`; `text-[rgba(0,0,0,0.82)]`; `bg-[#F3F4F1]`; `bg-[#F9FAFB]`; `bg-[#E6EEAD]`; `bg-[#2A3008]`; `shadow-[0px_4px_10px_rgba(0,0,0,0.15)]`; `text-white`; `text-[#1A1C1D]`; `text-[#414755]`; `shadow-md`; `text-gray-500`; `text-gray-400`; `text-[rgba(0,_0,_0,_0.8)]` |
| Interaction / motion | `hover:bg-blue-50`; `hover:text-blue-500`; `transition-colors`; `disabled:opacity-50`; `animate-spin`; `hover:bg-red-50`; `hover:text-red-500`; `hover:scale-105`; `active:scale-95`; `transition-all` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 54 | `disabled={isDownloading}` |
| 58 | `{isDownloading ? (` |
| 195 | `accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*"` |
| 264 | `{uploadedFiles.length === 0 ? (` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#414755`, `#BDD327`, `#E1E5EF`, `#E6EEAD`, `#F3F4F1`, `#F6F9E2`, `#F9FAFB`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.7)`, `rgba(0,0,0,0.82)`, `rgba(0,_0,_0,_0.8)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFilesDocument.tsx).

**Purpose:** Dispatch to the active report-specific upload form; this module does not own its own visual wrapper.

**Named declarations:** `UploadFilesDocument`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/LegalUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LegalUploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/ValuationUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/ValuationUploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx).

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadFilesDocumentProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep?: boolean;
  isUploading?: boolean;
  hasCoverImage?: boolean;
  coordinatesValue?: string;
  onCoordinatesChange?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  selectedSoilType?: string;
  onSoilTypeChange?: (val: string) => void;
  selectedCropType?: string;
  onCropTypeChange?: (val: string) => void;
  waterLevelValue?: string;
  onWaterLevelChange?: (val: string) => void;
  selectedFutureCrops?: string;
  onFutureCropsChange?: (val: string) => void;
  yieldCostValue?: string;
  onYieldCostChange?: (val: string) => void;
  yieldReturnsValue?: string;
  onYieldReturnsChange?: (val: string) => void;
  cultivationTypeValue?: string;
  onCultivationTypeChange?: (val: string) => void;
  cultivationNameValue?: string;
  onCultivationNameChange?: (val: string) => void;
  cultivationContactValue?: string;
  onCultivationContactChange?: (val: string) => void;
  maintenanceCropValue?: string;
  onMaintenanceCropChange?: (val: string) => void;
  maintenanceReturnsValue?: string;
  onMaintenanceReturnsChange?: (val: string) => void;
  advantagesValue?: string;
  onAdvantagesChange?: (val: string) => void;
  disadvantagesValue?: string;
  onDisadvantagesChange?: (val: string) => void;
  landShapeValue?: string;
  onLandShapeChange?: (val: string) => void;
  facilityAvailabilityValue?: string;
  onFacilityAvailabilityChange?: (val: string) => void;
  waterFacilityValue?: string;
  onWaterFacilityChange?: (val: string) => void;
  ownerMindsetOptions?: any[];
  shapeOfTheLandOptions?: any[];
  treesCountOptions?: any[];
  boundariesOptions?: any[];
  electricityFacilityValue?: string;
  onElectricityFacilityChange?: (val: string) => void;
  treesAvailabilityValue?: string;
  onTreesAvailabilityChange?: (val: string) => void;
  treesCountValue?: string;
  onTreesCountChange?: (val: string) => void;
  surveyReportTypeValue?: string;
  onSurveyReportTypeChange?: (val: string) => void;
  privateSurveyFiles?: UploadedFileItem[];
  onPrivateSurveyFileUpload?: (files: FileList) => void;
  onPrivateSurveyFileDelete?: (id: string) => void;
  governmentSurveyFiles?: UploadedFileItem[];
  onGovernmentSurveyFileUpload?: (files: FileList) => void;
  onGovernmentSurveyFileDelete?: (id: string) => void;
  privateSurveyCommentValue?: string;
  onPrivateSurveyCommentChange?: (val: string) => void;
  governmentSurveyCommentValue?: string;
  onGovernmentSurveyCommentChange?: (val: string) => void;
  boundaryTypeValue?: string;
  onBoundaryTypeChange?: (val: string) => void;
  boundaryOwnerNameValue?: string;
  onBoundaryOwnerNameChange?: (val: string) => void;
  boundaryOwnerAgeValue?: string;
  onBoundaryOwnerAgeChange?: (val: string) => void;
  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;
  boundaryTreesCountValue?: string;
  onBoundaryTreesCountChange?: (val: string) => void;
  recentTransactionTypeValue?: string;
  onRecentTransactionTypeChange?: (val: string) => void;
  valuationPerAcreValue?: string;
  onValuationPerAcreChange?: (val: string) => void;
  localMarketPriceValue?: string;
  onLocalMarketPriceChange?: (val: string) => void;
  geologicalAdvantagesTypeValue?: string;
  onGeologicalAdvantagesTypeChange?: (val: string) => void;
  upcomingInfrastructuresValue?: string;
  onUpcomingInfrastructuresChange?: (val: string) => void;
  railwayConnectivityTypeValue?: string;
  onRailwayConnectivityTypeChange?: (val: string) => void;
  railwayDistanceValue?: string;
  onRailwayDistanceChange?: (val: string) => void;
  airportConnectivityTypeValue?: string;
  onAirportConnectivityTypeChange?: (val: string) => void;
  airportDistanceValue?: string;
  onAirportDistanceChange?: (val: string) => void;
  anyIssuesTypeValue?: string;
  onAnyIssuesTypeChange?: (val: string) => void;
  localLiabilitiesTypeValue?: string;
  onLocalLiabilitiesTypeChange?: (val: string) => void;
  pendingLoansTypeValue?: string;
  onPendingLoansTypeChange?: (val: string) => void;
  pendingLoansAmountValue?: string;
  onPendingLoansAmountChange?: (val: string) => void;
  ownerMindsetValue?: string;
  onOwnerMindsetChange?: (val: string) => void;
  sourcePersonTypeValue?: string;
  onSourcePersonTypeChange?: (val: string) => void;
  sourcePersonNameValue?: string;
  onSourcePersonNameChange?: (val: string) => void;
  sourcePersonMobileValue?: string;
  onSourcePersonMobileChange?: (val: string) => void;
  agreementPaperValue?: string;
  onAgreementPaperChange?: (val: string) => void;
  agreementTypeValue?: string;
  onAgreementTypeChange?: (val: string) => void;
  agreementPriceValue?: string;
  onAgreementPriceChange?: (val: string) => void;
  prevTransactionsTypeValue?: string;
  onPrevTransactionsTypeChange?: (val: string) => void;
  prevTransactionsPriceValue?: string;
  onPrevTransactionsPriceChange?: (val: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `grown` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 327 | `if (props.isUploading) {` |

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadGoBack.tsx).

**Purpose:** Provide a locally styled back affordance with caller navigation.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 15 | `text-[#353535]` |
| 16 | `font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.53rem,1.1vw,1.125rem)] leading-none text-[#353535]` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadGoBackProps {
  onClick: () => void;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `cursor-pointer` |
| Size & spacing | `gap-[clamp(0.29rem,0.6vw,0.75rem)]`; `px-[clamp(0.72rem,1.5vw,1.75rem)]`; `h-[clamp(1.44rem,3vw,3.25rem)]` |
| Type | `font-[`; `font-normal`; `text-[clamp(0.53rem,1.1vw,1.125rem)]`; `leading-none`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[clamp(1.44rem,3vw,3.75rem)]`; `shadow-[0px_0px_4px_rgba(0,0,0,0.12)]`; `text-[#353535]` |
| Interaction / motion | `hover:bg-gray-50`; `transition-all` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#353535`, `rgba(0,0,0,0.12)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx).

**Purpose:** Display fetched land attributes and imagery within customer information.

**Named declarations:** `UploadLandDetailsTab`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 26 | `flex-1 flex flex-col items-center justify-center py-[clamp(0.5rem,1.5vw,2rem)] w-full` |
| 27 | `animate-spin rounded-full h-8 w-8 border-b-2 border-[#A3C33D]` |
| 28 | `ml-3 text-gray-500 font-medium` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadLandDetailsTabProps {
  farmlandId: number;
  setActiveTab: (tab: "owner" | "family" | "land") => void;
  onNextClick: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex-1`; `flex`; `flex-col`; `items-center`; `justify-center`; `relative`; `overflow-y-auto`; `grid-cols-1`; `md:grid-cols-[1fr_auto_1fr]`; `aspect-[417/306]`; `overflow-hidden`; `shrink-0`; `object-cover`; `flex-row`; `justify-end`; `cursor-pointer`; `grid` |
| Size & spacing | `py-[clamp(0.5rem,1.5vw,2rem)]`; `w-full`; `h-8`; `w-8`; `ml-3`; `h-full`; `px-6`; `py-4`; `md:px-8`; `md:py-4`; `mb-4`; `md:mb-6`; `gap-4`; `md:gap-8`; `gap-6`; `gap-1`; `max-w-[200px]`; `md:max-w-[280px]`; `mx-auto`; `md:py-6`; `px-8`; `py-3`; `min-w-[120px]` |
| Type | `font-medium`; `font-sans`; `font-bold`; `text-xs`; `md:text-sm`; `tracking-wide`; `uppercase`; `text-center`; `text-left`; `md:text-right`; `text-[10px]`; `tracking-wider`; `text-sm`; `md:text-base`; `break-words`; `font-normal` |
| Appearance | `rounded-full`; `border-b-2`; `border-[#A3C33D]`; `text-gray-500`; `text-[#5A5C5E]`; `text-[#8A96A3]`; `text-[#9BB424]`; `rounded-xl`; `md:rounded-2xl`; `border`; `border-white/50`; `shadow-sm`; `bg-[#F1F5F9]`; `border-t`; `border-gray-100`; `bg-white`; `text-black`; `text-white`; `shadow-lg` |
| Interaction / motion | `animate-spin`; `animate-in`; `fade-in`; `duration-300`; `hover:opacity-75`; `hover:scale-105`; `active:scale-95` |

| Inline style source line | Exact declaration |
| --- | --- |
| 143 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 24 | `if (isLandDetailsLoading \|\| locationNames.isLoading) {` |

**Literal palette:** `#2A3008`, `#3D4A0D`, `#5A5C5E`, `#8A96A3`, `#9BB424`, `#A3C33D`, `#F1F5F9`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx).

**Named declarations:** `UploadMemberEditModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 112 | `fixed inset-0 z-50 flex items-center justify-center bg-black/20 font-plus-jakarta p-4` |
| 113 | `bg-white rounded-3xl w-[420px] max-w-full max-h-[90vh] flex flex-col shadow-xl relative animate-in fade-in zoom-in duration-200` |
| 116 | `flex items-center justify-between p-6 md:p-8 pb-4 shrink-0 border-b border-gray-50` |

<details><summary>Props / reusable interface</summary>

```tsx
interface Props {
  role: ModalRole;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  existingMembers?: any[];
  initialData?: any;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `z-50`; `flex`; `items-center`; `justify-center`; `flex-col`; `relative`; `justify-between`; `shrink-0`; `cursor-pointer`; `flex-1`; `overflow-y-auto`; `custom-scrollbar`; `group`; `hidden`; `overflow-hidden`; `object-cover`; `absolute`; `z-10`; `appearance-none`; `pointer-events-none`; `placeholder:text-[#94A3B8]`; `justify-end`; `flex-row` |
| Size & spacing | `inset-0`; `p-4`; `w-[420px]`; `max-w-full`; `max-h-[90vh]`; `p-6`; `md:p-8`; `pb-4`; `w-5`; `h-5`; `px-6`; `md:px-8`; `py-6`; `mb-8`; `w-[110px]`; `h-[110px]`; `w-full`; `h-full`; `mt-1`; `-bottom-1`; `-right-1`; `w-[38px]`; `h-[38px]`; `w-4`; `h-4`; `gap-2`; `mb-5`; `px-4`; `py-3`; `right-4`; `top-3.5`; `gap-4`; `mb-1.5`; `mb-6`; `gap-3`; `pt-4` |
| Type | `font-plus-jakarta`; `text-[15px]`; `font-bold`; `text-[34px]`; `font-light`; `leading-[1]`; `text-[10px]`; `font-medium`; `tracking-wide`; `text-[13px]` |
| Appearance | `bg-black/20`; `bg-white`; `rounded-3xl`; `shadow-xl`; `border-b`; `border-gray-50`; `text-[#1A1C1D]`; `text-[#64748B]`; `border-none`; `bg-transparent`; `rounded-full`; `border-[3px]`; `border-dashed`; `border-[#BCC6BC]`; `text-[#0B6230]`; `bg-[#0B6230]`; `border-[4px]`; `border-white`; `shadow-sm`; `text-white`; `text-[#475569]`; `bg-[#F8FAFC]`; `border`; `border-transparent`; `rounded-[8px]`; `outline-none`; `border-t`; `border-gray-200`; `bg-[#2D3409]` |
| Interaction / motion | `animate-in`; `fade-in`; `zoom-in`; `duration-200`; `hover:text-[#1A1C1D]`; `transition-colors`; `group-hover:bg-[#f2f8f2]`; `focus:bg-white`; `focus:border-[#E2E8F0]`; `slide-in-from-top-2`; `hover:bg-gray-50`; `hover:bg-[#3D4A0D]` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 131 | `accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*"` |
| 229 | `maxLength={50}` |
| 242 | `maxLength={50}` |
| 272 | `maxLength={50}` |

**Literal palette:** `#0B6230`, `#1A1C1D`, `#2D3409`, `#3D4A0D`, `#475569`, `#64748B`, `#94A3B8`, `#BCC6BC`, `#E2E8F0`, `#F8FAFC`, `#f2f8f2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx).

**Named declarations:** `UploadOwnerDetailsForm`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 38 | `h-full flex flex-col w-full relative` |
| 39 | `flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6 w-full` |
| 40 | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8 w-full` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadOwnerDetailsFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  onDismiss?: () => void;
  onSubmit: (e: React.FormEvent) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `relative`; `flex-1`; `overflow-y-auto`; `grid-cols-1`; `md:grid-cols-2`; `lg:grid-cols-3`; `placeholder:text-gray-400`; `overflow-hidden`; `absolute`; `-translate-y-1/2`; `box-sizing-border-box`; `appearance-none`; `cursor-pointer`; `pointer-events-none`; `items-center`; `flex-row`; `justify-end`; `shrink-0`; `justify-center`; `grid` |
| Size & spacing | `h-full`; `w-full`; `px-6`; `py-4`; `md:px-8`; `md:py-6`; `gap-x-6`; `md:gap-x-10`; `gap-y-6`; `md:gap-y-8`; `gap-2`; `h-10`; `md:h-12`; `px-4`; `py-2`; `pl-10`; `md:pl-11`; `pr-4`; `w-4`; `h-4`; `left-3.5`; `md:left-4`; `top-1/2`; `gap-[clamp(0.27rem,0.56vw,0.8rem)]`; `h-[clamp(1.67rem,3.47vw,4.0rem)]`; `px-[clamp(0.53rem,1.11vw,1.5rem)]`; `py-[clamp(0.4rem,0.83vw,1.1rem)]`; `pl-4`; `pr-10`; `inset-y-0`; `right-0`; `gap-6`; `px-8`; `py-3`; `min-w-[120px]` |
| Type | `font-sans`; `font-semibold`; `text-[10px]`; `md:text-xs`; `leading-tight`; `tracking-[0.35px]`; `uppercase`; `font-normal`; `text-xs`; `md:text-sm`; `font-[`; `text-[clamp(0.47rem,0.97vw,1.15rem)]`; `text-[clamp(0.53rem,1.11vw,1.35rem)]`; `font-medium`; `tracking-wider`; `text-sm`; `md:text-base`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `text-[#3D4949]`; `bg-[#F3F3F5]`; `rounded-xl`; `outline-none`; `text-[#1A1C1D]`; `border`; `border-transparent`; `rounded-2xl`; `rounded-[clamp(0.8rem,1.67vw,2.0rem)]`; `border-t`; `border-gray-100`; `bg-white`; `text-black`; `text-white`; `rounded-full`; `shadow-lg` |
| Interaction / motion | `focus:border-[#2D3409]/30`; `transition-all`; `hover:underline`; `hover:scale-105`; `active:scale-95` |

| Inline style source line | Exact declaration |
| --- | --- |
| 194 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 52 | `maxLength={50}` |
| 68 | `maxLength={50}` |
| 84 | `maxLength={10}` |
| 106 | `maxLength={50}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2D3409`, `#3D4949`, `#3D4A0D`, `#F3F3F5`, `rgba(26,28,29,0.24)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx).

**Named declarations:** `UploadProfileAvatar`.

**Composition:** [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 38 | `flex items-center justify-center bg-white rounded-[40px] border-none cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0px_0px_4px_rgba(0,0,0,0.12)] shrink-0 w-[clamp(1.73rem,_3.61vw,_4.33rem)] h-[clamp(1.73rem,_3.61vw,_4.33rem)] p-2` |
| 44 | `w-[24px] h-[24px] relative` |
| 70 | `bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[0px_0px_4px_rgba(0,0,0,0.12)] shrink-0 w-[clamp(1.73rem,_3.61vw,_4.33rem)] h-[clamp(1.73rem,_3.61vw,_4.33rem)] cursor-pointer hover:scale-105 active:scale-95 transition-transform` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadProfileAvatarProps {
  className?: string;
  style?: React.CSSProperties;
  avatarUrl?: string;
  onNotificationsClick?: () => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-row`; `items-center`; `select-none`; `relative`; `justify-center`; `cursor-pointer`; `shrink-0`; `overflow-hidden`; `object-cover` |
| Size & spacing | `p-0`; `gap-[clamp(0.44rem,_0.91vw,_1.09rem)]`; `w-[clamp(3.9rem,_8.13vw,_9.75rem)]`; `h-[clamp(1.73rem,_3.61vw,_4.33rem)]`; `w-[clamp(1.73rem,_3.61vw,_4.33rem)]`; `p-2`; `w-[24px]`; `h-[24px]`; `w-full`; `h-full` |
| Appearance | `bg-white`; `rounded-[40px]`; `border-none`; `shadow-[0px_0px_4px_rgba(0,0,0,0.12)]`; `rounded-full` |
| Interaction / motion | `transition-all`; `hover:scale-105`; `active:scale-95`; `transition-transform` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#2C2C2C`, `#EF4646`, `rgba(0,0,0,0.12)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx).

**Purpose:** Show the compact document-workflow timeline.

**Named declarations:** `UploadShortTimelineSidebar`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 60 | `flex flex-col gap-1 mb-8` |
| 61 | `font-['Plus_Jakarta_Sans'] font-medium text-[0.85rem] leading-tight text-[#1A1C1D]` |
| 64 | `font-['Plus_Jakarta_Sans'] text-[1.6rem] leading-tight text-[#1A1C1D] font-medium break-all` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadShortTimelineSidebarProps {
  farmlandId: string;
  activeStep: UploadStepId;
  style?: React.CSSProperties;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `relative`; `box-border`; `flex`; `flex-col`; `select-none`; `shrink-0`; `overflow-y-auto`; `absolute`; `flex-row`; `items-center`; `z-10`; `cursor-pointer`; `justify-center` |
| Size & spacing | `px-8`; `py-10`; `gap-1`; `mb-8`; `left-[9px]`; `top-[14px]`; `bottom-[14px]`; `w-0`; `gap-6`; `py-[22px]`; `w-[18px]`; `h-[18px]`; `w-[20px]`; `h-[20px]`; `w-[10px]`; `h-[10px]`; `w-full`; `h-full`; `w-[8px]`; `h-[8px]`; `pr-4` |
| Type | `font-[`; `font-medium`; `text-[0.85rem]`; `leading-tight`; `text-[1.6rem]`; `break-all`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[24px]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `text-[#1A1C1D]`; `border-l`; `border-[rgba(44,44,44,0.15)]`; `rounded-full`; `bg-[#BDD327]`; `bg-[#2D3409]`; `border-[2px]`; `border-[rgba(122,_149,_28,_0.8)]`; `shadow-[0_0_0_4px_rgba(189,_211,_39,_0.38)]`; `border-[#BDD327]`; `text-[#2A3008]`; `text-[#8C9088]` |
| Interaction / motion | `hover:opacity-80`; `transition-opacity` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2D3409`, `#8C9088`, `#BDD327`, `rgba(0,49,50,0.06)`, `rgba(122,_149,_28,_0.8)`, `rgba(189,_211,_39,_0.38)`, `rgba(44,44,44,0.15)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx).

**Named declarations:** `UploadSubmittedModal`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 19 | `fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200` |
| 22 | `box-sizing-border-box bg-white border border-[rgba(0,0,0,0.2)] shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)] rounded-[24px] flex flex-col items-center justify-between p-8 relative animate-in zoom-in-95 duration-200` |
| 29 | `font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.8rem,1.67vw,1.5rem)] text-black text-center mt-2` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadSubmittedModalProps {

  onProceed: () => void;
  onDismiss: () => void;
  title?: string;
  description?: React.ReactNode;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `fixed`; `flex`; `items-center`; `justify-center`; `z-[9999]`; `box-sizing-border-box`; `flex-col`; `justify-between`; `relative`; `shrink-0`; `cursor-pointer` |
| Size & spacing | `inset-0`; `p-8`; `mt-2`; `w-[clamp(6rem,12.5vw,11.25rem)]`; `h-[clamp(6rem,12.5vw,11.25rem)]`; `w-[clamp(4.2rem,8.75vw,7.875rem)]`; `h-[clamp(4.2rem,8.75vw,7.875rem)]`; `w-full`; `h-full`; `max-w-[319px]`; `w-[clamp(13.27rem,27.64vw,24.875rem)]`; `h-[clamp(1.87rem,3.89vw,3.5rem)]`; `mb-2` |
| Type | `font-[`; `font-semibold`; `text-[clamp(0.8rem,1.67vw,1.5rem)]`; `text-center`; `text-[clamp(0.67rem,1.39vw,1.25rem)]`; `leading-snug`; `font-normal`; `text-[clamp(0.6rem,1.25vw,1.125rem)]`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.2)]`; `shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)]`; `rounded-[24px]`; `text-black`; `bg-[#2A3008]/[0.08]`; `rounded-full`; `text-[#BDD327]`; `text-[#3D4949]`; `text-[#0052cc]`; `text-white`; `rounded-[57px]`; `shadow-lg` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `zoom-in-95`; `hover:underline`; `hover:scale-105`; `active:scale-95` |

| Inline style source line | Exact declaration |
| --- | --- |
| 23 | `style={{ width: "clamp(17.97rem, 37.43vw, 33.6875rem)", // 539px max height: "clamp(16.5rem, 34.38vw, 30.9375rem)", // 495px max }}` |
| 58 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)" }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Literal palette:** `#0052cc`, `#2A3008`, `#3D4949`, `#3D4A0D`, `#BDD327`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.2)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx

**Coverage:** [x] source audited. **Reachability:** Outside active entry import graph; alternative/unused module. **Source:** [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx).

**Purpose:** Show the alternative larger document timeline with Outfit declarations.

**Named declarations:** `UploadTimelineSidebar`.

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 46 | `flex flex-col mb-[clamp(1.5rem,3.1vw,3.75rem)] w-full` |
| 47 | `font-['Outfit'] font-normal text-[clamp(0.6rem,1.25vw,1.5rem)] text-gray-900 leading-none` |
| 50 | `font-['Outfit'] font-normal text-[clamp(1.5rem,3vw,3.5rem)] text-gray-900 leading-none break-all mt-1` |

<details><summary>Props / reusable interface</summary>

```tsx
interface UploadTimelineSidebarProps {
  farmlandId: string;
  activeStep: UploadStepId;
  style?: React.CSSProperties;
  className?: string;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `flex-col`; `select-none`; `shrink-0`; `relative`; `flex-1`; `justify-between`; `absolute`; `flex-row`; `items-center`; `z-10`; `justify-center` |
| Size & spacing | `p-[clamp(1.07rem,2.22vw,2.5rem)]`; `w-full`; `md:w-[clamp(13.68rem,28.5vw,28.0rem)]`; `mb-[clamp(1.5rem,3.1vw,3.75rem)]`; `mt-1`; `py-2`; `pl-1`; `min-h-[clamp(16.66rem,34.7vw,36.0rem)]`; `gap-[clamp(0.8rem,1.67vw,2.0rem)]`; `w-[clamp(0.73rem,1.53vw,1.65rem)]`; `h-[clamp(0.73rem,1.53vw,1.65rem)]`; `inset-0`; `w-[clamp(0.47rem,0.97vw,1.1rem)]`; `h-[clamp(0.47rem,0.97vw,1.1rem)]` |
| Type | `font-[`; `font-normal`; `text-[clamp(0.6rem,1.25vw,1.5rem)]`; `leading-none`; `text-[clamp(1.5rem,3vw,3.5rem)]`; `break-all`; `font-semibold`; `uppercase`; `tracking-wider`; `text-left`; `font-['Outfit']`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-white`; `rounded-[clamp(0.8rem,1.67vw,2.0rem)]`; `shadow-[0px_20px_40px_rgba(0,49,50,0.06)]`; `text-gray-900`; `border-l`; `border-[rgba(44,44,44,0.25)]`; `rounded-full`; `border-box` |
| Interaction / motion | `transition-all`; `duration-300` |

| Inline style source line | Exact declaration |
| --- | --- |
| 40 | `style={{ minHeight: "clamp(27.36rem,57vw,58.0rem)", ...style }}` |
| 61 | `style={{ left: "clamp(0.36rem,0.76vw,0.85rem)", top: "16px", bottom: "16px", width: "0px" }}` |
| 84 | `style={{ background: "rgba(255, 255, 255, 0.002)", boxShadow: "0px 0px 0px clamp(4px,0.42vw,8px) rgba(189, 211, 39, 0.38)" }}` |
| 92 | `style={{ boxSizing: "border-box", backgroundColor: isActive ? "#2D3409" : "#C0C2B7", border: isActive ? "2px solid rgba(122, 149, 28, 0.8)" : "2px solid #CAD69F", }}` |
| 103 | `style={{ fontSize: isActive ? "clamp(0.6rem,1.25vw,1.6rem)" : "clamp(0.47rem,0.97vw,1.2rem)", color: isActive ? "#2A3008" : "#5A5C5E", }}` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

**Literal palette:** `#2A3008`, `#2D3409`, `#5A5C5E`, `#C0C2B7`, `#CAD69F`, `rgba(0,49,50,0.06)`, `rgba(122, 149, 28, 0.8)`, `rgba(189, 211, 39, 0.38)`, `rgba(255, 255, 255, 0.002)`, `rgba(44,44,44,0.25)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/components/ValuationUploadFile.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/components/ValuationUploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/ValuationUploadFile.tsx).

**Named declarations:** `ValuationUploadFile`.

**Composition:** [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx), [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 98 | `px-6 py-6 shrink-0` |
| 99 | `text-black font-sans font-bold text-base md:text-lg m-0 leading-tight` |
| 102 | `text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1` |

<details><summary>Props / reusable interface</summary>

```tsx
interface ValuationUploadFileProps {
  activeTabLabel: string;
  uploadedFiles: UploadedFileItem[];
  commentValue: string;
  onCommentChange: (val: string) => void;
  onFileUpload: (files: FileList, imageType?: "cover" | "land") => void;
  onFileDelete: (fileId: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  isFinishStep: boolean;
  isNextEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  boundaryRoadTypeValue?: string;
  onBoundaryRoadTypeChange?: (val: string) => void;
  boundaryRoadWidthValue?: string;
  onBoundaryRoadWidthChange?: (val: string) => void;

  recentTransactionTypeValue?: string;
  onRecentTransactionTypeChange?: (val: string) => void;
  valuationPerAcreValue?: string;
  onValuationPerAcreChange?: (val: string) => void;
  localMarketPriceValue?: string;
  onLocalMarketPriceChange?: (val: string) => void;

  geologicalAdvantagesTypeValue?: string;
  onGeologicalAdvantagesTypeChange?: (val: string) => void;

  upcomingInfrastructuresValue?: string;
  onUpcomingInfrastructuresChange?: (val: string) => void;

  railwayConnectivityTypeValue?: string;
  onRailwayConnectivityTypeChange?: (val: string) => void;
  railwayDistanceValue?: string;
  onRailwayDistanceChange?: (val: string) => void;

  airportConnectivityTypeValue?: string;
  onAirportConnectivityTypeChange?: (val: string) => void;
  airportDistanceValue?: string;
  onAirportDistanceChange?: (val: string) => void;
}
```

</details>

| Specification | Existing declarations |
| --- | --- |
| Layout | `select-none`; `flex`; `flex-col`; `overflow-hidden`; `shrink-0`; `flex-1`; `overflow-y-auto`; `flex-row`; `items-center`; `relative`; `appearance-none`; `cursor-pointer`; `absolute`; `-translate-y-1/2`; `pointer-events-none`; `justify-end`; `justify-center`; `box-border` |
| Size & spacing | `w-full`; `h-full`; `px-6`; `py-6`; `m-0`; `mt-1`; `md:px-8`; `md:py-8`; `gap-8`; `gap-6`; `gap-3`; `gap-4`; `h-[48px]`; `px-4`; `right-4`; `top-1/2`; `mt-4`; `py-4`; `md:py-6`; `w-28`; `md:w-32`; `min-h-11`; `md:min-h-12` |
| Type | `font-sans`; `font-bold`; `text-base`; `md:text-lg`; `leading-tight`; `text-xs`; `md:text-sm`; `font-semibold`; `text-[16px]`; `text-[14px]`; `text-sm`; `md:text-base` |
| Appearance | `bg-white`; `rounded-3xl`; `text-black`; `text-[#8C9088]`; `border-t`; `border-gray-100`; `border-[#2B2D2F]`; `bg-[#2B2D2F]`; `text-white`; `border-gray-300`; `border-white`; `bg-[#BDD327]`; `border-[#BDD327]`; `text-gray-700`; `border`; `border-[rgba(0,0,0,0.3)]`; `rounded-[8px]`; `outline-none`; `text-[#1A1C1D]`; `border-[#D0D5DD]`; `rounded-full`; `bg-[#2A3008]`; `border-none` |
| Interaction / motion | `focus:border-[#BDD327]`; `animate-in`; `fade-in`; `duration-200`; `focus:outline-none`; `hover:bg-gray-50`; `active:scale-95`; `transition-all` |

**Responsive:** Breakpoint-prefixed declarations are listed above; layout changes apply only to their target element. No module-wide mobile guarantee is inferred.

| State/control source line | Evidence |
| --- | --- |
| 161 | `maxLength={50}` |
| 216 | `maxLength={50}` |
| 227 | `maxLength={50}` |
| 463 | `disabled={!isNextEnabled}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#2B2D2F`, `#363434`, `#8C9088`, `#BDD327`, `#D0D5DD`, `rgba(0,0,0,0.3)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

#### Shell, entry, routing and notification modules

##### src/App.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/App.tsx](src/App.tsx).

**Composition:** [src/app/router/AppRouter.tsx](src/app/router/AppRouter.tsx), [src/core/firebase/NotificationHandler.tsx](src/core/firebase/NotificationHandler.tsx).

| Specification | Existing declarations |
| --- | --- |
| Size & spacing | `top-right` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/AppRouter.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/AppRouter.tsx](src/app/router/AppRouter.tsx).

**Named declarations:** `AppRouter`.

**Composition:** [src/app/router/AuthGuard.tsx](src/app/router/AuthGuard.tsx), [src/app/router/GuestGuard.tsx](src/app/router/GuestGuard.tsx), [src/app/router/routes.definitions.tsx](src/app/router/routes.definitions.tsx), [src/components/common/RouteErrorBoundary.tsx](src/components/common/RouteErrorBoundary.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 10 | `flex min-h-screen items-center justify-center bg-gray-50/50 backdrop-blur-sm` |
| 11 | `flex flex-col items-center gap-4` |
| 12 | `h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `flex`; `items-center`; `justify-center`; `flex-col` |
| Size & spacing | `min-h-screen`; `gap-4`; `h-10`; `w-10` |
| Type | `text-sm`; `font-medium` |
| Appearance | `bg-gray-50/50`; `backdrop-blur-sm`; `rounded-full`; `border-4`; `border-primary`; `border-t-transparent`; `text-muted-foreground` |
| Interaction / motion | `animate-spin`; `animate-pulse` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/AuthGuard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/AuthGuard.tsx](src/app/router/AuthGuard.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/DashboardRedirect.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/DashboardRedirect.tsx](src/app/router/DashboardRedirect.tsx).

**Routes:** `/`.

**Named declarations:** `DashboardRedirect`.

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/GuestGuard.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/GuestGuard.tsx](src/app/router/GuestGuard.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/routes.config.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/routes.config.tsx](src/app/router/routes.config.tsx).

**Named declarations:** `SuperAdminDashboard`, `SuperAdminLogin`, `SuperAdminFarmlands`, `SuperAdminFarmlandsListPreview`, `SuperAdminFarmlandsListFull`, `SuperAdminDraftFarmlands`, `SuperAdminUsersListFull`, `SuperAdminUsersListAll`, `SuperAdminEditFarmlandTag`, `SuperAdminAssignedFarmlandsList`, `SuperAdminAssignedFarmlandDetails`, `SuperAdminUserProfile`, `SuperAdminTopPerformers`, `SuperAdminFarmlandDetails`, `SuperAdminAgentProfile`, `SuperAdminProfile`, `SuperAdminPoolBuying`, `SuperAdminPoolCreate`, `SuperAdminPoolBuyingAll`, `SuperAdminPoolDetails`, `SuperAdminPoolInvestorDetails`, `SuperAdminPoolPublished`, `SuperAdminPoolCreated`, `FarmLandDocsVerificationRoot`, `SuperAdminCustomerInformation`, `SuperAdminLegalDocuments`, `SuperAdminAgricultureReport`, `SuperAdminLandBoundaries`, `SuperAdminValuation`, `SuperAdminLocalIntelligence`, `UploadSuperAdmin`, `SuperAdminUploadLandDetails`, `SuperAdminUploadViewMaps`, `SuperAdminUploadCustomerInformation`, `UploadDocsRoot`, `UploadLegalDocuments`, `UploadAgricultureReport`, `UploadLandBoundaries`, `UploadValuation`, `UploadLocalIntelligence`, `MaintenanceDashboard`, `MaintenanceLogin`, `MaintenanceServiceRequests`, `MaintenanceVerifyRequest`, `MaintenanceQuotationDetails`, `MaintenanceCustomerResponseDetails`, `MaintenanceWorkOrders`, `MaintenanceProfile`.

**Composition:** [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminLogin.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx), [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx), [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx), [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/index.tsx](src/features/super-admin/sub-features/farmLandDocsverification/index.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx](src/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx), [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx), [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx), [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation.tsx), [src/features/super-admin/sub-features/upload-docs/index.tsx](src/features/super-admin/sub-features/upload-docs/index.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadValuation.tsx), [src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx](src/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx), [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/app/router/routes.definitions.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/app/router/routes.definitions.tsx](src/app/router/routes.definitions.tsx).

**Named declarations:** `guestRoutes`, `authRoutes`, `publicRoutes`.

**Composition:** [src/components/common/layouts/RootLayout.tsx](src/components/common/layouts/RootLayout.tsx), [src/app/router/DashboardRedirect.tsx](src/app/router/DashboardRedirect.tsx), [src/app/router/routes.config.tsx](src/app/router/routes.config.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/core/firebase/NotificationHandler.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/core/firebase/NotificationHandler.tsx](src/core/firebase/NotificationHandler.tsx).

**Named declarations:** `NotificationHandler`.

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 55 | `} catch (error) {` |
| 83 | `} catch (error) {` |

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/farmLandDocsverification/index.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/farmLandDocsverification/index.tsx](src/features/super-admin/sub-features/farmLandDocsverification/index.tsx).

**Routes:** `/super-admin/assigned-farmlands/:id`.

**Named declarations:** `FarmLandDocsVerificationRoot`.

**Composition:** [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx), [src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx](src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 112 | `h-screen overflow-hidden bg-[#F2F2F2] font-sans flex flex-col` |
| 114 | `flex items-center justify-between px-10 pt-8 pb-4 shrink-0 w-full` |
| 119 | `flex items-stretch gap-5 px-10 pb-10 flex-1 min-h-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `overflow-hidden`; `flex`; `flex-col`; `items-center`; `justify-between`; `shrink-0`; `items-stretch`; `flex-1`; `flex-row`; `relative` |
| Size & spacing | `h-screen`; `px-10`; `pt-8`; `pb-4`; `w-full`; `gap-5`; `pb-10`; `min-h-0`; `min-w-0`; `h-full` |
| Type | `font-sans` |
| Appearance | `bg-[#F2F2F2]` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 28 | `if (uploadedItems.length === 0) return true; // nothing uploaded = nothing to review` |

**Literal palette:** `#F2F2F2`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/features/super-admin/sub-features/upload-docs/index.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/features/super-admin/sub-features/upload-docs/index.tsx](src/features/super-admin/sub-features/upload-docs/index.tsx).

**Routes:** `/super-admin/upload/process/:id`.

**Named declarations:** `UploadDocsRoot`.

**Composition:** [src/components/ui/BackButton.tsx](src/components/ui/BackButton.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadProfileAvatar.tsx), [src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx](src/features/super-admin/sub-features/upload-docs/components/UploadShortTimelineSidebar.tsx).

**Anatomy samples (exact declarations, not computed styles):**

| Source line | Declared classes |
| --- | --- |
| 94 | `h-screen overflow-hidden bg-[#F2F2F2] font-sans flex flex-col` |
| 96 | `flex items-center justify-between px-10 pt-8 pb-4 shrink-0` |
| 105 | `flex items-stretch gap-5 px-10 pb-10 flex-1 min-h-0` |

| Specification | Existing declarations |
| --- | --- |
| Layout | `overflow-hidden`; `flex`; `flex-col`; `items-center`; `justify-between`; `shrink-0`; `items-stretch`; `flex-1`; `flex-row`; `relative`; `fixed`; `justify-center`; `z-[110]` |
| Size & spacing | `h-screen`; `px-10`; `pt-8`; `pb-4`; `gap-5`; `pb-10`; `min-h-0`; `w-[280px]`; `h-full`; `min-w-0`; `inset-0`; `p-[clamp(1.5rem,3.125vw,2.5rem)]`; `max-w-sm`; `w-full`; `mx-4`; `mb-4`; `mb-8`; `gap-4`; `py-[clamp(0.6rem,1.25vw,1rem)]` |
| Type | `font-sans`; `text-center`; `font-[`; `font-bold`; `text-xl`; `font-['Manrope']`; `font-['Plus_Jakarta_Sans']` |
| Appearance | `bg-[#F2F2F2]`; `bg-black/40`; `backdrop-blur-sm`; `bg-white`; `border`; `border-[rgba(0,0,0,0.2)]`; `shadow-[0px_0px_12.5px_rgba(0,0,0,0.15)]`; `rounded-[24px]`; `text-[#1A1C1D]`; `text-[#5A5C5E]`; `rounded-full`; `border-[#D1D5DB]`; `text-white` |
| Interaction / motion | `animate-in`; `fade-in`; `duration-200`; `hover:bg-gray-50`; `transition-colors`; `transition-opacity`; `hover:opacity-90`; `disabled:opacity-50` |

| Inline style source line | Exact declaration |
| --- | --- |
| 141 | `style={{ background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)", }}` |

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

| State/control source line | Evidence |
| --- | --- |
| 71 | `} catch (error) {` |
| 139 | `disabled={isDrafting}` |

**Literal palette:** `#1A1C1D`, `#2A3008`, `#3D4A0D`, `#5A5C5E`, `#D1D5DB`, `#F2F2F2`, `rgba(0,0,0,0.15)`, `rgba(0,0,0,0.2)`.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

##### src/main.tsx

**Coverage:** [x] source audited. **Reachability:** Entry import graph. **Source:** [src/main.tsx](src/main.tsx).

**Composition:** [src/App.tsx](src/App.tsx).

**Local visual declarations:** none identified; rendered appearance is delegated to child components or this module provides routing/state only.

**Responsive:** No breakpoint-prefixed utility found in this module. Clamp/percentage sizing, if listed, still applies; child responsiveness is documented separately.

**Accessibility / states:** native semantics apply only to the elements actually rendered. Custom hover/focus/pressed/disabled/read-only states are limited to the selectors and conditions above; unlisted custom states are not verified. Loading/error/empty behavior may be delegated to listed children. Apply §13 recommendations before adding new interactions; runtime focus, computed layout and backend outcomes are unverified.

### 18.3 Global CSS inventory

`src/index.css` is the only project CSS file. The root token block is in §3. The ledger below includes every remaining rule body, including old fixed-coordinate screens and media overrides. This is a **declaration inventory**; the presence of a selector is not evidence that a reachable page uses it. Legacy CSS is deliberately not recommended as the base for new screens. Current feature modules predominantly use utility classes.

In particular, the regional-officer `.nav-container`, requested-info/workbench/rejection/detail/owner/family/submit-form/boundaries styles remain in this stylesheet although the current app's routed features compose different layouts. Inspect current source before importing a legacy class. The explicit media rules at768/1024px only affect the enclosed selectors.

| Source line | Selector | Exact declarations |
| --- | --- | --- |
| 220 | `body` | `margin: 0; font-family: var(--font-sans); background: var(--surface-page); color: var(--text-primary);` |
| 228 | `*` | `scrollbar-width: none; -ms-overflow-style: none;` |
| 235 | `*::-webkit-scrollbar` | `display: none;` |
| 240 | `.font-inter` | `font-family: var(--font-inter);` |
| 244 | `h1` | `font-family: var(--font-heading);` |
| 250 | `.card` | `background: var(--surface-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-card);` |
| 256 | `.text-muted` | `color: var(--text-muted);` |
| 261 | `.custom-scrollbar::-webkit-scrollbar` | `width: 6px; height: 6px;` |
| 266 | `.custom-scrollbar::-webkit-scrollbar-track` | `background: transparent;` |
| 270 | `.custom-scrollbar::-webkit-scrollbar-thumb` | `background: rgba(0, 0, 0, 0.15); border-radius: 9999px;` |
| 275 | `.custom-scrollbar::-webkit-scrollbar-thumb:hover` | `background: rgba(0, 0, 0, 0.3);` |
| 280 | `.no-scrollbar::-webkit-scrollbar` | `display: none;` |
| 285 | `.no-scrollbar` | `-ms-overflow-style: none; scrollbar-width: none;` |
| 291 | `.nav-container` | `width: 98%; max-width: 1800px; height: 85px; margin: 15px auto 0; background: #FFFFFF; border-radius: 22.5px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 40px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05); position: relative; z-index: 50;` |
| 307 | `.nav-menu` | `display: flex; gap: 47px; align-items: center;` |
| 313 | `.nav-item` | `font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 500; color: #000000; cursor: pointer; transition: all 0.3s ease; height: 37px; display: flex; align-items: center; padding: 0 28px; white-space: nowrap;` |
| 327 | `.nav-item-active` | `background: #000000; color: #FFFFFF; border-radius: 18.75px; font-weight: 600;` |
| 334 | `.icon-button` | `width: 37.5px; height: 37.5px; display: flex; align-items: center; justify-content: center; background: #FFFFFF; border: 0.75px solid rgba(155, 155, 155, 0.6); border-radius: 50%; cursor: pointer; transition: all 0.2s ease;` |
| 347 | `.icon-button:hover` | `background: #F9F9F9; transform: scale(1.05);` |
| 352 | `.profile-container` | `width: 37.5px; height: 37.5px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.05);` |
| 360 | `.profile-img` | `width: 100%; height: 100%; object-fit: cover;` |
| 368 | `.requested-info-container` | `max-width: 1407px; margin: 0 auto; padding-top: 8px; padding-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; height: calc(100vh - 120px); display: flex; flex-direction: column; overflow: hidden;` |
| 382 | `.workbench-layout` | `display: grid; grid-template-columns: 1fr; gap: 32px; align-items: stretch; width: 100%; flex: 1; min-height: 0; height: 100%;` |
| 394 | `.workbench-layout` | `grid-template-columns: 3fr 1fr;` |
| 399 | `.executive-summary-card` | `background: #FFFFFF; padding: 24px; box-shadow: 0px 8px 40px rgba(9, 20, 38, 0.04); border-radius: 36px; display: flex; flex-direction: column; gap: 16px; height: 100%; justify-content: space-between; min-height: 0;` |
| 414 | `.requested-cards-list-container` | `display: flex; flex-direction: column; gap: 24px; overflow-y: auto; flex: 1; padding-right: 8px; min-height: 0; scrollbar-width: thin; scrollbar-color: rgba(39, 128, 196, 0.2) transparent;` |
| 428 | `.status-badge-returned` | `display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 218, 214, 0.5); border: 1px solid rgba(186, 26, 26, 0.2); border-radius: 9999px; width: fit-content; flex-shrink: 0;` |
| 440 | `.status-badge-dot` | `width: 8px; height: 8px; background: #BA1A1A; border-radius: 9999px;` |
| 447 | `.status-badge-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #BA1A1A; margin-top: 2px;` |
| 458 | `.agent-identity-badge` | `display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(243, 244, 245, 0.5); border-radius: 24px; width: 100%;` |
| 468 | `.agent-avatar-large` | `width: 56px; height: 56px; border-radius: 9999px; border: 1px solid rgba(0, 0, 0, 0.05); object-fit: cover; flex-shrink: 0;` |
| 477 | `.agent-name-heading` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 20px; line-height: 28px; color: #131600;` |
| 485 | `.agent-email-link` | `display: flex; align-items: center; gap: 6px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 16px; line-height: 24px; color: #00629E; text-decoration: none;` |
| 497 | `.agent-email-link:hover` | `text-decoration: underline;` |
| 501 | `.ledger-grid` | `display: grid; grid-template-columns: 1fr; gap: 16px; width: 100%;` |
| 509 | `.ledger-grid` | `grid-template-columns: 1fr 1fr;` |
| 513 | `.ledger-card-full` | `grid-column: span 2;` |
| 518 | `.ledger-card` | `background: #F8F9FA; border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 4px;` |
| 527 | `.ledger-card-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #45474C;` |
| 537 | `.ledger-card-value` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 18px; line-height: 28px; color: #131600;` |
| 545 | `.ledger-card-location-wrapper` | `display: flex; align-items: center; gap: 8px; margin-top: 4px;` |
| 552 | `.actions-card` | `display: flex; flex-direction: column; padding: 24px; gap: 20px; background: #FFFFFF; box-shadow: 0px 8px 30px rgba(9, 20, 38, 0.02); border-radius: 36px; justify-content: space-between; height: 100%;` |
| 565 | `.actions-card` | `min-height: 0;` |
| 570 | `.actions-card-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 18px; line-height: 28px; letter-spacing: -0.45px; color: #131600;` |
| 579 | `.actions-buttons-container` | `display: flex; flex-direction: column; gap: 16px; width: 100%;` |
| 586 | `.action-btn-primary` | `width: 100%; height: 56px; background: #2780C4; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 16px; border-radius: 32px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);` |
| 604 | `.action-btn-primary:hover` | `background: #1f66a3;` |
| 608 | `.action-btn-secondary` | `width: 100%; height: 58px; background: transparent; border: 1px solid #2780C4; color: #2780C4; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 16px; border-radius: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;` |
| 625 | `.action-btn-secondary:hover` | `background: rgba(39, 128, 196, 0.05);` |
| 629 | `.actions-card-footer-text` | `border-top: 1px solid rgba(231, 232, 233, 0.5); padding-top: 16px; margin-top: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 12px; line-height: 18px; color: #45474C; text-align: center;` |
| 641 | `.back-dashboard-btn` | `display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #FFFFFF; border: 1px solid rgba(231, 232, 233, 0.5); border-radius: 60px; cursor: pointer; width: fit-content; margin-bottom: 16px; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12); transition: background-color 0.2s ease;` |
| 656 | `.back-dashboard-btn:hover` | `background: #F9F9F9;` |
| 660 | `.back-dashboard-btn-text` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 16px; line-height: 18px; color: #353535;` |
| 670 | `.rejection-reason-page` | `min-height: 100vh; background: #F9F9F9; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; font-family: 'Plus Jakarta Sans', sans-serif;` |
| 681 | `.reason-top-header` | `position: absolute; top: 34px; right: 80px; display: flex; align-items: center; gap: 13px;` |
| 690 | `.bell-badge-btn` | `width: 52px; height: 52px; background: #FFFFFF; border-radius: 40px; display: flex; align-items: center; justify-content: center; position: relative; border: none; cursor: pointer; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.02); transition: transform 0.2s ease;` |
| 705 | `.bell-badge-btn:hover` | `transform: scale(1.05);` |
| 709 | `.bell-badge-dot` | `position: absolute; top: 14px; right: 14px; width: 6px; height: 6px; background: #EF4646; border-radius: 9999px;` |
| 719 | `.profile-badge-avatar-container` | `width: 52px; height: 52px; background: #FFFFFF; border-radius: 72px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.02); border: 1.5px solid rgba(0, 0, 0, 0.05);` |
| 732 | `.profile-badge-avatar-image` | `width: 52px; height: 52px; object-fit: cover;` |
| 738 | `.rejection-reason-card` | `width: 672px; max-width: 90vw; background: #FFFFFF; box-shadow: 0px 20px 40px rgba(0, 49, 50, 0.06); border-radius: 32px; overflow: hidden; display: flex; flex-direction: column; position: relative; border: 1px solid rgba(188, 201, 201, 0.15);` |
| 751 | `.rejection-card-header` | `padding: 24px 32px; background: #FFFFFF; display: flex; align-items: center; justify-content: space-between;` |
| 759 | `.rejection-card-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 24px; line-height: 32px; letter-spacing: -0.6px; color: #1A1C1D; margin: 0;` |
| 769 | `.rejection-card-body` | `padding: 0px 32px 24px; display: flex; flex-direction: column; gap: 24px;` |
| 776 | `.rejection-meta-info` | `display: flex; align-items: center; gap: 8px;` |
| 782 | `.rejection-meta-label` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 14px; line-height: 20px; color: #3D4949;` |
| 790 | `.rejection-meta-value` | `font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px; line-height: 20px; color: #1A1C1D;` |
| 798 | `.rejection-reason-content-box` | `display: flex; flex-direction: column; align-items: flex-start; padding: 24px; gap: 16px; background: #F3F3F5; border: 1px solid #BCC9C9; border-radius: 16px; min-height: 200px;` |
| 810 | `.rejection-paragraph-primary` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 16px; line-height: 26px; color: #1A1C1D; margin: 0;` |
| 819 | `.rejection-paragraph-secondary` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 16px; line-height: 26px; color: #1A1C1D; margin: 0;` |
| 828 | `.rejection-card-footer` | `padding: 16px 32px 24px; background: #FFFFFF; display: flex; justify-content: flex-end; align-items: center;` |
| 836 | `.rejection-done-btn` | `width: 124px; height: 52px; background: #2780C4; border-radius: 48px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 20px; letter-spacing: 0.7px; text-transform: uppercase; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0px 20px 40px rgba(0, 49, 50, 0.06); transition: background-color 0.2s ease, transform 0.1s ease;` |
| 857 | `.rejection-done-btn:hover` | `background: #1f66a3; transform: translateY(-1px);` |
| 862 | `.rejection-done-btn:active` | `transform: translateY(0);` |
| 866 | `.farmland-details-page-fluid` | `width: 100vw; height: 100vh; background: #F9F9F9; box-sizing: border-box; display: flex; flex-direction: column; padding: 32px 96px; overflow-y: auto; overflow-x: hidden; position: relative;` |
| 880 | `.farmland-details-page-fluid::-webkit-scrollbar` | `width: 8px;` |
| 884 | `.farmland-details-page-fluid::-webkit-scrollbar-track` | `background: #F9F9F9;` |
| 888 | `.farmland-details-page-fluid::-webkit-scrollbar-thumb` | `background: #E2E2E4; border-radius: 4px;` |
| 893 | `.farmland-details-page-fluid::-webkit-scrollbar-thumb:hover` | `background: #D0D0D2;` |
| 897 | `.details-fluid-header-row` | `display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 24px; flex-shrink: 0;` |
| 906 | `.back-dashboard-pill-btn-fluid` | `display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 12px 24px; gap: 8px; height: 52px; background: #FFFFFF; border-radius: 60px; border: none; cursor: pointer; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); transition: all 0.2s ease;` |
| 922 | `.back-dashboard-pill-btn-fluid:hover` | `background: #F5F5F7; transform: translateY(-1px);` |
| 927 | `.back-dashboard-pill-btn-fluid:active` | `transform: translateY(0);` |
| 931 | `.back-dashboard-pill-text-fluid` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 16px; color: #353535;` |
| 939 | `.details-fluid-badges-container` | `display: flex; align-items: center; gap: 16px;` |
| 945 | `.details-fluid-bell-badge-btn` | `width: 52px; height: 52px; background: #FFFFFF; border-radius: 40px; display: flex; align-items: center; justify-content: center; position: relative; border: none; cursor: pointer; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease;` |
| 960 | `.details-fluid-bell-badge-btn:hover` | `transform: scale(1.05);` |
| 964 | `.details-fluid-bell-badge-dot` | `position: absolute; top: 12px; right: 14px; width: 6px; height: 6px; background: #EF4646; border-radius: 9999px;` |
| 974 | `.details-fluid-profile-badge` | `width: 52px; height: 52px; background: #FFFFFF; border-radius: 72px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); border: 1.5px solid rgba(0, 0, 0, 0.05);` |
| 987 | `.details-fluid-profile-image` | `width: 100%; height: 100%; object-fit: cover;` |
| 993 | `.details-fluid-title-container` | `margin-bottom: 24px; flex-shrink: 0;` |
| 998 | `.details-fluid-main-heading` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 800; font-size: 38px; line-height: 48px; color: #1A1C1D; margin: 0;` |
| 1008 | `.details-fluid-hero-card` | `width: 100%; flex: 1.1; min-height: 300px; max-height: 409px; position: relative; background: #E2E2E4; border-radius: 32px; overflow: hidden; box-shadow: 0px 20px 40px rgba(0, 49, 50, 0.04); margin-bottom: 24px; flex-shrink: 0;` |
| 1022 | `.details-fluid-hero-image-wrapper` | `position: absolute; inset: 0; z-index: 1;` |
| 1028 | `.details-fluid-hero-image` | `width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85);` |
| 1035 | `.details-fluid-hero-left-overlay` | `position: absolute; left: 74px; bottom: 80px; z-index: 2; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; box-sizing: border-box;` |
| 1047 | `.details-fluid-status-capsule` | `display: flex; align-items: center; padding: 4px 12px; background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(6px); border-radius: 9999px; height: 26px; box-sizing: border-box;` |
| 1059 | `.details-fluid-status-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 700; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #FFFFFF;` |
| 1070 | `.details-fluid-hero-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 800; font-size: 48px; line-height: 48px; letter-spacing: -1.2px; color: #FFFFFF; margin: 0; filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.07));` |
| 1082 | `.details-fluid-hero-location` | `display: flex; align-items: center; gap: 4px; height: 24px;` |
| 1089 | `.details-fluid-hero-location-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 16px; line-height: 24px; color: #EEEEF0;` |
| 1098 | `.details-fluid-hero-stats-wrapper` | `position: absolute; right: 74px; bottom: 80px; z-index: 2; display: flex; align-items: center; gap: 24px;` |
| 1108 | `.details-fluid-stat-card` | `display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 16px 24px; gap: 4px; background: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 16px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); box-sizing: border-box; height: 106px; flex-shrink: 0;` |
| 1125 | `.details-fluid-stat-card:nth-child(1)` | `width: auto; min-width: 188px;` |
| 1130 | `.details-fluid-stat-card:nth-child(2)` | `width: auto; min-width: 178px;` |
| 1135 | `.fluid-stat-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #3D4949;` |
| 1146 | `.fluid-stat-value` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 700; font-size: 30px; line-height: 36px; color: #000000; white-space: nowrap;` |
| 1156 | `.details-fluid-bento-grid` | `width: 100%; flex: 1.3; min-height: 380px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; box-sizing: border-box;` |
| 1167 | `.details-fluid-bento-card` | `background: #FFFFFF; border: 1px solid rgba(188, 201, 201, 0.15); box-shadow: 0px 20px 40px rgba(0, 49, 50, 0.02); border-radius: 32px; padding: 32px; display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box;` |
| 1179 | `.fluid-bento-header` | `border-bottom: 1px solid #EEEEF0; padding-bottom: 16px; margin-bottom: 20px; flex-shrink: 0;` |
| 1186 | `.fluid-bento-header-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 700; font-size: 20px; line-height: 28px; color: #1A1C1D; margin: 0;` |
| 1196 | `.fluid-bento-body` | `display: flex; flex-direction: column; justify-content: space-between; flex: 1;` |
| 1203 | `.fluid-bento-item` | `display: flex; flex-direction: column; gap: 4px;` |
| 1209 | `.fluid-bento-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #3D4949;` |
| 1220 | `.fluid-bento-value-primary` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 24px; color: #1A1C1D;` |
| 1229 | `.fluid-bento-agent-row` | `display: flex; align-items: center; gap: 12px;` |
| 1235 | `.fluid-bento-agent-avatar` | `width: 40px; height: 40px; background: #EEEEF0; border-radius: 9999px; overflow: hidden;` |
| 1243 | `.fluid-bento-agent-avatar-img` | `width: 100%; height: 100%; object-fit: cover;` |
| 1249 | `.fluid-bento-agent-name` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 24px; color: #1A1C1D;` |
| 1258 | `.fluid-bento-timestamp-row` | `display: grid; grid-template-columns: 1fr 1fr; gap: 16px;` |
| 1264 | `.fluid-bento-timestamp-item` | `display: flex; flex-direction: column; gap: 4px;` |
| 1270 | `.fluid-bento-timestamp-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 10px; line-height: 15px; letter-spacing: 0.5px; text-transform: uppercase; color: #3D4949;` |
| 1281 | `.fluid-bento-timestamp-value` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; color: #1A1C1D;` |
| 1290 | `.fluid-bento-body-status` | `display: flex; flex-direction: column; justify-content: center; gap: 20px; flex: 1;` |
| 1298 | `.fluid-bento-status-block` | `width: 100%; height: 98px; background: #F9F9FB; border: 1px solid #E2E2E4; border-radius: 32px; padding: 24px; display: flex; align-items: center; box-sizing: border-box;` |
| 1310 | `.fluid-bento-status-text-stack` | `display: flex; flex-direction: column; gap: 4px;` |
| 1316 | `.fluid-bento-status-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 12px; line-height: 16px; letter-spacing: 0.6px; text-transform: uppercase; color: #3D4949;` |
| 1327 | `.fluid-bento-status-value` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 18px; line-height: 28px; color: #1A1C1D;` |
| 1336 | `.details-fluid-footer` | `display: flex; justify-content: flex-end; align-items: center; width: 100%; padding-top: 8px; gap: 12px; flex-shrink: 0;` |
| 1346 | `.details-fluid-done-btn` | `width: 121px; height: 38px; background: #2780C4; border-radius: 33px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 14px; line-height: 18px; text-align: center; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); transition: all 0.2s ease;` |
| 1367 | `.details-fluid-done-btn:hover` | `background: #1f66a3; transform: translateY(-1px);` |
| 1372 | `.details-fluid-done-btn:active` | `transform: translateY(0);` |
| 1376 | `.details-fluid-back-outline-btn` | `width: 121px; height: 38px; background: transparent; border: 1px solid rgba(0, 0, 0, 0.27); border-radius: 33px; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 14px; line-height: 18px; text-align: center; color: rgba(0, 0, 0, 0.8); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; box-sizing: border-box;` |
| 1397 | `.details-fluid-back-outline-btn:hover` | `background: rgba(0, 0, 0, 0.03); transform: translateY(-1px);` |
| 1402 | `.details-fluid-back-outline-btn:active` | `transform: translateY(0);` |
| 1409 | `.owner-details-responsive-outer-container` | `width: 100vw; height: 100vh; overflow-y: auto; overflow-x: hidden; background: #F2F2F2; box-sizing: border-box;` |
| 1420 | `.owner-details-responsive-outer-container::-webkit-scrollbar` | `display: none;` |
| 1425 | `.owner-details-page-wrapper` | `position: relative; width: 1440px; height: 1080px; background: #F2F2F2; border-radius: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; overflow: visible; transform-origin: top left;` |
| 1440 | `.owner-details-back-pill-btn` | `position: absolute; left: 72px; top: 36px; width: 240px; height: 52px; display: flex; flex-direction: row; align-items: center; padding: 19px 20px; gap: 8px; background: #FFFFFF; border-radius: 60px; border: none; filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.12)); cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; z-index: 10;` |
| 1461 | `.owner-details-back-pill-btn:hover` | `transform: translateY(-1px); filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.15));` |
| 1466 | `.owner-details-back-pill-text` | `font-family: 'Inter', sans-serif; font-style: normal; font-weight: 400; font-size: 16px; line-height: 18px; color: #353535;` |
| 1476 | `.owner-details-timeline-card` | `position: absolute; width: 410px; height: 443px; left: 40px; top: 130px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box; padding: 30px;` |
| 1489 | `.owner-details-timeline-lbl` | `position: absolute; width: 96px; height: 20px; left: 30px; top: 30px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 16px; line-height: 20px; color: #000000;` |
| 1502 | `.owner-details-timeline-title` | `position: absolute; width: 195px; height: 44px; left: 30px; top: 60px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 35px; line-height: 44px; color: #000000; margin: 0;` |
| 1516 | `.owner-details-timeline-vertical-line` | `position: absolute; width: 0px; height: 164px; left: 109px; top: 175px; border: 1px solid rgba(0, 120, 250, 0.25);` |
| 1525 | `.timeline-node-dot-inner.active-dot` | `position: absolute; width: 12.44px; height: 12.44px; left: 103px; top: 169.56px; background: #3D93D1; box-shadow: 0px 0px 0px 4.14px #FFFFFF, 0px 0px 0px 6.22px rgba(37, 99, 235, 0.1); border-radius: 6.22px; z-index: 2;` |
| 1537 | `.timeline-node-text-primary.active-text` | `position: absolute; left: 144px; top: 167px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; color: #138FFF; text-transform: uppercase;` |
| 1549 | `.timeline-node-dot-inactive.node-2-dot` | `position: absolute; width: 12.44px; height: 12.44px; left: 103px; top: 255.56px; background: #FFFFFF; border: 2.07px solid #85BFE5; border-radius: 6.22px; box-shadow: 0px 0px 0px 4.14px #F3F3F3; z-index: 2;` |
| 1562 | `.timeline-node-text-secondary.node-2-text` | `position: absolute; left: 144px; top: 253px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; color: #5A5C5E; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;` |
| 1576 | `.timeline-node-text-secondary.node-2-text:hover` | `color: #138FFF;` |
| 1580 | `.timeline-node-dot-inactive.node-2-dot` | `cursor: pointer; transition: all 0.2s ease;` |
| 1585 | `.timeline-node-dot-inactive.node-2-dot:hover` | `border-color: #138FFF;` |
| 1590 | `.timeline-node-dot-inactive.node-1-dot` | `position: absolute; width: 12.44px; height: 12.44px; left: 103px; top: 169.56px; background: #FFFFFF; border: 2.07px solid #85BFE5; border-radius: 6.22px; box-shadow: 0px 0px 0px 4.14px #F3F3F3; z-index: 2; cursor: pointer; transition: all 0.2s ease;` |
| 1605 | `.timeline-node-dot-inactive.node-1-dot:hover` | `border-color: #138FFF;` |
| 1609 | `.timeline-node-text-secondary.node-1-text` | `position: absolute; left: 144px; top: 167px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; color: #5A5C5E; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;` |
| 1623 | `.timeline-node-text-secondary.node-1-text:hover` | `color: #138FFF;` |
| 1628 | `.timeline-node-dot-inactive.node-3-dot` | `position: absolute; width: 12.44px; height: 12.44px; left: 103px; top: 329.56px; background: #FFFFFF; border: 2.07px solid #85BFE5; border-radius: 6.22px; box-shadow: 0px 0px 0px 4.14px #F3F3F3; z-index: 2; cursor: pointer; transition: all 0.2s ease;` |
| 1643 | `.timeline-node-dot-inactive.node-3-dot:hover` | `border-color: #138FFF;` |
| 1647 | `.timeline-node-text-secondary.node-3-text` | `position: absolute; left: 144px; top: 327px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; color: #5A5C5E; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;` |
| 1661 | `.timeline-node-text-secondary.node-3-text:hover` | `color: #138FFF;` |
| 1666 | `.owner-details-location-card` | `position: absolute; width: 410px; height: 443px; left: 40px; top: 586px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box; padding: 30px;` |
| 1679 | `.owner-details-location-title` | `position: absolute; width: 184px; height: 30px; left: 24px; top: 30px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 24px; line-height: 30px; color: #000000; margin: 0;` |
| 1693 | `.owner-details-coords-row` | `position: absolute; width: 217px; height: 24px; left: 24px; top: 84px; display: flex; flex-direction: row; align-items: center; gap: 10px;` |
| 1705 | `.owner-details-coords-link` | `font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 16px; line-height: 24px; color: #1D7ABE; text-decoration: underline;` |
| 1714 | `.owner-details-map-frame` | `position: absolute; width: 362px; height: 285px; left: 24px; top: 134px; border-radius: 24px; overflow: hidden; background: #BA9A9A; box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.05);` |
| 1726 | `.owner-details-map-image` | `width: 100%; height: 100%; object-fit: cover;` |
| 1732 | `.owner-details-map-overlay-grid` | `position: absolute; inset: 0; background-image: linear-gradient(rgba(0, 0, 0, 0.08) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0, 0, 0, 0.08) 1.5px, transparent 1.5px); background-size: 24px 24px; pointer-events: none;` |
| 1742 | `.owner-details-central-card` | `position: absolute; height: 901px; left: 466px; right: 40px; top: 128px; background: #FFFFFF; box-shadow: 0px 20px 40px rgba(0, 49, 50, 0.06); border-radius: 32px; box-sizing: border-box;` |
| 1754 | `.owner-details-avatar-wrapper` | `position: absolute; width: 82px; height: 82px; left: 48px; top: 128px; border: 4px solid #F9F9FB; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05); border-radius: 9999px; overflow: hidden;` |
| 1766 | `.owner-details-avatar` | `width: 100%; height: 100%; object-fit: cover;` |
| 1772 | `.owner-details-profile-name` | `position: absolute; width: 176px; height: 36px; left: 151px; top: 146px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 24px; line-height: 36px; display: flex; align-items: center; color: #1A1C1D; margin: 0;` |
| 1788 | `.owner-details-tab-bar` | `position: absolute; width: 628px; height: 41.22px; left: 266px; top: 40px; display: flex; flex-direction: row; align-items: center; gap: 20px;` |
| 1800 | `.owner-details-tab` | `position: absolute; top: 0; display: flex; flex-direction: row; align-items: center; box-shadow: 0px 42px 17px rgba(0, 0, 0, 0.01); box-sizing: border-box; cursor: pointer; transition: all 0.2s ease;` |
| 1812 | `.owner-details-tab.tab-1` | `width: 184px; height: 41.22px; left: 0px; padding: 11.6px 11.6px 11.6px 31px; gap: 20px; border-radius: 72.55px; background: #FFFFFF; border: 1px solid #3D93D1;` |
| 1823 | `.owner-details-tab.tab-2` | `width: 202px; height: 41.22px; left: 204px; padding: 11.6px 11.6px 11.6px 39px; gap: 20px; border-radius: 72.55px; background: #F9F9F9; border: 1px solid transparent;` |
| 1834 | `.owner-details-tab.tab-3` | `width: 202px; height: 41.22px; left: 426px; padding: 11.6px 11.6px 11.6px 39px; gap: 20px; border-radius: 72.55px; background: #F9F9F9; border: 1px solid transparent;` |
| 1845 | `.owner-details-tab-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; text-align: center; color: #5A5C5E;` |
| 1854 | `.owner-details-tab-text.active` | `color: #3D93D1;` |
| 1859 | `.owner-details-form-grid` | `position: absolute; left: 48px; right: 48px; top: 238px; height: 408px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 48px; row-gap: 28px;` |
| 1871 | `.owner-details-form-field` | `display: flex; flex-direction: column; gap: 8px;` |
| 1877 | `.owner-details-field-label` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 20px; color: #3D4949; letter-spacing: 0.35px;` |
| 1886 | `.owner-details-field-input-box` | `display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 12px 16px; height: 50px; background: #F3F3F5; border-radius: 24px; border: 2px solid transparent; box-sizing: border-box; transition: all 0.2s ease;` |
| 1900 | `.owner-details-field-input-box.prefix` | `flex-direction: row; justify-content: flex-start; align-items: center; padding: 12px 16px 12px 20px; gap: 12px;` |
| 1908 | `.owner-details-field-input-box.prefix:focus-within` | `border-color: #3D93D1; background: #FFFFFF; box-shadow: 0px 4px 12px rgba(61, 147, 209, 0.08);` |
| 1914 | `.owner-details-input-field` | `width: 100%; height: 50px; background: #F3F3F5; border-radius: 24px; border: 2px solid transparent; padding: 12px 24px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; color: #1A1C1D; box-sizing: border-box; outline: none; transition: all 0.2s ease;` |
| 1931 | `.owner-details-input-field:focus` | `border-color: #3D93D1; background: #FFFFFF; box-shadow: 0px 4px 12px rgba(61, 147, 209, 0.08);` |
| 1937 | `.owner-details-input-field-inline` | `border: none; background: transparent; width: 100%; height: 100%; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; color: #1A1C1D; padding: 0;` |
| 1952 | `.owner-details-google-loc-row` | `position: absolute; left: 48px; top: 694px; display: flex; flex-direction: row; align-items: center; gap: 15px;` |
| 1962 | `.owner-details-google-loc-lbl` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 16px; line-height: 20px; color: #000000;` |
| 1970 | `.owner-details-google-loc-link` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 16px; line-height: 20px; color: #1D7ABE; text-decoration: underline;` |
| 1980 | `.owner-details-footer-actions` | `position: absolute; height: 68px; left: 56px; right: 48px; top: 763px; display: flex; align-items: center; box-sizing: border-box;` |
| 1991 | `.owner-details-footer-btns-group` | `position: absolute; right: -8px; top: calc(50% - 38px/2 + 11px); display: flex; flex-direction: row; align-items: center; gap: 12px;` |
| 2001 | `.owner-details-btn-back` | `box-sizing: border-box; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10px; width: 121px; height: 38px; border: 1px solid rgba(0, 0, 0, 0.27); border-radius: 33px; background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 14px; line-height: 18px; color: rgba(0, 0, 0, 0.8); cursor: pointer; transition: all 0.2s ease;` |
| 2022 | `.owner-details-btn-back:hover` | `background: rgba(0, 0, 0, 0.03); transform: translateY(-1px);` |
| 2027 | `.owner-details-btn-next` | `box-sizing: border-box; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10px; width: 121px; height: 38px; background: #2780C4; border-radius: 33px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; line-height: 18px; color: #FFFFFF; cursor: pointer; transition: all 0.2s ease;` |
| 2048 | `.owner-details-btn-next:hover` | `background: #1f66a3; transform: translateY(-1px);` |
| 2054 | `.owner-details-central-card.family-tree-card` | `height: 849px;` |
| 2058 | `.family-tree-diagram-container` | `position: absolute; left: 0; right: 0; top: 110px; bottom: 85px; overflow: hidden;` |
| 2067 | `.family-tree-svg-connectors` | `position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;` |
| 2077 | `.family-tree-connector-pill` | `position: absolute; display: flex; align-items: center; justify-content: center; background: #F2F8FC; border: 1px solid #3D93D1; color: #3D93D1; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 8px; font-weight: 700; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px; z-index: 2; height: 20px; box-sizing: border-box; text-transform: uppercase;` |
| 2100 | `.family-tree-node-owner` | `position: absolute; width: 216px; height: 132px; border: 1px solid #3D93D1; background: #F2F8FC; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0px 4px 20px rgba(61, 147, 209, 0.04); z-index: 3;` |
| 2115 | `.family-tree-owner-avatar-wrapper` | `position: relative; margin-top: 0px; display: flex; flex-direction: column; align-items: center;` |
| 2124 | `.family-tree-owner-avatar` | `width: 52px; height: 52px; border-radius: 9999px; object-fit: cover; border: 3px solid #FFFFFF; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);` |
| 2133 | `.family-tree-owner-badge` | `background: #3D93D1; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 8px; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; margin-top: -6px; z-index: 2; border: 1px solid #FFFFFF; letter-spacing: 0.5px;` |
| 2148 | `.family-tree-owner-name` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; color: #1A1C1D; margin: 10px 0 2px 0;` |
| 2156 | `.family-tree-owner-details` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 12px; color: #3D93D1;` |
| 2163 | `.family-tree-relative-card` | `position: absolute; width: 186px; height: 72px; border: 1px solid #EEEEEF; background: #FFFFFF; border-radius: 16px; display: flex; flex-direction: row; align-items: center; padding: 12px; gap: 12px; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.02); z-index: 3; box-sizing: border-box;` |
| 2183 | `.family-tree-relative-avatar` | `width: 44px; height: 44px; border-radius: 9999px; object-fit: cover;` |
| 2190 | `.family-tree-relative-info` | `display: flex; flex-direction: column;` |
| 2195 | `.family-tree-relative-name` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 13px; color: #1D1E20; margin: 0 0 2px 0;` |
| 2203 | `.family-tree-relative-meta` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 11px; color: #7F8487;` |
| 2211 | `.owner-details-active-tab-check` | `display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #3D93D1; border-radius: 9999px; flex-shrink: 0;` |
| 2222 | `.owner-details-active-tab-check.inactive` | `background: #A5A5A5;` |
| 2226 | `.owner-details-tab.active` | `background: #FFFFFF !important; border: 1px solid #3D93D1 !important;` |
| 2231 | `.owner-details-tab.inactive` | `background: #F9F9F9 !important; border: 1px solid transparent !important;` |
| 2236 | `.owner-details-footer-actions.family-tree-footer` | `top: 711px;` |
| 2244 | `.owner-details-central-card.land-details-card` | `height: 928px; top: 133px;` |
| 2250 | `.land-details-header-title` | `position: absolute; left: 50%; transform: translateX(-50%); top: 191px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; line-height: 20px; letter-spacing: 0.7px; text-transform: uppercase; color: #5A5C5E; white-space: nowrap; margin: 0;` |
| 2267 | `.land-details-aerial-image-wrapper` | `position: absolute; width: 417px; height: 306px; left: 247px; top: 242px; border-radius: 23.4px; overflow: hidden; background: #F1F5F9; box-shadow: 0px 0px 39px rgba(0, 0, 0, 0.05);` |
| 2279 | `.land-details-aerial-image` | `width: 100%; height: 100%; object-fit: cover; border-radius: 29.9px;` |
| 2286 | `.land-details-aerial-image-border` | `position: absolute; inset: 0; border: 0.65px solid rgba(255, 255, 255, 0.5); border-radius: 23.4px; pointer-events: none;` |
| 2295 | `.land-details-data-item` | `position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;` |
| 2303 | `.land-details-data-lbl` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 12px; line-height: 15px; letter-spacing: 1.1px; text-transform: uppercase; color: #8A96A3;` |
| 2313 | `.land-details-data-val` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 16px; line-height: 22px; color: #2780C4;` |
| 2322 | `.land-details-data-item.state-box` | `left: 84px; top: 258px;` |
| 2327 | `.land-details-data-item.district-box` | `left: 88px; top: 342px;` |
| 2332 | `.land-details-data-item.area-box` | `left: 83px; top: 426px;` |
| 2337 | `.land-details-data-item.acquisition-box` | `left: 38px; top: 510px;` |
| 2343 | `.land-details-data-item.agent-box` | `left: 712px; top: 253px;` |
| 2348 | `.land-details-data-item.conversion-box` | `left: 712px; top: 337px;` |
| 2353 | `.land-details-data-item.value-box` | `left: 712px; top: 426px;` |
| 2358 | `.land-details-data-item.referral-box` | `left: 702px; top: 507px;` |
| 2364 | `.land-details-geo-reference-card` | `position: absolute; left: 107px; top: 668px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;` |
| 2374 | `.land-details-geo-lbl` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 12px; line-height: 15px; letter-spacing: 0.55px; text-transform: uppercase; color: #9AA3AD;` |
| 2384 | `.land-details-geo-coords` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 24px; line-height: 30px; letter-spacing: -0.56px; color: #5A5C5E; margin: 0;` |
| 2394 | `.land-details-geo-sub` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 400; font-size: 14px; line-height: 18px; color: #9AA3AD;` |
| 2403 | `.land-details-map-ref-card` | `position: absolute; width: 240px; height: 120px; right: 40px; bottom: 160px; background: #F2F4F6; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 23px; overflow: hidden;` |
| 2415 | `.land-details-map-ref-image` | `width: 100%; height: 100%; object-fit: cover;` |
| 2421 | `.land-details-map-ref-overlay` | `position: absolute; inset: 0; background: linear-gradient(135deg, rgba(39, 128, 196, 0.07) 0%, transparent 60%); pointer-events: none;` |
| 2429 | `.land-details-footer-actions-group` | `position: absolute; right: 40px; bottom: 40px; display: flex; flex-direction: row; align-items: center; gap: 12px;` |
| 2440 | `.owner-details-btn-next.done-theme` | `background: #2780C4;` |
| 2444 | `.owner-details-btn-next.done-theme:hover` | `background: #1f66a3;` |
| 2451 | `.owner-details-responsive-outer-container.submit-form-no-scroll` | `overflow: hidden !important; overflow-y: hidden !important;` |
| 2456 | `.submit-form-back-pill` | `position: absolute; left: 40px; top: 32px; width: 244px; height: 52px; display: flex; flex-direction: row; align-items: center; padding: 19px 20px; gap: 8px; background: #FFFFFF; border-radius: 60px; border: none; filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.12)); cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; z-index: 10;` |
| 2477 | `.submit-form-back-pill:hover` | `transform: translateY(-1px); filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.15));` |
| 2482 | `.submit-form-back-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 400; font-size: 16px; line-height: 18px; color: #353535;` |
| 2491 | `.submit-form-header-right` | `position: absolute; width: 117.06px; height: 52px; left: calc(50% - 117.06px/2 + 621.53px); top: 34px; display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 13.06px; z-index: 10;` |
| 2505 | `.submit-form-bell-btn` | `display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 8px; gap: 10px; width: 52px; height: 52px; background: #FFFFFF; border-radius: 40px; border: none; cursor: pointer; transition: all 0.2s ease; box-sizing: border-box;` |
| 2522 | `.submit-form-bell-btn:hover` | `background: #fdfdfd;` |
| 2526 | `.submit-form-avatar-box` | `display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 0; width: 52px; height: 52px; background: #FFFFFF; border-radius: 72.5px; overflow: hidden; box-sizing: border-box;` |
| 2541 | `.submit-form-left-card` | `position: absolute; width: 410px; height: 443px; left: 40px; top: 120px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box; padding: 30px;` |
| 2554 | `.submit-form-farmland-lbl` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 20px; color: #000000; display: block;` |
| 2564 | `.submit-form-farmland-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 500; font-size: 35px; line-height: 44px; color: #000000; margin-top: 10px; display: block;` |
| 2576 | `.submit-form-stepper-box` | `position: relative; margin-top: 40px; display: flex; flex-direction: column; gap: 22px; padding-left: 20px;` |
| 2585 | `.submit-form-stepper-line` | `position: absolute; width: 1px; background: rgba(0, 120, 250, 0.25); left: 31px; top: 10px; bottom: 10px; z-index: 1;` |
| 2595 | `.submit-form-step-item` | `position: relative; display: flex; flex-direction: row; align-items: flex-start; gap: 16px; z-index: 2;` |
| 2604 | `.submit-form-step-badge` | `position: relative; width: 24px; height: 24px; background: #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-sizing: border-box; margin-top: 4px;` |
| 2617 | `.submit-form-step-info` | `display: flex; flex-direction: column; gap: 2px;` |
| 2623 | `.submit-form-step-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 14px; line-height: 18px;` |
| 2631 | `.submit-form-step-date` | `font-family: 'Outfit', sans-serif; font-style: normal; font-weight: 400; font-size: 11px; line-height: 14px; color: #9AA3AD;` |
| 2641 | `.submit-form-bottom-left-card` | `position: absolute; height: 443px; left: 40px; width: 640px; top: 581px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box; padding: 30px;` |
| 2654 | `.submit-form-adv-lbl` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 24px; line-height: 30px; color: #000000;` |
| 2663 | `.submit-form-adv-input` | `box-sizing: border-box; width: 100%; height: 54px; background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.4); border-radius: 8px; display: flex; align-items: center; padding: 0 24px;` |
| 2675 | `.submit-form-adv-input span` | `font-family: 'Inter', sans-serif; font-style: normal; font-weight: 400; font-size: 18px; line-height: 22px; color: #000000;` |
| 2685 | `.submit-form-right-card` | `position: absolute; height: 443px; left: 466px; right: 40px; top: 120px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box; padding: 30px; -ms-overflow-style: none; scrollbar-width: none;` |
| 2700 | `.submit-form-right-card::-webkit-scrollbar` | `display: none;` |
| 2704 | `.submit-form-tags-grid` | `display: flex; flex-wrap: wrap; gap: 16px;` |
| 2710 | `.submit-form-tag-item` | `box-sizing: border-box; display: flex; flex-direction: row; align-items: center; padding: 11.6px 22px; gap: 20px; background: #F9F9F9; border: 0.73px solid #A5B767; border-radius: 72.5px; transition: all 0.2s ease;` |
| 2723 | `.submit-form-tag-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 14px; line-height: 18px; text-align: center; color: #5A5C5E;` |
| 2734 | `.submit-form-actions-group` | `position: absolute; width: 254px; height: 38px; left: 1081px; top: 962px; display: flex; flex-direction: row; align-items: center; gap: 12px; z-index: 10;` |
| 2748 | `.submit-form-btn-back` | `box-sizing: border-box; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10px; gap: 10px; width: 121px; height: 38px; border: 1px solid rgba(39, 128, 196, 0.8); border-radius: 33px; background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 14px; color: rgba(39, 128, 196, 0.8); cursor: pointer; transition: all 0.2s ease;` |
| 2769 | `.submit-form-btn-back:hover` | `background: rgba(39, 128, 196, 0.05);` |
| 2773 | `.submit-form-btn-next` | `box-sizing: border-box; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 10px; gap: 10px; width: 121px; height: 38px; background: #2780C4; border-radius: 33px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 14px; color: #FFFFFF; cursor: pointer; transition: all 0.2s ease;` |
| 2794 | `.submit-form-btn-next:hover` | `background: #1f66a3;` |
| 2799 | `.submit-form-modal-backdrop` | `position: fixed; inset: 0; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 9999;` |
| 2810 | `.submit-form-modal-card` | `box-sizing: border-box; width: 610px; height: 477px; background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.2); box-shadow: 0px 0px 12.5px rgba(0, 0, 0, 0.15); border-radius: 24px; position: relative; display: flex; flex-direction: column; align-items: center; padding: 32px 40px;` |
| 2825 | `.submit-form-modal-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 24px; line-height: 30px; text-align: center; color: #000000;` |
| 2835 | `.submit-form-modal-icon-container` | `position: relative; width: 180px; height: 180px; margin-top: 24px; display: flex; align-items: center; justify-content: center;` |
| 2845 | `.submit-form-modal-icon-bg` | `position: absolute; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center;` |
| 2854 | `.submit-form-modal-icon-core` | `position: relative; width: 126px; height: 126px; display: flex; align-items: center; justify-content: center;` |
| 2863 | `.submit-form-modal-message` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 20px; line-height: 25px; text-align: center; color: #3D4949; margin-top: 24px; max-width: 367px;` |
| 2875 | `.submit-form-modal-btn` | `width: 349px; height: 64px; background: #2780C4; border-radius: 56.1383px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 23.8px; line-height: 30px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; margin-top: 24px;` |
| 2895 | `.submit-form-modal-btn:hover` | `background: #1f66a3; transform: translateY(-1px); box-shadow: 0px 4px 12px rgba(39, 128, 196, 0.2);` |
| 2904 | `.land-boundaries-bottom-card` | `position: absolute; height: 443px; left: 40px; right: 40px; top: 585px; background: #FFFFFF; border-radius: 24px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02); box-sizing: border-box;` |
| 2917 | `.land-boundaries-upload-container` | `position: absolute; width: 682px; height: 355px; left: 18px; top: 73px; background: #FFFFFF; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25); border-radius: 24px; box-sizing: border-box;` |
| 2930 | `.land-boundaries-dashed-dropzone` | `box-sizing: border-box; position: absolute; width: 314px; height: 327px; left: 12px; top: 14px; background: rgba(242, 244, 246, 0.5); border: 2px dashed rgba(225, 229, 239, 0.6); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.2s ease;` |
| 2947 | `.land-boundaries-dashed-dropzone.dragover` | `border-color: #2780C4; background: rgba(39, 128, 196, 0.05);` |
| 2953 | `.land-boundaries-icon-stack` | `position: absolute; width: 48.25px; height: 48.25px; left: calc(50% - 48.25px/2 - 0.88px); top: 58px; background: rgba(0, 112, 235, 0.1); border-radius: 9999px; display: flex; align-items: center; justify-content: center;` |
| 2966 | `.land-boundaries-icon-bg` | `position: absolute; width: 38.6px; height: 38.6px; left: calc(50% - 38.6px/2); top: calc(50% - 38.6px/2); background: linear-gradient(135deg, rgba(0, 88, 188, 0.84) 0%, rgba(0, 112, 235, 0.84) 100%); border-radius: 9999px; box-shadow: 0px 6px 9px -1.8px rgba(0, 88, 188, 0.2), 0px 2.4px 3.6px -2.4px rgba(0, 88, 188, 0.2); display: flex; align-items: center; justify-content: center;` |
| 2981 | `.land-boundaries-upload-title` | `position: absolute; width: 64px; height: 23px; left: calc(50% - 64px/2 - 0.5px); top: 121.25px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 18px; line-height: 23px; display: flex; align-items: center; text-align: center; color: #1A1C1D;` |
| 2998 | `.land-boundaries-upload-desc` | `position: absolute; width: 214px; height: 30px; left: calc(50% - 214px/2 + 1.5px); top: 151.25px; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; line-height: 15px; display: flex; align-items: center; text-align: center; color: #414755;` |
| 3015 | `.land-boundaries-btn-choose` | `position: absolute; width: 108px; height: 36px; left: calc(50% - 108px/2 - 0.5px); top: 218px; background: linear-gradient(135deg, #0095FF 0%, #1F8AFF 100%); border-radius: 9999px; border: none; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 12px; line-height: 24px; color: #FFFFFF; cursor: pointer; box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;` |
| 3036 | `.land-boundaries-btn-choose:hover` | `opacity: 0.95;` |
| 3041 | `.land-boundaries-format-row` | `position: absolute; width: 87px; height: 12px; left: 20px; top: 299px; display: flex; flex-direction: row; align-items: center; gap: 4px;` |
| 3053 | `.land-boundaries-format-lbl` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 10px; line-height: 12px; color: #000000;` |
| 3061 | `.land-boundaries-format-val` | `font-family: 'Inter', sans-serif; font-weight: 500; font-size: 10px; line-height: 12px; color: #000000;` |
| 3069 | `.land-boundaries-size-row` | `position: absolute; width: 94px; height: 12px; right: 15px; top: 297px; display: flex; flex-direction: row; align-items: center; gap: 2px;` |
| 3081 | `.land-boundaries-size-lbl` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 10px; line-height: 12px; color: #000000;` |
| 3089 | `.land-boundaries-size-val` | `font-family: 'Inter', sans-serif; font-weight: 500; font-size: 10px; line-height: 12px; color: #000000;` |
| 3098 | `.land-boundaries-uploaded-section` | `position: absolute; left: 341px; top: 14px; right: 14px; bottom: 14px; display: flex; flex-direction: column; overflow-y: auto;` |
| 3109 | `.land-boundaries-uploaded-header` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; font-size: 20px; line-height: 25px; color: #000000; margin-bottom: 12px;` |
| 3118 | `.land-boundaries-uploaded-list` | `flex: 1; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 12px;` |
| 3127 | `.land-boundaries-uploaded-list::-webkit-scrollbar` | `width: 4px;` |
| 3131 | `.land-boundaries-uploaded-list::-webkit-scrollbar-thumb` | `background: #E1E5EF; border-radius: 4px;` |
| 3136 | `.land-boundaries-file-card` | `display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 10px 14px; background: #F9F9FB; border: 1px solid #E2E2E6; border-radius: 12px;` |
| 3147 | `.land-boundaries-file-info` | `display: flex; flex-direction: row; align-items: center; gap: 12px;` |
| 3154 | `.land-boundaries-file-preview` | `width: 36px; height: 36px; border-radius: 8px; object-fit: cover; border: 1px solid #E1E5EF;` |
| 3162 | `.land-boundaries-file-fallback` | `width: 36px; height: 36px; border-radius: 8px; background: rgba(39, 128, 196, 0.1); display: flex; align-items: center; justify-content: center; color: #2780C4;` |
| 3173 | `.land-boundaries-file-meta` | `display: flex; flex-direction: column;` |
| 3178 | `.land-boundaries-file-name` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 13px; color: #1A1C1D; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` |
| 3189 | `.land-boundaries-file-size` | `font-family: 'Inter', sans-serif; font-weight: 400; font-size: 11px; color: #9AA3AD;` |
| 3196 | `.land-boundaries-file-delete` | `background: transparent; border: none; color: #EF4646; cursor: pointer; padding: 4px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease;` |
| 3209 | `.land-boundaries-file-delete:hover` | `background: rgba(239, 70, 70, 0.1);` |
| 3214 | `.land-boundaries-comments-container` | `flex: 1; min-width: 0; height: 383px; display: flex; flex-direction: column; gap: 13px;` |
| 3223 | `.land-boundaries-comments-title` | `font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 24px; line-height: 30px; color: #000000; margin: 0 0 13px 0;` |
| 3232 | `.land-boundaries-textarea-box` | `box-sizing: border-box; position: relative; width: 618px; height: 181px; background: rgba(187, 219, 240, 0.38); border: 1px solid #96C9ED; border-radius: 18px;` |
| 3242 | `.land-boundaries-textarea` | `width: 100%; height: 100%; background: transparent; border: none; outline: none; resize: none; box-sizing: border-box; padding: 24px 26px 50px 26px; font-family: 'Inter', sans-serif; font-weight: 400; font-size: 14px; line-height: 17px; color: #000000;` |
| 3258 | `.land-boundaries-textarea::placeholder` | `color: rgba(0, 0, 0, 0.4);` |
| 3262 | `.land-boundaries-mic-btn` | `position: absolute; width: 32px; height: 32px; left: 572px; top: 135px; background: #2680C4; border-radius: 90px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #FFFFFF; transition: opacity 0.2s ease;` |
| 3279 | `.land-boundaries-mic-btn:hover` | `opacity: 0.9;` |
| 3284 | `.land-boundaries-actions-bar` | `display: flex; flex-direction: row; align-items: center; padding: 0px; gap: 12px; position: absolute; width: auto; height: 38px; right: 0px; bottom: 0px;` |
| 3298 | `.boundaries-tabs-container` | `display: flex; flex-direction: column; gap: 30px; position: absolute; left: 30px; top: 30px; right: 30px;` |
| 3308 | `.boundaries-tabs-row` | `display: flex; flex-direction: row; align-items: center; gap: 16px;` |
| 3315 | `.boundaries-tab-item` | `box-sizing: border-box; display: flex; flex-direction: row; align-items: center; padding: 11.6px 22px; gap: 20px; height: 41.22px; background: #F9F9F9; border-radius: 72.5581px; box-shadow: 0px 42px 17px rgba(0, 0, 0, 0.01); border: 1px solid transparent; cursor: pointer; transition: all 0.2s ease;` |
| 3331 | `.boundaries-tab-item.active` | `border: 0.725581px solid #2780C4;` |
| 3335 | `.boundaries-tab-dot` | `box-sizing: border-box; width: 18px; height: 18px; background: #3D93D1; border: 4px solid #FFFFFF; border-radius: 25px; box-shadow: 0px 0px 0px 1px #3D93D1; flex-shrink: 0;` |
| 3346 | `.boundaries-tab-text` | `font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 14px; line-height: 18px; text-align: center; color: rgba(90, 92, 94, 0.74); white-space: nowrap;` |
| 3357 | `.boundaries-tab-item.active .boundaries-tab-text` | `color: #2780C4;` |
| 3362 | `.boundaries-timeline-line` | `position: absolute; width: 0px; height: 257px; left: 109px; top: 147px; border: 1px solid rgba(0, 120, 250, 0.25);` |
| 3371 | `.boundaries-timeline-node` | `position: absolute; display: flex; flex-direction: column; align-items: flex-start;` |
| 3378 | `.boundaries-timeline-node.node-1` | `left: 144px; top: 139px; width: 173px; height: 68px;` |
| 3385 | `.boundaries-timeline-node.node-2` | `left: 144px; top: 223px; width: 166px; height: 18px;` |
| 3392 | `.boundaries-timeline-node.node-3` | `left: 144px; top: 299px; width: 149px; height: 18px;` |
| 3399 | `.boundaries-timeline-node.node-4` | `left: 144px; top: 375px; width: 149px; height: 36px;` |
| 3407 | `.boundaries-timeline-dot` | `position: absolute; border-radius: 50%; box-sizing: border-box;` |
| 3413 | `.boundaries-timeline-dot.completed` | `width: 8px; height: 8px; background: #3D93D1; box-shadow: 0px 0px 0px 2.66667px #FFFFFF, 0px 0px 0px 4px rgba(37, 99, 235, 0.1);` |
| 3420 | `.boundaries-timeline-dot.active` | `width: 12.44px; height: 12.44px; background: #3D93D1; box-shadow: 0px 0px 0px 4.14667px #FFFFFF, 0px 0px 0px 6.22px rgba(37, 99, 235, 0.1);` |
| 3427 | `.boundaries-timeline-dot.upcoming` | `width: 12.44px; height: 12.44px; background: #FFFFFF; border: 2.07333px solid #85BFE5; box-shadow: 0px 0px 0px 4.14667px #F3F3F3;` |
| 3436 | `.boundaries-timeline-dot.dot-1.completed` | `left: 105px; top: 140px;` |
| 3441 | `.boundaries-timeline-dot.dot-1.active,<br>.boundaries-timeline-dot.dot-1.upcoming` | `left: 103px; top: 138px;` |
| 3447 | `.boundaries-timeline-dot.dot-2.completed` | `left: 105px; top: 228px;` |
| 3452 | `.boundaries-timeline-dot.dot-2.active,<br>.boundaries-timeline-dot.dot-2.upcoming` | `left: 103px; top: 225.56px;` |
| 3458 | `.boundaries-timeline-dot.dot-3.completed` | `left: 105px; top: 310px;` |
| 3463 | `.boundaries-timeline-dot.dot-3.active,<br>.boundaries-timeline-dot.dot-3.upcoming` | `left: 103px; top: 307.44px;` |
| 3469 | `.boundaries-timeline-dot.dot-4.completed` | `left: 105px; top: 392px;` |
| 3474 | `.boundaries-timeline-dot.dot-4.active,<br>.boundaries-timeline-dot.dot-4.upcoming` | `left: 103px; top: 390px;` |
| 3480 | `.boundaries-timeline-node.active .submit-form-step-title` | `color: #138FFF !important; font-weight: bold;` |
| 3486 | `.upload-modal-backdrop` | `position: absolute; inset: 0; background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; border-radius: 32px;` |
| 3499 | `.upload-modal-frame` | `box-sizing: border-box; position: absolute; width: 610px; height: 377px; left: calc(50% - 610px/2); top: calc(50% - 377px/2 + 0.5px); background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.2); box-shadow: 0px 0px 12.5px rgba(0, 0, 0, 0.15); border-radius: 24px;` |
| 3513 | `.upload-modal-title` | `position: absolute; width: 255px; height: 30px; left: 35px; top: 29px; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 24px; line-height: 30px; display: flex; align-items: center; color: #000000; margin: 0;` |
| 3531 | `.upload-modal-card` | `box-sizing: border-box; position: absolute; width: 240px; height: 226px; background: #FFFFFF; border-radius: 12px;` |
| 3540 | `.upload-modal-card.cover-image` | `left: 35px; top: 101px; box-shadow: 0px 0px 7.3px rgba(0, 0, 0, 0.17);` |
| 3546 | `.upload-modal-card.land-images` | `left: 319px; top: 101px; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);` |
| 3553 | `.upload-modal-card-title` | `position: absolute; width: 148px; height: 30px; left: 46px; top: 41px; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 24px; line-height: 30px; display: flex; align-items: center; justify-content: center;` |
| 3569 | `.upload-modal-card.cover-image .upload-modal-card-title` | `color: #000000;` |
| 3573 | `.upload-modal-card.land-images .upload-modal-card-title` | `color: rgba(0, 0, 0, 0.57);` |
| 3578 | `.upload-modal-btn` | `display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 8px 44px; gap: 10px; position: absolute; width: 152px; height: 39px; left: 44px; top: 168px; border-radius: 41px; border: none; cursor: pointer; transition: opacity 0.2s ease;` |
| 3596 | `.upload-modal-card.cover-image .upload-modal-btn` | `background: #168DFF;` |
| 3600 | `.upload-modal-card.land-images .upload-modal-btn` | `background: rgba(22, 141, 255, 0.72);` |
| 3604 | `.upload-modal-btn-text` | `width: 64px; height: 23px; font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 18px; line-height: 23px; display: flex; align-items: center; justify-content: center; color: #FFFFFF;` |
| 3619 | `.upload-modal-icon-stack` | `position: absolute; width: 48.25px; height: 48.25px; left: calc(50% - 48.25px/2 + 0.12px); top: 93px; background: rgba(0, 112, 235, 0.1); border-radius: 6030.65px; display: flex; align-items: center; justify-content: center;` |
| 3632 | `.upload-modal-icon-bg` | `position: absolute; width: 38.6px; height: 38.6px; left: calc(50% - 38.6px/2); top: calc(50% - 38.6px/2); border-radius: 6030.65px;` |
| 3641 | `.upload-modal-card.cover-image .upload-modal-icon-bg` | `background: linear-gradient(135deg, rgba(0, 88, 188, 0.84) 0%, rgba(0, 112, 235, 0.84) 100%);` |
| 3645 | `.upload-modal-card.land-images .upload-modal-icon-bg` | `background: linear-gradient(135deg, rgba(0, 88, 188, 0.7) 0%, rgba(0, 112, 235, 0.7) 100%);` |
| 3649 | `.upload-modal-icon-shadow` | `position: absolute; width: 38.6px; height: 38.6px; left: calc(50% - 38.6px/2); top: calc(50% - 38.6px/2); background: rgba(255, 255, 255, 0.002); box-shadow: 0px 6.03125px 9.04688px -1.80938px rgba(0, 88, 188, 0.2), 0px 2.4125px 3.61875px -2.4125px rgba(0, 88, 188, 0.2); border-radius: 6030.65px; pointer-events: none;` |
| 3661 | `.upload-modal-icon` | `position: absolute; width: 20px; height: 20px; left: calc(50% - 20px/2); top: calc(50% - 20px/2); display: flex; align-items: center; justify-content: center; color: #FFFFFF;` |
| 3674 | `.boundaries-tab-item.completed` | `border: 0.725581px solid rgba(122, 149, 28, 0.43); background: #FFFFFF;` |
| 3679 | `.boundaries-tab-item.completed .boundaries-tab-text` | `color: #5A5C5E;` |
| 3684 | `.land-boundaries-file-card.cover-theme` | `height: 59px; background: #E5F1F9 !important; border: none !important; padding: 8px 12px;` |
| 3691 | `.land-boundaries-file-card.cover-theme .cover-icon-bg` | `width: 36px; height: 36px; background: #FFFFFF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #168DFF;` |
| 3702 | `.land-boundaries-file-card.cover-theme .cover-delete-bg` | `width: 36px; height: 36px; background: #FFFFFF; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #FF4D4D; border: none; cursor: pointer; transition: opacity 0.2s;` |
| 3716 | `.land-boundaries-file-card.cover-theme .cover-delete-bg:hover` | `opacity: 0.8;` |
| 3721 | `.region-hover-popup .maplibregl-popup-content` | `background: transparent; padding: 0; box-shadow: none; border-radius: 0;` |
| 3728 | `.region-hover-popup .maplibregl-popup-tip` | `display: none;` |
| 3734 | `.scrollbar-hide::-webkit-scrollbar` | `display: none;` |
| 3738 | `.scrollbar-hide` | `-ms-overflow-style: none; scrollbar-width: none;` |

**Media contexts:** `@media (min-width: 1024px)`, `@media (min-width: 768px)`, `@media (min-width: 1024px)`. No custom @keyframes or reduced-motion media query is defined.

### 18.4 Literal color provenance beyond root tokens

Every unique HEX/RGB/RGBA literal found in project `.ts`,`.tsx`,`.css` source is indexed below with a source example. Local SVG asset internals are assets, not promoted into design tokens. Utility palette names such as gray-100 remain documented as classes in18.2; their exact color-space values are supplied by the unresolved installed Tailwind theme and have not been converted speculatively.

These are raw declarations, not a consolidated palette. The same RGB channels can occur with different case/alpha formatting; those spellings are retained. Dynamic data-provided colors remain props unless a static palette is supplied in data modules.

| Exact literal | Source example | Source locations found |
| --- | --- | --- |
| `#000000` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:181](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L181) | 26 |
| `#0052cc` | [src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx:49](src/features/super-admin/sub-features/upload-docs/components/UploadSubmittedModal.tsx#L49) | 8 |
| `#00629E` | [src/index.css:493](src/index.css#L493) | 1 |
| `#006D3A` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:25](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L25) | 6 |
| `#0095FF` | [src/index.css:192](src/index.css#L192) | 2 |
| `#0284C7` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:180](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L180) | 5 |
| `#047857` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:1286](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L1286) | 1 |
| `#059669` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:75](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L75) | 1 |
| `#06B6D4` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:19](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L19) | 2 |
| `#07192C` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1544](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1544) | 3 |
| `#081A24` | [src/index.css:21](src/index.css#L21) | 1 |
| `#091426` | [src/index.css:37](src/index.css#L37) | 2 |
| `#0A2540` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:651](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L651) | 7 |
| `#0B6230` | [src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx:152](src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx#L152) | 2 |
| `#0E7490` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:19](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L19) | 2 |
| `#0F1011` | [src/features/super-admin/components/layout/Sidebar.tsx:18](src/features/super-admin/components/layout/Sidebar.tsx#L18) | 2 |
| `#0F172A` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:765](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L765) | 19 |
| `#0F2F4C` | [src/index.css:115](src/index.css#L115) | 1 |
| `#103354` | [src/index.css:20](src/index.css#L20) | 1 |
| `#10B981` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:171](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L171) | 35 |
| `#111` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:430](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L430) | 15 |
| `#111827` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:565](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L565) | 90 |
| `#118` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:264](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L264) | 4 |
| `#121820` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:318](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L318) | 2 |
| `#131600` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:69](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L69) | 5 |
| `#138FFF` | [src/index.css:1545](src/index.css#L1545) | 8 |
| `#1565C0` | [src/features/super-admin/data/mockDashboardData.ts:440](src/features/super-admin/data/mockDashboardData.ts#L440) | 2 |
| `#15803D` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:128](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L128) | 41 |
| `#1664A2` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:18](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L18) | 1 |
| `#166534` | [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx:262](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx#L262) | 4 |
| `#166FE5` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:527](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L527) | 10 |
| `#168DFF` | [src/index.css:3597](src/index.css#L3597) | 2 |
| `#16A34A` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx:17](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx#L17) | 17 |
| `#174D7B` | [src/index.css:19](src/index.css#L19) | 1 |
| `#1864A0` | [src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx:159](src/features/super-admin/sub-features/maintenance/components/MaintenanceUpdatePasswordModal.tsx#L159) | 7 |
| `#1877F2` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:377](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L377) | 39 |
| `#191B1C` | [src/features/super-admin/components/layout/Sidebar.tsx:14](src/features/super-admin/components/layout/Sidebar.tsx#L14) | 3 |
| `#191C1B` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:196](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L196) | 1 |
| `#191C1E` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:246](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L246) | 5 |
| `#191E00` | [src/index.css:89](src/index.css#L89) | 1 |
| `#191b1c` | [src/index.css:42](src/index.css#L42) | 1 |
| `#1A1A1A` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:113](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L113) | 1 |
| `#1A1C1D` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:83](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L83) | 123 |
| `#1B3A2D` | [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx:92](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx#L92) | 14 |
| `#1C5F9D` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1443](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1443) | 2 |
| `#1D1E20` | [src/index.css:2199](src/index.css#L2199) | 1 |
| `#1D4ED8` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:608](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L608) | 5 |
| `#1D5E9C` | [src/index.css:181](src/index.css#L181) | 1 |
| `#1D7ABE` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:26](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L26) | 16 |
| `#1E252B` | [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx:38](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx#L38) | 4 |
| `#1E293B` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:105](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L105) | 18 |
| `#1E3A8A` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:92](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L92) | 1 |
| `#1E75BB` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:106](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L106) | 67 |
| `#1F2937` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:75](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L75) | 20 |
| `#1F66A3` | [src/index.css:18](src/index.css#L18) | 1 |
| `#1F8AFF` | [src/index.css:193](src/index.css#L193) | 2 |
| `#1a1f0f` | [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx:121](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx#L121) | 1 |
| `#1f2937` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:62](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L62) | 1 |
| `#1f66a3` | [src/index.css:605](src/index.css#L605) | 7 |
| `#201` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:334](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L334) | 2 |
| `#2196F3` | [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx:97](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx#L97) | 1 |
| `#222` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:426](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L426) | 10 |
| `#2244cc` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:481](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L481) | 5 |
| `#22C55E` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx:297](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx#L297) | 3 |
| `#22cc44` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:513](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L513) | 1 |
| `#252729` | [src/features/super-admin/components/layout/Sidebar.tsx:36](src/features/super-admin/components/layout/Sidebar.tsx#L36) | 3 |
| `#262C00` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandCard.tsx:53](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandCard.tsx#L53) | 1 |
| `#2680C4` | [src/index.css:3268](src/index.css#L3268) | 1 |
| `#2680c4` | [src/index.css:127](src/index.css#L127) | 1 |
| `#2780C4` | [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx:506](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx#L506) | 19 |
| `#2A3008` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:102](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L102) | 43 |
| `#2A3125` | [src/features/super-admin/components/FollowUpModal.tsx:151](src/features/super-admin/components/FollowUpModal.tsx#L151) | 25 |
| `#2B2D2F` | [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx:397](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx#L397) | 24 |
| `#2B3024` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:215](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L215) | 6 |
| `#2C2C2C` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:177](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L177) | 6 |
| `#2D3012` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:86](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L86) | 4 |
| `#2D3032` | [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx:75](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx#L75) | 73 |
| `#2D3319` | [src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx:121](src/features/super-admin/sub-features/dashboard/components/PoolBuyingCard.tsx#L121) | 6 |
| `#2D3409` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:188](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L188) | 34 |
| `#2D3509` | [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx:43](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx#L43) | 2 |
| `#2E7D32` | [src/features/super-admin/data/mockDashboardData.ts:414](src/features/super-admin/data/mockDashboardData.ts#L414) | 6 |
| `#2a2` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:468](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L468) | 1 |
| `#2a2f1e` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:674](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L674) | 3 |
| `#2a5c3f` | [src/index.css:122](src/index.css#L122) | 1 |
| `#2c5f8a` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:417](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L417) | 1 |
| `#2c6b4a` | [src/index.css:124](src/index.css#L124) | 1 |
| `#2e7d32` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx:133](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx#L133) | 1 |
| `#304` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:287](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L287) | 4 |
| `#333` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:540](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L540) | 7 |
| `#334155` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:501](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L501) | 21 |
| `#353535` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:170](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L170) | 12 |
| `#363434` | [src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx:257](src/features/super-admin/sub-features/upload-docs/components/LocalIntelligenceUploadFile.tsx#L257) | 7 |
| `#374151` | [src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx:105](src/features/super-admin/sub-features/maintenance/components/ProjectDistributionCard.tsx#L105) | 6 |
| `#37E8DD` | [src/index.css:155](src/index.css#L155) | 1 |
| `#388E3C` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:81](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L81) | 4 |
| `#38BDF8` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:662](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L662) | 2 |
| `#3A8EE6` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx:204](src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx#L204) | 8 |
| `#3B3B3B` | [src/features/super-admin/data/mockDashboardData.ts:179](src/features/super-admin/data/mockDashboardData.ts#L179) | 4 |
| `#3B82F6` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx:21](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx#L21) | 15 |
| `#3D4949` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:26](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L26) | 51 |
| `#3D4A0D` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:102](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L102) | 35 |
| `#3D5A1E` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx:185](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx#L185) | 1 |
| `#3D93D1` | [src/index.css:16](src/index.css#L16) | 17 |
| `#3E421B` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:62](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L62) | 6 |
| `#3E4A35` | [src/features/super-admin/sub-features/legal-docs/pages/LocalIntelligenceFlow.tsx:61](src/features/super-admin/sub-features/legal-docs/pages/LocalIntelligenceFlow.tsx#L61) | 1 |
| `#3E4A3D` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:737](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L737) | 15 |
| `#3a7bd5` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:417](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L417) | 1 |
| `#3a7d5a` | [src/index.css:123](src/index.css#L123) | 1 |
| `#3d4a0d` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx:86](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx#L86) | 1 |
| `#3e4a3d` | [src/index.css:63](src/index.css#L63) | 1 |
| `#3f470d` | [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx:307](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx#L307) | 2 |
| `#414755` | [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx:221](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx#L221) | 2 |
| `#442` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:240](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L240) | 6 |
| `#45474C` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:72](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L72) | 4 |
| `#45483E` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:199](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L199) | 2 |
| `#475569` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:840](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L840) | 20 |
| `#48A760` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:18](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L18) | 2 |
| `#4A5568` | [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx:48](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx#L48) | 3 |
| `#4B5563` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:69](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L69) | 17 |
| `#4CAF50` | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx:174](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx#L174) | 3 |
| `#4F46E5` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:83](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L83) | 5 |
| `#4a7bbb` | [src/index.css:128](src/index.css#L128) | 1 |
| `#4a8f4a` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:417](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L417) | 1 |
| `#4caf50` | [src/index.css:98](src/index.css#L98) | 1 |
| `#529CFA` | [src/features/super-admin/sub-features/legal-docs/components/FormFields.tsx:123](src/features/super-admin/sub-features/legal-docs/components/FormFields.tsx#L123) | 1 |
| `#545E6A` | [src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx:59](src/features/super-admin/sub-features/users/pages/SuperAdminUserProfile.tsx#L59) | 3 |
| `#555` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:578](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L578) | 8 |
| `#576400` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:1553](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L1553) | 2 |
| `#5A5C5E` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:86](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L86) | 22 |
| `#5C5C5C` | [src/index.css:30](src/index.css#L30) | 1 |
| `#5CA2D3` | [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx:398](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx#L398) | 3 |
| `#5FBF5F` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:450](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L450) | 1 |
| `#606170` | [src/index.css:135](src/index.css#L135) | 1 |
| `#626C70` | [src/index.css:35](src/index.css#L35) | 1 |
| `#626c70` | [src/index.css:41](src/index.css#L41) | 1 |
| `#64748B` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:99](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L99) | 89 |
| `#666` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:630](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L630) | 3 |
| `#6B7280` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx:51](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx#L51) | 4 |
| `#6B8A2E` | [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx:81](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx#L81) | 2 |
| `#6D7A7A` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:118](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L118) | 31 |
| `#6b7c45` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:170](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L170) | 4 |
| `#757575` | [src/features/super-admin/data/mockDashboardData.ts:466](src/features/super-admin/data/mockDashboardData.ts#L466) | 1 |
| `#767676` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:98](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L98) | 2 |
| `#777` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:127](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L127) | 2 |
| `#78909C` | [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx:94](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx#L94) | 8 |
| `#7A8699` | [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx:80](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx#L80) | 53 |
| `#7A8C9E` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:361](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L361) | 1 |
| `#7A951C` | [src/index.css:104](src/index.css#L104) | 1 |
| `#7C5CBF` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:30](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L30) | 1 |
| `#7DB4D8` | [src/index.css:15](src/index.css#L15) | 1 |
| `#7E22CE` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:616](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L616) | 3 |
| `#7F8487` | [src/index.css:2207](src/index.css#L2207) | 1 |
| `#808277` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:234](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L234) | 1 |
| `#8280FF` | [src/index.css:187](src/index.css#L187) | 1 |
| `#854D0E` | [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx:145](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx#L145) | 5 |
| `#85BFE5` | [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx:398](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx#L398) | 11 |
| `#86EFAC` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx:297](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx#L297) | 7 |
| `#888` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:533](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L533) | 7 |
| `#8A96A3` | [src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx:54](src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx#L54) | 8 |
| `#8B5CF6` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:190](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L190) | 1 |
| `#8B9A46` | [src/features/super-admin/data/mockDashboardData.ts:180](src/features/super-admin/data/mockDashboardData.ts#L180) | 10 |
| `#8BA3BA` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx:58](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx#L58) | 5 |
| `#8BC34A` | [src/features/super-admin/components/FollowUpModal.tsx:25](src/features/super-admin/components/FollowUpModal.tsx#L25) | 37 |
| `#8C9088` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx:180](src/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport.tsx#L180) | 11 |
| `#8CB43A` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:47](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L47) | 5 |
| `#8CC63F` | [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx:133](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx#L133) | 8 |
| `#8DC63F` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:20](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L20) | 2 |
| `#8E9093` | [src/features/super-admin/components/layout/Sidebar.tsx:36](src/features/super-admin/components/layout/Sidebar.tsx#L36) | 3 |
| `#8fbc2a` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:663](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L663) | 7 |
| `#8fbc5a` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:417](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L417) | 2 |
| `#90A4AE` | [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx:103](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx#L103) | 1 |
| `#92400E` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:872](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L872) | 1 |
| `#9333EA` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx:227](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx#L227) | 1 |
| `#93C5FD` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:606](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L606) | 1 |
| `#94A3B8` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:110](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L110) | 17 |
| `#94C7E9` | [src/index.css:118](src/index.css#L118) | 1 |
| `#95C11E` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:84](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L84) | 1 |
| `#96C9ED` | [src/index.css:185](src/index.css#L185) | 2 |
| `#991B1B` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1336](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1336) | 1 |
| `#9AA3AD` | [src/index.css:2381](src/index.css#L2381) | 4 |
| `#9BB424` | [src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx:57](src/features/super-admin/sub-features/upload-docs/components/UploadLandDetailsTab.tsx#L57) | 6 |
| `#9CA3AF` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx:52](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx#L52) | 6 |
| `#9ca3af` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:129](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L129) | 1 |
| `#A16207` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1280](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1280) | 1 |
| `#A1BEEF` | [src/index.css:136](src/index.css#L136) | 1 |
| `#A3C33D` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:240](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L240) | 32 |
| `#A5A5A5` | [src/index.css:2223](src/index.css#L2223) | 1 |
| `#A5B767` | [src/index.css:2718](src/index.css#L2718) | 1 |
| `#A5BFD7` | [src/index.css:173](src/index.css#L173) | 1 |
| `#A855F7` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:18](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L18) | 2 |
| `#AED6EF` | [src/index.css:14](src/index.css#L14) | 1 |
| `#B0BEC5` | [src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx:102](src/features/super-admin/components/SuperAdminNotificationsDropdown.tsx#L102) | 2 |
| `#B1BCB3` | [src/features/super-admin/components/SuperAdminHeader.tsx:80](src/features/super-admin/components/SuperAdminHeader.tsx#L80) | 1 |
| `#B2EBF2` | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx:57](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx#L57) | 1 |
| `#B8D327` | [src/index.css:105](src/index.css#L105) | 1 |
| `#B8D995` | [src/index.css:139](src/index.css#L139) | 1 |
| `#B91C1C` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:867](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L867) | 5 |
| `#BA1A1A` | [src/index.css:75](src/index.css#L75) | 3 |
| `#BA9A9A` | [src/index.css:1722](src/index.css#L1722) | 1 |
| `#BBF7D0` | [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx:257](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx#L257) | 4 |
| `#BCC6BC` | [src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx:152](src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx#L152) | 1 |
| `#BCC9C9` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:107](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L107) | 3 |
| `#BCE3D9` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:90](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L90) | 1 |
| `#BDD327` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx:72](src/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands.tsx#L72) | 91 |
| `#BDE0FE` | [src/features/super-admin/sub-features/legal-docs/pages/ValuationFlow.tsx:126](src/features/super-admin/sub-features/legal-docs/pages/ValuationFlow.tsx#L126) | 1 |
| `#BE185D` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:57](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L57) | 1 |
| `#BFDBFE` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:68](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L68) | 3 |
| `#C0C2B7` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:272](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L272) | 6 |
| `#C2410C` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:602](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L602) | 5 |
| `#C5D654` | [src/features/super-admin/data/mockDashboardData.ts:181](src/features/super-admin/data/mockDashboardData.ts#L181) | 9 |
| `#C5E1A5` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:199](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L199) | 2 |
| `#C6C8BA` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:194](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L194) | 2 |
| `#C8DE52` | [src/index.css:106](src/index.css#L106) | 1 |
| `#CA8A04` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:66](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L66) | 3 |
| `#CAD69F` | [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx:95](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx#L95) | 1 |
| `#CBD5E1` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderCompletedDetail.tsx:40](src/features/super-admin/sub-features/maintenance/components/WorkOrderCompletedDetail.tsx#L40) | 20 |
| `#CBD796` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:1131](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L1131) | 2 |
| `#CBDBAF` | [src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx:1487](src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx#L1487) | 1 |
| `#CCDB99` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:227](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L227) | 2 |
| `#CED2B4` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:227](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L227) | 1 |
| `#D0D0D2` | [src/index.css:894](src/index.css#L894) | 1 |
| `#D0D5DD` | [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx:430](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx#L430) | 5 |
| `#D0E4FA` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1350](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1350) | 1 |
| `#D1D5DB` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:52](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L52) | 10 |
| `#D3DDE2` | [src/index.css:150](src/index.css#L150) | 1 |
| `#D3ECFE` | [src/index.css:172](src/index.css#L172) | 1 |
| `#D4AF37` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:90](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L90) | 1 |
| `#D4E6F3` | [src/index.css:13](src/index.css#L13) | 1 |
| `#D4E8B0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx:177](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails.tsx#L177) | 1 |
| `#D5DF96` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx:39](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx#L39) | 1 |
| `#D5DFE8` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:361](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L361) | 1 |
| `#D6E6FF` | [src/index.css:137](src/index.css#L137) | 1 |
| `#D7EBF7` | [src/index.css:151](src/index.css#L151) | 2 |
| `#D84315` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:111](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L111) | 4 |
| `#D8E3FB` | [src/index.css:79](src/index.css#L79) | 1 |
| `#D96B27` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:118](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L118) | 1 |
| `#D97706` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:322](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L322) | 1 |
| `#DBE3DA` | [src/features/super-admin/components/SuperAdminHeader.tsx:80](src/features/super-admin/components/SuperAdminHeader.tsx#L80) | 1 |
| `#DBEAFE` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:608](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L608) | 2 |
| `#DC2626` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:79](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L79) | 17 |
| `#DCE4EC` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:361](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L361) | 1 |
| `#DCFCE7` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:474](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L474) | 23 |
| `#E0E0E0` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:203](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L203) | 2 |
| `#E0E7FF` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:83](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L83) | 5 |
| `#E0F2E9` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:116](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L116) | 1 |
| `#E0F2FE` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:619](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L619) | 4 |
| `#E0F7FA` | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx:57](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx#L57) | 1 |
| `#E1E5EF` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:269](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L269) | 13 |
| `#E1E8B0` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:214](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L214) | 5 |
| `#E2E2E4` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:116](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L116) | 5 |
| `#E2E2E6` | [src/index.css:3143](src/index.css#L3143) | 1 |
| `#E2E8F0` | [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx:126](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx#L126) | 50 |
| `#E33B32` | [src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx:573](src/features/super-admin/sub-features/upload-docs/components/LandAndBoundariesUploadFile.tsx#L573) | 2 |
| `#E3F2FD` | [src/features/super-admin/data/mockDashboardData.ts:440](src/features/super-admin/data/mockDashboardData.ts#L440) | 2 |
| `#E5E385` | [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx:155](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx#L155) | 2 |
| `#E5E7EB` | [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx:77](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx#L77) | 3 |
| `#E5E9D8` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:264](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L264) | 8 |
| `#E5F0EB` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:431](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L431) | 2 |
| `#E5F1F9` | [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx:296](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx#L296) | 7 |
| `#E6EEAD` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx:39](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx#L39) | 20 |
| `#E7E8E9` | [src/index.css:76](src/index.css#L76) | 1 |
| `#E88B5A` | [src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx:159](src/features/super-admin/sub-features/dashboard/components/SalesReportChart.tsx#L159) | 4 |
| `#E8EAE0` | [src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx:63](src/features/super-admin/sub-features/dashboard/components/TopPerformersList.tsx#L63) | 1 |
| `#E8F1FD` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:1080](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L1080) | 1 |
| `#E8F5E9` | [src/features/super-admin/components/FollowUpModal.tsx:109](src/features/super-admin/components/FollowUpModal.tsx#L109) | 6 |
| `#E8F8F0` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:89](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L89) | 5 |
| `#E8F8F3` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:291](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L291) | 2 |
| `#E9ECEF` | [src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx:54](src/features/super-admin/sub-features/maintenance/components/PipelineStepper.tsx#L54) | 3 |
| `#E9EDF0` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx:61](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx#L61) | 1 |
| `#EA580C` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:758](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L758) | 1 |
| `#EAB308` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx:34](src/features/super-admin/sub-features/dashboard/components/SuperAdminSoldOutTable.tsx#L34) | 7 |
| `#EAEAEA` | [src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx:47](src/features/super-admin/sub-features/maintenance/components/MaintenanceNavbar.tsx#L47) | 1 |
| `#EAEFF4` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:100](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L100) | 1 |
| `#EAEFF5` | [src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx:196](src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx#L196) | 1 |
| `#EAF3FA` | [src/index.css:12](src/index.css#L12) | 1 |
| `#EBEBEB` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:98](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L98) | 3 |
| `#EBEFF3` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:218](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L218) | 1 |
| `#EBF3FA` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:159](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L159) | 1 |
| `#EBF3FC` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:783](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L783) | 2 |
| `#EBF5FA` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:418](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L418) | 2 |
| `#EBF5FB` | [src/index.css:112](src/index.css#L112) | 1 |
| `#EBF5FF` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1443](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1443) | 1 |
| `#EBF7EE` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:18](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L18) | 1 |
| `#EC4899` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:57](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L57) | 1 |
| `#ECEFF2` | [src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx:22](src/features/super-admin/sub-features/maintenance/components/EstimationSuccessModal.tsx#L22) | 29 |
| `#ECFDF5` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:75](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L75) | 2 |
| `#EDEEEB` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:258](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L258) | 2 |
| `#EEEEEF` | [src/index.css:2167](src/index.css#L2167) | 1 |
| `#EEEEF0` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:108](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L108) | 5 |
| `#EEF2F6` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx:334](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx#L334) | 2 |
| `#EEF5FA` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx:450](src/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries.tsx#L450) | 3 |
| `#EF4444` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:11](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L11) | 20 |
| `#EF4646` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:52](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L52) | 5 |
| `#EFF6FF` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx:310](src/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation.tsx#L310) | 4 |
| `#EFF8FF` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:179](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L179) | 1 |
| `#F0EEF0` | [src/index.css:138](src/index.css#L138) | 1 |
| `#F0F4D4` | [src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx:246](src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx#L246) | 2 |
| `#F0F4F8` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx:205](src/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments.tsx#L205) | 3 |
| `#F0F7E4` | [src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx:80](src/features/super-admin/sub-features/dashboard/components/VisitorSalesCard.tsx#L80) | 7 |
| `#F0F7FF` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx:1350](src/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails.tsx#L1350) | 1 |
| `#F0FDF4` | [src/features/super-admin/components/FollowUpModal.tsx:25](src/features/super-admin/components/FollowUpModal.tsx#L25) | 4 |
| `#F1F3F5` | [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx:171](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx#L171) | 6 |
| `#F1F4F7` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:984](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L984) | 1 |
| `#F1F4F8` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx:311](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx#L311) | 1 |
| `#F1F5F9` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:501](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L501) | 25 |
| `#F2F2F2` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:157](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L157) | 10 |
| `#F2F4F6` | [src/index.css:2409](src/index.css#L2409) | 1 |
| `#F2F4F7` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx:26](src/features/super-admin/sub-features/dashboard/components/SuperAdminFarmlandCard.tsx#L26) | 3 |
| `#F2F8FC` | [src/index.css:2082](src/index.css#L2082) | 2 |
| `#F2FBF4` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx:342](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx#L342) | 1 |
| `#F2FBF6` | [src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx:116](src/features/super-admin/sub-features/maintenance/components/AssignmentSuccessModal.tsx#L116) | 1 |
| `#F2FFDA` | [src/features/super-admin/components/SuperAdminHeader.tsx:90](src/features/super-admin/components/SuperAdminHeader.tsx#L90) | 1 |
| `#F2FFDB` | [src/features/super-admin/components/SuperAdminHeader.tsx:86](src/features/super-admin/components/SuperAdminHeader.tsx#L86) | 1 |
| `#F3E8FF` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:616](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L616) | 2 |
| `#F3F0FA` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:30](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L30) | 1 |
| `#F3F3F3` | [src/index.css:1558](src/index.css#L1558) | 4 |
| `#F3F3F5` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx:114](src/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin.tsx#L114) | 20 |
| `#F3F4F1` | [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx:186](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx#L186) | 2 |
| `#F3F4F6` | [src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx:18](src/features/super-admin/sub-features/dashboard/components/StatusCards.tsx#L18) | 13 |
| `#F3F6E8` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:62](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L62) | 4 |
| `#F4F5F7` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx:225](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx#L225) | 2 |
| `#F4F6F8` | [src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx:48](src/features/super-admin/sub-features/maintenance/components/OperationsOverviewCard.tsx#L48) | 3 |
| `#F4F7E6` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:252](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L252) | 2 |
| `#F4F9FF` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:68](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L68) | 4 |
| `#F4FBF7` | [src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx:423](src/features/super-admin/sub-features/maintenance/components/WorkOrderInProgressDetail.tsx#L423) | 1 |
| `#F57C00` | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx:179](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx#L179) | 1 |
| `#F57F17` | [src/features/super-admin/data/mockDashboardData.ts:427](src/features/super-admin/data/mockDashboardData.ts#L427) | 5 |
| `#F59E0B` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:19](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L19) | 5 |
| `#F5F3FF` | [src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts:189](src/features/super-admin/sub-features/maintenance/data/maintenanceData.ts#L189) | 1 |
| `#F5F5F5` | [src/features/super-admin/data/mockDashboardData.ts:466](src/features/super-admin/data/mockDashboardData.ts#L466) | 3 |
| `#F5F5F7` | [src/index.css:923](src/index.css#L923) | 1 |
| `#F6F7F6` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx:40](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx#L40) | 12 |
| `#F6F9E2` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:63](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L63) | 2 |
| `#F8F9FA` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx:61](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx#L61) | 11 |
| `#F8F9FB` | [src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx:77](src/features/super-admin/sub-features/maintenance/components/GeneratedEstimationModal.tsx#L77) | 10 |
| `#F8FAFC` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:405](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L405) | 25 |
| `#F97316` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:56](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L56) | 1 |
| `#F9F9F9` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx:35](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx#L35) | 19 |
| `#F9F9FB` | [src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx:134](src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx#L134) | 6 |
| `#F9FAFB` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:63](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L63) | 10 |
| `#F9FBF9` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx:96](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx#L96) | 1 |
| `#F9FCE9` | [src/index.css:103](src/index.css#L103) | 1 |
| `#FAFAFA` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx:206](src/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails.tsx#L206) | 3 |
| `#FAFBFD` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx:372](src/features/super-admin/sub-features/maintenance/components/ServiceRequestFilterModal.tsx#L372) | 1 |
| `#FBBF24` | [src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx:23](src/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation.tsx#L23) | 4 |
| `#FBE9E7` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:110](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L110) | 1 |
| `#FCA5A5` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:567](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L567) | 5 |
| `#FCD34D` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:872](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L872) | 1 |
| `#FDBA74` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:758](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L758) | 1 |
| `#FDE047` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:572](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L572) | 2 |
| `#FDE68A` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:322](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L322) | 1 |
| `#FDFDFE` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:512](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L512) | 6 |
| `#FECACA` | [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx:274](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx#L274) | 4 |
| `#FECDD3` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx:244](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx#L244) | 1 |
| `#FED7AA` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:742](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L742) | 1 |
| `#FEE2E2` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:9](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L9) | 14 |
| `#FEECEC` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx:381](src/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders.tsx#L381) | 1 |
| `#FEF08A` | [src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx:145](src/features/super-admin/sub-features/maintenance/components/QuotationStatusDetailsModal.tsx#L145) | 3 |
| `#FEF2F2` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:79](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L79) | 6 |
| `#FEF3C7` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:872](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L872) | 1 |
| `#FEF7EC` | [src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx:322](src/features/super-admin/sub-features/maintenance/components/AssignFieldOfficerModal.tsx#L322) | 2 |
| `#FEF9C3` | [src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx:66](src/features/super-admin/sub-features/maintenance/components/ServiceRequestCard.tsx#L66) | 3 |
| `#FF4B4B` | [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx:436](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx#L436) | 1 |
| `#FF4D4D` | [src/index.css:3710](src/index.css#L3710) | 1 |
| `#FFAB91` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:113](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L113) | 1 |
| `#FFE082` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:79](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L79) | 1 |
| `#FFE5E5` | [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx:436](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx#L436) | 1 |
| `#FFECB3` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:76](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L76) | 1 |
| `#FFEDD5` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx:602](src/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests.tsx#L602) | 3 |
| `#FFF0F0` | [src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx:436](src/features/super-admin/sub-features/users/pages/SuperAdminProfile.tsx#L436) | 1 |
| `#FFF1F2` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx:244](src/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile.tsx#L244) | 1 |
| `#FFF7ED` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx:742](src/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails.tsx#L742) | 1 |
| `#FFF8E1` | [src/features/super-admin/data/mockDashboardData.ts:427](src/features/super-admin/data/mockDashboardData.ts#L427) | 2 |
| `#FFFCEE` | [src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx:180](src/features/super-admin/sub-features/upload-docs/components/UploadCustomerInformationCard.tsx#L180) | 2 |
| `#FFFFFF` | [src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx:105](src/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest.tsx#L105) | 82 |
| `#a3d628` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:709](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L709) | 1 |
| `#b8d4a0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:418](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L418) | 1 |
| `#bbb` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:715](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L715) | 1 |
| `#c00` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:567](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L567) | 1 |
| `#c0c0c0` | [src/index.css:99](src/index.css#L99) | 1 |
| `#c8ddb0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:418](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L418) | 1 |
| `#c9a84c` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:417](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L417) | 1 |
| `#ccc` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:453](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L453) | 2 |
| `#d0e8a0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx:24](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx#L24) | 1 |
| `#d1d5db` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:124](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L124) | 1 |
| `#d4dce8` | [src/index.css:132](src/index.css#L132) | 1 |
| `#d4e8c2` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:418](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L418) | 1 |
| `#d8ddc7` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx:264](src/features/super-admin/sub-features/dashboard/pages/SuperAdminCustomerInformation.tsx#L264) | 2 |
| `#dde8c8` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:418](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L418) | 1 |
| `#e0e0e0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:426](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L426) | 2 |
| `#e1e5ef` | [src/index.css:57](src/index.css#L57) | 1 |
| `#e53535` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:567](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L567) | 1 |
| `#e5e7eb` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:62](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L62) | 1 |
| `#e65100` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx:133](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx#L133) | 1 |
| `#e6ebf1` | [src/features/super-admin/sub-features/legal-docs/components/Icons.tsx:45](src/features/super-admin/sub-features/legal-docs/components/Icons.tsx#L45) | 1 |
| `#e8e8e8` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:638](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L638) | 5 |
| `#e8edf5` | [src/index.css:131](src/index.css#L131) | 1 |
| `#e8f0d8` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:418](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L418) | 1 |
| `#e8f5d0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx:23](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx#L23) | 1 |
| `#e8f5e9` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx:132](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx#L132) | 1 |
| `#ebebeb` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx:77](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx#L77) | 1 |
| `#eee` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx:61](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx#L61) | 1 |
| `#eef0f2` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:113](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L113) | 8 |
| `#f0f0f0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:424](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L424) | 6 |
| `#f0f4e3` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:219](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L219) | 1 |
| `#f0f4ff` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:567](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L567) | 2 |
| `#f2f8f2` | [src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx:152](src/features/super-admin/sub-features/upload-docs/components/UploadMemberEditModal.tsx#L152) | 1 |
| `#f3f3f5` | [src/index.css:53](src/index.css#L53) | 1 |
| `#f3f4f5` | [src/index.css:100](src/index.css#L100) | 1 |
| `#f5f5f5` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:591](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L591) | 1 |
| `#f5faeb` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:121](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L121) | 1 |
| `#f90` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:524](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L524) | 1 |
| `#f9fafa` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:121](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L121) | 4 |
| `#fdfdfd` | [src/index.css:2523](src/index.css#L2523) | 1 |
| `#ffeaea` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:567](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L567) | 1 |
| `#fff` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:10](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L10) | 12 |
| `#fff3e0` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx:132](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails.tsx#L132) | 1 |
| `#ffffff` | [src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx:73](src/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart.tsx#L73) | 7 |
| `rgb(0,0,0,0.04)` | [src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx:40](src/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile.tsx#L40) | 1 |
| `rgb(0,0,0,0.12)` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:253](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L253) | 1 |
| `rgba(0, 0, 0, 0.01)` | [src/index.css:1806](src/index.css#L1806) | 2 |
| `rgba(0, 0, 0, 0.02)` | [src/index.css:701](src/index.css#L701) | 9 |
| `rgba(0, 0, 0, 0.03)` | [src/index.css:1398](src/index.css#L1398) | 2 |
| `rgba(0, 0, 0, 0.04)` | [src/index.css:142](src/index.css#L142) | 1 |
| `rgba(0, 0, 0, 0.05)` | [src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx:1494](src/features/super-admin/sub-features/upload-docs/pages/LegalUploadDocument.tsx#L1494) | 18 |
| `rgba(0, 0, 0, 0.06)` | [src/index.css:1079](src/index.css#L1079) | 1 |
| `rgba(0, 0, 0, 0.07)` | [src/index.css:1079](src/index.css#L1079) | 1 |
| `rgba(0, 0, 0, 0.08)` | [src/index.css:67](src/index.css#L67) | 6 |
| `rgba(0, 0, 0, 0.1)` | [src/index.css:56](src/index.css#L56) | 3 |
| `rgba(0, 0, 0, 0.12)` | [src/index.css:652](src/index.css#L652) | 3 |
| `rgba(0, 0, 0, 0.15)` | [src/index.css:271](src/index.css#L271) | 5 |
| `rgba(0, 0, 0, 0.17)` | [src/index.css:3543](src/index.css#L3543) | 1 |
| `rgba(0, 0, 0, 0.2)` | [src/index.css:108](src/index.css#L108) | 4 |
| `rgba(0, 0, 0, 0.25)` | [src/index.css:2924](src/index.css#L2924) | 2 |
| `rgba(0, 0, 0, 0.27)` | [src/index.css:200](src/index.css#L200) | 3 |
| `rgba(0, 0, 0, 0.3)` | [src/index.css:276](src/index.css#L276) | 1 |
| `rgba(0, 0, 0, 0.4)` | [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx:176](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx#L176) | 5 |
| `rgba(0, 0, 0, 0.57)` | [src/index.css:3574](src/index.css#L3574) | 1 |
| `rgba(0, 0, 0, 0.6)` | [src/index.css:38](src/index.css#L38) | 1 |
| `rgba(0, 0, 0, 0.8)` | [src/index.css:201](src/index.css#L201) | 3 |
| `rgba(0, 112, 235, 0.1)` | [src/index.css:2959](src/index.css#L2959) | 2 |
| `rgba(0, 112, 235, 0.7)` | [src/index.css:3646](src/index.css#L3646) | 1 |
| `rgba(0, 112, 235, 0.84)` | [src/index.css:2972](src/index.css#L2972) | 2 |
| `rgba(0, 120, 250, 0.25)` | [src/index.css:1522](src/index.css#L1522) | 3 |
| `rgba(0, 49, 50, 0.02)` | [src/index.css:1170](src/index.css#L1170) | 1 |
| `rgba(0, 49, 50, 0.04)` | [src/index.css:1017](src/index.css#L1017) | 1 |
| `rgba(0, 49, 50, 0.06)` | [src/index.css:742](src/index.css#L742) | 3 |
| `rgba(0, 88, 188, 0.2)` | [src/index.css:2974](src/index.css#L2974) | 2 |
| `rgba(0, 88, 188, 0.7)` | [src/index.css:3646](src/index.css#L3646) | 1 |
| `rgba(0, 88, 188, 0.84)` | [src/index.css:2972](src/index.css#L2972) | 2 |
| `rgba(0, 98, 158, 0)` | [src/index.css:94](src/index.css#L94) | 1 |
| `rgba(0, 98, 158, 0.06)` | [src/index.css:92](src/index.css#L92) | 1 |
| `rgba(0, 98, 158, 0.20)` | [src/index.css:94](src/index.css#L94) | 1 |
| `rgba(0,0,0,0.01)` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:98](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L98) | 1 |
| `rgba(0,0,0,0.02)` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx:126](src/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails.tsx#L126) | 5 |
| `rgba(0,0,0,0.04)` | [src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx:159](src/features/super-admin/sub-features/upload-docs/components/UploadFamilyTreeTab.tsx#L159) | 1 |
| `rgba(0,0,0,0.05)` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx:96](src/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag.tsx#L96) | 6 |
| `rgba(0,0,0,0.06)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx:77](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished.tsx#L77) | 2 |
| `rgba(0,0,0,0.07)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:627](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L627) | 3 |
| `rgba(0,0,0,0.08)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx:62](src/features/super-admin/sub-features/farmLandDocsverification/components/Modals.tsx#L62) | 4 |
| `rgba(0,0,0,0.1)` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:85](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L85) | 8 |
| `rgba(0,0,0,0.10)` | [src/components/ui/button.tsx:152](src/components/ui/button.tsx#L152) | 1 |
| `rgba(0,0,0,0.12)` | [src/components/ui/BackButton.tsx:6](src/components/ui/BackButton.tsx#L6) | 9 |
| `rgba(0,0,0,0.15)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:82](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L82) | 17 |
| `rgba(0,0,0,0.18)` | [src/components/ui/BackButton.tsx:6](src/components/ui/BackButton.tsx#L6) | 4 |
| `rgba(0,0,0,0.2)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:82](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L82) | 6 |
| `rgba(0,0,0,0.25)` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:179](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L179) | 1 |
| `rgba(0,0,0,0.3)` | [src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx:151](src/features/super-admin/sub-features/upload-docs/components/AgricultureReportUploadFile.tsx#L151) | 31 |
| `rgba(0,0,0,0.4)` | [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx:36](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx#L36) | 1 |
| `rgba(0,0,0,0.5)` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:464](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L464) | 5 |
| `rgba(0,0,0,0.7)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:75](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L75) | 2 |
| `rgba(0,0,0,0.8)` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:528](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L528) | 1 |
| `rgba(0,0,0,0.82)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx:89](src/features/super-admin/sub-features/farmLandDocsverification/components/Icons.tsx#L89) | 3 |
| `rgba(0,49,50,0.02)` | [src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx:107](src/features/super-admin/sub-features/upload-docs/components/UploadFarmlandDetails.tsx#L107) | 2 |
| `rgba(0,49,50,0.06)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:144](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L144) | 9 |
| `rgba(0,49,50,0.08)` | [src/components/common/RouteErrorBoundary.tsx:26](src/components/common/RouteErrorBoundary.tsx#L26) | 1 |
| `rgba(0,49,50,0.10)` | [src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx:34](src/features/super-admin/sub-features/dashboard/components/SuperAdminUserListCard.tsx#L34) | 1 |
| `rgba(0,_0,_0,_0.8)` | [src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx:272](src/features/super-admin/sub-features/upload-docs/components/UploadFile.tsx#L272) | 1 |
| `rgba(0,_49,_50,_0.06)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:228](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L228) | 2 |
| `rgba(100, 200, 100, 0.45)` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx:384](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails.tsx#L384) | 1 |
| `rgba(100, 200, 210, 0.65)` | [src/index.css:177](src/index.css#L177) | 1 |
| `rgba(100,150,30,0.5)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:82](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L82) | 7 |
| `rgba(100,180,40,0.55)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:467](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L467) | 1 |
| `rgba(105, 182, 254, 0.20)` | [src/index.css:86](src/index.css#L86) | 1 |
| `rgba(122, 149, 28, 0.43)` | [src/index.css:3675](src/index.css#L3675) | 1 |
| `rgba(122, 149, 28, 0.8)` | [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx:95](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx#L95) | 1 |
| `rgba(122,_149,_28,_0.8)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:188](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L188) | 2 |
| `rgba(124, 171, 218, 0.77)` | [src/index.css:162](src/index.css#L162) | 1 |
| `rgba(130, 130, 130, 0.1)` | [src/index.css:113](src/index.css#L113) | 1 |
| `rgba(130, 130, 130, 0.4)` | [src/index.css:119](src/index.css#L119) | 1 |
| `rgba(140,190,50,0.35)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:85](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L85) | 2 |
| `rgba(140,190,50,0.45)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:82](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L82) | 2 |
| `rgba(140,190,50,0.55)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:83](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L83) | 1 |
| `rgba(155, 155, 155, 0.6)` | [src/index.css:341](src/index.css#L341) | 1 |
| `rgba(16, 185, 129, 0.25)` | [src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx:409](src/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps.tsx#L409) | 1 |
| `rgba(160,210,60,0.4)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:84](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L84) | 1 |
| `rgba(163,214,40,0.72)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:467](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L467) | 1 |
| `rgba(170,220,70,0.55)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx:87](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated.tsx#L87) | 1 |
| `rgba(174, 214, 239, 0.92)` | [src/index.css:157](src/index.css#L157) | 1 |
| `rgba(186, 26, 26, 0.2)` | [src/index.css:434](src/index.css#L434) | 1 |
| `rgba(187, 219, 240, 0.38)` | [src/index.css:3237](src/index.css#L3237) | 1 |
| `rgba(188, 201, 201, 0.15)` | [src/index.css:748](src/index.css#L748) | 2 |
| `rgba(188, 210, 37, 0.20)` | [src/index.css:88](src/index.css#L88) | 1 |
| `rgba(189, 211, 39, 0.38)` | [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx:86](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx#L86) | 1 |
| `rgba(189,211,39,0.38)` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:227](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L227) | 1 |
| `rgba(189,_211,_39,_0.38)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:188](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L188) | 2 |
| `rgba(197, 198, 205, 0.3)` | [src/index.css:58](src/index.css#L58) | 1 |
| `rgba(20,20,20,0.7)` | [src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx:468](src/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate.tsx#L468) | 1 |
| `rgba(205, 0, 0, 0.27)` | [src/index.css:202](src/index.css#L202) | 1 |
| `rgba(208, 20, 20, 0.8)` | [src/index.css:203](src/index.css#L203) | 1 |
| `rgba(215, 235, 247, 0)` | [src/index.css:117](src/index.css#L117) | 1 |
| `rgba(22, 141, 255, 0.72)` | [src/index.css:3601](src/index.css#L3601) | 1 |
| `rgba(22, 163, 74, 0.08)` | [src/index.css:48](src/index.css#L48) | 1 |
| `rgba(220, 38, 38, 0.08)` | [src/index.css:52](src/index.css#L52) | 1 |
| `rgba(220,252,231,0.5)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx:321](src/features/super-admin/sub-features/farmLandDocsverification/components/VerificationSummaryModal.tsx#L321) | 1 |
| `rgba(223, 232, 200, 0)` | [src/index.css:161](src/index.css#L161) | 1 |
| `rgba(225, 229, 239, 0.6)` | [src/index.css:2938](src/index.css#L2938) | 1 |
| `rgba(230,238,173,0.2)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:303](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L303) | 1 |
| `rgba(230,238,173,0.3)` | [src/features/super-admin/sub-features/upload-docs/components/Comments.tsx:30](src/features/super-admin/sub-features/upload-docs/components/Comments.tsx#L30) | 1 |
| `rgba(231, 232, 233, 0.5)` | [src/index.css:630](src/index.css#L630) | 2 |
| `rgba(239, 70, 70, 0.1)` | [src/index.css:3210](src/index.css#L3210) | 1 |
| `rgba(242, 244, 246, 0.5)` | [src/index.css:2937](src/index.css#L2937) | 1 |
| `rgba(242, 255, 219, 0.34)` | [src/index.css:145](src/index.css#L145) | 1 |
| `rgba(243, 244, 245, 0.5)` | [src/index.css:78](src/index.css#L78) | 2 |
| `rgba(245, 158, 11, 0.08)` | [src/index.css:50](src/index.css#L50) | 1 |
| `rgba(255, 218, 214, 0.5)` | [src/index.css:433](src/index.css#L433) | 1 |
| `rgba(255, 255, 255, 0.002)` | [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx:85](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx#L85) | 2 |
| `rgba(255, 255, 255, 0.1)` | [src/index.css:1052](src/index.css#L1052) | 1 |
| `rgba(255, 255, 255, 0.10)` | [src/index.css:93](src/index.css#L93) | 2 |
| `rgba(255, 255, 255, 0.15)` | [src/index.css:91](src/index.css#L91) | 1 |
| `rgba(255, 255, 255, 0.2)` | [src/index.css:1051](src/index.css#L1051) | 2 |
| `rgba(255, 255, 255, 0.20)` | [src/index.css:84](src/index.css#L84) | 1 |
| `rgba(255, 255, 255, 0.5)` | [src/index.css:2289](src/index.css#L2289) | 1 |
| `rgba(255, 255, 255, 0.7)` | [src/index.css:2802](src/index.css#L2802) | 1 |
| `rgba(255, 255, 255, 0.75)` | [src/index.css:82](src/index.css#L82) | 1 |
| `rgba(255, 255, 255, 0.90)` | [src/index.css:176](src/index.css#L176) | 1 |
| `rgba(255, 255, 255, 0.95)` | [src/index.css:80](src/index.css#L80) | 1 |
| `rgba(255,255,255,0.5)` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:51](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L51) | 2 |
| `rgba(255,255,255,0.8)` | [src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx:85](src/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers.tsx#L85) | 1 |
| `rgba(255,_255,_255,_1)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:191](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L191) | 1 |
| `rgba(26,28,29,0.24)` | [src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx:145](src/features/super-admin/sub-features/upload-docs/components/UploadOwnerDetailsForm.tsx#L145) | 1 |
| `rgba(37, 99, 235, 0.1)` | [src/index.css:1532](src/index.css#L1532) | 3 |
| `rgba(39, 128, 196, 0.05)` | [src/index.css:626](src/index.css#L626) | 3 |
| `rgba(39, 128, 196, 0.06)` | [src/index.css:142](src/index.css#L142) | 1 |
| `rgba(39, 128, 196, 0.07)` | [src/index.css:2424](src/index.css#L2424) | 1 |
| `rgba(39, 128, 196, 0.08)` | [src/index.css:22](src/index.css#L22) | 2 |
| `rgba(39, 128, 196, 0.1)` | [src/index.css:3166](src/index.css#L3166) | 1 |
| `rgba(39, 128, 196, 0.12)` | [src/index.css:24](src/index.css#L24) | 1 |
| `rgba(39, 128, 196, 0.2)` | [src/index.css:424](src/index.css#L424) | 2 |
| `rgba(39, 128, 196, 0.4)` | [src/index.css:23](src/index.css#L23) | 1 |
| `rgba(39, 128, 196, 0.5)` | [src/index.css:204](src/index.css#L204) | 1 |
| `rgba(39, 128, 196, 0.8)` | [src/index.css:198](src/index.css#L198) | 3 |
| `rgba(42,48,8,0.2)` | [src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx:274](src/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin.tsx#L274) | 1 |
| `rgba(44,44,44,0.15)` | [src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx:160](src/features/super-admin/sub-features/farmLandDocsverification/components/SharedUI.tsx#L160) | 2 |
| `rgba(44,44,44,0.25)` | [src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx:60](src/features/super-admin/sub-features/upload-docs/components/UploadTimelineSidebar.tsx#L60) | 1 |
| `rgba(61, 147, 209, 0.04)` | [src/index.css:2111](src/index.css#L2111) | 1 |
| `rgba(61, 147, 209, 0.08)` | [src/index.css:1911](src/index.css#L1911) | 2 |
| `rgba(61, 74, 13, 0.08)` | [src/index.css:107](src/index.css#L107) | 1 |
| `rgba(66, 143, 223, 0.07)` | [src/index.css:149](src/index.css#L149) | 1 |
| `rgba(9, 20, 38, 0.02)` | [src/index.css:558](src/index.css#L558) | 1 |
| `rgba(9, 20, 38, 0.04)` | [src/index.css:403](src/index.css#L403) | 1 |
| `rgba(9, 20, 38, 0.05)` | [src/index.css:87](src/index.css#L87) | 1 |
| `rgba(9, 20, 38, 0.10)` | [src/index.css:81](src/index.css#L81) | 2 |
| `rgba(9, 20, 38, 0.90)` | [src/index.css:83](src/index.css#L83) | 1 |
| `rgba(90, 92, 94, 0.74)` | [src/index.css:3353](src/index.css#L3353) | 1 |
| `rgba(92, 92, 92, 0.5)` | [src/index.css:114](src/index.css#L114) | 1 |

### 18.5 Visual asset ledger

Intrinsic dimensions below come from SVG root attributes or binary PNG/JPEG headers. Display dimensions are controlled by component classes. A stored SVG may embed raster content; its filename alone does not establish scalable vector artwork. See §10 for placement and image treatment.

| Asset | Intrinsic dimensions | Usage convention |
| --- | --- | --- |
| [public/logo.png](public/logo.png) | 2222 × 1080 | Public absolute URL |
| [public/logo.svg](public/logo.svg) | 65 × 64; viewBox 0 0 65 64 | Public absolute URL |
| [public/super-admin/412454830_4ab87760-e674-4c28-80e0-4ba647ad5166 1.svg](public/super-admin/412454830_4ab87760-e674-4c28-80e0-4ba647ad5166 1.svg) | 299 × 273; viewBox 0 0 299 273 | Public absolute URL |
| [public/super-admin/icons/Widget.svg](public/super-admin/icons/Widget.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/assignedicon.svg](public/super-admin/icons/assignedicon.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/cone.svg](public/super-admin/icons/cone.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/cross.svg](public/super-admin/icons/cross.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/date.svg](public/super-admin/icons/date.svg) | 18 × 20; viewBox 0 0 18 20 | Public absolute URL |
| [public/super-admin/icons/farmlisticon.svg](public/super-admin/icons/farmlisticon.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/id.svg](public/super-admin/icons/id.svg) | 20 × 20; viewBox 0 0 20 20 | Public absolute URL |
| [public/super-admin/icons/land.svg](public/super-admin/icons/land.svg) | 18 × 18; viewBox 0 0 18 18 | Public absolute URL |
| [public/super-admin/icons/loc.svg](public/super-admin/icons/loc.svg) | 16 × 20; viewBox 0 0 16 20 | Public absolute URL |
| [public/super-admin/icons/name.svg](public/super-admin/icons/name.svg) | 16 × 16; viewBox 0 0 16 16 | Public absolute URL |
| [public/super-admin/icons/own.svg](public/super-admin/icons/own.svg) | 16 × 16; viewBox 0 0 16 16 | Public absolute URL |
| [public/super-admin/icons/plotid.svg](public/super-admin/icons/plotid.svg) | 20 × 20; viewBox 0 0 20 20 | Public absolute URL |
| [public/super-admin/icons/pool.svg](public/super-admin/icons/pool.svg) | 18 × 18; viewBox 0 0 18 18 | Public absolute URL |
| [public/super-admin/icons/poolicon.svg](public/super-admin/icons/poolicon.svg) | 28 × 28; viewBox 0 0 28 28 | Public absolute URL |
| [public/super-admin/icons/right.svg](public/super-admin/icons/right.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/icons/uploadicon.svg](public/super-admin/icons/uploadicon.svg) | 24 × 18; viewBox 0 0 24 18 | Public absolute URL |
| [public/super-admin/icons/usericon.svg](public/super-admin/icons/usericon.svg) | 24 × 24; viewBox 0 0 24 24 | Public absolute URL |
| [public/super-admin/images/document_preview_mockup.png](public/super-admin/images/document_preview_mockup.png) | 1024 × 1024 | Public absolute URL |
| [public/super-admin/images/farmland1.png](public/super-admin/images/farmland1.png) | 1024 × 1024 | Public absolute URL |
| [public/super-admin/images/farmland2.png](public/super-admin/images/farmland2.png) | 1024 × 1024 | Public absolute URL |
| [public/super-admin/images/farmland3.png](public/super-admin/images/farmland3.png) | 1024 × 1024 | Public absolute URL |
| [public/super-admin/images/farmland4.png](public/super-admin/images/farmland4.png) | 1024 × 1024 | Public absolute URL |
| [public/super-admin/images/map_confirmed_boundary.png](public/super-admin/images/map_confirmed_boundary.png) | 1024 × 1024 | Public absolute URL |
| [src/assets/aerial-satellite-map.png](src/assets/aerial-satellite-map.png) | 394 × 303 | Bundled module import |
| [src/assets/glc-logo.svg](src/assets/glc-logo.svg) | 524 × 254; viewBox 0 0 524 254 | Bundled module import |
| [src/assets/login-bg.jpg](src/assets/login-bg.jpg) | 1120 × 1680 | Bundled module import |
| [src/assets/main login.svg](src/assets/main login.svg) | 1440 × 1024; viewBox 0 0 1440 1024 | Bundled module import |
| [src/assets/maintenance-login-bg.jpg](src/assets/maintenance-login-bg.jpg) | 1024 × 682 | Bundled module import |
| [src/assets/map.svg](src/assets/map.svg) | 203 × 249; viewBox 0 0 203 249 | Bundled module import |
| [src/assets/sharp.svg](src/assets/sharp.svg) | 180 × 180; viewBox 0 0 180 180 | Bundled module import |
| [src/assets/sucess.svg](src/assets/sucess.svg) | 200 × 200; viewBox 0 0 200 200 | Bundled module import |

### 18.6 Nonvisual supporting sources and scope limits

The architecture audit also inspected `package.json`, Vite/PostCSS/Tailwind/TypeScript configs,`components.json`, routing guards/definitions/lazy imports, layout/viewport hooks, feature flags and utility composition. API/store/types/data modules were used to trace component inputs and states. They are not independent visual screens. Pure transport/business functions are not design specifications. No server implementation was supplied or audited for backend truth.

Root tokens contain no supported dark-mode counterpart. There is no universal spacing/motion/z-index registry. Some root tokens and legacy CSS declarations have no active UI consumer. No existing automated visual regression suite or browser screenshots were available in the supplied workspace. Source file class values take precedence over comments that refer to an earlier Figma request.

## 19. AI Development Rules — Mandatory for All New Screens

These are **Recommended project rules adopted by this documentation for future work**, not a claim that tooling currently enforces them.

1. Read `Design.md` before creating or modifying UI.
2. Inspect the closest routed screen and relevant current components before building.
3. Reuse established colors, typography, spacing, radii, layout and scroll ownership from the correct UI family.
4. Prefer existing shared/feature components with verified APIs; inspect props and actual behavior.
5. Preserve the application's visual identity and distinguish maintenance, authentication and document-workflow conventions.
6. Do not invent design tokens, breakpoints, component variants, interactions or animations and present them as existing.
7. Do not use a token/utility simply because it appears in a dependency manifest or disconnected Tailwind config.
8. Avoid duplicating reusable components or introducing new fonts, colors or arbitrary values without a justified need. Use established icon conventions and inspect §10 before choosing icon size/stroke.
9. Do not import an unrouted legacy component without validating its read-only/editable semantics and dependencies.
10. Match exact existing responsive behavior; where it is missing, propose and implement an explicit adaptation rather than claiming it exists.
11. Include appropriate loading, disabled, error, empty and success behavior; never substitute static data for unverified API functionality.
12. Use accessible semantics, visible focus, associated field errors and named icon actions. Verify modal focus management and keyboard navigation.
13. Preserve supported reduced-motion preferences for new motion; do not add unconnected animation classes.
14. Keep application changes scoped to the user request; do not silently consolidate differing colors, radii or component families.
15. Mark new recommendations/deviations explicitly and update the corresponding specifications and audit entry.
16. Verify the resulting screen at relevant viewports and feature modes; do not declare WCAG or visual parity without evidence.

## 20. Verification & Readiness

### Completed source verification

- Inventoried140 TSX modules, all54 page-directory modules, all75 component-directory modules and the complete3743-line application stylesheet.
- Resolved local imports from `main.tsx` and distinguished123 reachable TSX modules from17 outside the active import graph.
- Matched89 explicit route entries to lazy-loaded screen modules and resolved nested upload/verification child paths. Counted46 unique routed screen modules, excluding redirects and workflow parents.
- Extracted every root custom-property declaration, all source literal colors, per-module utility specifications, inline styles, component interfaces and declared state conditions.
- Recorded all15 shared Button variants,3 Input variants,4 BackButton appearances×3 sizes, Typography/Card APIs, feature component families and route aliases.
- Compared actual font imports, theme wiring, animation imports, breakpoint declarations, root responsiveness, ARIA/focus declarations and repeated literal palettes.
- Calculated selected opaque color-pair contrast ratios; these calculations are not a rendered contrast audit.
- Verified documentation source paths and token values against the source snapshot; confirmed no existing project file changed.

### Unverified runtime evidence

This supplied directory has no installed dependencies or lockfile and is not a Git checkout. No application server/browser session was started, dependencies were not installed, and no build/lint/test or screenshot comparison was claimed. The UI audit is static. Authentication/API responses, MapLibre network assets, computed styles, actual Tailwind output, real font fallback, overflow on devices, screen-reader output, focus order and third-party defaults remain unverified. Public preview route declarations do not remove those API/runtime limitations.

### New-screen readiness

This document supplies the current component APIs, declared measurements, token values, screen families, routes and responsive/state exceptions needed to implement a new screen in the existing visual language. It is **ready as a source-based implementation reference**. It is not a fully standardized or browser-validated production design system. Before promising exact visual parity or accessibility compliance, resolve theme/font/animation wiring and validate the chosen screen family in a running application. The fixed workbench layout and fragmented focus/dialog behavior are the most material remaining consistency risks.
