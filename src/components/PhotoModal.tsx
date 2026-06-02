import { X } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import type { PhotoEntry } from '../lib/mockDb'

interface Props {
  photos: PhotoEntry[]
  selectedIndex: number
  onClose: () => void
  compareIndex?: number | null
}

export function PhotoModal({ photos, selectedIndex, onClose, compareIndex }: Props) {
  const photo = photos[selectedIndex]
  const comparePhoto = compareIndex != null ? photos[compareIndex] : null

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/40"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {comparePhoto ? (
        <div className="flex gap-2 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {[photo, comparePhoto].map((p, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <img src={p.photoUrl} alt="" className="w-full rounded-xl object-cover max-h-60" />
              <p className="text-white text-sm text-center">{fmt(p.date)}</p>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <img src={photo.photoUrl} alt="" className="w-full rounded-xl object-cover max-h-80" />
          <p className="text-white text-sm">{fmt(photo.date)}</p>
          <StatusBadge status={photo.status} />
          {photo.note && <p className="text-gray-300 text-sm text-center">{photo.note}</p>}
        </div>
      )}
    </div>
  )
}
