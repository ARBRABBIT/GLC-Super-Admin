# AI Agent Guidelines & Project Rules

## 1. Mandatory Rule: Strict Adherence to Design.md

> **CRITICAL RULE:**
> **Every screen, page, modal, component, table, and user interface element created or modified MUST strictly follow [Design.md](Design.md) ONLY.**
> Never invent arbitrary styling, non-standard colors, unverified design tokens, or inconsistent component structures. Always inspect existing screens and `Design.md` before writing or modifying any UI.

---

## 2. Core Design Tokens & Conventions (from Design.md)

### Typography
- **Headings & Key Metrics:** `font-['Plus_Jakarta_Sans']` (`font-bold` or `font-extrabold`).
- **Body, Table Content, Controls & Actions:** `font-inter` / sans-serif with proper tracking and sizing.

### Color Palette
- **Page Background Shell:** `#F6F7F6` / `bg-[#F6F7F6]`.
- **Card & Modal Surfaces:** `#FFFFFF` with `border border-gray-100` or `border-gray-200`, subtle shadows (`shadow-xs` or `shadow-sm`).
- **Primary Text:** `var(--text-primary)` (`#191B1C` / `#111827`).
- **Muted / Subtitle Text:** `var(--text-muted)` (`rgba(0,0,0,0.6)` / `text-gray-500` / `text-gray-600`).
- **Primary Brand / Dark Action Buttons:** `#2D3032` / `#2D3319` / `#2A2F1E` (`hover:bg-black text-white`).
- **GLC Exclusive Badge:** `bg-[#E6EEAD] text-[#2A3125] border border-[#D5DF96] text-[10px] font-bold px-2.5 py-0.5 rounded-full`.
- **Success / Approved Status Badge:** `bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]` with a `w-1.5 h-1.5 rounded-full bg-[#16A34A]` live dot indicator.
- **Table Header Background:** `bg-[#FAFAFA]/80` with uppercase tracking (`text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider`).

### Border Radii
- **Page Shells:** `rounded-[24px]`.
- **Modals, Dialogs & Large Cards:** `rounded-2xl` (`16px`).
- **Action Buttons, Badges, Search Inputs & Filter Pills:** `rounded-full` (or `rounded-xl` for input controls).

---

## 3. UI Component Patterns

### Tables
- Wrap tables in `w-full overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-xs`.
- Header row: `border-b border-gray-200 bg-[#FAFAFA]/80 text-xs font-semibold uppercase tracking-wider font-inter text-[var(--text-muted)]`.
- Row styling: `border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors`.
- Action buttons: Pill buttons `rounded-full border border-gray-300 bg-white hover:bg-[#2D3032] hover:text-white px-4 py-1.5 text-xs font-medium font-inter`.

### Modals & Dialogs
- Backdrop: `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200`.
- Dialog card: `relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col`.
- Header: Sticky header with title `text-[17px] font-bold text-[#191B1C]`, close `X` button.
- Filter & Search Area: Clean search bar with `Search` icon and dropdown filters (`State`, `Region`).
- Content Area: Scrollable area (`overflow-y-auto max-h-[...]`) with loading and empty states.
- Footer: Sticky bottom row with Cancel and primary action buttons.

---

## 4. Code & Architecture Rules
1. **TypeScript Integrity:** All code must pass `npm run build` (`tsc -b && vite build`) with 0 errors.
2. **Preserve Existing Functionality:** Do not break existing API bindings, RTK Query hooks, routing structures, or query parameters.
3. **Responsive by Default:** Ensure layouts adapt smoothly to desktop and smaller viewports.
4. **Follow Section 19 of Design.md:** AI Development Rules are mandatory for all new screens.

