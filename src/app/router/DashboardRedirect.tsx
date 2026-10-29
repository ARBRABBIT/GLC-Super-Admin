import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/store/authSlice';

export const DashboardRedirect = () => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/super-admin/login" replace />;
  }

  if (user.role === 'MAINTENANCE') {
    return <Navigate to="/maintenance/dashboard" replace />;
  }

  return <Navigate to="/super-admin/farmlands" replace />;
};
