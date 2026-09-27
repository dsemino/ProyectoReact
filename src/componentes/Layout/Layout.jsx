import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main>
        <Outlet /> {/* Aquí se renderizará cada vista (Inicio, Productos, etc.) */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
