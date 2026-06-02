import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Plus, X, CalendarPlus } from 'lucide-react'
import {
  getPatient, getPhotos, addPhoto, addAppointment, updatePatient,
  compressImage,
} from '../../lib/mockDb'
import type { SessionStatus, PhotoEntry } from '../../lib/mockDb'
import { StatusBadge } from '../../components/StatusBadge'
import { PhotoModal } from '../../components/PhotoModal'

type Tab = 'historial' | 'datos' | 'citas'

export function AdminPatientDetail() {
  const { dni } = useParams<{ dni: string }>()
  const navigate = useNavigate()
  const patient = getPatient(dni!)

  const [tab, setTab] = useState<Tab>('historial')
  const [photos, setPhotos] = useState<PhotoEntry[]>(() => getPhotos(dni!))
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-8">
        <p className="text-gray-500">Paciente no encontrado.</p>
        <button onClick={() => navigate('/admin')} className="text-[#00AADD] text-sm">← Volver</button>
      </div>
    )
  }

  const refreshPhotos = () => setPhotos(getPhotos(dni!))

  const tabs: { key: Tab; label: string }[] = [
    { key: 'historial', label: 'Historial fotográfico' },
    { key: 'datos',     label: 'Datos del paciente' },
    { key: 'citas',     label: 'Citas' },
  ]

  return (
    <div className="flex flex-col min-h-full max-w-2xl mx-auto">
      {/* Back + name */}
      <div className="px-5 py-4 flex items-center gap-3 bg-white border-b border-gray-100">
        <button onClick={() => navigate('/admin')} className="text-gray-500 p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-800 truncate">{patient.name}</p>
          <p className="text-xs text-gray-400">DNI: {patient.dni}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-[#00AADD] text-[#00AADD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 p-5">
        {tab === 'historial' && (
          <HistorialTab
            photos={photos}
            patientDni={dni!}
            onPhotoAdded={refreshPhotos}
            onPhotoClick={(i) => setSelectedPhoto(i)}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
          />
        )}
        {tab === 'datos' && <DatosTab patient={patient} />}
        {tab === 'citas' && <CitasTab patientDni={dni!} patientName={patient.name} />}
      </div>

      {selectedPhoto !== null && (
        <PhotoModal
          photos={photos}
          selectedIndex={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  )
}

// ─── Historial tab ────────────────────────────────────────────────────────────

function HistorialTab({
  photos, patientDni, onPhotoAdded, onPhotoClick, showUpload, setShowUpload,
}: {
  photos: PhotoEntry[]
  patientDni: string
  onPhotoAdded: () => void
  onPhotoClick: (i: number) => void
  showUpload: boolean
  setShowUpload: (v: boolean) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<SessionStatus>('estable')
  const [saving, setSaving] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setPreview(compressed)
  }

  const handleSave = async () => {
    if (!preview) return
    setSaving(true)
    addPhoto({
      sessionId: `s${Date.now()}`,
      patientDni,
      photoUrl: preview,
      note: note.slice(0, 200),
      status,
      date: new Date().toISOString(),
      uploadedBy: 'specialist',
    })
    setPreview(null); setNote(''); setStatus('estable'); setShowUpload(false)
    onPhotoAdded()
    setSaving(false)
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="flex flex-col gap-4">
      {/* Add photo button */}
      {!showUpload ? (
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#00AADD]/40 text-[#00AADD] font-medium py-4 rounded-2xl hover:bg-[#00AADD]/5 transition-colors"
        >
          <Plus size={20} />
          Agregar nueva entrada
        </button>
      ) : (
        <UploadForm
          fileRef={fileRef}
          preview={preview}
          note={note}
          status={status}
          saving={saving}
          onFileChange={handleFileChange}
          onNoteChange={setNote}
          onStatusChange={setStatus}
          onSave={handleSave}
          onCancel={() => { setShowUpload(false); setPreview(null); setNote(''); setStatus('estable') }}
        />
      )}

      {/* Photos list */}
      {photos.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          No hay registros fotográficos para este paciente.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => onPhotoClick(i)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left active:scale-98 transition-all w-full"
            >
              <img src={photo.photoUrl} alt="" className="w-full h-44 object-cover" />
              <div className="p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{fmt(photo.date)}</span>
                  <StatusBadge status={photo.status} />
                </div>
                {photo.note && <p className="text-sm text-gray-700 line-clamp-2">{photo.note}</p>}
                <p className="text-xs text-gray-400">
                  Subida por: {photo.uploadedBy === 'specialist' ? 'Especialista' : 'Paciente'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UploadForm({
  fileRef, preview, note, status, saving,
  onFileChange, onNoteChange, onStatusChange, onSave, onCancel,
}: {
  fileRef: React.RefObject<HTMLInputElement | null>
  preview: string | null
  note: string
  status: SessionStatus
  saving: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNoteChange: (v: string) => void
  onStatusChange: (v: SessionStatus) => void
  onSave: () => void
  onCancel: () => void
}) {
  const statusOptions: { value: SessionStatus; label: string; color: string }[] = [
    { value: 'mejora',   label: 'Mejora visible',    color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'estable',  label: 'Estable',           color: 'bg-gray-100 text-gray-600 border-gray-300' },
    { value: 'atencion', label: 'Requiere atención', color: 'bg-orange-100 text-orange-600 border-orange-300' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-[#00AADD]/30 p-4 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-800">Nueva entrada clínica</p>
        <button onClick={onCancel} className="text-gray-400 p-1"><X size={18} /></button>
      </div>

      {/* Photo picker */}
      {preview ? (
        <div className="relative">
          <img src={preview} alt="" className="w-full h-48 object-cover rounded-xl" />
          <button
            onClick={() => { onFileChange({ target: { files: null } } as any); (fileRef.current as HTMLInputElement | null)!.value = '' }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#00AADD]/40 transition-colors"
        >
          <Camera size={28} />
          <span className="text-sm">Tomar foto o seleccionar de galería</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

      {/* Note */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Nota clínica (máx. 200 caracteres)</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Descripción de la sesión, observaciones, indicaciones…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
        />
        <p className="text-xs text-gray-400 text-right">{note.length}/200</p>
      </div>

      {/* Status selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Estado</label>
        <div className="flex flex-col gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                status === opt.value ? opt.color + ' border-2' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status === opt.value ? 'bg-current' : 'bg-gray-300'}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={!preview || saving}
        className="w-full bg-[#00AADD] text-white font-semibold py-3.5 rounded-xl disabled:opacity-40 active:scale-95 transition-all"
      >
        {saving ? 'Guardando…' : 'Guardar entrada'}
      </button>
    </div>
  )
}

// ─── Datos tab ────────────────────────────────────────────────────────────────

function DatosTab({ patient }: { patient: ReturnType<typeof getPatient> }) {
  const [condition, setCondition] = useState(patient!.condition)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updatePatient(patient!.dni, { condition })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const rows = [
    { label: 'Nombre completo', value: patient!.name },
    { label: 'DNI', value: patient!.dni },
    { label: 'Teléfono', value: patient!.phone },
    { label: 'Correo', value: patient!.email },
    { label: 'Registrado el', value: new Date(patient!.registeredAt).toLocaleDateString('es-PE') },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {rows.map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Condition — editable by specialist */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-700">Condición registrada</p>
        <textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
        />
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-[#00AADD] text-white active:scale-95'
          }`}
        >
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

// ─── Citas tab ────────────────────────────────────────────────────────────────

function CitasTab({ patientDni }: { patientDni: string; patientName: string }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [specialist, setSpecialist] = useState('Dra. Paola Sánchez')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!date || !time) return
    addAppointment({
      patientDni,
      date: `${date}T${time}:00`,
      specialist,
      confirmed: false,
    })
    setDate(''); setTime('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
        <p className="font-semibold text-gray-800 flex items-center gap-2">
          <CalendarPlus size={18} className="text-[#00AADD]" />
          Agendar nueva cita
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Especialista</label>
          <input
            type="text"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!date || !time}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[#00AADD] text-white disabled:opacity-40 active:scale-95'
          }`}
        >
          {saved ? '✓ Cita agendada' : 'Agendar cita'}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        La cita aparecerá en la app del paciente automáticamente.
      </p>
    </div>
  )
}
