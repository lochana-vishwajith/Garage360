import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import InputField from '../components/InputField'
import { Spinner, Alert } from '../components/SharedUI'
import './css/LoginPage.css'

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

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    setServerError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err?.message || 'Login failed. Please try again.'
      if (err?.code === 'UserNotConfirmedException') {
        setServerError('Your email is not verified. Please check your inbox for the confirmation code.')
      } else if (err?.code === 'NotAuthorizedException') {
        setServerError('Incorrect email or password.')
      } else if (err?.code === 'UserNotFoundException') {
        setServerError('No account found with this email.')
      } else {
        setServerError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

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

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to continue to your workspace</p>

        {serverError && <Alert type="error">{serverError}</Alert>}

        <form id="login-form" className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            id="login-email"
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

          <InputField
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<LockIcon />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />

          <div className="login-forgot-row">
            <Link to="/forgot-password" className="auth-link login-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading && <Spinner />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
