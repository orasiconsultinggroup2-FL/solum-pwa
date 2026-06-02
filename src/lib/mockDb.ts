// Mock database — simulates Firebase Firestore + Storage with localStorage.
// Replace each function body with real Firebase calls when ready to connect backend.

export type SessionStatus = 'mejora' | 'estable' | 'atencion'

export interface PhotoEntry {
  id: string
  sessionId: string
  patientDni: string
  photoUrl: string       // base64 data URL in mock; Firebase Storage URL in prod
  note: string           // max 200 chars
  status: SessionStatus
  date: string           // ISO date string
  uploadedBy: 'specialist' | 'patient'
}

export interface Appointment {
  id: string
  patientDni: string
  date: string           // ISO datetime
  specialist: string
  confirmed: boolean
}

export interface Patient {
  dni: string            // primary key — DNI peruano (8 digits)
  pin: string            // 4-digit PIN (hashed in prod; plain in mock)
  name: string
  phone: string
  email: string
  condition: string      // set by specialist, read-only for patient
  registeredAt: string
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_PATIENTS: Patient[] = [
  {
    dni: '12345678',
    pin: '1234',
    name: 'María López Quispe',
    phone: '987654321',
    email: 'maria@example.com',
    condition: 'Uña encarnada bilateral — pie derecho e izquierdo',
    registeredAt: '2026-01-10T09:00:00Z',
  },
  {
    dni: '87654321',
    pin: '5678',
    name: 'Carlos Rojas Mendoza',
    phone: '912345678',
    email: 'carlos@example.com',
    condition: 'Pie diabético — seguimiento mensual',
    registeredAt: '2026-02-15T10:30:00Z',
  },
  {
    dni: '45678901',
    pin: '0000',
    name: 'Ana Flores Torres',
    phone: '999111222',
    email: 'ana@example.com',
    condition: 'Onicomicosis — tratamiento en curso',
    registeredAt: '2026-03-01T08:00:00Z',
  },
]

// Placeholder photos (solid-color SVG data URLs — ASCII only to avoid btoa issues)
const makePhoto = (color: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${color}"/><text x="200" y="160" text-anchor="middle" font-size="64" fill="white" font-family="Arial">&#x1F9B6;</text><text x="200" y="220" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.7)" font-family="Arial">SOLUM Podologia</text></svg>`
  )}`

const SEED_PHOTOS: PhotoEntry[] = [
  { id: 'p1', sessionId: 's1', patientDni: '12345678', photoUrl: makePhoto('#00AADD'), note: 'Primera consulta. Uña encarnada en dedo gordo derecho. Se realiza procedimiento de alivio.', status: 'atencion', date: '2026-01-10T09:30:00Z', uploadedBy: 'specialist' },
  { id: 'p2', sessionId: 's2', patientDni: '12345678', photoUrl: makePhoto('#4CB8D4'), note: 'Segunda sesión. Reducción de inflamación. Continuar cuidados en casa.', status: 'estable', date: '2026-02-05T10:00:00Z', uploadedBy: 'specialist' },
  { id: 'p3', sessionId: 's3', patientDni: '12345678', photoUrl: makePhoto('#2ECC71'), note: 'Evolución muy positiva. Uña creciendo correctamente.', status: 'mejora', date: '2026-03-12T09:00:00Z', uploadedBy: 'specialist' },
  { id: 'p4', sessionId: 's4', patientDni: '87654321', photoUrl: makePhoto('#C9A96E'), note: 'Control pie diabético. Sin lesiones activas. Hidratación adecuada.', status: 'estable', date: '2026-02-20T11:00:00Z', uploadedBy: 'specialist' },
  { id: 'p5', sessionId: 's5', patientDni: '87654321', photoUrl: makePhoto('#E8C99E'), note: 'Pequeña fisura en talón. Se aplica tratamiento preventivo.', status: 'atencion', date: '2026-03-20T11:30:00Z', uploadedBy: 'specialist' },
  { id: 'p6', sessionId: 's6', patientDni: '45678901', photoUrl: makePhoto('#8B6A8B'), note: 'Aplicación de tratamiento antifúngico. Mejora en coloración de uña.', status: 'mejora', date: '2026-03-05T09:00:00Z', uploadedBy: 'specialist' },
]

const SEED_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientDni: '12345678', date: '2026-06-10T10:00:00', specialist: 'Dra. Paola Sánchez', confirmed: false },
  { id: 'a2', patientDni: '87654321', date: '2026-06-12T11:30:00', specialist: 'Dra. Paola Sánchez', confirmed: true },
]

// ─── Storage helpers ──────────────────────────────────────────────────────────

function load<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw) as T[]
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

function save(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── Patient API ──────────────────────────────────────────────────────────────

export function getPatients(): Patient[] {
  return load<Patient>('solum_patients', SEED_PATIENTS)
}

export function getPatient(dni: string): Patient | undefined {
  return getPatients().find((p) => p.dni === dni)
}

export function createPatient(patient: Patient): void {
  const patients = getPatients()
  patients.push(patient)
  save('solum_patients', patients)
}

export function updatePatient(dni: string, updates: Partial<Omit<Patient, 'dni'>>): void {
  const patients = getPatients().map((p) => (p.dni === dni ? { ...p, ...updates } : p))
  save('solum_patients', patients)
}

export function authenticatePatient(dni: string, pin: string): Patient | null {
  const patient = getPatient(dni)
  if (patient && patient.pin === pin) return patient
  return null
}

// ─── Photo API ────────────────────────────────────────────────────────────────

export function getPhotos(patientDni: string): PhotoEntry[] {
  const all = load<PhotoEntry>('solum_photos', SEED_PHOTOS)
  return all
    .filter((p) => p.patientDni === patientDni)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function addPhoto(entry: Omit<PhotoEntry, 'id'>): PhotoEntry {
  const all = load<PhotoEntry>('solum_photos', SEED_PHOTOS)
  const newEntry: PhotoEntry = { ...entry, id: `p${Date.now()}` }
  all.push(newEntry)
  save('solum_photos', all)
  return newEntry
}

// ─── Appointment API ──────────────────────────────────────────────────────────

export function getAppointment(patientDni: string): Appointment | undefined {
  const all = load<Appointment>('solum_appointments', SEED_APPOINTMENTS)
  const now = new Date()
  return all
    .filter((a) => a.patientDni === patientDni && new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
}

export function getAllAppointments(): Appointment[] {
  return load<Appointment>('solum_appointments', SEED_APPOINTMENTS)
}

export function confirmAppointment(id: string): void {
  const all = load<Appointment>('solum_appointments', SEED_APPOINTMENTS)
  save('solum_appointments', all.map((a) => (a.id === id ? { ...a, confirmed: true } : a)))
}

export function addAppointment(appt: Omit<Appointment, 'id'>): void {
  const all = load<Appointment>('solum_appointments', SEED_APPOINTMENTS)
  all.push({ ...appt, id: `a${Date.now()}` })
  save('solum_appointments', all)
}

// ─── Admin auth (mock) ────────────────────────────────────────────────────────

const ADMIN_CREDENTIALS = { user: 'admin', password: 'solum2026' }

export function authenticateAdmin(user: string, password: string): boolean {
  return user === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.password
}

// ─── Image compression helper ─────────────────────────────────────────────────

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxW = 800
        const scale = img.width > maxW ? maxW / img.width : 1
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
