import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

function RutaProtegida({ children }) {
  const { usuario } = useContext(AuthContext);

  // Si no hay usuario logueado, lo redirige automáticamente al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;
