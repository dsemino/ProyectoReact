import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

function RutaProtegida({ children }) {
  const { usuario, perfil } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfil && perfil.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;

