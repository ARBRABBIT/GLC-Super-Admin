import { useAppSelector } from './index';
import {
  ROLE_LAYOUT_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  type RoleLayoutConfig,
} from '@/core/config/layoutConfig';

/**
 * Reads user.role from Redux auth state and returns the
 * matching layout configuration (variant + navItems + roleLabel).
 * Falls back to DEFAULT_LAYOUT_CONFIG if role is unknown.
 */
export const useRoleLayout = (): RoleLayoutConfig => {
  const role = useAppSelector((state) => state.auth.user?.role ?? '');
  return ROLE_LAYOUT_CONFIG[role] ?? DEFAULT_LAYOUT_CONFIG;
};
