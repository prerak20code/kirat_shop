export function RegMark({ corner }) {
  return (
    <div className={`regmark ${corner}`}>
      <svg viewBox="0 0 14 14">
        <line x1="7" y1="0" x2="7" y2="14" stroke="#62D6E8" strokeWidth="1" />
        <line x1="0" y1="7" x2="14" y2="7" stroke="#62D6E8" strokeWidth="1" />
      </svg>
    </div>
  )
}

export function DimLine({ label }) {
  return (
    <div className="dimline">
      <div className="seg" />
      <span className="label">{label}</span>
      <div className="seg" />
    </div>
  )
}

export function Badge({ status, children }) {
  return <span className={`badge ${status}`}>{children}</span>
}

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" stroke="#62D6E8" strokeWidth="1" />
      <path
        d="M6 18h4l2.5-6h7L22 18h4M6 18v5.5a1 1 0 001 1h1.2a1 1 0 001-1v-1.2h13.6v1.2a1 1 0 001 1H25a1 1 0 001-1V18M6 18l1.3-7h17.4l1.3 7"
        stroke="#FFB100"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10.2" cy="23.5" r="1.5" fill="#FFB100" />
      <circle cx="21.8" cy="23.5" r="1.5" fill="#FFB100" />
    </svg>
  )
}
