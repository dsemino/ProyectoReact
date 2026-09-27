import { Link } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import styles from './Header.module.css'; 

function Header() {
  return (
    <header className={styles.header}>
      {/* Al hacer clic en el logo, regresará suavemente a la página principal */}
      <Link to="/" className={styles.logoContenedor}>
        <div className={styles.iconoLogo}>
          🛠️
        </div>
        <span className={styles.marcaTexto}>MiFerretería</span>
      </Link>
      
      <NavBar />
    </header>
  );
}

export default Header;


