import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  fetchMasterFeatures,
  createMasterFeature,
  updateMasterFeature,
  FEATURE_CATEGORIES,
} from '../services/featureService'
import './css/PackageBuilderPage.css'

const GarageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="15" y2="12" />
  </svg>
)

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

// Default initial sample subscription tiers
const INITIAL_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Starter Garage',
    description: 'Perfect for small independent repair shops getting started with digital operations.',
    priceMonthly: 49,
    priceYearly: 490,
    status: 'active',
    isPopular: false,
    quotas: {
      staffLimit: 3,
      workOrdersMonthly: 150,
      storageGb: 5,
      smsMonthly: 200,
    },
    features: ['work_orders', 'inventory', 'crm', 'invoicing'],
  },
  {
    id: 'pkg-2',
    name: 'Pro Auto Hub',
    description: 'Designed for growing auto centers requiring automated scheduling & SMS updates.',
    priceMonthly: 119,
    priceYearly: 1190,
    status: 'active',
    isPopular: true,
    quotas: {
      staffLimit: 10,
      workOrdersMonthly: 800,
      storageGb: 25,
      smsMonthly: 1500,
    },
    features: ['work_orders', 'inventory', 'crm', 'sms', 'invoicing', 'multi_bay', 'analytics'],
  },
  {
    id: 'pkg-3',
    name: 'Enterprise Fleet',
    description: 'Full-featured package for multi-location garages and heavy-duty repair networks.',
    priceMonthly: 249,
    priceYearly: 2490,
    status: 'active',
    isPopular: false,
    quotas: {
      staffLimit: 50,
      workOrdersMonthly: 5000,
      storageGb: 100,
      smsMonthly: 10000,
    },
    features: [
      'work_orders',
      'inventory',
      'crm',
      'sms',
      'invoicing',
      'multi_bay',
      'analytics',
      'api_access',
    ],
  },
]

