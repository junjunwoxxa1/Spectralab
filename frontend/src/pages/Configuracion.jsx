import { useState, useEffect } from 'react';
import { User, Users, Bell, Shield, Webhook, Key, Save, Loader2, CheckCircle2, AlertCircle, Plus, X, Edit2, Power, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';

const API_URL = 'https://spectralab-api.onrender.com';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados: Perfil y Contraseña
  const [userProfile, setUserProfile] = useState({ id: '', full_name: '', email: '', role: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false, create: false });

  // Estados: Gestión de Usuarios
  const [usersList, setUsersList] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'tecnico', password: '' });
  
  // NUEVO: Estados para Editar Usuario
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({ id: '', full_name: '', email: '', role: '' });

  // Estados: Notificaciones
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const saved = localStorage.getItem('notifPrefs');
    return saved ? JSON.parse(saved) : { maintenance: true, tickets: false };
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUserProfile({ ...savedUser });
  }, []);

  useEffect(() => {
    if (activeTab === 'usuarios') fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/users/`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setUsersList(data);
    } catch (err) {
      console.error("Error cargando usuarios", err);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true); setErrorMsg(''); setSuccessMsg('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userProfile.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: userProfile.full_name, email: userProfile.email })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data));
        setSuccessMsg('Perfil actualizado correctamente');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      setErrorMsg('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setErrorMsg('Las contraseñas nuevas no coinciden');
      return;
    }
    setIsLoading(true); setErrorMsg(''); setSuccessMsg('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userProfile.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new })
      });
      if (response.ok) {
        setSuccessMsg('Contraseña actualizada con éxito');
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Error al actualizar');
      }
    } catch (error) {
      setErrorMsg('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/v1/users/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        fetchUsers();
        setIsUserModalOpen(false);
        setNewUser({ full_name: '', email: '', role: 'tecnico', password: '' });
      } else {
        const data = await response.json();
        alert(data.error || "Error al crear usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // NUEVO: Funciones para Editar Usuario
  const openEditModal = (user) => {
    setEditUserData({
      id: user.id,
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'tecnico'
    });
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${editUserData.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editUserData.full_name,
          email: editUserData.email,
          role: editUserData.role
        })
      });
      if (response.ok) {
        fetchUsers();
        setIsEditUserModalOpen(false);
      } else {
        const data = await response.json();
        alert(data.error || "Error al actualizar usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active })
      });
      if (response.ok) fetchUsers(); 
    } catch (err) {
      console.error("Error cambiando estado:", err);
    }
  };

  const toggleNotif = (key) => {
    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(newPrefs);
    localStorage.setItem('notifPrefs', JSON.stringify(newPrefs));
    setSuccessMsg('Preferencias guardadas');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const tabs = [
    { id: 'perfil', name: 'Mi Perfil', icon: User },
    { id: 'usuarios', name: 'Usuarios y Roles', icon: Users },
    { id: 'seguridad', name: 'Seguridad', icon: Shield },
    { id: 'notificaciones', name: 'Notificaciones', icon: Bell },
    { id: 'integraciones', name: 'Integraciones & Webhooks', icon: Webhook },
    { id: 'api', name: 'API Pública', icon: Key },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tu cuenta, equipo y conexiones de Spectralab.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600/10' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 min-h-[600px]">
            <div className="flex justify-end mb-4 h-8">
              {successMsg && <span className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 animate-in fade-in"><CheckCircle2 size={16} /> {successMsg}</span>}
              {errorMsg && <span className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 animate-in fade-in"><AlertCircle size={16} /> {errorMsg}</span>}
            </div>

            {/* PESTAÑA: PERFIL */}
            {activeTab === 'perfil' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-semibold text-gray-900">Información Personal</h2><p className="text-sm text-gray-500 mt-1">Actualiza tus datos de contacto.</p></div>
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg uppercase">
                    {userProfile.full_name ? userProfile.full_name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{userProfile.full_name || 'Usuario'}</h3>
                    <p className="text-gray-500">{userProfile.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium uppercase tracking-wide">Rol: {userProfile.role}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label><input type="text" value={userProfile.full_name} onChange={(e) => setUserProfile({...userProfile, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label><input type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                </div>
                <div className="flex justify-end pt-4"><button onClick={handleSaveProfile} disabled={isLoading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70">{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Guardar Perfil</button></div>
              </div>
            )}

            {/* PESTAÑA: USUARIOS Y ROLES */}
            {activeTab === 'usuarios' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div><h2 className="text-xl font-semibold text-gray-900">Directorio de Usuarios</h2><p className="text-sm text-gray-500 mt-1">Gestiona quién tiene acceso a Spectralab.</p></div>
                  <button onClick={() => setIsUserModalOpen(true)} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"><Plus size={18} /> Nuevo Usuario</button>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr><th className="px-6 py-3">Nombre</th><th className="px-6 py-3">Rol</th><th className="px-6 py-3">Estado</th><th className="px-6 py-3 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4"><p className="font-medium text-gray-900">{user.full_name || 'Sin Nombre'}</p><p className="text-gray-500">{user.email}</p></td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : user.role === 'tecnico' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{user.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 ${user.is_active !== false ? 'text-green-600' : 'text-red-600'}`}>
                              <div className={`w-2 h-2 rounded-full ${user.is_active !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>{user.is_active !== false ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {/* Botón Editar Activo */}
                              <button onClick={() => openEditModal(user)} title="Editar Usuario" className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => handleToggleUserStatus(user)} title={user.is_active !== false ? "Desactivar" : "Activar"} className={`p-1.5 rounded-lg transition-colors ${user.is_active !== false ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50' : 'text-red-500 hover:text-green-600 hover:bg-green-50 bg-red-50'}`}><Power size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PESTAÑA: SEGURIDAD */}
            {activeTab === 'seguridad' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-semibold text-gray-900">Seguridad de la Cuenta</h2><p className="text-sm text-gray-500 mt-1">Actualiza tu contraseña para mantener tu cuenta segura.</p></div>
                <div className="space-y-4 max-w-md">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña Actual</label>
                    <input type={showPass.current ? "text" : "password"} placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                    <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva Contraseña</label>
                    <input type={showPass.new ? "text" : "password"} placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                    <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Nueva Contraseña</label>
                    <input type={showPass.confirm ? "text" : "password"} placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                    <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600">{showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div className="pt-4"><button onClick={handleSavePassword} disabled={isLoading} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70">{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />} Actualizar Contraseña</button></div>
              </div>
            )}

            {/* PESTAÑA: NOTIFICACIONES */}
            {activeTab === 'notificaciones' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-semibold text-gray-900">Preferencias de Notificación</h2><p className="text-sm text-gray-500 mt-1">Controla cómo y cuándo Spectralab se comunica contigo.</p></div>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div><p className="font-medium text-gray-900">Mantenimientos Próximos</p><p className="text-sm text-gray-500">Recibir alertas 7 días antes del mantenimiento preventivo.</p></div>
                    <button onClick={() => toggleNotif('maintenance')} className="focus:outline-none">{notifPrefs.maintenance ? <ToggleRight size={36} className="text-blue-600" /> : <ToggleLeft size={36} className="text-gray-300" />}</button>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div><p className="font-medium text-gray-900">Nuevas Solicitudes de Servicio</p><p className="text-sm text-gray-500">Notificar por correo cuando un cliente levante un ticket.</p></div>
                    <button onClick={() => toggleNotif('tickets')} className="focus:outline-none">{notifPrefs.tickets ? <ToggleRight size={36} className="text-blue-600" /> : <ToggleLeft size={36} className="text-gray-300" />}</button>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑAS: MOCKUPS DE INTEGRACIONES Y API */}
            {activeTab === 'integraciones' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-semibold text-gray-900">Integraciones & Webhooks</h2><p className="text-sm text-gray-500 mt-1">Conecta Spectralab con WhatsApp (DonBot) o tu ERP.</p></div>
                <div className="p-5 border border-blue-100 bg-blue-50/50 rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0"><Webhook size={20} /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Webhook de Eventos</h4>
                    <p className="text-sm text-gray-500 mt-1">Actualmente en desarrollo. Aquí podrás configurar la URL para disparar flujos automatizados de mensajería.</p>
                    <div className="mt-4 flex gap-2"><input type="url" disabled placeholder="https://tu-endpoint.com/api/webhook" className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm outline-none cursor-not-allowed" /><button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">Conectar</button></div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'api' && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4 text-gray-400">
                <Key size={48} className="opacity-20" /><h3 className="text-lg font-medium text-gray-900">API Pública</h3><p className="max-w-sm">Genera llaves de acceso (API Keys) para que sistemas de terceros puedan consultar los Gemelos Digitales de tus activos.</p><span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide">Próximamente</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL: CREAR USUARIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label><input required type="text" value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label><input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="tecnico">Técnico</option><option value="admin">Administrador</option><option value="cliente">Cliente</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input required type={showPass.create ? "text" : "password"} value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                  <button type="button" onClick={() => setShowPass({...showPass, create: !showPass.create})} className="absolute right-2 top-[30px] text-gray-400 hover:text-gray-600">{showPass.create ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button><button type="submit" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium">Crear Usuario</button></div>
            </form>
          </div>
        </div>
      )}

      {/* NUEVO MODAL: EDITAR USUARIO */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
              <button onClick={() => setIsEditUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label><input required type="text" value={editUserData.full_name} onChange={(e) => setEditUserData({...editUserData, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label><input required type="email" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select value={editUserData.role} onChange={(e) => setEditUserData({...editUserData, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="tecnico">Técnico</option><option value="admin">Administrador</option><option value="cliente">Cliente</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={() => setIsEditUserModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Guardar Cambios</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}