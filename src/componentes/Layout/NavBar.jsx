import { Link } from 'react-router-dom';
import styles from './NavBar.module.css'; // Importamos el módulo de estilos

function NavBar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.lista}>
        <li><Link to="/" className={styles.enlace}>Inicio</Link></li>
        <li><Link to="/productos" className={styles.enlace}>Productos</Link></li>
        <li><Link to="/carrito" className={styles.enlace}>Carrito</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
