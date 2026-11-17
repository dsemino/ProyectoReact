import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext.js';
import { AuthContext } from '../../context/AuthContext.js';
import styles from './NavBar.module.css';

function NavBar() {
  const { totalItems } = useContext(CarritoContext);
  const { usuario, logout } = useContext(AuthContext);

  return (
    <nav className={styles.nav}>
      <ul className={styles.lista}>
        <li><Link to="/" className={styles.enlace}>Inicio</Link></li>
        <li><Link to="/productos" className={styles.enlace}>Productos</Link></li>
        <li>
          <Link to="/carrito" className={styles.enlace}>
            🛒 Carrito {totalItems > 0 && `(${totalItems})`}
          </Link>
        </li>

        {usuario ? (
          <>
            <li><Link to="/admin" className={styles.enlace}>⚙️ Panel Admin</Link></li>
            <li>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: '1px solid #ffc107',
                  color: '#ffc107',
                  padding: '4px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Salir
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login" className={styles.enlace}>👤 Ingresar</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
