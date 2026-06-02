export function SolumLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#00AADD" />
      <text x="24" y="33" textAnchor="middle" fontSize="28" fontFamily="Georgia, serif" fontWeight="bold" fill="white">S</text>
      <rect x="10" y="39" width="28" height="3" rx="1.5" fill="#C9A96E" />
    </svg>
  )
}