export default function PackageBuilderPage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'features' ? 'features' : 'packages'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [packages, setPackages] = useState(INITIAL_PACKAGES)
  const [masterFeatures, setMasterFeatures] = useState([])
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)
  const [isSavingFeature, setIsSavingFeature] = useState(false)

  // Package search & filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [packageModalOpen, setPackageModalOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState(null)

  // Feature search & filters
  const [featureSearch, setFeatureSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [featureModalOpen, setFeatureModalOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState(null)

  // Fetch master feature flags from simulated backend REST GET endpoint on mount
  useEffect(() => {
    let isMounted = true
    async function loadCatalog() {
      try {
        const data = await fetchMasterFeatures()
        if (isMounted) {
          const list = Array.isArray(data) ? data : (data?.allFeatures || data?.data || [])
          setMasterFeatures(list)
          setIsLoadingFeatures(false)
        }
      } catch (err) {
        console.error('Failed to load master feature catalog:', err)
        if (isMounted) setIsLoadingFeatures(false)
      }
    }
    loadCatalog()
    return () => {
      isMounted = false
    }
  }, [])

  // Package Form State
  const [pkgFormData, setPkgFormData] = useState({
    name: '',
    description: '',
    priceMonthly: 79,
    priceYearly: 790,
    status: 'active',
    isPopular: false,
    quotas: {
      staffLimit: 5,
      workOrdersMonthly: 500,
      storageGb: 10,
      smsMonthly: 500,
    },
    features: ['work_orders', 'inventory', 'crm', 'invoicing'],
  })

  // Feature Flag Form State
  const [featureFormData, setFeatureFormData] = useState({
    label: '',
    key: '',
    desc: '',
    category: 'Core Operations',
    status: 'active',
    isStandaloneAddon: false,
    addonPrice: 15,
  })

  // Open package creation modal
  const handleOpenCreatePkg = () => {
    setEditingPkg(null)
    setPkgFormData({
      name: '',
      description: '',
      priceMonthly: 79,
      priceYearly: 790,
      status: 'active',
      isPopular: false,
      quotas: {
        staffLimit: 5,
        workOrdersMonthly: 500,
        storageGb: 10,
        smsMonthly: 500,
      },
      features: (Array.isArray(masterFeatures) ? masterFeatures : []).slice(0, 4).map((f) => f.id),
    })
    setPackageModalOpen(true)
  }

  // Open package edit modal
  const handleOpenEditPkg = (pkg) => {
    setEditingPkg(pkg)
    setPkgFormData({
      name: pkg.name,
      description: pkg.description,
      priceMonthly: pkg.priceMonthly,
      priceYearly: pkg.priceYearly,
      status: pkg.status,
      isPopular: pkg.isPopular,
      quotas: { ...pkg.quotas },
      features: [...pkg.features],
    })
    setPackageModalOpen(true)
  }

  // Toggle feature selection inside Package modal
  const handleTogglePkgFeature = (featureId) => {
    setPkgFormData((prev) => {
      const exists = prev.features.includes(featureId)
      return {
        ...prev,
        features: exists
          ? prev.features.filter((id) => id !== featureId)
          : [...prev.features, featureId],
      }
    })
  }

  // Save Package Handler
  const handleSavePackage = (e) => {
    e.preventDefault()
    if (!pkgFormData.name.trim()) return

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) => (p.id === editingPkg.id ? { ...p, ...pkgFormData } : p))
      )
    } else {
      const newPkg = {
        id: `pkg-${Date.now()}`,
        ...pkgFormData,
      }
      setPackages((prev) => [newPkg, ...prev])
    }
    setPackageModalOpen(false)
  }

  // Toggle Package Active/Draft Status
  const handleTogglePkgStatus = (id) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, status: p.status === 'active' ? 'draft' : 'active' }
      })
    )
  }

  // Delete Package
  const handleDeletePackage = (id) => {
    if (confirm('Are you sure you want to delete this subscription package tier?')) {
      setPackages((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // Open Feature Registration Modal (Create)
  const handleOpenCreateFeature = () => {
    setEditingFeature(null)
    setFeatureFormData({
      label: '',
      key: '',
      desc: '',
      category: 'Core Operations',
      status: 'active',
      isStandaloneAddon: false,
      addonPrice: 15,
    })
    setFeatureModalOpen(true)
  }

  // Open Feature Registration Modal (Edit)
  const handleOpenEditFeature = (feat) => {
    setEditingFeature(feat)
    setFeatureFormData({
      label: feat.label,
      key: feat.key,
      desc: feat.desc,
      category: feat.category,
      status: feat.status,
      isStandaloneAddon: feat.isStandaloneAddon,
      addonPrice: feat.addonPrice || 15,
    })
    setFeatureModalOpen(true)
  }

  // Save Feature Flag (POST creation or PUT editing)
  const handleSaveFeature = async (e) => {
    e.preventDefault()
    if (!featureFormData.label.trim() || isSavingFeature) return

    setIsSavingFeature(true)
    try {
      if (editingFeature) {
        // PUT update endpoint
        const updatedFeature = await updateMasterFeature(editingFeature.id, {
          label: featureFormData.label.trim(),
          key: featureFormData.key.trim().toUpperCase().replace(/[^A-Z0-9_]+/g, '_'),
          desc: featureFormData.desc.trim(),
          category: featureFormData.category,
          status: featureFormData.status,
          isStandaloneAddon: featureFormData.isStandaloneAddon,
          addonPrice: featureFormData.isStandaloneAddon ? Number(featureFormData.addonPrice) : 0,
        })
        setMasterFeatures((prev) =>
          prev.map((f) => (f.id === editingFeature.id ? updatedFeature : f))
        )
      } else {
        // POST create endpoint
        const createdFeature = await createMasterFeature(featureFormData)
        setMasterFeatures((prev) => [...prev, createdFeature])

        if (packageModalOpen) {
          setPkgFormData((prev) => ({
            ...prev,
            features: [...prev.features, createdFeature.id],
          }))
        }
      }

      setFeatureModalOpen(false)
    } catch (err) {
      console.error('Failed to save feature flag:', err)
    } finally {
      setIsSavingFeature(false)
    }
  }

  // Toggle Standalone Add-on status for a feature in Master Catalog (PUT /api/v1/superadmin/features/{id})
  const handleToggleAddonSetting = async (featureId) => {
    const safeList = Array.isArray(masterFeatures) ? masterFeatures : []
    const target = safeList.find((f) => f.id === featureId)
    if (!target) return

    const nextState = !target.isStandaloneAddon
    const nextPrice = nextState ? (target.addonPrice || 19) : 0

    // Optimistic update
    setMasterFeatures((prev) =>
      prev.map((f) =>
        f.id === featureId
          ? { ...f, isStandaloneAddon: nextState, addonPrice: nextPrice }
          : f
      )
    )

    try {
      await updateMasterFeature(featureId, {
        isStandaloneAddon: nextState,
        addonPrice: nextPrice,
      })
    } catch (err) {
      console.error('Failed to update feature add-on setting:', err)
    }
  }

  // Filtered lists
  const filteredPackages = packages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const safeMasterFeatures = Array.isArray(masterFeatures) ? masterFeatures : []

  const filteredFeatures = safeMasterFeatures.filter((f) => {
    const matchesSearch =
      f.label.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.key.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.desc.toLowerCase().includes(featureSearch.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' ? true : f.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Stats calculation
  const totalPkgCount = packages.length
  const activePkgCount = packages.filter((p) => p.status === 'active').length
  const popularTier = packages.find((p) => p.isPopular)?.name || 'Pro Auto Hub'

  const totalFeaturesCount = safeMasterFeatures.length
  const standaloneAddonCount = safeMasterFeatures.filter((f) => f.isStandaloneAddon).length
  const betaFeaturesCount = safeMasterFeatures.filter((f) => f.status === 'beta').length

  return (
    <div className="pkg-layout">
      {/* Top Navbar */}
      <nav className="pkg-nav">
        <div className="pkg-nav-left">
          <Link to="/dashboard" className="pkg-nav-back">
            <BackIcon /> Dashboard
          </Link>
          <div className="pkg-nav-title">
            <GarageIcon />
            <span>Super Admin Engine</span>
          </div>
          <span className="pkg-badge-admin">Super Admin</span>
        </div>

        {/* Subnav Navigation Tabs */}
        <div className="pkg-nav-tabs">
          <button
            type="button"
            className={`pkg-nav-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            📦 Subscription Packages ({packages.length})
          </button>
          <button
            type="button"
            className={`pkg-nav-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            ⚡ Master Feature Registry ({safeMasterFeatures.length})
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <main className="pkg-body">
        {/* TAB 1: SUBSCRIPTION PACKAGES BUILDER */}
        {activeTab === 'packages' && (
          <>
            {/* Header */}
            <div className="pkg-header-row">
              <div>
                <h1 className="pkg-headline">Subscription Packages</h1>
                <p className="pkg-subheadline">
                  Configure feature bundles, pricing tiers, and usage quotas for auto repair shop clients.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto' }}
                onClick={handleOpenCreatePkg}
              >
                <PlusIcon /> Create New Package
              </button>
            </div>

            {/* Stats Grid */}
            <div className="pkg-stats-grid">
              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">📦</div>
                <div>
                  <div className="pkg-stat-val">{totalPkgCount}</div>
                  <div className="pkg-stat-lbl">Total Tier Packages</div>
                </div>
              </div>

              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">⚡</div>
                <div>
                  <div className="pkg-stat-val">{activePkgCount}</div>
                  <div className="pkg-stat-lbl">Active Tiers Published</div>
                </div>
              </div>

              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">🔥</div>
                <div>
                  <div className="pkg-stat-val">{popularTier}</div>
                  <div className="pkg-stat-lbl">Most Popular Choice</div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="pkg-toolbar">
              <div className="pkg-search-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  className="pkg-search-input"
                  placeholder="Search packages by name or feature..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="pkg-status-tabs">
                {['all', 'active', 'draft'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`pkg-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Packages Cards Grid */}
            <div className="pkg-grid">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`pkg-card ${pkg.isPopular ? 'pkg-card--featured' : ''}`}
                >
                  {pkg.isPopular && <div className="pkg-badge-popular">Popular Choice</div>}

                  <div className="pkg-card-top">
                    <h3 className="pkg-name">{pkg.name}</h3>
                    <span className={`pkg-status-pill pkg-status-pill--${pkg.status}`}>
                      {pkg.status}
                    </span>
                  </div>

                  <p className="pkg-description">{pkg.description}</p>

                  <div className="pkg-pricing-block">
                    <span className="pkg-price">${pkg.priceMonthly}</span>
                    <span className="pkg-period">/ month (${pkg.priceYearly}/yr)</span>
                  </div>

                  {/* Quotas Badges */}
                  <div className="pkg-quotas-section">
                    <div className="pkg-section-title">Included Quotas</div>
                    <div className="pkg-quota-grid">
                      <div className="pkg-quota-item">
                        <span className="pkg-quota-val">{pkg.quotas.staffLimit} Users</span>
                        <span className="pkg-quota-lbl">Staff / Techs</span>
                      </div>
                      <div className="pkg-quota-item">
                        <span className="pkg-quota-val">{pkg.quotas.workOrdersMonthly}/mo</span>
                        <span className="pkg-quota-lbl">Work Orders</span>
                      </div>
                      <div className="pkg-quota-item">
                        <span className="pkg-quota-val">{pkg.quotas.storageGb} GB</span>
                        <span className="pkg-quota-lbl">Cloud Storage</span>
                      </div>
                      <div className="pkg-quota-item">
                        <span className="pkg-quota-val">{pkg.quotas.smsMonthly} SMS</span>
                        <span className="pkg-quota-lbl">Notifications</span>
                      </div>
                    </div>
                  </div>

                  {/* Bundled Features List dynamically from Master Catalog */}
                  <div className="pkg-features-list">
                    <div className="pkg-section-title">
                      Bundled Modules ({pkg.features.length})
                    </div>
                    {safeMasterFeatures.map((feat) => {
                      const isIncluded = pkg.features.includes(feat.id)
                      return (
                        <div key={feat.id} className="pkg-feature-item">
                          <span
                            className={`pkg-feature-icon ${
                              isIncluded
                                ? 'pkg-feature-icon--active'
                                : 'pkg-feature-icon--inactive'
                            }`}
                          >
                            {isIncluded ? <CheckIcon /> : <CrossIcon />}
                          </span>
                          <span style={{ opacity: isIncluded ? 1 : 0.5 }}>
                            {feat.label}
                            {feat.isStandaloneAddon && (
                              <span className="pkg-addon-tag">Add-on</span>
                            )}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Actions */}
                  <div className="pkg-card-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenEditPkg(pkg)}
                    >
                      Edit Tier & Features
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => handleTogglePkgStatus(pkg.id)}
                    >
                      {pkg.status === 'active' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ color: '#f87171' }}
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 2: MASTER FEATURE FLAG REGISTRY */}
        {activeTab === 'features' && (
          <>
            {/* Header */}
            <div className="pkg-header-row">
              <div>
                <h1 className="pkg-headline">Master Feature Flag Registry</h1>
                <p className="pkg-subheadline">
                  Register new platform tools, toggle standalone add-on eligibility, and set add-on pricing for modular monetization.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto' }}
                onClick={handleOpenCreateFeature}
              >
                <ZapIcon /> Register New Feature Flag
              </button>
            </div>

            {/* Feature Stats Grid */}
            <div className="pkg-stats-grid">
              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">⚡</div>
                <div>
                  <div className="pkg-stat-val">{totalFeaturesCount}</div>
                  <div className="pkg-stat-lbl">Registered System Features</div>
                </div>
              </div>

              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">💎</div>
                <div>
                  <div className="pkg-stat-val">{standaloneAddonCount}</div>
                  <div className="pkg-stat-lbl">Standalone Monetized Add-ons</div>
                </div>
              </div>

              <div className="pkg-stat-card">
                <div className="pkg-stat-icon">🧪</div>
                <div>
                  <div className="pkg-stat-val">{betaFeaturesCount}</div>
                  <div className="pkg-stat-lbl">Beta / Experimental Flags</div>
                </div>
              </div>
            </div>

            {/* Feature Toolbar */}
            <div className="pkg-toolbar">
              <div className="pkg-search-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  className="pkg-search-input"
                  placeholder="Search master features by name, key, or category..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                />
              </div>

              <div className="pkg-status-tabs">
                <button
                  type="button"
                  className={`pkg-tab-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('all')}
                >
                  All Categories
                </button>
                {FEATURE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`pkg-tab-btn ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Feature Grid */}
            <div className="feature-registry-grid">
              {filteredFeatures.map((feat) => (
                <div key={feat.id} className="feature-registry-card">
                  <div className="feature-card-header">
                    <div>
                      <div className="feature-category-pill">{feat.category}</div>
                      <h3 className="feature-title">{feat.label}</h3>
                      <div className="feature-key-code">
                        KEY: <code>{feat.key}</code>
                      </div>
                    </div>
                    <span className={`feature-status-pill feature-status-pill--${feat.status}`}>
                      {feat.status}
                    </span>
                  </div>

                  <p className="feature-desc">{feat.desc}</p>

                  <div className="feature-addon-block">
                    {feat.isStandaloneAddon ? (
                      <div className="feature-addon-badge feature-addon-badge--enabled">
                        <span>💎 Standalone Add-on</span>
                        <strong>${feat.addonPrice}/month</strong>
                      </div>
                    ) : (
                      <div className="feature-addon-badge feature-addon-badge--disabled">
                        <span>🔒 Tier Package Only</span>
                        <span>Included in Tiers</span>
                      </div>
                    )}
                  </div>

                  <div className="feature-card-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenEditFeature(feat)}
                    >
                      Edit Feature Flag
                    </button>
                    <button
                      type="button"
                      className={`btn-ghost ${feat.isStandaloneAddon ? 'btn-ghost--warning' : ''}`}
                      onClick={() => handleToggleAddonSetting(feat.id)}
                    >
                      {feat.isStandaloneAddon ? 'Disable Add-on' : 'Make Add-on'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* CREATE / EDIT SUBSCRIPTION PACKAGE MODAL */}
      {packageModalOpen && (
        <div className="pkg-modal-backdrop" onClick={() => setPackageModalOpen(false)}>
          <div className="pkg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pkg-modal-header">
              <h2 className="pkg-modal-title">
                {editingPkg ? 'Edit Subscription Package' : 'Create Subscription Package'}
              </h2>
              <button
                type="button"
                className="pkg-modal-close"
                onClick={() => setPackageModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePackage} style={{ display: 'contents' }}>
              <div className="pkg-modal-body">
                {/* Form Inputs Column */}
                <div className="pkg-form-col">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Package Name</label>
                    <input
                      type="text"
                      className="pkg-input"
                      placeholder="e.g. Pro Auto Hub"
                      required
                      value={pkgFormData.name}
                      onChange={(e) =>
                        setPkgFormData({ ...pkgFormData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Description</label>
                    <textarea
                      className="pkg-input"
                      placeholder="Describe target shop size and main highlights..."
                      value={pkgFormData.description}
                      onChange={(e) =>
                        setPkgFormData({ ...pkgFormData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="pkg-form-row">
                    <div className="pkg-form-group">
                      <label className="pkg-form-label">Monthly Price ($)</label>
                      <input
                        type="number"
                        className="pkg-input"
                        value={pkgFormData.priceMonthly}
                        onChange={(e) =>
                          setPkgFormData({
                            ...pkgFormData,
                            priceMonthly: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="pkg-form-group">
                      <label className="pkg-form-label">Yearly Price ($)</label>
                      <input
                        type="number"
                        className="pkg-input"
                        value={pkgFormData.priceYearly}
                        onChange={(e) =>
                          setPkgFormData({
                            ...pkgFormData,
                            priceYearly: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Quotas section */}
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Usage Quotas</label>
                    <div className="pkg-form-row" style={{ marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Staff Users</span>
                        <input
                          type="number"
                          className="pkg-input"
                          value={pkgFormData.quotas.staffLimit}
                          onChange={(e) =>
                            setPkgFormData({
                              ...pkgFormData,
                              quotas: {
                                ...pkgFormData.quotas,
                                staffLimit: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Max Work Orders/mo</span>
                        <input
                          type="number"
                          className="pkg-input"
                          value={pkgFormData.quotas.workOrdersMonthly}
                          onChange={(e) =>
                            setPkgFormData({
                              ...pkgFormData,
                              quotas: {
                                ...pkgFormData.quotas,
                                workOrdersMonthly: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="pkg-form-row">
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Storage Limit (GB)</span>
                        <input
                          type="number"
                          className="pkg-input"
                          value={pkgFormData.quotas.storageGb}
                          onChange={(e) =>
                            setPkgFormData({
                              ...pkgFormData,
                              quotas: {
                                ...pkgFormData.quotas,
                                storageGb: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Monthly SMS</span>
                        <input
                          type="number"
                          className="pkg-input"
                          value={pkgFormData.quotas.smsMonthly}
                          onChange={(e) =>
                            setPkgFormData({
                              ...pkgFormData,
                              quotas: {
                                ...pkgFormData.quotas,
                                smsMonthly: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Master Feature Bundles selector */}
                  <div className="pkg-form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label className="pkg-form-label" style={{ margin: 0 }}>
                        Bundled System Modules ({safeMasterFeatures.length})
                      </label>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ fontSize: 12, padding: '4px 8px', color: '#a78bfa' }}
                        onClick={handleOpenCreateFeature}
                      >
                        + Register New Feature
                      </button>
                    </div>

                    <div className="pkg-toggle-list">
                      {safeMasterFeatures.map((feat) => {
                        const checked = pkgFormData.features.includes(feat.id)
                        return (
                          <div key={feat.id} className="pkg-toggle-item">
                            <div className="pkg-toggle-info">
                              <span className="pkg-toggle-name">
                                {feat.label}
                                {feat.isStandaloneAddon && (
                                  <span className="pkg-addon-tag">Add-on (${feat.addonPrice}/mo)</span>
                                )}
                              </span>
                              <span className="pkg-toggle-desc">{feat.desc}</span>
                            </div>
                            <label className="pkg-switch">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleTogglePkgFeature(feat.id)}
                              />
                              <span className="pkg-slider" />
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Card Preview Column */}
                <div>
                  <div className="pkg-form-label" style={{ marginBottom: 12 }}>
                    Live Customer Card Preview
                  </div>
                  <div
                    className={`pkg-card ${
                      pkgFormData.isPopular ? 'pkg-card--featured' : ''
                    }`}
                  >
                    {pkgFormData.isPopular && (
                      <div className="pkg-badge-popular">Popular Choice</div>
                    )}
                    <div className="pkg-card-top">
                      <h3 className="pkg-name">
                        {pkgFormData.name || 'Untitled Package'}
                      </h3>
                      <span className={`pkg-status-pill pkg-status-pill--${pkgFormData.status}`}>
                        {pkgFormData.status}
                      </span>
                    </div>

                    <p className="pkg-description">
                      {pkgFormData.description || 'Package description preview...'}
                    </p>

                    <div className="pkg-pricing-block">
                      <span className="pkg-price">${pkgFormData.priceMonthly}</span>
                      <span className="pkg-period">/ mo</span>
                    </div>

                    <div className="pkg-quotas-section">
                      <div className="pkg-section-title">Quotas</div>
                      <div className="pkg-quota-grid">
                        <div className="pkg-quota-item">
                          <span className="pkg-quota-val">{pkgFormData.quotas.staffLimit} Users</span>
                        </div>
                        <div className="pkg-quota-item">
                          <span className="pkg-quota-val">{pkgFormData.quotas.workOrdersMonthly}/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="pkg-features-list">
                      <div className="pkg-section-title">Included Modules</div>
                      {safeMasterFeatures
                        .filter((f) => pkgFormData.features.includes(f.id))
                        .map((feat) => (
                          <div key={feat.id} className="pkg-feature-item">
                            <span className="pkg-feature-icon pkg-feature-icon--active">
                              <CheckIcon />
                            </span>
                            <span>{feat.label}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pkg-modal-footer">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setPackageModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto' }}
                >
                  {editingPkg ? 'Save Package Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER / EDIT FEATURE FLAG MODAL */}
      {featureModalOpen && (
        <div className="pkg-modal-backdrop" onClick={() => setFeatureModalOpen(false)}>
          <div className="pkg-modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <div className="pkg-modal-header">
              <h2 className="pkg-modal-title">
                {editingFeature ? 'Edit Master Feature Flag' : 'Register New Feature Flag'}
              </h2>
              <button
                type="button"
                className="pkg-modal-close"
                onClick={() => setFeatureModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFeature}>
              <div className="pkg-modal-body" style={{ gridTemplateColumns: '1fr', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="pkg-form-group">
                  <label className="pkg-form-label">Feature Label / Display Name *</label>
                  <input
                    type="text"
                    className="pkg-input"
                    placeholder="e.g. Tyre Depth AI Inspector"
                    required
                    value={featureFormData.label}
                    onChange={(e) =>
                      setFeatureFormData({ ...featureFormData, label: e.target.value })
                    }
                  />
                </div>

                <div className="pkg-form-row">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Feature System Key (Code)</label>
                    <input
                      type="text"
                      className="pkg-input"
                      placeholder="e.g. TYRE_AI_INSPECTOR"
                      value={featureFormData.key}
                      onChange={(e) =>
                        setFeatureFormData({ ...featureFormData, key: e.target.value })
                      }
                    />
                  </div>
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Category</label>
                    <select
                      className="pkg-input"
                      value={featureFormData.category}
                      onChange={(e) =>
                        setFeatureFormData({ ...featureFormData, category: e.target.value })
                      }
                    >
                      {FEATURE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pkg-form-group">
                  <label className="pkg-form-label">Description</label>
                  <textarea
                    className="pkg-input"
                    placeholder="Describe what this module unlocks for auto repair shops..."
                    value={featureFormData.desc}
                    onChange={(e) =>
                      setFeatureFormData({ ...featureFormData, desc: e.target.value })
                    }
                  />
                </div>

                <div className="pkg-form-row" style={{ alignItems: 'center' }}>
                  <div className="pkg-form-group" style={{ flex: 1 }}>
                    <label className="pkg-form-label">Release Status</label>
                    <select
                      className="pkg-input"
                      value={featureFormData.status}
                      onChange={(e) =>
                        setFeatureFormData({ ...featureFormData, status: e.target.value })
                      }
                    >
                      <option value="active">Active (Production)</option>
                      <option value="beta">Beta (Experimental)</option>
                    </select>
                  </div>

                  <div className="pkg-form-group" style={{ flex: 1 }}>
                    <label className="pkg-form-label">Standalone Add-on Option</label>
                    <label className="pkg-switch" style={{ marginTop: 4 }}>
                      <input
                        type="checkbox"
                        checked={featureFormData.isStandaloneAddon}
                        onChange={(e) =>
                          setFeatureFormData({
                            ...featureFormData,
                            isStandaloneAddon: e.target.checked,
                          })
                        }
                      />
                      <span className="pkg-slider" />
                    </label>
                  </div>
                </div>

                {featureFormData.isStandaloneAddon && (
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Standalone Add-on Monthly Price ($)</label>
                    <input
                      type="number"
                      className="pkg-input"
                      value={featureFormData.addonPrice}
                      onChange={(e) =>
                        setFeatureFormData({
                          ...featureFormData,
                          addonPrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="pkg-modal-footer">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setFeatureModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto' }}
                  disabled={isSavingFeature}
                >
                  {isSavingFeature
                    ? 'Saving...'
                    : editingFeature
                    ? 'Save Feature Changes'
                    : 'Register Feature Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
