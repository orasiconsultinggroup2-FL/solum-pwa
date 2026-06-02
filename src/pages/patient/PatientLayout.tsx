import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Camera, Clock, CalendarCheck, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { SolumLogo } from '../../components/SolumLogo'
import { PatientOnboarding } from '../../components/PatientOnboarding'

export function PatientLayout() {
  const { patient, logout } = useAuth()
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('solum_onboarded_patient')
    if (!done) setShowOnboarding(true)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const navItems = [
    { to: '/patient', label: 'Inicio', icon: Camera, end: true },
    { to: '/patient/historial', label: 'Historial', icon: Clock },
    { to: '/patient/cita', label: 'Mi cita', icon: CalendarCheck },
    { to: '/patient/perfil', label: 'Perfil', icon: User },
  ]

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SolumLogo size={32} />
          <div>
            <p className="text-sm font-bold text-[#00AADD]" style={{ fontFamily: 'Georgia, serif' }}>SOLUM</p>
            <p className="text-xs text-gray-400 leading-none">{patient?.name.split(' ')[0]}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-400 p-2 rounded-lg hover:bg-gray-100">
          <LogOut size={18} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="bg-white border-t border-gray-100 flex safe-bottom">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-1 text-xs transition-colors ${
                isActive ? 'text-[#00AADD]' : 'text-gray-400'
              }`
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* First-time onboarding */}
      {showOnboarding && (
        <PatientOnboarding onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
