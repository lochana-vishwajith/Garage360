import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchMasterFeatures, FEATURE_CATEGORIES } from '../services/featureService'
import './css/MasterFeatureWidget.css'

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

function MasterFeatureWidget() {
  const [features, setFeatures] = useState([])
  const [allFeatures, setAllFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Collapse / Expand Toggle State
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Pagination Parameters (sent as HTTP request body payload)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    // Call service passing page, pageSize, search, and category in request payload
    fetchMasterFeatures({
      page,
      pageSize,
      search,
      category: selectedCategory,
    })
      .then((res) => {
        if (isMounted) {
          setFeatures(res.data || [])
          setAllFeatures(res.allFeatures || [])
          setTotalPages(res.totalPages || 1)
          setTotalItems(res.totalItems || 0)
        }
      })
      .catch((err) => {
        console.error('Failed to load master features widget:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [page, pageSize, search, selectedCategory])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setPage(1)
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  const totalCatalogCount = allFeatures.length
  const standaloneAddonsCount = allFeatures.filter((f) => f.isStandaloneAddon).length
  const betaFeaturesCount = allFeatures.filter((f) => f.status === 'beta').length

  const startRecord = totalItems === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalItems)
  const endRecord = Math.min(page * pageSize, totalItems)

  return (
    <div className="mf-widget-card">
      <div className="mf-widget-header">
        <div>
          <div className="mf-widget-badge">Super Admin Feature Catalog</div>
          <h2 className="mf-widget-title">⚡ Master Feature Flags & Monetized Add-ons</h2>
          <p className="mf-widget-sub">
            Central repository of platform capabilities, feature flags, and standalone add-on pricing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            to="/packages?tab=features"
            className="btn-primary"
            style={{ width: 'auto', textDecoration: 'none', gap: 6 }}
          >
            <span>Manage Master Catalog →</span>
          </Link>

          {/* Collapse / Expand Toggle Button */}
          <button
            type="button"
            className="widget-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand Widget' : 'Collapse Widget'}
          >
            <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
            <span className={`widget-collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>
              <ChevronDownIcon />
            </span>
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Overview Stat Badges */}
          <div className="mf-widget-stats">
            <div className="mf-stat-item">
              <span className="mf-stat-val">{totalCatalogCount}</span>
              <span className="mf-stat-lbl">System Features</span>
            </div>
            <div className="mf-stat-item">
              <span className="mf-stat-val" style={{ color: '#c4b5fd' }}>{standaloneAddonsCount}</span>
              <span className="mf-stat-lbl">Standalone Add-ons</span>
            </div>
            <div className="mf-stat-item">
              <span className="mf-stat-val" style={{ color: '#fbbf24' }}>{betaFeaturesCount}</span>
              <span className="mf-stat-lbl">Beta Experiments</span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="mf-widget-toolbar">
            <div className="mf-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Filter feature flags..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <div className="mf-category-pills">
              <button
                type="button"
                className={`mf-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Categories
              </button>
              {FEATURE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`mf-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Flags Grid List */}
          {loading ? (
            <div className="mf-widget-loading">Loading Master Feature Flags (Page {page})...</div>
          ) : features.length === 0 ? (
            <div className="mf-widget-loading">No feature flags matched your search filter.</div>
          ) : (
            <>
              <div className="mf-widget-grid">
                {features.map((feat) => (
                  <div key={feat.id} className="mf-item-card">
                    <div className="mf-item-top">
                      <div>
                        <span className="mf-item-cat">{feat.category}</span>
                        <div className="mf-item-title">{feat.label}</div>
                        <div className="mf-item-key"><code>{feat.key}</code></div>
                      </div>
                      <span className={`mf-status-badge mf-status-badge--${feat.status}`}>
                        {feat.status}
                      </span>
                    </div>

                    <p className="mf-item-desc">{feat.desc}</p>

                    <div className="mf-item-footer">
                      {feat.isStandaloneAddon ? (
                        <span className="mf-addon-tag mf-addon-tag--enabled">
                          💎 Add-on (${feat.addonPrice}/mo)
                        </span>
                      ) : (
                        <span className="mf-addon-tag mf-addon-tag--disabled">
                          🔒 Tier Package Only
                        </span>
                      )}

                      <Link
                        to="/packages?tab=features"
                        className="mf-edit-link"
                      >
                        Edit Flag
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              <div className="widget-pagination">
                <div className="pagination-info">
                  Showing <strong>{startRecord} - {endRecord}</strong> of <strong>{totalItems}</strong> features
                </div>

                <div className="pagination-controls">
                  <label className="pagination-label">
                    Per page:
                    <select
                      className="pagination-select"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                    </select>
                  </label>

                  <div className="pagination-nav-btns">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ‹ Previous
                    </button>
                    <span className="pagination-page-num">
                      Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MasterFeatureWidget
