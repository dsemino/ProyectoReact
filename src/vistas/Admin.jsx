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

  // Estados controlados para cada campo del formulario (creación y edición)
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const productosRef = collection(db, 'productos');

  // Vuelve a consultar Firestore después de crear, editar o borrar un producto
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

  // Carga inicial segura al entrar al panel
  useEffect(() => {
    let activo = true;
    const cargarInicial = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'productos'));
        if (activo) {
          setProductos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    return () => { activo = false; };
  }, []);

  // Resetea todos los inputs del formulario a su estado inicial
  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setCategoria('');
    setPrecio('');
    setImagen('');
    setDescripcion('');
    setError('');
  };

  // Maneja el envío del formulario: valida datos y decide si crea (addDoc) o actualiza (updateDoc)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        // Actualiza el documento existente en Firestore
        await updateDoc(doc(db, 'productos', idEditando), datosProducto);
      } else {
        // Crea un documento nuevo en Firestore
        await addDoc(productosRef, datosProducto);
      }
      limpiarFormulario();
      recargarProductos();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el producto en la base de datos.');
    }
  };

  // Rellena el formulario con los datos de la fila seleccionada para editarla
  const handleEditar = (prod) => {
    setIdEditando(prod.id);
    setNombre(prod.nombre);
    setCategoria(prod.categoria);
    setPrecio(prod.precio);
    setImagen(prod.imagen);
    setDescripcion(prod.descripcion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pide confirmación visual antes de borrar definitivamente un documento de Firestore
  const handleEliminar = async (id, nombreProd) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${nombreProd}" del catálogo?`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'productos', id));
      recargarProductos();
    } catch (err) {
      console.error(err);
      setError('Error al intentar eliminar el producto.');
    }
  };

  // ... (Renderizado JSX del formulario y la tabla) ...
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

      {/* Tabla de Inventario */}
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
