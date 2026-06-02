import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SolumLogo } from '../components/SolumLogo'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft } from 'lucide-react'

export function AdminLogin() {
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = loginAdmin(user, password)
    if (ok) navigate('/admin')
    else setError('Usuario o contraseña incorrectos.')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 text-sm w-fit">
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex flex-col items-center gap-3">
          <SolumLogo size={56} />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#00AADD]" style={{ fontFamily: 'Georgia, serif' }}>
              Panel Especialista
            </h1>
            <p className="text-sm text-gray-500 mt-1">SOLUM Podología</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
            />
          </div>

          {error && (
            <p className="text-sm text-orange-600 text-center bg-orange-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#C9A96E] text-white font-semibold py-4 rounded-xl text-base hover:bg-[#b8965e] active:scale-95 transition-all"
          >
            Ingresar al panel
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
          <p className="font-medium text-gray-500 mb-1">Acceso de prueba</p>
          <p>Usuario: <strong>admin</strong> — Contraseña: <strong>solum2026</strong></p>
        </div>
      </div>
    </div>
  )
}
