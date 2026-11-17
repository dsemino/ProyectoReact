import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config.js';
import Item from './Item.jsx';
import styles from './Item.module.css';


function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estados para búsqueda y paginación (Requerimiento 4)
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8; // Mostramos 6 por página para que se vea el paginador con tus 10 ítems

  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError('');
      try {
        const productosRef = collection(db, 'productos');
        const snapshot = await getDocs(productosRef);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(lista);
      } catch (err) {
        console.error('Error al cargar las herramientas:', err);
        setError('No se pudo conectar con el servidor. Intenta recargar la página.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Filtrado en tiempo real por nombre o categoría
  const productosFiltrados = productos.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculos de paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo);

  // Reiniciar a la página 1 cada vez que el usuario escribe en el buscador
  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  if (cargando) {
    return (
      <p style={{ textAlign: 'center', fontSize: '18px', padding: '40px' }}>
        ⏳ Cargando herramientas desde la base de datos...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: 'center', color: '#dc3545', fontWeight: 'bold', padding: '40px' }}>
        ⚠️ {error}
      </p>
    );
  }

  return (
    <div>
      {/* Barra de búsqueda en tiempo real */}
      <div className={styles.controlesContenedor}>
        <input
          type="text"
          placeholder="🔍 Buscar herramienta por nombre o categoría..."
          value={busqueda}
          onChange={handleBuscar}
          className={styles.buscador}
        />
        <span className={styles.infoResultados}>
          Mostrando {productosPaginados.length} de {productosFiltrados.length} herramientas
        </span>
      </div>

      {/* Grilla de productos */}
      {productosPaginados.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          No se encontraron herramientas que coincidan con "{busqueda}".
        </p>
      ) : (
        <div className={styles.grid}>
          {productosPaginados.map((producto) => (
            <Item key={producto.id} info={producto} />
          ))}
        </div>
      )}

      {/* Paginador */}
      {totalPaginas > 1 && (
        <div className={styles.paginador}>
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className={styles.botonPagina}
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
            <button
              key={numero}
              onClick={() => setPaginaActual(numero)}
              className={`${styles.botonPagina} ${
                paginaActual === numero ? styles.paginaActiva : ''
              }`}
            >
              {numero}
            </button>
          ))}

          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className={styles.botonPagina}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemListContainer;
