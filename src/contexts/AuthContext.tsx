import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authenticatePatient, authenticateAdmin, getPatient } from '../lib/mockDb'
import type { Patient } from '../lib/mockDb'

type Role = 'patient' | 'admin' | null

interface AuthState {
  role: Role
  patient: Patient | null
  login: (role: 'patient', dni: string, pin: string) => boolean
  loginAdmin: (user: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null)
  const [patient, setPatient] = useState<Patient | null>(null)

  // Restore session from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('solum_session')
    if (saved) {
      const { role: r, dni } = JSON.parse(saved) as { role: string; dni?: string }
      if (r === 'admin') {
        setRole('admin')
      } else if (r === 'patient' && dni) {
        const p = getPatient(dni)
        if (p) { setRole('patient'); setPatient(p) }
      }
    }
  }, [])

  const login = (_role: 'patient', dni: string, pin: string): boolean => {
    const p = authenticatePatient(dni, pin)
    if (p) {
      setRole('patient')
      setPatient(p)
      sessionStorage.setItem('solum_session', JSON.stringify({ role: 'patient', dni }))
      return true
    }
    return false
  }

  const loginAdmin = (user: string, password: string): boolean => {
    if (authenticateAdmin(user, password)) {
      setRole('admin')
      setPatient(null)
      sessionStorage.setItem('solum_session', JSON.stringify({ role: 'admin' }))
      return true
    }
    return false
  }

  const logout = () => {
    setRole(null)
    setPatient(null)
    sessionStorage.removeItem('solum_session')
  }

  return (
    <AuthContext.Provider value={{ role, patient, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
