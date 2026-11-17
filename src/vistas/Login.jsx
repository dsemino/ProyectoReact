import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import styles from './Login.module.css';

function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
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

    try {
      if (esRegistro) {
        await registrar(email, password);
      } else {
        await login(email, password);
      }
      navigate('/admin'); // Al loguearse, lo llevamos directo al panel de administración
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
        <div className={styles.campo}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ferreteria.com"
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
