import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout/Layout.jsx';
import Inicio from './vistas/Inicio.jsx';
import Productos from './vistas/Productos.jsx';
import Detalle from './vistas/Detalle.jsx';
import Carrito from './vistas/Carrito.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="productos" element={<Productos />} />
          <Route path="producto/:id" element={<Detalle />} />
          <Route path="carrito" element={<Carrito />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
