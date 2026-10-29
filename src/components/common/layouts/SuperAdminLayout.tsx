import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { logOut } from "@/features/auth/store/authSlice";
import SuperAdminSidebar from "@/features/super-admin/components/layout/Sidebar";
import { useRoleLayout } from "@/hooks/useRoleLayout";

export const SuperAdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { navItems } = useRoleLayout();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/super-admin/login", { replace: true });
  };

  const isDocumentFlow = 
    location.pathname.includes("/Documents/") || 
    location.pathname.includes("/customer-information") || 
    location.pathname.includes("/legal-documents") || 
    location.pathname.includes("/agriculture-report") || 
    location.pathname.includes("/land-boundaries") || 
    location.pathname.includes("/valuation") || 
    location.pathname.includes("/local-intelligence") || 
    location.pathname.includes("/profile");

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--surface-page)" }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      {!isDocumentFlow && (
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-logout]")) {
              handleLogout();
            }
          }}
        >
          <SuperAdminSidebar navItems={navItems} />
        </div>
      )}

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
