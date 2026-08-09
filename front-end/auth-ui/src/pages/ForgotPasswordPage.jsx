import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'
import { Spinner, Alert, PasswordStrength } from '../components/SharedUI'
import './css/ForgotPasswordPage.css'

const GarageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
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

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

// ─── Step 1: Enter Email ──────────────────────────────────────────────────────
function EmailStep({ onCodeSent }) {
  const { forgotPassword } = useAuth()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setServerError('')
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      onCodeSent(email.trim())
    } catch (err) {
      if (err?.code === 'UserNotFoundException') {
        setServerError('No account found with this email address.')
      } else if (err?.code === 'LimitExceededException') {
        setServerError('Too many attempts. Please try again later.')
      } else {
        setServerError(err?.message || 'Something went wrong. Please try again.')
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
        <div className="step-dot" />
      </div>

      <h1 className="auth-heading">Reset password</h1>
      <p className="auth-subheading">
        Enter your email and we&apos;ll send you a reset code
      </p>

      {serverError && <Alert type="error">{serverError}</Alert>}

      <form id="forgot-email-form" className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="forgot-email"
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

        <button id="send-reset-code" type="submit" className="btn-primary" disabled={loading}>
          {loading && <Spinner />}
          {loading ? 'Sending…' : 'Send reset code'}
        </button>
      </form>

      <p className="auth-footer">
        <Link to="/login" className="auth-link">
          ← Back to sign in
        </Link>
      </p>
    </>
  )
}

// ─── Step 2: Enter Code + New Password ───────────────────────────────────────
function ResetStep({ email, onSuccess }) {
  const { confirmPassword } = useAuth()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const password = watch('newPassword', '')

  const onSubmit = async ({ code, newPassword }) => {
    setServerError('')
    setLoading(true)
    try {
      await confirmPassword(email, code.trim(), newPassword)
      onSuccess()
    } catch (err) {
      if (err?.code === 'CodeMismatchException') {
        setServerError('Incorrect code. Please check your email and try again.')
      } else if (err?.code === 'ExpiredCodeException') {
        setServerError('Code has expired. Please request a new one.')
      } else if (err?.code === 'InvalidPasswordException') {
        setServerError('Password must include uppercase, lowercase, number, and symbol.')
      } else {
        setServerError(err?.message || 'Reset failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="step-indicator">
        <div className="step-dot done" />
        <div className="step-dot active" />
        <div className="step-dot" />
      </div>

      <h1 className="auth-heading">Set new password</h1>
      <p className="auth-subheading">
        Enter the code sent to <strong className="email-highlight">{email}</strong>
      </p>

      {serverError && <Alert type="error">{serverError}</Alert>}

      <form id="reset-password-form" className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          id="reset-code"
          label="Verification code"
          type="text"
          placeholder="6-digit code"
          icon={<KeyIcon />}
          error={errors.code?.message}
          {...register('code', {
            required: 'Verification code is required',
            pattern: { value: /^\d{6}$/, message: 'Enter the 6-digit code from your email' },
          })}
        />

        <div>
          <InputField
            id="reset-new-password"
            label="New password"
            type="password"
            placeholder="Min. 8 chars, with uppercase, number & symbol"
            icon={<LockIcon />}
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              validate: {
                uppercase: (v) => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                number: (v) => /[0-9]/.test(v) || 'Must contain a number',
                symbol: (v) => /[^A-Za-z0-9]/.test(v) || 'Must contain a special character',
              },
            })}
          />
          <PasswordStrength password={password} />
        </div>

        <button id="reset-submit" type="submit" className="btn-primary" disabled={loading}>
          {loading && <Spinner />}
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </>
  )
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────
function SuccessStep() {
  const navigate = useNavigate()
  return (
    <div className="success-container">
      <div className="success-icon-ring">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="auth-heading auth-heading--center">Password reset!</h1>
      <p className="auth-subheading auth-subheading--center-spaced">
        Your password has been updated. Sign in with your new credentials.
      </p>
      <button
        id="goto-login-after-reset"
        type="button"
        className="btn-primary"
        onClick={() => navigate('/login', { replace: true })}
      >
        Sign in now
      </button>
    </div>
  )
}

// ─── Main Forgot Password Page ────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email') // 'email' | 'reset' | 'success'
  const [email, setEmail] = useState('')

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

        {step === 'email' && (
          <EmailStep onCodeSent={(e) => { setEmail(e); setStep('reset') }} />
        )}
        {step === 'reset' && (
          <ResetStep email={email} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && <SuccessStep />}
      </div>
    </div>
  )
}
