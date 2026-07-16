import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Building2, ShieldAlert, Wrench, ArrowRight, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const API_URL = 'https://spectralab-api.onrender.com';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Consultamos Equipos y Empresas al mismo tiempo
    Promise.all([
      fetch(`${API_URL}/api/v1/assets/`, { headers }).then(res => res.json()),
      fetch(`${API_URL}/api/v1/companies/`, { headers }).then(res => res.json())
    ])
    .then(([assetsData, companiesData]) => {
      if (Array.isArray(assetsData)) setAssets(assetsData);
      if (Array.isArray(companiesData)) setCompanies(companiesData);
    })
    .catch(err => console.error("Error cargando el dashboard:", err))
    .finally(() => setIsLoading(false));
  }, []);

  // ================= CÁLCULOS DINÁMICOS =================
  const totalAssets = assets.length;
  const totalCompanies = companies.length;
  const operativeAssets = assets.filter(a => a.status === 'Operativo').length;
  
  // Lógica para detectar garantías vencidas
  const today = new Date();
  const warrantyAlerts = assets.filter(a => {
    if (!a.warranty_expires) return false;
    const expiryDate = new Date(a.warranty_expires);
    return expiryDate < today; // Retorna true si la fecha ya pasó
  });

  // Ordenar equipos para mostrar los más recientes primero
  const recentAssets = [...assets].reverse().slice(0, 4);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 flex justify-center items-center h-full"><Activity className="animate-spin text-blue-600 mr-2" /> Cargando métricas...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Centro de Mando</h1>
        <p className="text-gray-500 mt-1">Visión general en tiempo real de tu ecosistema de laboratorios.</p>
      </div>

      {/* ================= TARJETAS DE MÉTRICAS (KPIs) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI 1: Equipos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity size={24} /></div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">+ Total</span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Equipos Registrados</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalAssets}</p>
          </div>
        </div>

        {/* KPI 2: Empresas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 size={24} /></div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Clientes / Sedes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalCompanies}</p>
          </div>
        </div>

        {/* KPI 3: Operatividad */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={24} /></div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              {totalAssets > 0 ? Math.round((operativeAssets / totalAssets) * 100) : 0}% Salud
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Equipos Operativos</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{operativeAssets}</p>
          </div>
        </div>

        {/* KPI 4: Alertas (Garantías) */}
        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-red-50 opacity-50"><ShieldAlert size={100} /></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><ShieldAlert size={24} /></div>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-sm font-medium text-red-600">Garantías Vencidas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{warrantyAlerts.length}</p>
          </div>
        </div>
      </div>

      {/* ================= CONTENIDO DE COLUMNAS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Activos Recientes (Ocupa 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-semibold text-gray-900">Gemelos Digitales Recientes</h2>
            <Link to="/activos" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recentAssets.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <Wrench size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-900 font-medium">No hay equipos registrados</p>
                <Link to="/activos" className="text-sm text-blue-600 hover:underline mt-1 inline-block">Registrar mi primer equipo</Link>
              </div>
            ) : (
              recentAssets.map(asset => (
                <Link key={asset.id} to={`/activos/${asset.id}`} className="block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{asset.brand}</h3>
                      <p className="text-sm text-gray-500">{asset.model}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      asset.status === 'Operativo' ? 'bg-green-50 text-green-700 border-green-200' :
                      asset.status === 'En Mantenimiento' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><Clock size={14} /> Cód. Interno:</span>
                    <span className="font-mono text-gray-900 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{asset.internal_code}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Panel de Alertas (Ocupa 1/3) */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h2>
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-500" /> Atención Requerida
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {warrantyAlerts.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  <ShieldAlert size={24} className="mx-auto text-gray-300 mb-2" />
                  No hay alertas de garantía. Todos los equipos están cubiertos o sin fecha.
                </div>
              ) : (
                warrantyAlerts.slice(0, 5).map(asset => (
                  <Link key={`alert-${asset.id}`} to={`/activos/${asset.id}`} className="block p-4 hover:bg-red-50/50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900">{asset.brand} {asset.model}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600">
                      <Clock size={12} /> Venció el: {new Date(asset.warranty_expires).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            {warrantyAlerts.length > 5 && (
              <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                <span className="text-xs font-medium text-gray-500">+{warrantyAlerts.length - 5} alertas adicionales</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}