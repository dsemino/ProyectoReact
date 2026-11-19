import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';
import { AuthContext } from './AuthContext.js';

// Proveedor que maneja la sesión del usuario y su perfil (rol y nombre) desde Firebase
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // Datos de autenticación (email, uid)
  const [perfil, setPerfil] = useState(null);   // Datos extra de Firestore (firstName, role)
  const [cargando, setCargando] = useState(true); // Evita renderizar hasta verificar si hay sesión

  // Crea la cuenta en Firebase Auth y guarda sus datos personales en la colección 'users'
  const registrar = async (email, password, firstName, lastName, role = 'customer') => {
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credencial.user.uid;

    const datosPerfil = {
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
      createdAt: new Date()
    };

    // Usa el mismo UID de Auth como ID del documento en Firestore
    await setDoc(doc(db, 'users', uid), datosPerfil);
    setPerfil(datosPerfil);
    return credencial;
  };

  // Inicia sesión con correo y contraseña en Firebase Auth
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Cierra la sesión activa y limpia el estado del perfil
  const logout = () => {
    setPerfil(null);
    return signOut(auth);
  };

  // Observador que detecta automáticamente si el usuario inicia, cierra sesión o recarga la página
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (usuarioActual) => {
      setUsuario(usuarioActual);

      if (usuarioActual) {
        try {
          // Busca el perfil del usuario en Firestore para conocer su nombre y rol
          const docRef = doc(db, 'users', usuarioActual.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPerfil(docSnap.data());
          } else {
            setPerfil({ firstName: 'Admin', lastName: '', role: 'admin' });
          }
        } catch (error) {
          console.error('Error al obtener perfil:', error);
        }
      } else {
        setPerfil(null);
      }

      setCargando(false);
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => desuscribir();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, perfil, registrar, login, logout, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}
