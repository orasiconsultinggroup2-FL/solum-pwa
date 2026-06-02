import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCheck } from 'lucide-react'
import { createPatient, getPatient } from '../../lib/mockDb'

export function AdminNewPatient() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    dni: '', name: '', phone: '', email: '', condition: '', pin: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.dni.length !== 8) { setError('El DNI debe tener exactamente 8 dígitos.'); return }
    if (form.pin.length !== 4) { setError('El PIN debe tener exactamente 4 dígitos.'); return }
    if (!form.name.trim()) { setError('El nombre es requerido.'); return }
    if (getPatient(form.dni)) { setError('Ya existe un paciente con ese DNI.'); return }

    createPatient({
      dni: form.dni,
      pin: form.pin,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      condition: form.condition.trim(),
      registeredAt: new Date().toISOString(),
    })
    setSuccess(true)
    setTimeout(() => navigate(`/admin/paciente/${form.dni}`), 1200)
  }

  const fields = [
    { key: 'dni',       label: 'DNI (8 dígitos)',     type: 'tel',   placeholder: '12345678',      maxLength: 8 },
    { key: 'pin',       label: 'PIN de acceso (4 dígitos)', type: 'tel', placeholder: '0000',      maxLength: 4 },
    { key: 'name',      label: 'Nombre completo',     type: 'text',  placeholder: 'María López',   maxLength: 80 },
    { key: 'phone',     label: 'Teléfono',            type: 'tel',   placeholder: '987654321',     maxLength: 12 },
    { key: 'email',     label: 'Correo electrónico',  type: 'email', placeholder: 'maria@email.com', maxLength: 80 },
    { key: 'condition', label: 'Condición inicial',   type: 'text',  placeholder: 'Ej: uña encarnada, pie diabético…', maxLength: 200 },
  ]

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate('/admin')} className="text-gray-500 p-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Nuevo paciente</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {fields.map(({ key, label, type, placeholder, maxLength }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              inputMode={type === 'tel' ? 'numeric' : undefined}
              value={form[key as keyof typeof form]}
              onChange={(e) => set(key, type === 'tel' ? e.target.value.replace(/\D/g, '') : e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
            />
          </div>
        ))}

        {error && (
          <p className="text-sm text-orange-600 bg-orange-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all ${
            success
              ? 'bg-green-500 text-white'
              : 'bg-[#00AADD] text-white active:scale-95'
          }`}
        >
          <UserCheck size={18} />
          {success ? 'Paciente registrado ✓' : 'Registrar paciente'}
        </button>
      </form>

      <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
        <p className="text-xs text-amber-700">
          El DNI es el identificador permanente del paciente. El PIN le permite acceder a la app desde su teléfono.
        </p>
      </div>
    </div>
  )
}
