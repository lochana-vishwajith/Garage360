import { useState, useEffect } from 'react'
import { fetchTenantSubscriptions } from '../services/subscriptionService'
import { Spinner } from './SharedUI'

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

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="12"
    height="12"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function TenantSubscriptionWidget() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedIds, setExpandedIds] = useState([])

  // Collapse / Expand Widget State
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Pagination Parameters (sent as HTTP request body payload)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    // Call service with pagination payload parameter
    fetchTenantSubscriptions({ page, pageSize })
      .then((res) => {
        if (isMounted) {
          const items = res.data || []
          setSubscriptions(items)
          setTotalPages(res.totalPages || 1)
          setTotalItems(res.totalItems || 0)
          // Default expand first item on page change
          if (items.length > 0) {
            setExpandedIds([items[0].tenantId])
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch tenant subscriptions')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [page, pageSize])

  const toggleExpand = (tenantId) => {
    setExpandedIds((prev) =>
      prev.includes(tenantId)
        ? prev.filter((id) => id !== tenantId)
        : [...prev, tenantId]
    )
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="tenant-badge tenant-badge--active">Active</span>
      case 'EXPIRING_SOON':
        return (
          <span className="tenant-badge tenant-badge--warning">
            Expiring Soon
          </span>
        )
      case 'PAST_DUE':
        return <span className="tenant-badge tenant-badge--danger">Past Due</span>
      default:
        return <span className="tenant-badge">{status}</span>
    }
  }

  const startRecord = Math.min((page - 1) * pageSize + 1, totalItems)
  const endRecord = Math.min(page * pageSize, totalItems)

  return (
    <div className="tenant-widget-card">
      <div className="tenant-widget-header">
        <div>
          <h3 className="tenant-widget-title">Tenants & Purchased Packages</h3>
          <p className="tenant-widget-subtitle">
            Live overview of active repair shop clients, package tiers, and expiration dates fetched from server endpoint.
          </p>
        </div>

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

      {!isCollapsed && (
        <>
          {loading ? (
            <div className="tenant-widget-loading">
              <Spinner />
              <span>Fetching tenant subscriptions (Page {page})...</span>
            </div>
          ) : error ? (
            <div className="tenant-widget-error">{error}</div>
          ) : (
            <>
              <div className="tenant-table-container">
                {/* Header Row with matching grid columns */}
                <div className="tenant-table-header">
                  <div>Tenant / Repair Shop</div>
                  <div>Purchased Package</div>
                  <div>Status</div>
                  <div>Billing Cycle</div>
                  <div>Last Payment Date</div>
                  <div>Expire Date</div>
                  <div style={{ textAlign: 'right' }}>Details</div>
                </div>

                <div className="tenant-table-body">
                  {subscriptions.map((tenant) => {
                    const isExpanded = expandedIds.includes(tenant.tenantId)
                    return (
                      <div key={tenant.tenantId} className="tenant-row-wrapper">
                        {/* Main Summary Row */}
                        <div
                          className={`tenant-main-row ${
                            isExpanded ? 'is-expanded' : ''
                          }`}
                          onClick={() => toggleExpand(tenant.tenantId)}
                        >
                          <div className="tenant-col tenant-col-shop">
                            <div className="tenant-shop-name">
                              {tenant.shopName}
                            </div>
                            <div className="tenant-shop-email">
                              {tenant.ownerName} • {tenant.email}
                            </div>
                          </div>

                          <div className="tenant-col">
                            <span className="tenant-pkg-tag">
                              {tenant.packageName}
                            </span>
                          </div>

                          <div className="tenant-col">
                            {getStatusBadge(tenant.status)}
                          </div>

                          <div className="tenant-col tenant-col-billing">
                            <span className="tenant-price">{tenant.price}</span>
                            <span className="tenant-cycle">/{tenant.billingCycle.toLowerCase()}</span>
                          </div>

                          <div className="tenant-col tenant-date">
                            {tenant.lastPaymentDate}
                          </div>

                          <div className="tenant-col tenant-date tenant-date--expire">
                            {tenant.expireDate}
                          </div>

                          <div
                            className="tenant-col"
                            style={{ textAlign: 'right', justifyContent: 'flex-end' }}
                          >
                            <button
                              type="button"
                              className={`tenant-expand-btn ${
                                isExpanded ? 'expanded' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExpand(tenant.tenantId)
                              }}
                              aria-label="Toggle modules list"
                            >
                              <ChevronDownIcon />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Included Modules & Quotas Details */}
                        {isExpanded && (
                          <div className="tenant-expanded-panel">
                            <div className="tenant-expanded-grid">
                              {/* Included Package Modules */}
                              <div className="tenant-expanded-col">
                                <h4 className="tenant-subhead">
                                  Included Package Modules ({tenant.modules.length})
                                </h4>
                                <div className="tenant-modules-list">
                                  {tenant.modules.map((moduleName) => (
                                    <span
                                      key={moduleName}
                                      className="tenant-module-pill"
                                    >
                                      <CheckIcon />
                                      {moduleName}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Subscription Billing Metadata */}
                              <div className="tenant-expanded-col">
                                <h4 className="tenant-subhead">
                                  Billing & Usage Quotas
                                </h4>
                                <div className="tenant-meta-box">
                                  <div className="tenant-meta-item">
                                    <span className="tenant-meta-label">Payment Method:</span>
                                    <span className="tenant-meta-val">{tenant.paymentMethod}</span>
                                  </div>
                                  <div className="tenant-meta-item">
                                    <span className="tenant-meta-label">Last Payment:</span>
                                    <span className="tenant-meta-val">{tenant.lastPaymentDate}</span>
                                  </div>
                                  <div className="tenant-meta-item">
                                    <span className="tenant-meta-label">Expiration Date:</span>
                                    <span className="tenant-meta-val" style={{ color: tenant.status === 'EXPIRING_SOON' ? '#fbbf24' : tenant.status === 'PAST_DUE' ? '#f87171' : '#34d399' }}>
                                      {tenant.expireDate}
                                    </span>
                                  </div>

                                  <div className="tenant-quotas-inline">
                                    <div className="tenant-quota-pill">
                                      <span>Staff Users:</span>
                                      <strong>{tenant.quotas.staffUsers.used} / {tenant.quotas.staffUsers.total}</strong>
                                    </div>
                                    <div className="tenant-quota-pill">
                                      <span>Work Orders:</span>
                                      <strong>{tenant.quotas.workOrders.used} / {tenant.quotas.workOrders.total}</strong>
                                    </div>
                                    <div className="tenant-quota-pill">
                                      <span>Cloud Storage:</span>
                                      <strong>{tenant.quotas.storageGb.used} GB / {tenant.quotas.storageGb.total} GB</strong>
                                    </div>
                                    <div className="tenant-quota-pill">
                                      <span>SMS Notifications:</span>
                                      <strong>{tenant.quotas.monthlySms.used} / {tenant.quotas.monthlySms.total}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pagination Bar */}
              <div className="widget-pagination">
                <div className="pagination-info">
                  Showing <strong>{startRecord} - {endRecord}</strong> of <strong>{totalItems}</strong> tenants
                </div>

                <div className="pagination-controls">
                  <label className="pagination-label">
                    Per page:
                    <select
                      className="pagination-select"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
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

export default TenantSubscriptionWidget
