import { useAuth } from '../../contexts/AuthContext'
import { MessageCircle, User, Phone, Mail, Stethoscope } from 'lucide-react'

const SOLUM_WHATSAPP = '51999999999'

export function PatientProfile() {
  const { patient } = useAuth()

  const contactWA = () => {
    const msg = encodeURIComponent(`Hola SOLUM, soy ${patient?.name} (DNI: ${patient?.dni}). Tengo una consulta.`)
    window.open(`https://wa.me/${SOLUM_WHATSAPP}?text=${msg}`, '_blank')
  }

  const rows = [
    { icon: User,         label: 'Nombre',    value: patient?.name },
    { icon: Phone,        label: 'Teléfono',  value: patient?.phone },
    { icon: Mail,         label: 'Correo',    value: patient?.email },
    { icon: Stethoscope,  label: 'Condición registrada', value: patient?.condition },
  ]

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-800 pt-2">Mi perfil</h2>

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-[#00AADD]/10 flex items-center justify-center">
          <span className="text-3xl font-bold text-[#00AADD]">
            {patient?.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 px-4 py-3.5">
            <Icon size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DNI badge */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-500">DNI registrado</p>
        <p className="text-sm font-bold text-gray-700 tracking-widest">{patient?.dni}</p>
      </div>

      {/* Contact */}
      <button
        onClick={contactWA}
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-4 rounded-xl active:scale-95 transition-all"
      >
        <MessageCircle size={20} />
        Contactar a SOLUM por WhatsApp
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Los datos de tu condición son registrados por tu especialista y no pueden ser modificados desde esta app.
      </p>
    </div>
  )
}
