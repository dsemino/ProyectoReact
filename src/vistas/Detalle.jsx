import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Detalle.module.css'; // Importamos el módulo

function Detalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/productos.json')
      .then(response => response.json())
      .then(data => {
        const encontrado = data.find(prod => prod.id === parseInt(id));
        setProducto(encontrado);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar el detalle:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p style={{ textAlign: 'center' }}>Cargando detalles...</p>;
  if (!producto) return <p style={{ textAlign: 'center' }}>El producto no existe.</p>;

  return (
    <div className={styles.contenedor}>
      <Link to="/productos" className={styles.volver}>← Volver al catálogo</Link>
      <div className={styles.detalleCard}>
        <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
        <div className={styles.info}>
          <span className={styles.categoria}>{producto.categoria}</span>
          <h2>{producto.nombre}</h2>
          <p className={styles.descripcion}>{producto.descripcion}</p>
          <p className={styles.precio}>${producto.precio.toLocaleString('es-AR')}</p>
          <button className={styles.botonAgregar}>Agregar al Carrito (Próximamente)</button>
        </div>
      </div>
    </div>
  );
}

export default Detalle;
