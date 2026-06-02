import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getPhotos } from '../../lib/mockDb'
import type { PhotoEntry } from '../../lib/mockDb'
import { StatusBadge } from '../../components/StatusBadge'
import { PhotoModal } from '../../components/PhotoModal'
import { GitCompare } from 'lucide-react'

export function PatientHistory() {
  const { patient } = useAuth()
  const photos = patient ? getPhotos(patient.dni) : []
  const [selected, setSelected] = useState<number | null>(null)
  const [compareA, setCompareA] = useState<number | null>(null)
  const [compareMode, setCompareMode] = useState(false)

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })

  const handlePhotoClick = (i: number) => {
    if (!compareMode) { setSelected(i); return }
    if (compareA === null) { setCompareA(i) }
    else if (compareA !== i) { setSelected(i) } // shows compare modal
  }

  const inCompareSelection = compareMode && compareA !== null

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Mi historial</h2>
        <button
          onClick={() => { setCompareMode(!compareMode); setCompareA(null); setSelected(null) }}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
            compareMode ? 'bg-[#00AADD] text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <GitCompare size={14} />
          Comparar
        </button>
      </div>

      {compareMode && (
        <div className="px-5 py-2 bg-blue-50 text-xs text-blue-600">
          {compareA === null
            ? 'Toca la primera foto a comparar'
            : 'Ahora toca la segunda foto'}
        </div>
      )}

      <div className="px-5 py-4 flex flex-col gap-4 max-w-md mx-auto w-full">
        {photos.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-4xl mb-3">🦶</p>
            <p className="text-sm">Aún no hay registros en tu historial.</p>
          </div>
        ) : (
          photos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              date={fmt(photo.date)}
              onClick={() => handlePhotoClick(i)}
              highlighted={compareA === i}
              compareMode={compareMode}
            />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-5 pb-6 mt-auto">
        <p className="text-xs text-gray-400 text-center">
          Las imágenes y notas son orientativas. No reemplazan la evaluación clínica presencial.
        </p>
      </div>

      {selected !== null && (
        <PhotoModal
          photos={photos}
          selectedIndex={selected}
          compareIndex={inCompareSelection ? compareA : null}
          onClose={() => { setSelected(null); if (inCompareSelection) { setCompareA(null); setCompareMode(false) } }}
        />
      )}
    </div>
  )
}

function PhotoCard({
  photo, date, onClick, highlighted, compareMode,
}: {
  photo: PhotoEntry; date: string; onClick: () => void; highlighted: boolean; compareMode: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden text-left w-full active:scale-98 transition-all ${
        highlighted ? 'border-[#00AADD] ring-2 ring-[#00AADD]/30' : 'border-gray-100'
      } ${compareMode ? 'cursor-pointer' : ''}`}
    >
      <img
        src={photo.photoUrl}
        alt={`Foto ${date}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{date}</span>
          <StatusBadge status={photo.status} />
        </div>
        {photo.note && (
          <p className="text-sm text-gray-700 line-clamp-2">{photo.note}</p>
        )}
      </div>
    </button>
  )
}
