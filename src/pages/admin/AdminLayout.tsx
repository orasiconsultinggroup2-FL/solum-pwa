import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut, HelpCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { SolumLogo } from '../../components/SolumLogo'
import { AdminHelp } from '../../components/AdminHelp'

export function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SolumLogo size={32} />
          <div>
            <p className="text-sm font-bold text-[#00AADD]" style={{ fontFamily: 'Georgia, serif' }}>SOLUM</p>
            <p className="text-xs text-[#C9A96E] leading-none font-medium">Panel especialista</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Help button */}
          <button
            onClick={() => setShowHelp(true)}
            className="text-gray-400 hover:text-[#00AADD] p-2 rounded-lg hover:bg-[#00AADD]/5 transition-colors"
            title="Ver guía de uso"
          >
            <HelpCircle size={20} />
          </button>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/') }}
            className="text-gray-400 p-2 rounded-lg hover:bg-gray-100 flex items-center gap-1.5 text-xs"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {showHelp && <AdminHelp onClose={() => setShowHelp(false)} />}
    </div>
  )
}
