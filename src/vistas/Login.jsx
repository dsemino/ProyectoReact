import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import styles from './Login.module.css';

function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, registrar } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (esRegistro && (!firstName.trim() || !lastName.trim())) {
      setError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    try {
      if (esRegistro) {
        await registrar(email, password, firstName, lastName, role);
        navigate(role === 'admin' ? '/admin' : '/productos');
      } else {
        await login(email, password);
        navigate('/productos');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Ocurrió un error al autenticar. Verifica tus datos.');
      }
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>
        {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        {esRegistro && (
          <>
            <div className={styles.campo}>
              <label>Nombre:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ej. Darío"
                required
              />
            </div>

            <div className={styles.campo}>
              <label>Apellido:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej. Semino"
                required
              />
            </div>

            <div className={styles.campo}>
              <label>Tipo de Cuenta (Rol):</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '15px' }}
              >
                <option value="customer">Cliente (Solo compras)</option>
                <option value="admin">Administrador (Gestión de catálogo)</option>
              </select>
            </div>
          </>
        )}

        <div className={styles.campo}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ferreteria.com"
            required
          />
        </div>

        <div className={styles.campo}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <button type="submit" className={styles.boton}>
          {esRegistro ? 'Registrarse' : 'Ingresar'}
        </button>
      </form>

      <div className={styles.cambiarModo}>
        {esRegistro ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
        <button
          type="button"
          onClick={() => {
            setEsRegistro(!esRegistro);
            setError('');
          }}
          className={styles.enlaceModo}
        >
          {esRegistro ? 'Inicia sesión aquí' : 'Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}

export default Login;
