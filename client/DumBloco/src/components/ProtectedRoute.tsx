import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { PERMISSIONS } from '../config/permissions';

interface JwtPayload {
  id: string;
  usuario: string;
  nivelAcesso: number;
  exp: number;
}

interface AuthInfo {
  isAuthenticated: boolean;
  nivelAcesso: number | null;
}

export const useAuth = (): AuthInfo => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return { isAuthenticated: false, nivelAcesso: null };
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('authToken');
      return { isAuthenticated: false, nivelAcesso: null };
    }

    return { isAuthenticated: true, nivelAcesso: decodedToken.nivelAcesso };

  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem('authToken');
    return { isAuthenticated: false, nivelAcesso: null };
  }
};

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, nivelAcesso } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const allowedRoles = PERMISSIONS[location.pathname];

  if (!allowedRoles || (nivelAcesso !== null && !allowedRoles.includes(nivelAcesso))) {
      return <Navigate to="/tabelaNoticias" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;