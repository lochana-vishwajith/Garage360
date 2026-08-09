import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'
import { Spinner, Alert, PasswordStrength } from '../components/SharedUI'
import './css/RegisterPage.css'

const GarageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// ─── Step 1: Register Form ────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async ({ name, email, password }) => {
    setServerError('')
    setLoading(true)
    try {
      await registerUser(email.trim(), password, name.trim())
      onSuccess(email.trim())
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please try again.'
      if (err?.code === 'UsernameExistsException') {
        setServerError('An account with this email already exists.')
      } else if (err?.code === 'InvalidPasswordException') {
        setServerError('Password must be at least 8 characters and contain uppercase, lowercase, number, and symbol.')
      } else {
        setServerError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot" />
      </div>

      <h1 className="auth-heading">Create account</h1>
      <p className="auth-subheading">Set up your Garage Management account</p>

      {serverError && <Alert type="error">{serverError}</Alert>}

      <form id="register-form" className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="register-name"
          label="Full name"
          type="text"
          placeholder="John Doe"
          icon={<UserIcon />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <InputField
          id="register-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<MailIcon />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />

        <div>
          <InputField
            id="register-password"
            label="Password"
            type="password"
            placeholder="Min. 8 chars, with uppercase, number & symbol"
            icon={<LockIcon />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: {
                uppercase: (v) => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                number: (v) => /[0-9]/.test(v) || 'Must contain a number',
                symbol: (v) => /[^A-Za-z0-9]/.test(v) || 'Must contain a special character',
              },
              onChange: (e) => setPasswordValue(e.target.value),
            })}
          />
          <PasswordStrength password={password} />
        </div>

        <InputField
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          icon={<ShieldIcon />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === password || 'Passwords do not match',
          })}
        />

        <button id="register-submit" type="submit" className="btn-primary" disabled={loading}>
          {loading && <Spinner />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">Sign in</Link>
      </p>
    </>
  )
}

// ─── Step 2: Verify Email ─────────────────────────────────────────────────────
function VerifyEmail({ email, onVerified }) {
  const { confirmRegistration, resendCode } = useAuth()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const inputs = useRef([])

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
    if (!val && idx > 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
      inputs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...code]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setCode(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await confirmRegistration(email, fullCode)
      onVerified()
    } catch (err) {
      if (err?.code === 'CodeMismatchException') {
        setError('Incorrect code. Please check and try again.')
      } else if (err?.code === 'ExpiredCodeException') {
        setError('Code expired. Please request a new one.')
      } else {
        setError(err?.message || 'Verification failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendSuccess(false)
    try {
      await resendCode(email)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 4000)
    } catch (err) {
      setError(err?.message || 'Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <div className="step-indicator">
        <div className="step-dot done" />
        <div className="step-dot active" />
      </div>

      <h1 className="auth-heading">Verify your email</h1>
      <p className="auth-subheading">
        We sent a 6-digit code to <strong className="email-highlight">{email}</strong>
      </p>

      {error && <Alert type="error">{error}</Alert>}
      {resendSuccess && <Alert type="success">A new code has been sent to your email.</Alert>}

      <div className="verify-column">
        <div>
          <div className="code-input-row" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                id={`verify-code-${i}`}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e, i)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !code[i] && i > 0) {
                    inputs.current[i - 1]?.focus()
                  }
                }}
                className="code-input"
                aria-label={`Code digit ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          id="verify-submit"
          type="button"
          className="btn-primary"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading && <Spinner />}
          {loading ? 'Verifying…' : 'Verify email'}
        </button>

        <p className="auth-footer--no-top">
          Didn&apos;t receive it?{' '}
          <button
            id="resend-code"
            type="button"
            className="btn-resend-code"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        </p>
      </div>
    </>
  )
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────
function VerifySuccess() {
  const navigate = useNavigate()
  return (
    <div className="success-container">
      <div className="success-icon-ring">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="auth-heading auth-heading--center">Account verified!</h1>
      <p className="auth-subheading auth-subheading--center-spaced">
        Your email has been confirmed. You can now sign in.
      </p>
      <button
        id="goto-login"
        type="button"
        className="btn-primary"
        onClick={() => navigate('/login', { replace: true })}
      >
        Go to sign in
      </button>
    </div>
  )
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState('form') // 'form' | 'verify' | 'success'
  const [registeredEmail, setRegisteredEmail] = useState('')

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <GarageIcon />
          </div>
          <div className="auth-brand-text">
            <span className="auth-brand-name">GarageMS</span>
            <span className="auth-brand-sub">Management Platform</span>
          </div>
        </div>

        {step === 'form' && (
          <RegisterForm
            onSuccess={(email) => {
              setRegisteredEmail(email)
              setStep('verify')
            }}
          />
        )}

        {step === 'verify' && (
          <VerifyEmail
            email={registeredEmail}
            onVerified={() => setStep('success')}
          />
        )}

        {step === 'success' && <VerifySuccess />}
      </div>
    </div>
  )
}
