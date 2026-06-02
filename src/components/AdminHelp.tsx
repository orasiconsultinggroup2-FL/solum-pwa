import { useState } from 'react'
import { X, Search, UserPlus, Camera, FileText, CalendarPlus, ChevronRight } from 'lucide-react'

const sections = [
  {
    title: 'Lista de pacientes',
    icon: Search,
    color: '#00AADD',
    steps: [
      'Usa el buscador para encontrar a un paciente por nombre, DNI o teléfono.',
      'El botón "Nuevo" (arriba a la derecha) te permite registrar a un paciente por primera vez.',
      'Cada tarjeta muestra la última foto, el estado actual y la fecha de la sesión más reciente.',
    ],
  },
  {
    title: 'Historial fotográfico',
    icon: Camera,
    color: '#00AADD',
    steps: [
      'Entra a la ficha de un paciente y selecciona la pestaña "Historial fotográfico".',
      'Toca "Agregar nueva entrada" para subir una foto desde la cámara o galería.',
      'Escribe una nota clínica (máx. 200 caracteres) y selecciona el estado: Mejora visible, Estable o Requiere atención.',
      'Toca "Guardar entrada" — la foto queda visible para el paciente de inmediato.',
    ],
  },
  {
    title: 'Datos del paciente',
    icon: FileText,
    color: '#C9A96E',
    steps: [
      'En la pestaña "Datos del paciente" puedes editar la condición registrada.',
      'El paciente verá esta condición en su perfil (solo lectura).',
      'Los demás datos (nombre, DNI, teléfono) solo se editan al crear el perfil.',
    ],
  },
  {
    title: 'Agendar citas',
    icon: CalendarPlus,
    color: '#C9A96E',
    steps: [
      'Ve a la pestaña "Citas" dentro de la ficha del paciente.',
      'Selecciona fecha, hora y nombre del especialista.',
      'La cita aparece automáticamente en la app del paciente.',
    ],
  },
]

interface Props {
  onClose: () => void
}

export function AdminHelp({ onClose }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">Guía de uso</h3>
            <p className="text-xs text-gray-400 mt-0.5">Panel especialista — SOLUM</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Sections */}
        <div className="overflow-y-auto flex-1 px-4 py-4 flex flex-col gap-2">
          {sections.map((section, i) => {
            const Icon = section.icon
            const isOpen = open === i
            return (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: section.color + '18' }}
                  >
                    <Icon size={18} color={section.color} />
                  </div>
                  <p className="flex-1 text-sm font-semibold text-gray-700">{section.title}</p>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 transition-transform duration-200 shrink-0"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 flex flex-col gap-2.5">
                    {section.steps.map((step, j) => (
                      <div key={j} className="flex gap-3 items-start">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: section.color }}
                        >
                          {j + 1}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-all"
            style={{ backgroundColor: '#00AADD' }}
          >
            Cerrar guía
          </button>
        </div>
      </div>
    </div>
  )
}
