import type { SessionStatus } from '../lib/mockDb'

const config: Record<SessionStatus, { label: string; bg: string; text: string }> = {
  mejora:   { label: 'Mejora visible',     bg: 'bg-green-100',  text: 'text-green-700' },
  estable:  { label: 'Estable',            bg: 'bg-gray-100',   text: 'text-gray-600' },
  atencion: { label: 'Requiere atención',  bg: 'bg-orange-100', text: 'text-orange-600' },
}

export function StatusBadge({ status }: { status: SessionStatus }) {
  const { label, bg, text } = config[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  )
}
