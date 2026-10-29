// ─── Image imports for Super Admin nav icons ──────────────────────────────────
const widgetIcon = "/super-admin/icons/Widget.svg";
const assignedIcon = "/super-admin/icons/assignedicon.svg";
const farmlandListIcon = "/super-admin/icons/farmlisticon.svg";
const userIcon = "/super-admin/icons/usericon.svg";
const poolIcon = "/super-admin/icons/poolicon.svg";
const uploadIcon = "/super-admin/icons/uploadicon.svg";

import { SIMPLE_MODE } from "@/core/config/featureFlags";

// ─── Types ───────────────────────────────────────────────────────────────────
export type LayoutVariant =
  | 'sidebar-super-admin'
  | 'header-only';

export type NavItem = {
  label: string;
  path: string;
  icon?: string;
  iconImg?: string;
};

export type RoleLayoutConfig = {
  layoutVariant: LayoutVariant;
  roleLabel: string;
  navItems: NavItem[];
};

// ─── Mock Credentials ─────────────────────────────────────────────────────────
export const MOCK_USERS: Record<
  string,
  { email: string; password: string; name: string; role: string }
> = {
  SUPER_ADMIN: {
    email: 'superadmin@glc.com',
    password: 'superadmin@123',
    name: 'Super Admin',
    role: 'SADMIN',
  },
};

// ─── All possible nav items ───────────────────────────────────────────────────
const ALL_NAV_ITEMS: (NavItem & { hiddenInSimpleMode?: boolean })[] = [
  {
    label: "Dashboard",
    path: "/super-admin/dashboard",
    iconImg: widgetIcon,
    hiddenInSimpleMode: true,
  },
  {
    label: "Assigned Farmlands",
    path: "/super-admin/farmlands",
    iconImg: assignedIcon,
  },
  {
    label: "Farmlands List",
    path: "/super-admin/farmlands-list",
    iconImg: farmlandListIcon,
  },
  {
    label: "Draft Farmlands",
    path: "/super-admin/draft-farmlands",
    icon: "FileText",
  },
  {
    label: "User Management",
    path: "/super-admin/users-list",
    iconImg: userIcon,
    hiddenInSimpleMode: true,
  },
  {
    label: "Pool Buying",
    path: "/super-admin/pool-buying",
    iconImg: poolIcon,
    hiddenInSimpleMode: true,
  },
  {
    label: "Upload",
    path: "/super-admin/upload",
    iconImg: uploadIcon,
  },
];

// ─── Master Layout Config ─────────────────────────────────────────────────────
export const ROLE_LAYOUT_CONFIG: Record<string, RoleLayoutConfig> = {
  SADMIN: {
    layoutVariant: "sidebar-super-admin",
    roleLabel: "Super Admin",
    navItems: ALL_NAV_ITEMS.filter(item => !(SIMPLE_MODE && item.hiddenInSimpleMode)),
  },
};

// Fallback
export const DEFAULT_LAYOUT_CONFIG: RoleLayoutConfig =
  ROLE_LAYOUT_CONFIG.SADMIN;