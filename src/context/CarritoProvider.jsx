import { useState } from 'react';
import { CarritoContext } from './CarritoContext.js';

// Proveedor que envuelve la app para compartir el estado del carrito en todas las vistas
export function CarritoProvider({ children }) {
  // Estado principal que almacena el array de productos agregados
  const [carrito, setCarrito] = useState([]);

  // Agrega un producto o suma su cantidad si ya estaba en el carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      // Verifica si el ID del producto ya existe en la lista actual
      const existe = prevCarrito.find((item) => item.id === producto.id);
      if (existe) {
        // Si existe, recorre el array y actualiza solo la cantidad de ese ítem
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      // Si no existe, lo agrega al final del array con su cantidad inicial
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };
  // Filtra el array dejando fuera el producto cuyo ID coincida con el recibido
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id));
  };
  // Restablece el carrito a un array vacío
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  // Suma las cantidades de todos los productos para mostrar el contador en el menú
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  // Calcula el monto total multiplicando precio por cantidad de cada ítem
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
