import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import { PatientLogin } from './pages/PatientLogin'
import { AdminLogin } from './pages/AdminLogin'
import { PatientLayout } from './pages/patient/PatientLayout'
import { PatientHome } from './pages/patient/PatientHome'
import { PatientHistory } from './pages/patient/PatientHistory'
import { PatientAppointment } from './pages/patient/PatientAppointment'
import { PatientProfile } from './pages/patient/PatientProfile'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminPatientList } from './pages/admin/AdminPatientList'
import { AdminPatientDetail } from './pages/admin/AdminPatientDetail'
import { AdminNewPatient } from './pages/admin/AdminNewPatient'

function ProtectedPatient({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()
  return role === 'patient' ? <>{children}</> : <Navigate to="/" replace />
}

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()
  return role === 'admin' ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function Root() {
  const { role } = useAuth()
  if (role === 'patient') return <Navigate to="/patient" replace />
  if (role === 'admin')   return <Navigate to="/admin" replace />
  return <PatientLogin />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />

          <Route
            path="/patient"
            element={<ProtectedPatient><PatientLayout /></ProtectedPatient>}
          >
            <Route index element={<PatientHome />} />
            <Route path="historial" element={<PatientHistory />} />
            <Route path="cita" element={<PatientAppointment />} />
            <Route path="perfil" element={<PatientProfile />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}
          >
            <Route index element={<AdminPatientList />} />
            <Route path="paciente/:dni" element={<AdminPatientDetail />} />
            <Route path="nuevo-paciente" element={<AdminNewPatient />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
