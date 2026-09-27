// function Inicio() {
//   return (
//     <div style={{ textAlign: 'center', padding: '50px' }}>
//       <h1>🛠️ Bienvenido a la Tienda de Herramientas de MiFerreteria.com</h1>
//       <p style={{ color: '#666', fontSize: '18px', marginTop: '15px' }}>
//         Encuentra las mejores herramientas eléctricas y manuales para tus proyectos profesionales y del hogar.
//       </p>
//     </div>
//   );
// }
// export default Inicio;


import { Link } from 'react-router-dom';
import styles from './Inicio.module.css';

function Inicio() {
  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>🛠️ Bienvenido a MiFerretería</h1>
      <p className={styles.bajada}>
        Encuentra las mejores herramientas eléctricas y manuales para tus proyectos profesionales y del hogar.
      </p>

      {/* Al hacer clic en cualquier parte del collage, redirige a /productos */}
      <Link to="/productos" className={styles.enlaceCollage}>
        <div className={styles.collageGrid}>
          
          {/* Foto 1: Grande (Ocupa más espacio) */}
          <div className={`${styles.fotoItem} ${styles.itemLarge}`}>
            <img src="/imagenes/Herramientas electricas.jpg" alt="Herramientas Eléctricas" />
          </div>

        </div>
        <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#007bff' }}>
          🖱️ Haz clic en el collage para ingresar al catálogo completo
        </p>
      </Link>
    </div>
  );
}

export default Inicio;
