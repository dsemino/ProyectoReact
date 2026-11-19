import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config.js';
import Item from './Item.jsx';
import styles from './Item.module.css';

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Lee y modifica los parámetros de la URL (ej. ?categoria=Herramientas)
  const [searchParams, setSearchParams] = useSearchParams();
  const busqueda = searchParams.get('categoria') || '';
  
  // Estados para controlar la paginación (8 ítems por vista)
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;

  // Se ejecuta una sola vez al montar el componente para traer todos los productos de Firestore
  useEffect(() => {
    const obtenerProductos = async () => {
      setCargando(true);
      setError('');
      try {
        const productosRef = collection(db, 'productos');
        const snapshot = await getDocs(productosRef);
        // Transforma los documentos de Firebase en un array de objetos con su ID
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(lista);
      } catch (err) {
        console.error('Error al cargar los productos:', err);
        setError('No se pudo conectar con el servidor. Intenta recargar la página.');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Filtra la lista completa comparando el texto buscado contra el nombre o categoría
  const productosFiltrados = productos.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcula qué porción (slice) del array filtrado corresponde mostrar en la página actual
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo);

  // Actualiza la URL al escribir en el buscador y reinicia a la página 1
  const handleBuscar = (e) => {
    const valor = e.target.value;
    setPaginaActual(1);
    if (valor) {
      setSearchParams({ categoria: valor });
    } else {
      setSearchParams({});
    }
  };

  // Renderizado condicional mientras cargan los datos o si ocurre un fallo de red
  if (cargando) return <p style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando productos...</p>;
  if (error) return <p style={{ textAlign: 'center', color: '#dc3545', padding: '40px' }}>⚠️ {error}</p>;

  return (
    <div>
      {/* Barra de búsqueda controlada */}
      <div className={styles.controlesContenedor}>
        <input
          type="text"
          placeholder="🔍 Buscar producto por nombre o categoría..."
          value={busqueda}
          onChange={handleBuscar}
          className={styles.buscador}
        />
        <span className={styles.infoResultados}>
          Mostrando {productosPaginados.length} de {productosFiltrados.length} productos
        </span>
      </div>

      {/* Grilla de tarjetas o mensaje si no hay coincidencias */}
      {productosPaginados.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>No se encontraron productos.</p>
      ) : (
        <div className={styles.grid}>
          {productosPaginados.map((producto) => (
            <Item key={producto.id} info={producto} />
          ))}
        </div>
      )}

      {/* Botonera de paginación (se muestra solo si hay más de 1 página) */}
      {totalPaginas > 1 && (
        <div className={styles.paginador}>
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className={styles.botonPagina}
          >
            ← Anterior
          </button>

          {/* Genera dinámicamente un botón numérico por cada página disponible */}
          {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
            <button
              key={numero}
              onClick={() => setPaginaActual(numero)}
              className={`${styles.botonPagina} ${paginaActual === numero ? styles.paginaActiva : ''}`}
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

