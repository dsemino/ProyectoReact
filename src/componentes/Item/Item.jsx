import { Link } from 'react-router-dom';
import styles from './Item.module.css';

function Item({ info }) {
  return (
    <div className={styles.card}>
      <img src={info.imagen} alt={info.nombre} className={styles.imagen} />
      <span className={styles.categoria}>{info.categoria}</span>
      <h3 className={styles.titulo}>{info.nombre}</h3>
      
      {}
      <p className={styles.precio}>${info.precio.toLocaleString('es-AR')}</p>
      
      <Link to={`/producto/${info.id}`} className={styles.boton}>
        Ver Detalles
      </Link>
    </div>
  );
}

export default Item;

