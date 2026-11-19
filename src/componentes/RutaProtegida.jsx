import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

// Componente guardia que bloquea el acceso a rutas privadas según sesión y rol
function RutaProtegida({ children }) {
  const { usuario, perfil } = useContext(AuthContext);

  // Si no hay usuario logueado, redirige al formulario de inicio de sesión
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado pero su rol no es 'admin', lo redirige a la portada
  if (perfil && perfil.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si cumple ambas condiciones, permite ver el componente hijo (Admin)
  return children;
}

export default RutaProtegida;


