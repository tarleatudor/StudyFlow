import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
  
  // Dacă există token, randează copiii, altfel trimite la login
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;