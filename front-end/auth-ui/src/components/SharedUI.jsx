import './css/SharedUI.css'

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />
}

export function Alert({ type = 'error', children }) {
  const icons = {
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }

  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {icons[type]}
      <span>{children}</span>
    </div>
  )
}

export function PasswordStrength({ password }) {
  const getScore = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const score = getScore(password || '')
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const classes = ['', 'weak', 'fair', 'strong', 'strong']

  if (!password) return null

  return (
    <div>
      <div className="password-strength">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`strength-bar${score >= i ? ` ${classes[score]}` : ''}`}
          />
        ))}
      </div>
      {score > 0 && (
        <div className={`strength-label strength-label--${score <= 1 ? 'weak' : score <= 2 ? 'fair' : 'strong'}`}>
          {labels[score]} password
        </div>
      )}
    </div>
  )
}
