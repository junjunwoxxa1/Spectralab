import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Activity, Wrench, FileText, Calendar, ShieldCheck, Save, X, Plus, Clock, Download } from 'lucide-react';

export default function GemeloDigital() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  // Estados para la Info General
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Estados para el Historial de Mantenimientos
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    asset_id: id,
    event_type: 'Mantenimiento Preventivo',
    technician: '',
    description: ''
  });

  // Estados para la Biblioteca Documental
  const [documents, setDocuments] = useState([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({ 
    asset_id: id, 
    version: '1.0', 
    document_type: 'Manual', 
    file_url: '' 
  });
  useEffect(() => {
    // 1. Cargar datos del equipo
    fetch('https://spectralab-api.onrender.com/api/v1/assets/')
      .then(res => res.json())
      .then(data => {
        const foundAsset = data.find(item => item.id === id);
        setAsset(foundAsset);
      })
      .catch(err => console.error("Error cargando activo:", err));

    // 2. Cargar historial de mantenimientos
    fetch(`https://spectralab-api.onrender.com/api/v1/lifecycle/asset/${id}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error cargando historial:", err));

      // 3. Cargar documentos
    fetch(`https://spectralab-api.onrender.com/api/v1/documents/asset/${id}`)
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error("Error cargando documentos:", err));
  }, [id]);

  /* --- LÓGICA DE INFO GENERAL --- */
  const handleEditClick = () => {
    setEditForm({
      serial_number: asset.serial_number || '',
      status: asset.status || 'Operativo',
      purchase_date: asset.purchase_date || '',
      warranty_expires: asset.warranty_expires || ''
    });
    setIsEditing(true);
  };

  const handleInfoChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleInfoSave = async () => {
    try {
      const response = await fetch(`https://spectralab-api.onrender.com/api/v1/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        const updatedAsset = await response.json();
        setAsset(updatedAsset);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
    }
  };

  /* --- LÓGICA DE MANTENIMIENTOS --- */
  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

 const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    // Obtenemos los datos del usuario real desde el navegador
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    const eventData = {
        ...eventForm,
        technician: user ? user.full_name : eventForm.technician, 
        tech_id: user ? user.id : null 
    };

    try {
      const response = await fetch('https://spectralab-api.onrender.com/api/v1/lifecycle/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        // Agregamos el nuevo evento a la lista forzando el nombre en la vista
        setEvents([{...newEvent, technician: eventData.technician}, ...events]);
        setIsEventModalOpen(false);
        // Limpiamos el formulario
        setEventForm({ 
            asset_id: id, 
            event_type: 'Mantenimiento Preventivo', 
            technician: '', 
            description: '' 
        });
      }
    } catch (err) {
      console.error("Error guardando intervención:", err);
    }
  };
  /* --- LÓGICA DE DOCUMENTOS --- */
  const handleDocChange = (e) => {
    setDocForm({ ...docForm, [e.target.name]: e.target.value });
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://spectralab-api.onrender.com/api/v1/documents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docForm),
      });
      if (response.ok) {
        const newDoc = await response.json();
        setDocuments([newDoc, ...documents]); // Agrega el documento a la lista
        setIsDocModalOpen(false); // Cierra el modal
        setDocForm({ ...docForm, file_url: '', version: '1.0' }); // Limpia el formulario
      }
    } catch (err) {
      console.error("Error guardando documento:", err);
    }
  };

  if (!asset) return <div className="p-8 text-center text-gray-500">Cargando Gemelo Digital...</div>;

  return (
    <div className="relative">
      {/* Cabecera Principal */}
      <div className="mb-8">
        <Link to="/activos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver a Gestión de Activos
        </Link>
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <Activity size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{asset.brand} {asset.model}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-mono bg-gray-100 px-2.5 py-1 rounded-md text-sm font-medium text-gray-700 border border-gray-200">
                {asset.internal_code}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                N/S: <span className="font-medium text-gray-700">{asset.serial_number || 'No especificado'}</span>
              </span>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                {asset.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button onClick={() => setActiveTab('info')} className={`border-b-2 py-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Activity size={18} /> Información General
          </button>
          <button onClick={() => setActiveTab('mantenimientos')} className={`border-b-2 py-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'mantenimientos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Wrench size={18} /> Historial y Mantenimientos
          </button>
          <button onClick={() => setActiveTab('documentos')} className={`border-b-2 py-4 font-medium flex items-center gap-2 transition-colors ${activeTab === 'documentos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <FileText size={18} /> Biblioteca Documental
          </button>
        </nav>
      </div>

      {/* Contenido Dinámico */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        
        {/* PESTAÑA 1: Información General */}
        {activeTab === 'info' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Detalles Técnicos</h2>
              {!isEditing ? (
                <button onClick={handleEditClick} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                  Editar información
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1">
                    <X size={16} /> Cancelar
                  </button>
                  <button onClick={handleInfoSave} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm">
                    <Save size={16} /> Guardar Cambios
                  </button>
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><Calendar size={14}/> Fecha de Compra</span>
                    <span className="font-medium text-gray-900">{asset.purchase_date || 'No registrada'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1 flex items-center gap-1.5"><ShieldCheck size={14}/> Vencimiento de Garantía</span>
                    <span className="font-medium text-gray-900">{asset.warranty_expires || 'No registrada'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                    <input type="text" name="serial_number" value={editForm.serial_number} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado Operativo</label>
                    <select name="status" value={editForm.status} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option value="Operativo">Operativo</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Fuera de Servicio">Fuera de Servicio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                    <input type="date" name="purchase_date" value={editForm.purchase_date} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento de Garantía</label>
                    <input type="date" name="warranty_expires" value={editForm.warranty_expires} onChange={handleInfoChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: Mantenimientos y Ciclo de Vida */}
        {activeTab === 'mantenimientos' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Historial de Intervenciones</h2>
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={16} /> Registrar Intervención
              </button>
            </div>

            {/* Lista de Eventos (Timeline) */}
            {events.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500"><Wrench size={20} /></div>
                <h3 className="text-gray-900 font-medium">Sin historial registrado</h3>
                <p className="text-gray-500 text-sm mt-1">Este equipo aún no tiene mantenimientos o servicios registrados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                        ev.event_type === 'Mantenimiento Preventivo' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        ev.event_type === 'Mantenimiento Correctivo' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {ev.event_type}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {new Date(ev.event_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm mt-2">{ev.observations}</p>
                    <div className="mt-3 text-xs text-gray-500">
                      <strong>Técnico:</strong> {ev.technician || 'No especificado'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: Documentos */}
        {activeTab === 'documentos' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Archivos del Equipo</h2>
              <button onClick={() => setIsDocModalOpen(true)} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
                <Plus size={16} /> Subir Documento
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500"><FileText size={20} /></div>
                <h3 className="text-gray-900 font-medium">Bóveda vacía</h3>
                <p className="text-gray-500 text-sm mt-1">Sube manuales, garantías o certificados de este equipo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.document_type} v{doc.version}</p>
                        <p className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download size={18} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Registrar Intervención */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Registrar Intervención</h2>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                <select name="event_type" value={eventForm.event_type} onChange={handleEventChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="Instalación">Instalación</option>
                  <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                  <option value="Mantenimiento Correctivo">Mantenimiento Correctivo</option>
                  <option value="Diagnóstico">Diagnóstico</option>
                  <option value="Calibración">Calibración</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Técnico Asignado</label>
                <input type="text" name="technician" placeholder="Ej: Juan Pérez" value={eventForm.technician} onChange={handleEventChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Observaciones</label>
                <textarea name="description" placeholder="Detalle el trabajo realizado..." rows="4" value={eventForm.description} onChange={handleEventChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Subir Documento */}
      {isDocModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Añadir Documento</h2>
              <button onClick={() => setIsDocModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleDocSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select name="document_type" value={docForm.document_type} onChange={handleDocChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="Manual">Manual de Usuario</option>
                  <option value="Certificado">Certificado de Calibración</option>
                  <option value="Garantía">Garantía</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
                <input type="text" name="version" placeholder="Ej: 1.0" value={docForm.version} onChange={handleDocChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Enlace al Archivo</label>
                <input type="url" name="file_url" placeholder="https://..." value={docForm.file_url} onChange={handleDocChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <p className="text-xs text-gray-500 mt-1">Por ahora, pega aquí el enlace público de tu PDF (Drive, Dropbox, etc).</p>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Guardar Documento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}