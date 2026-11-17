import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoProvider.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import RutaProtegida from './componentes/RutaProtegida.jsx';
import Layout from './componentes/Layout/Layout.jsx';
import Inicio from './vistas/Inicio.jsx';
import Productos from './vistas/Productos.jsx';
import Detalle from './vistas/Detalle.jsx';
import Carrito from './vistas/Carrito.jsx';
import Login from './vistas/Login.jsx';
import Admin from './vistas/Admin.jsx'; // <-- Importamos el panel real

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="productos" element={<Productos />} />
              <Route path="producto/:id" element={<Detalle />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="login" element={<Login />} />
              
              <Route
                path="admin"
                element={
                  <RutaProtegida>
                    <Admin />
                  </RutaProtegida>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
