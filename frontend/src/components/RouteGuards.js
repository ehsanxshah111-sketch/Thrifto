import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Any logged-in user (customer or admin)
export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Admin-only area. An unauthenticated visitor is sent to the hidden admin
// login (not the public /login customer form) - the two flows never cross.
// A logged-in customer trying to reach /admin is bounced home instead of
// seeing the dashboard - this mirrors the backend's protect + adminOnly
// middleware so orders/messages stay admin-only.
export const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
