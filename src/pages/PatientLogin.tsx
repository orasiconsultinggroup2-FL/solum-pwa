import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SolumLogo } from '../components/SolumLogo'
import { useAuth } from '../contexts/AuthContext'

export function PatientLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [dni, setDni] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handlePinChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...pin]
    next[i] = val
    setPin(next)
    if (val && i < 3) pinRefs[i + 1].current?.focus()
  }

  const handlePinKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) pinRefs[i - 1].current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const pinStr = pin.join('')
    if (dni.length !== 8) { setError('Ingresa tu DNI de 8 dígitos.'); return }
    if (pinStr.length !== 4) { setError('Ingresa tu PIN de 4 dígitos.'); return }
    const ok = login('patient', dni, pinStr)
    if (ok) navigate('/patient')
    else setError('DNI o PIN incorrecto. Consulta a tu especialista.')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <SolumLogo size={64} />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#00AADD]" style={{ fontFamily: 'Georgia, serif' }}>
              SOLUM
            </h1>
            <p className="text-sm text-gray-500 mt-1">Tu pie en manos expertas</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">DNI</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={8}
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-center tracking-widest focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">PIN de 4 dígitos</label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={pinRefs[i]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKey(i, e)}
                  className="w-14 h-14 border border-gray-300 rounded-xl text-2xl text-center font-bold focus:outline-none focus:border-[#00AADD] focus:ring-2 focus:ring-[#00AADD]/20"
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-orange-600 text-center bg-orange-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#00AADD] text-white font-semibold py-4 rounded-xl text-base hover:bg-[#0099CC] active:scale-95 transition-all"
          >
            Ingresar
          </button>
        </form>

        {/* Demo hint */}
        <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 w-full">
          <p className="font-medium text-gray-500 mb-1">Cuentas de prueba</p>
          <p>DNI: <strong>12345678</strong> — PIN: <strong>1234</strong></p>
          <p>DNI: <strong>87654321</strong> — PIN: <strong>5678</strong></p>
        </div>

        {/* Admin link */}
        <button
          onClick={() => navigate('/admin/login')}
          className="text-xs text-gray-400 underline"
        >
          Acceso especialista
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed max-w-xs">
          Las imágenes y notas son orientativas. No reemplazan la evaluación clínica presencial.
        </p>
      </div>
    </div>
  )
}
