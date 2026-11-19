import { Link } from 'react-router-dom';
import styles from './Inicio.module.css';

function Inicio() {
  return (
    <div className={styles.contenedor}>
      {/* Banner Principal (Hero) */}
      <section className={styles.hero}>
        <div className={styles.heroTexto}>
          <span className={styles.etiqueta}>Calidad Industrial y Hogar</span>
          <h1 className={styles.titulo}>
            Potencia y precisión para cada <span>proyecto</span>
          </h1>
          <p className={styles.bajada}>
            Equipa tu taller con las mejores herramientas eléctricas, manuales y accesorios del mercado. Stock permanente y asesoramiento especializado.
          </p>
          <div className={styles.botonesHero}>
            <Link to="/productos" className={styles.botonPrincipal}>
              Explorar Catálogo Completo →
            </Link>
          </div>
        </div>

        <div className={styles.heroImagenContenedor}>
          <img
            src="/imagenes/Herramientas electricas.jpg"
            alt="Herramientas Profesionales MiFerretería"
            className={styles.heroImagen}
          />
        </div>
      </section>

      {/* Barra de Beneficios */}
      <section className={styles.beneficiosGrid}>
        <div className={styles.beneficioCard}>
          <span className={styles.beneficioIcono}>🚚</span>
          <div>
            <h4>Envíos a todo el país</h4>
            <p>Despacho rápido y seguro a domicilio.</p>
          </div>
        </div>

        <div className={styles.beneficioCard}>
          <span className={styles.beneficioIcono}>🛡️</span>
          <div>
            <h4>Garantía Oficial</h4>
            <p>Respaldo directo en todas nuestras marcas.</p>
          </div>
        </div>

        <div className={styles.beneficioCard}>
          <span className={styles.beneficioIcono}>💳</span>
          <div>
            <h4>Pagos Flexibles</h4>
            <p>Cuotas sin interés y descuentos en efectivo.</p>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <h2 className={styles.seccionTitulo}>Nuestras Líneas Principales</h2>
      <section className={styles.categoriasGrid}>
        <Link to="/productos?categoria=Herramientas Eléctricas" className={styles.categoriaCard}>
          <img src="/imagenes/taladro 18V.webp" alt="Herramientas Eléctricas" />
          <div className={styles.categoriaInfo}>
            <h3>Herramientas Eléctricas</h3>
            <span>Ver productos →</span>
          </div>
        </Link>

        <Link to="/productos?categoria=Herramientas Manuales" className={styles.categoriaCard}>
          <img src="/imagenes/Kit llaves tubo 41 piezas.webp" alt="Herramientas Manuales" />
          <div className={styles.categoriaInfo}>
            <h3>Herramientas Manuales</h3>
            <span>Ver productos →</span>
          </div>
        </Link>

        <Link to="/productos?categoria=Organizadores" className={styles.categoriaCard}>
          <img src="/imagenes/Caja19.webp" alt="Organizadores y Medición" />
          <div className={styles.categoriaInfo}>
            <h3>Organizadores y Medición</h3>
            <span>Ver productos →</span>
          </div>
        </Link>
      </section>
    </div>
  );
}

export default Inicio;
