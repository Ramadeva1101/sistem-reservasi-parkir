import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute; 