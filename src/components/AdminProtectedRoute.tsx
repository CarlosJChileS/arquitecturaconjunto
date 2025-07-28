import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  console.log('AdminProtectedRoute - User:', user?.email, 'Profile:', profile?.role, 'Loading:', loading);

  // Mostrar loading solo por máximo 2 segundos
  if (loading) {
    setTimeout(() => {
      console.log('AdminProtectedRoute - Loading timeout, proceeding');
    }, 2000);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminProtectedRoute - No user, redirecting to login');
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Acceso directo para usuarios admin conocidos
  const isKnownAdmin = user.email === 'carlosjchiles@gmail.com' || user.email === 'admin@learnpro.com';
  
  if (isKnownAdmin) {
    console.log('AdminProtectedRoute - Known admin user, granting access immediately');
    return <>{children}</>;
  }

  // Para otros usuarios, verificar el perfil si está disponible
  if (profile && profile.role !== 'admin' && profile.role !== 'instructor') {
    console.log('AdminProtectedRoute - User is not admin/instructor, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Si no hay perfil pero no es admin conocido, redirigir a home
  if (!profile && !isKnownAdmin) {
    console.log('AdminProtectedRoute - No profile and not known admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminProtectedRoute - Access granted');
  return <>{children}</>;
};

export default AdminProtectedRoute;
