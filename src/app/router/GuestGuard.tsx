import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/store/authSlice';

const GuestGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (isAuthenticated && user) {
    if (user.is_first_login === 1) {
      return <Outlet />;
    }
    if (user.role === 'MAINTENANCE') {
      return <Navigate to="/maintenance/dashboard" replace />;
    }
    return <Navigate to="/super-admin/farmlands" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
