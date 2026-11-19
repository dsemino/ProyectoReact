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

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Registrar usuario en Auth y guardar perfil en Firestore con campos en inglés
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

    await setDoc(doc(db, 'users', uid), datosPerfil);
    setPerfil(datosPerfil);
    return credencial;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setPerfil(null);
    return signOut(auth);
  };

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (usuarioActual) => {
      setUsuario(usuarioActual);

      if (usuarioActual) {
        try {
          const docRef = doc(db, 'users', usuarioActual.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPerfil(docSnap.data());
          } else {
            // Respaldo para cuentas creadas antes de tener perfil en Firestore
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

    return () => desuscribir();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, perfil, registrar, login, logout, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}

