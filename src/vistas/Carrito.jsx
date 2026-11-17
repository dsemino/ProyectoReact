import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext.js';
import styles from './Carrito.module.css';

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useContext(CarritoContext);
  const [compraRealizada, setCompraRealizada] = useState(false);

  const handleFinalizarCompra = () => {
    vaciarCarrito();
    setCompraRealizada(true);
  };

  if (compraRealizada) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.vacio}>
          <h2>🎉 ¡Gracias por tu compra!</h2>
          <p>Tu pedido de herramientas ha sido procesado correctamente.</p>
          <Link to="/productos" className={styles.botonVolver}>
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.vacio}>
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Aún no has agregado ninguna herramienta a tu pedido.</p>
          <Link to="/productos" className={styles.botonVolver}>
            Ver catálogo de productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      <h2>🛒 Tu Carrito de Compras</h2>
      
      <div className={styles.lista}>
        {carrito.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <img src={item.imagen} alt={item.nombre} className={styles.imagen} />
            <div className={styles.info}>
              <h4>{item.nombre}</h4>
              <p>Cantidad: {item.cantidad} x $ {item.precio.toLocaleString('es-AR')}</p>
            </div>
            <span className={styles.subtotal}>
              $ {(item.precio * item.cantidad).toLocaleString('es-AR')}
            </span>
            <button
              onClick={() => eliminarDelCarrito(item.id)}
              className={styles.botonEliminar}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className={styles.resumen}>
        <p className={styles.totalTexto}>
          Total a pagar: $ {totalPrecio.toLocaleString('es-AR')}
        </p>
        <div className={styles.acciones}>
          <button onClick={vaciarCarrito} className={styles.botonVaciar}>
            Vaciar Carrito
          </button>
          <button onClick={handleFinalizarCompra} className={styles.botonComprar}>
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
