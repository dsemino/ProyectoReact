import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { CarritoContext } from '../context/CarritoContext.js';
import styles from './Detalle.module.css';

function Detalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [agregado, setAgregado] = useState(false);

  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const obtenerProducto = async () => {
      setCargando(true);
      setError('');
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProducto({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('La herramienta solicitada no existe o fue eliminada.');
        }
      } catch (err) {
        console.error('Error al cargar el detalle:', err);
        setError('Ocurrió un error al conectar con la base de datos.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [id]);

  const handleAgregar = () => {
    agregarAlCarrito(producto, 1);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (cargando) {
    return <p style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>⏳ Cargando detalles de la herramienta...</p>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#dc3545', fontWeight: 'bold' }}>⚠️ {error}</p>
        <Link to="/productos" className={styles.volver}>← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      <Link to="/productos" className={styles.volver}>← Volver al catálogo</Link>
      <div className={styles.detalleCard}>
        <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
        <div className={styles.info}>
          <span className={styles.categoria}>{producto.categoria}</span>
          <h2>{producto.nombre}</h2>
          <p className={styles.descripcion}>{producto.descripcion}</p>
          <p className={styles.precio}>$ {Number(producto.precio).toLocaleString('es-AR')}</p>
          
          <button onClick={handleAgregar} className={styles.botonAgregar}>
            {agregado ? '✅ ¡Agregado al carrito!' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detalle;
