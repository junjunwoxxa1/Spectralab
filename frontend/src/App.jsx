import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Activos from './pages/Activos';
import GemeloDigital from './pages/GemeloDigital';
import Empresas from './pages/Empresas';
import Configuracion from './pages/Configuracion';
import Solicitudes from './pages/Solicitudes'; // Asegúrate de importar el componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="empresas" element={<Empresas />} />
          
          <Route path="activos">
            <Route index element={<Activos />} />
            <Route path=":id" element={<GemeloDigital />} />
          </Route>
          
          {/* RUTA CORREGIDA: Ahora Solicitudes está en el nivel correcto */}
          <Route path="solicitudes" element={<Solicitudes />} />
          
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;