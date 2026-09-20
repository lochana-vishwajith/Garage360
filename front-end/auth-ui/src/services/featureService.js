/**
 * Feature Flag Service
 * Service layer for Super Admin Master Feature Flag Registry & Catalog.
 * Simulates backend REST API endpoints:
 *   - POST /api/v1/superadmin/features/query (with request body parameters for pagination)
 *   - POST /api/v1/superadmin/features
 *   - PUT  /api/v1/superadmin/features/{id}
 */

let featureDb = [
  {
    id: 'work_orders',
    key: 'WORK_ORDERS',
    label: 'Work Orders & Job Sheets',
    desc: 'Create, assign, and track auto repair job sheets with labor & parts breakdown.',
    category: 'Core Operations',
    status: 'active',
    isStandaloneAddon: false,
    addonPrice: 0,
  },
  {
    id: 'inventory',
    key: 'PARTS_INVENTORY',
    label: 'Parts & Inventory Tracking',
    desc: 'Real-time stock level tracking, low-stock alerts, and supplier purchase orders.',
    category: 'Core Operations',
    status: 'active',
    isStandaloneAddon: false,
    addonPrice: 0,
  },
  {
    id: 'crm',
    key: 'CUSTOMER_CRM',
    label: 'Customer & Vehicle History',
    desc: 'Digital service histories, vehicle VIN profiles, and customer contact management.',
    category: 'Core Operations',
    status: 'active',
    isStandaloneAddon: false,
    addonPrice: 0,
  },
  {
    id: 'sms',
    key: 'AUTOMATED_SMS',
    label: 'Automated SMS Reminders',
    desc: 'Automated SMS appointment reminders, repair status updates, and broadcast promos.',
    category: 'Customer Experience',
    status: 'active',
    isStandaloneAddon: true,
    addonPrice: 19,
  },
  {
    id: 'invoicing',
    key: 'INVOICING_QUICKBOOKS',
    label: 'Invoicing & QuickBooks Sync',
    desc: 'Instant invoice creation, online payment processing, and QuickBooks accounting sync.',
    category: 'Financials',
    status: 'active',
    isStandaloneAddon: false,
    addonPrice: 0,
  },
  {
    id: 'multi_bay',
    key: 'BAY_SCHEDULING',
    label: 'Multi-Bay Scheduling',
    desc: 'Visual drag-and-drop bay calendar scheduling and technician assignment.',
    category: 'Core Operations',
    status: 'active',
    isStandaloneAddon: true,
    addonPrice: 29,
  },
  {
    id: 'analytics',
    key: 'FINANCIAL_ANALYTICS',
    label: 'Advanced Financial Analytics',
    desc: 'Revenue forecasting, gross margin analysis, and technician productivity reports.',
    category: 'Financials',
    status: 'active',
    isStandaloneAddon: true,
    addonPrice: 39,
  },
  {
    id: 'api_access',
    key: 'REST_API_WEBHOOKS',
    label: 'REST API & Webhooks',
    desc: 'Developer REST API access, webhook events, and third-party software integration.',
    category: 'Integrations',
    status: 'active',
    isStandaloneAddon: true,
    addonPrice: 49,
  },
  {
    id: 'vin_scanner',
    key: 'AI_VIN_SCANNER',
    label: 'AI VIN & License Plate Scanner',
    desc: 'Mobile camera AI scanning for automatic vehicle VIN decoding and registration lookup.',
    category: 'Integrations',
    status: 'beta',
    isStandaloneAddon: true,
    addonPrice: 15,
  },
  {
    id: 'whatsapp_msg',
    key: 'WHATSAPP_BUSINESS',
    label: 'WhatsApp Business Messaging',
    desc: 'Direct 2-way WhatsApp repair estimate approvals and customer photo attachments.',
    category: 'Customer Experience',
    status: 'active',
    isStandaloneAddon: true,
    addonPrice: 25,
  },
]

export const FEATURE_CATEGORIES = [
  'Core Operations',
  'Customer Experience',
  'Financials',
  'Integrations',
  'Marketing & Growth',
]

/**
 * Fetch master feature catalog list with HTTP Request Body pagination parameters
 * @param {Object} queryParams - { page: number, pageSize: number, search: string, category: string }
 * @returns {Promise<Object>} Response object: { data, allFeatures, page, pageSize, totalItems, totalPages }
 */
export async function fetchMasterFeatures(queryParams = null) {
  // If no specific query parameters are passed, return the plain array catalog for backwards compatibility
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...featureDb])
      }, 300)
    })
  }

  const page = Number(queryParams.page || 1)
  const pageSize = Number(queryParams.pageSize || 6)
  const search = queryParams.search || ''
  const category = queryParams.category || 'all'

  // HTTP Request Body payload passed to endpoint
  const requestBody = {
    page,
    pageSize,
    search,
    category,
  }

  // Simulate HTTP POST request with body payload
  console.log('[HTTP POST /api/v1/superadmin/features/query]', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...featureDb]
      if (category && category !== 'all') {
        filtered = filtered.filter((f) => f.category === category)
      }
      if (search && search.trim()) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (f) =>
            f.label.toLowerCase().includes(q) ||
            f.key.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q)
        )
      }

      const totalItems = filtered.length
      const totalPages = Math.ceil(totalItems / pageSize) || 1
      const validPage = Math.min(Math.max(1, page), totalPages)
      const startIndex = (validPage - 1) * pageSize
      const paginatedItems = filtered.slice(startIndex, startIndex + pageSize)

      resolve({
        data: paginatedItems,
        allFeatures: [...featureDb],
        page: validPage,
        pageSize,
        totalItems,
        totalPages,
      })
    }, 300)
  })
}

/**
 * POST Endpoint: /api/v1/superadmin/features
 * Registers a new feature flag into the database catalog.
 */
export async function createMasterFeature(featurePayload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = featurePayload.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')
      const formattedKey = featurePayload.key?.trim()
        ? featurePayload.key.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')
        : featurePayload.label.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')

      const savedFeature = {
        id: newId,
        key: formattedKey,
        label: featurePayload.label.trim(),
        desc: featurePayload.desc?.trim() || 'Custom system feature module.',
        category: featurePayload.category || 'Core Operations',
        status: featurePayload.status || 'active',
        isStandaloneAddon: Boolean(featurePayload.isStandaloneAddon),
        addonPrice: featurePayload.isStandaloneAddon ? Number(featurePayload.addonPrice || 15) : 0,
      }

      featureDb = [...featureDb, savedFeature]
      resolve(savedFeature)
    }, 400)
  })
}

/**
 * PUT Endpoint: /api/v1/superadmin/features/{id}
 * Updates a feature flag in the database.
 */
export async function updateMasterFeature(featureId, updates) {
  return new Promise((resolve) => {
    setTimeout(() => {
      featureDb = featureDb.map((f) => {
        if (f.id !== featureId) return f
        return { ...f, ...updates }
      })
      const updated = featureDb.find((f) => f.id === featureId)
      resolve(updated)
    }, 300)
  })
}
