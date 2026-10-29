import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/store/authSlice';
import { useGetAllMasterDataQuery, useGetAllGeoMasterDataQuery } from '@/features/super-admin/api/masterData.api';

const AuthGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // Maintenance routes load their own master data (/master/get_all_master_data),
  // so the super-admin master data is only prefetched outside the maintenance portal
  const isMaintenanceRoute = location.pathname.includes("/maintenance");
  useGetAllMasterDataQuery(undefined, { skip: !isAuthenticated || isMaintenanceRoute });
  useGetAllGeoMasterDataQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated || !user) {
    const isMaintenance = location.pathname.startsWith("/maintenance");
    const redirectPath = isMaintenance ? "/maintenance/login" : "/super-admin/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If Maintenance user is trying to access Super Admin specific routes or root, keep them in Maintenance portal
  if (
    user.role === 'MAINTENANCE' &&
    (location.pathname.startsWith('/super-admin') || location.pathname === '/') &&
    !location.pathname.includes('/maintenance')
  ) {
    return <Navigate to="/maintenance/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;