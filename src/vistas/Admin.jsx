import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import styles from './Admin.module.css';

function Admin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estados del formulario controlado
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const productosRef = collection(db, 'productos');


  const recargarProductos = async () => {
    try {
      const snapshot = await getDocs(productosRef);
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      }));
      setProductos(lista);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos desde Firebase.');
    }
  };

useEffect(() => {
    let activo = true;

    const cargarInicial = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'productos'));
        if (activo) {
          const lista = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }));
          setProductos(lista);
          setCargando(false);
        }
      } catch (err) {
        console.error(err);
        if (activo) {
          setError('Error al cargar los productos desde Firebase.');
          setCargando(false);
        }
      }
    };

    cargarInicial();

    return () => {
      activo = false;
    };
  }, []);
    

  // Limpiar formulario
  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setCategoria('');
    setPrecio('');
    setImagen('');
    setDescripcion('');
    setError('');
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones obligatorias del Requerimiento 2.1
    if (!nombre.trim() || !categoria.trim() || !descripcion.trim()) {
      setError('Todos los campos de texto son obligatorios.');
      return;
    }
    if (Number(precio) <= 0 || isNaN(Number(precio))) {
      setError('El precio debe ser un número mayor que cero.');
      return;
    }

    const datosProducto = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: Number(precio),
      imagen: imagen.trim() || '/imagenes/taladro 18V.webp',
      descripcion: descripcion.trim()
    };

    try {
      if (idEditando) {
        // Actualizar existente
        const docRef = doc(db, 'productos', idEditando);
        await updateDoc(docRef, datosProducto);
      } else {
        // Crear nuevo
        await addDoc(productosRef, datosProducto);
      }
      limpiarFormulario();
      //obtenerProductos();
      recargarProductos();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el producto en la base de datos.');
    }
  };

  // Cargar datos en el formulario para editar
  const handleEditar = (prod) => {
    setIdEditando(prod.id);
    setNombre(prod.nombre);
    setCategoria(prod.categoria);
    setPrecio(prod.precio);
    setImagen(prod.imagen);
    setDescripcion(prod.descripcion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar con confirmación UX (Requerimiento 2.1)
  const handleEliminar = async (id, nombreProd) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${nombreProd}" del catálogo? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'productos', id));
      //btenerProductos();
      recargarProductos();
    } catch (err) {
      console.error(err);
      setError('Error al intentar eliminar el producto.');
    }
  };


  return (
    <div className={styles.contenedor}>
      <div className={styles.headerAdmin}>
        <h2>⚙️ Administración de Herramientas</h2>
      </div>

      {/* Formulario de Creación / Edición */}
      <div className={styles.formularioCard}>
        <h3>{idEditando ? '✏️ Editar Herramienta' : '➕ Agregar Nueva Herramienta'}</h3>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.gridForm}>
            <div className={styles.campo}>
              <label>Nombre del Producto *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Taladro Percutor 18V"
              />
            </div>

            <div className={styles.campo}>
              <label>Categoría *</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej. Herramientas Eléctricas"
              />
            </div>

            <div className={styles.campo}>
              <label>Precio ($) *</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 85000"
              />
            </div>

            <div className={styles.campo}>
              <label>Ruta o URL de Imagen</label>
              <input
                type="text"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="/imagenes/taladro 18V.webp"
              />
            </div>

            <div className={`${styles.campo} ${styles.campoFull}`}>
              <label>Descripción *</label>
              <textarea
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalles técnicos de la herramienta..."
              />
            </div>
          </div>

          <div className={styles.botonesForm}>
            <button type="submit" className={styles.botonGuardar}>
              {idEditando ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
            {idEditando && (
              <button type="button" onClick={limpiarFormulario} className={styles.botonCancelar}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado y Gestión */}
      {cargando ? (
        <p style={{ textAlign: 'center' }}>Cargando inventario desde Firebase...</p>
      ) : (
        <div className={styles.tablaContenedor}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <img src={prod.imagen} alt={prod.nombre} className={styles.miniImg} />
                  </td>
                  <td>{prod.nombre}</td>
                  <td>{prod.categoria}</td>
                  <td>$ {Number(prod.precio).toLocaleString('es-AR')}</td>
                  <td className={styles.accionesCelda}>
                    <button onClick={() => handleEditar(prod)} className={styles.botonEditar}>
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(prod.id, prod.nombre)}
                      className={styles.botonEliminar}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
