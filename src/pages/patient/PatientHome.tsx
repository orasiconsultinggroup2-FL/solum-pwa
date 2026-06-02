import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Clock, CalendarCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { addPhoto, compressImage } from '../../lib/mockDb'

export function PatientHome() {
  const { patient } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !patient) return
    const photoUrl = await compressImage(file)
    addPhoto({
      sessionId: `s${Date.now()}`,
      patientDni: patient.dni,
      photoUrl,
      note: '',
      status: 'estable',
      date: new Date().toISOString(),
      uploadedBy: 'patient',
    })
    navigate('/patient/historial')
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-gray-500 text-sm">{greeting},</p>
        <h2 className="text-xl font-bold text-gray-800">{patient?.name.split(' ').slice(0, 2).join(' ')}</h2>
      </div>

      {/* Main action — Subir foto */}
      <button
        onClick={() => fileRef.current?.click()}
        className="bg-[#00AADD] text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg shadow-[#00AADD]/20 active:scale-95 transition-all text-left"
      >
        <div className="bg-white/20 rounded-xl p-3">
          <Camera size={32} />
        </div>
        <div>
          <p className="font-bold text-lg leading-tight">Subir foto</p>
          <p className="text-sm text-white/80 mt-1 leading-tight">
            Fotografía el área con buena luz, desde cerca
          </p>
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoCapture}
      />

      {/* Secondary actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/patient/historial')}
          className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-all"
        >
          <div className="bg-[#00AADD]/10 rounded-xl p-2.5">
            <Clock size={24} className="text-[#00AADD]" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Mi historial</p>
        </button>

        <button
          onClick={() => navigate('/patient/cita')}
          className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-all"
        >
          <div className="bg-[#C9A96E]/10 rounded-xl p-2.5">
            <CalendarCheck size={24} className="text-[#C9A96E]" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Mi cita</p>
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Las imágenes y notas son orientativas. No reemplazan la evaluación clínica presencial.
        </p>
      </div>
    </div>
  )
}
