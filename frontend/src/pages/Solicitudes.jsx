import { useState, useEffect } from 'react';
import { Ticket, Plus, Search, AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://127.0.0.1:5000' 
  : 'https://TU_TÚNEL_AQUÍ.devtunnels.ms';

export default function Solicitudes() {
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Formulario
  const [formData, setFormData] = useState({
    title: '', description: '', service_type: 'Correctivo', priority: 'Media', asset_id: ''
  });

  useEffect(() => {
    fetchTickets();
    fetchAssets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/v1/tickets/`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (err) { console.error("Error cargando tickets:", err); }
  };

  const fetchAssets = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/v1/assets/`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setAssets(data);
    } catch (err) { console.error("Error cargando equipos:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      const response = await fetch(`${API_URL}/api/v1/tickets/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: user.id })
      });
      if (response.ok) {
        fetchTickets();
        setIsModalOpen(false);
        setFormData({ title: '', description: '', service_type: 'Correctivo', priority: 'Media', asset_id: '' });
      }
    } catch (err) { console.error("Error al crear ticket:", err); }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/v1/tickets/${id}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTickets();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Centro de Soporte</h1>
          <p className="text-gray-500 mt-1">Gestiona las solicitudes de servicio técnico y mantenimientos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={20} /> Nuevo Ticket
        </button>
      </div>

      {/* Lista de Tickets */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
            <Ticket size={48} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">Sin solicitudes activas</h3>
            <p className="text-sm">Todo está funcionando perfectamente en el laboratorio.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                      ticket.priority === 'Alta' || ticket.priority === 'Crítica' ? 'bg-red-50 text-red-700 border-red-200' :
                      ticket.priority === 'Media' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      Prioridad {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500 font-medium">
                    <span>📌 Equipo: {ticket.asset_name}</span>
                    <span>👤 Solicitado por: {ticket.client_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    {/* Select de Cambio de Estado Rápido */}
                    <select 
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.id, e.target.value)}
                      className={`text-sm font-semibold rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-colors ${
                        ticket.status === 'Resuelto' ? 'bg-green-50 text-green-700 border-green-200' :
                        ticket.status === 'En Proceso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <option value="Pendiente">⏳ Pendiente</option>
                      <option value="En Proceso">⚙️ En Proceso</option>
                      <option value="Resuelto">✅ Resuelto</option>
                    </select>
                    <span className="text-xs text-gray-400">Creado: {new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CREAR TICKET */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Crear Nueva Solicitud</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del problema</label>
                <input required type="text" placeholder="Ej: Ruido extraño en el motor" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo (Gemelo Digital)</label>
                <select required value={formData.asset_id} onChange={(e) => setFormData({...formData, asset_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="" disabled>Selecciona un equipo...</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.brand} {asset.model} (Cód: {asset.internal_code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                  <select value={formData.service_type} onChange={(e) => setFormData({...formData, service_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Diagnóstico">Diagnóstico</option>
                    <option value="Calibración">Calibración</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Baja">Baja (Rutina)</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta (Urgente)</option>
                    <option value="Crítica">Crítica (Equipo parado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
                <textarea required rows="3" placeholder="Describe los síntomas o el motivo del servicio..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium">Crear Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}