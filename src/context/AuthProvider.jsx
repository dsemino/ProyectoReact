import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Registrar usuario nuevo
  const registrar = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Cerrar sesión
  const logout = () => {
    return signOut(auth);
  };

  // Escuchar cambios de sesión (si recarga la página, mantiene el usuario logueado)
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual);
      setCargando(false);
    });
    return () => desuscribir();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, registrar, login, logout, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}
