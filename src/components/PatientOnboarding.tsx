import { useState } from 'react'
import { Camera, Clock, CalendarCheck, X } from 'lucide-react'

const steps = [
  {
    icon: Camera,
    color: '#00AADD',
    bg: '#e8f7fd',
    title: 'Sube una foto antes de tu cita',
    desc: 'Desde la pantalla de inicio, toca "Subir foto". Fotografia tu pie con buena luz y desde cerca. Se guarda automáticamente en tu historial.',
  },
  {
    icon: Clock,
    color: '#00AADD',
    bg: '#e8f7fd',
    title: 'Revisa tu evolución',
    desc: 'En "Mi historial" puedes ver todas tus fotos ordenadas por fecha, con las notas que dejó tu especialista después de cada sesión.',
  },
  {
    icon: CalendarCheck,
    color: '#C9A96E',
    bg: '#faf3e8',
    title: 'Confirma tu próxima cita',
    desc: 'En "Mi cita" verás la fecha y hora de tu próxima visita. Puedes confirmar tu asistencia o escribirnos por WhatsApp si necesitas cambiarla.',
  },
]

interface Props {
  onClose: () => void
}

export function PatientOnboarding({ onClose }: Props) {
  const [step, setStep] = useState(0)
  const current = steps[step]
  const Icon = current.icon
  const isLast = step === steps.length - 1

  const handleClose = () => {
    localStorage.setItem('solum_onboarded_patient', '1')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">

        {/* Close */}
        <div className="flex justify-end px-5 pt-4">
          <button onClick={handleClose} className="text-gray-300 hover:text-gray-500 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: current.bg }}
          >
            <Icon size={40} color={current.color} />
          </div>

          {/* Step counter */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 24 : 8,
                  backgroundColor: i === step ? '#00AADD' : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {current.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-7 flex flex-col gap-2">
          <button
            onClick={() => isLast ? handleClose() : setStep(step + 1)}
            className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95"
            style={{ backgroundColor: '#00AADD' }}
          >
            {isLast ? '¡Entendido, ya sé cómo usarla!' : 'Siguiente'}
          </button>
          {!isLast && (
            <button
              onClick={handleClose}
              className="w-full py-2.5 text-sm text-gray-400"
            >
              Saltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
