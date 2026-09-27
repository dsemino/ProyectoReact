import { useState, useEffect } from 'react';
import Item from './Item.jsx';
import styles from './Item.module.css'; // Importamos el módulo

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/productos.json')
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar las herramientas:", error);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p style={{ textAlign: 'center', fontSize: '20px' }}>Cargando herramientas...</p>;
  }

  return (
    <div className={styles.grid}> {/* Aplicamos la clase del módulo */}
      {productos.map((producto) => (
        <Item key={producto.id} info={producto} />
      ))}
    </div>
  );
}

export default ItemListContainer;
