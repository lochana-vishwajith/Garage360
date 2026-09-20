import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TenantSubscriptionWidget from '../components/TenantSubscriptionWidget'
import MasterFeatureWidget from '../components/MasterFeatureWidget'
import './css/DashboardPage.css'

const GarageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const stats = [
  { icon: '🚗', title: 'Vehicles',    value: '0',  desc: 'Registered in system', variant: 'indigo'  },
  { icon: '🔧', title: 'Work Orders', value: '0',  desc: 'Active this month',    variant: 'violet'  },
  { icon: '👥', title: 'Customers',   value: '0',  desc: 'Total registered',     variant: 'purple'  },
  { icon: '💰', title: 'Revenue',     value: '$0', desc: 'This month',           variant: 'emerald' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  const sessionFields = [
    { label: 'User ID',       value: user?.sub   || '—' },
    { label: 'Email',         value: user?.email || '—' },
    { label: 'Auth Provider', value: 'AWS Cognito'       },
  ]

  return (
    <div className="dashboard-layout">
      {/* Nav */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <span>
            <GarageIcon />
          </span>
          GarageMS
        </div>

        <div className="dashboard-nav-actions">
          <Link
            to="/packages"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#a78bfa' }}
          >
            📦 Package Builder
          </Link>
          <div className="dashboard-nav-user">
            <div className="dashboard-nav-user-name">{user?.name || user?.email}</div>
            <div className="dashboard-nav-user-email">{user?.email}</div>
          </div>
          <button
            id="logout-btn"
            type="button"
            className="btn-ghost btn-logout"
            onClick={handleLogout}
          >
            <LogOutIcon />
            Sign out
          </button>
        </div>
      </nav>

      {/* Body */}
      <main className="dashboard-body">
        <div className="dashboard-welcome">
          <h1 className="dashboard-greeting">
            Hello, <span>{firstName}</span> 👋
          </h1>
          <p className="dashboard-subtitle">
            Welcome to your Garage Management dashboard. Here&apos;s an overview of your workspace.
          </p>
        </div>

        <div className="dashboard-cards">
          {stats.map((s) => (
            <div
              key={s.title}
              className={`dashboard-card dashboard-card--${s.variant}`}
            >
              <div className="dashboard-card-icon">{s.icon}</div>
              <div className="dashboard-card-title">{s.title}</div>
              <div className="dashboard-card-value">{s.value}</div>
              <div className="dashboard-card-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Super Admin Control Panel */}
        <div className="session-panel" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="session-panel-title">Super Admin Control Panel</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Configure subscription packages, feature bundles, and usage quotas for repair shops.
              </p>
            </div>
            <Link to="/packages" className="btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
              Open Package Builder →
            </Link>
          </div>
        </div>

        {/* Tenant Subscriptions & Package Module Viewer Widget */}
        <TenantSubscriptionWidget />

        {/* Master Feature Flags Catalog Widget */}
        <MasterFeatureWidget />

        {/* Session info */}
        <div className="session-panel">
          <div className="session-panel-title">Session Info</div>
          <div className="session-panel-fields">
            {sessionFields.map(({ label, value }) => (
              <div key={label}>
                <div className="session-field-label">{label}</div>
                <div className="session-field-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
