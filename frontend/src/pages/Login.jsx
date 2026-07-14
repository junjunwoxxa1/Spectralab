import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Activity, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/activos'); 
      } else {
        setError('Credenciales incorrectas. Verifica tu email o contraseña.');
      }
    } catch (err) {
      console.error('Error al conectar:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* Fondos dinámicos para el efecto Liquid Glass */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-40"></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      {/* Contenedor Glassmorphism */}
      <div className="relative z-10 w-full max-w-md p-10 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border border-white/20">
            <Activity size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Spectralab</h2>
          <p className="mt-2 text-sm text-blue-200/80">Gestión Inteligente de Activos</p>
        </div>

        {/* Mensaje de Error UI */}
        {error && (
          <div className="flex items-center gap-3 p-3 mb-6 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-md">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Mail className="w-5 h-5 text-blue-200/70" />
            </div>
            <input 
              type="email" 
              placeholder="correo@spectralab.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-white placeholder-blue-200/50 transition-all bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-5 h-5 text-blue-200/70" />
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-white placeholder-blue-200/50 transition-all bg-white/5 border border-white/10 rounded-xl outline-none focus:bg-white/10 focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3.5 mt-2 font-semibold text-white transition-all bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Ingresar al Sistema
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}