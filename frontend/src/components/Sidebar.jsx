import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Beaker, Settings, LogOut, UserPlus } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Empresas', path: '/empresas', icon: Building2 },
    { name: 'Activos', path: '/activos', icon: Beaker },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  // Función rápida para salir del sistema
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-[#0E1117] text-gray-300 flex flex-col border-r border-gray-800">
      
      {/* Cabecera / Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          S
        </div>
        <span className="text-xl font-semibold text-white tracking-wide">Spectralab</span>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-500 font-medium' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Acciones de Usuario (Nuevos Botones) */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-2">
        <button 
          onClick={() => { /* Futura lógica o modal para crear usuario */ }}
          className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <UserPlus size={20} className="text-gray-400" />
          Crear Usuario
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} className="text-red-400 group-hover:text-red-500" />
          Cerrar Sesión
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
        Beta v1.0
      </div>
    </div>
  );
}