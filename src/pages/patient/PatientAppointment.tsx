import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAppointment, confirmAppointment } from '../../lib/mockDb'
import { CalendarCheck, MessageCircle, CheckCircle2 } from 'lucide-react'

const SOLUM_WHATSAPP = '51999999999' // reemplazar con número real

export function PatientAppointment() {
  const { patient } = useAuth()
  const [appt, setAppt] = useState(() => patient ? getAppointment(patient.dni) : undefined)

  const handleConfirm = () => {
    if (!appt) return
    confirmAppointment(appt.id)
    setAppt({ ...appt, confirmed: true })
  }

  const handleReschedule = () => {
    const msg = encodeURIComponent(
      `Hola SOLUM, soy ${patient?.name} (DNI: ${patient?.dni}). Necesito reagendar mi cita del ${fmtDate(appt?.date ?? '')}.`
    )
    window.open(`https://wa.me/${SOLUM_WHATSAPP}?text=${msg}`, '_blank')
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const fmtTime = (d: string) =>
    new Date(d).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 pt-2">Mi próxima cita</h2>

      {appt ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Date banner */}
          <div className="bg-[#00AADD] text-white px-5 py-4">
            <p className="text-xs text-white/70 uppercase tracking-wide">{fmtDate(appt.date)}</p>
            <p className="text-3xl font-bold mt-1">{fmtTime(appt.date)}</p>
          </div>

          {/* Details */}
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700">{appt.specialist}</p>
            </div>

            {appt.confirmed ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-3 py-2">
                <CheckCircle2 size={18} />
                <p className="text-sm font-medium">Asistencia confirmada</p>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="w-full bg-[#00AADD] text-white font-semibold py-3 rounded-xl active:scale-95 transition-all"
              >
                Confirmar asistencia
              </button>
            )}

            <button
              onClick={handleReschedule}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl active:scale-95 transition-all"
            >
              <MessageCircle size={18} className="text-green-500" />
              Necesito reagendar
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm">No tienes citas programadas próximamente.</p>
          <button
            onClick={handleReschedule}
            className="mt-6 flex items-center gap-2 mx-auto bg-green-500 text-white font-medium px-5 py-3 rounded-xl"
          >
            <MessageCircle size={18} />
            Contactar por WhatsApp
          </button>
        </div>
      )}

      {/* Reminder note */}
      {appt && (
        <div className="bg-[#C9A96E]/10 rounded-xl p-4 border border-[#C9A96E]/20">
          <p className="text-sm text-[#8a6a3e] font-medium mb-1">📸 Recordatorio</p>
          <p className="text-sm text-[#8a6a3e]">
            Toma una foto de tu pie el día anterior a tu cita para que tu especialista pueda revisarla antes de la sesión.
          </p>
        </div>
      )}
    </div>
  )
}
