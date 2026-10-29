// ─── Feature Flags ────────────────────────────────────────────────────────────
// Set VITE_SIMPLE_MODE=true in your .env file to enable the simplified UI mode.
// When enabled: top header sections, search bars, filters, and certain sidebar
// items (Users List, Pool Buying, Dashboard) are hidden.

const rawSimpleMode = import.meta.env.VITE_SIMPLE_MODE ?? (import.meta.env as any).SIMPLE_MODE;
const parsedSimpleMode = typeof rawSimpleMode === 'string' ? rawSimpleMode.trim().toLowerCase() : rawSimpleMode;
export const SIMPLE_MODE = parsedSimpleMode === 'true' || parsedSimpleMode === '1' || parsedSimpleMode === true;

