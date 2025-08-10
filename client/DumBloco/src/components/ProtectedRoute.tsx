import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  usuario: string;
  exp: number;
}

const useAuth = (): boolean => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('authToken');
      return false;
    }

    return true;

  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem('authToken');
    return false;
  }
};

const ProtectedRoute: React.FC = () => {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;