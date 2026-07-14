import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Plus, Search, Activity, X } from 'lucide-react';

export default function Activos() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para guardar los datos del nuevo equipo
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    internal_code: '',
    serial_number: '',
    status: 'Operativo',
    company_id: 'fe50f3f5-a8c4-49f5-b5ae-7f4b5557702d'  // Por ahora lo asignamos a la empresa por defecto
  });

  // Cargar los equipos al iniciar
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/v1/assets/')
      .then(res => res.json())
      .then(data => setAssets(data))
      .catch(err => console.error(err));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Enviar los datos al backend (Flask)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/assets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newAsset = await response.json();
        // Agregamos el nuevo equipo a la tabla al instante sin recargar la página
        setAssets([...assets, newAsset]);
        setIsModalOpen(false); // Cerramos el modal
        // Limpiamos el formulario
        setFormData({ brand: '', model: '', internal_code: '', serial_number: '', status: 'Operativo', company_id: 'fe50f3f5-a8c4-49f5-b5ae-7f4b5557702d' });
      } else {
        console.error("Error al guardar el equipo");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  return (
    <div className="relative">
      {/* Cabecera y Botón de Acción */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Activos</h1>
          <p className="text-gray-500 mt-1">Administra los gemelos digitales de tus equipos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nuevo Equipo
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white p-4 rounded-t-xl border-x border-t border-gray-200 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por marca, modelo o código..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Equipo</th>
              <th className="px-6 py-4 font-medium">Código Interno</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{asset.brand} {asset.model}</div>
                      <div className="text-sm text-gray-500">N/S: {asset.serial_number || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{asset.internal_code}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/activos/${asset.id}`)} 
                    className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ver Gemelo Digital &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ventana Flotante (Modal) para Nuevo Equipo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Equipo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Interno</label>
                  <input type="text" name="internal_code" value={formData.internal_code} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                  <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Operativo">Operativo</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                  <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Guardar Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}