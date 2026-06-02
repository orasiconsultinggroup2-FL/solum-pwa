import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, ChevronRight } from 'lucide-react'
import { getPatients, getPhotos } from '../../lib/mockDb'
import type { Patient } from '../../lib/mockDb'
import { StatusBadge } from '../../components/StatusBadge'

export function AdminPatientList() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const patients = getPatients()

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.dni.includes(query) ||
      p.phone.includes(query)
  )

  const getLastPhoto = (dni: string) => {
    const photos = getPhotos(dni)
    return photos[0] ?? null
  }

  return (
    <div className="flex flex-col gap-4 p-5 max-w-2xl mx-auto">
      {/* Search + new patient */}
      <div className="flex gap-3 pt-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o teléfono…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
          />
        </div>
        <button
          onClick={() => navigate('/admin/nuevo-paciente')}
          className="bg-[#00AADD] text-white px-4 rounded-xl flex items-center gap-1.5 text-sm font-medium"
        >
          <UserPlus size={16} />
          Nuevo
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#00AADD]">{patients.length}</p>
          <p className="text-xs text-gray-500">Pacientes</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#C9A96E]">{filtered.length}</p>
          <p className="text-xs text-gray-500">Resultados</p>
        </div>
      </div>

      {/* Patient list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No se encontraron pacientes.</p>
        ) : (
          filtered.map((patient) => (
            <PatientCard
              key={patient.dni}
              patient={patient}
              lastPhoto={getLastPhoto(patient.dni)}
              onClick={() => navigate(`/admin/paciente/${patient.dni}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function PatientCard({
  patient, lastPhoto, onClick,
}: {
  patient: Patient
  lastPhoto: ReturnType<typeof getPhotos>[0] | null
  onClick: () => void
}) {
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

  const initials = patient.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 text-left hover:border-[#00AADD]/30 active:scale-98 transition-all w-full"
    >
      {/* Avatar or last photo */}
      {lastPhoto ? (
        <img
          src={lastPhoto.photoUrl}
          alt=""
          className="w-12 h-12 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-[#00AADD]/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#00AADD]">{initials}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{patient.name}</p>
        <p className="text-xs text-gray-500">DNI: {patient.dni}</p>
        {lastPhoto && (
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={lastPhoto.status} />
            <span className="text-xs text-gray-400">{fmtDate(lastPhoto.date)}</span>
          </div>
        )}
      </div>

      <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </button>
  )
}
