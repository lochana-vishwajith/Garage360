/**
 * Subscription Service
 * Endpoint simulation layer for Super Admin tenant subscription management.
 * Accepts HTTP Request Body payload parameters for server-side pagination:
 *   POST /api/v1/super-admin/tenants/subscriptions/query
 *   Body: { "page": 1, "pageSize": 3 }
 */

const MOCK_TENANTS_LIST = [
  {
    tenantId: 'tnt-8091',
    shopName: 'Apex Auto Motors',
    ownerName: 'Marcus Vance',
    email: 'marcus@apexautomotors.com',
    packageName: 'Pro Auto Hub',
    tierCode: 'PRO_HUB',
    billingCycle: 'Monthly',
    price: '$119.00',
    status: 'ACTIVE',
    lastPaymentDate: '2026-08-15',
    expireDate: '2026-09-15',
    paymentMethod: 'Visa ending in •••• 4242',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Automated SMS Reminders',
      'Invoicing & QuickBooks Sync',
      'Multi-Bay Scheduling',
      'Advanced Financial Analytics',
    ],
    quotas: {
      staffUsers: { used: 8, total: 10 },
      workOrders: { used: 524, total: 800 },
      storageGb: { used: 14.8, total: 25 },
      monthlySms: { used: 1120, total: 1500 },
    },
  },
  {
    tenantId: 'tnt-4412',
    shopName: 'Silverstone Garage & Diagnostics',
    ownerName: 'Elena Rostova',
    email: 'elena@silverstonegarage.com',
    packageName: 'Enterprise Fleet',
    tierCode: 'ENT_FLEET',
    billingCycle: 'Yearly',
    price: '$2,490.00',
    status: 'ACTIVE',
    lastPaymentDate: '2026-01-10',
    expireDate: '2027-01-10',
    paymentMethod: 'Mastercard ending in •••• 8819',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Automated SMS Reminders',
      'Invoicing & QuickBooks Sync',
      'Multi-Bay Scheduling',
      'Advanced Financial Analytics',
      'REST API & Webhooks Integration',
      'Multi-Location Central Dashboard',
    ],
    quotas: {
      staffUsers: { used: 34, total: 50 },
      workOrders: { used: 3120, total: 5000 },
      storageGb: { used: 68.4, total: 100 },
      monthlySms: { used: 7850, total: 10000 },
    },
  },
  {
    tenantId: 'tnt-1903',
    shopName: 'FastTrack Tire & Lube',
    ownerName: 'David Miller',
    email: 'david@fasttracklube.io',
    packageName: 'Starter Garage',
    tierCode: 'STRT_GARAGE',
    billingCycle: 'Monthly',
    price: '$49.00',
    status: 'EXPIRING_SOON',
    lastPaymentDate: '2026-08-02',
    expireDate: '2026-09-02',
    paymentMethod: 'Amex ending in •••• 1004',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Invoicing & QuickBooks Sync',
    ],
    quotas: {
      staffUsers: { used: 3, total: 3 },
      workOrders: { used: 142, total: 150 },
      storageGb: { used: 4.1, total: 5 },
      monthlySms: { used: 180, total: 200 },
    },
  },
  {
    tenantId: 'tnt-6120',
    shopName: 'Metro Fleet Repair Co.',
    ownerName: 'Samantha Reed',
    email: 's.reed@metrofleet.com',
    packageName: 'Enterprise Fleet',
    tierCode: 'ENT_FLEET',
    billingCycle: 'Monthly',
    price: '$249.00',
    status: 'PAST_DUE',
    lastPaymentDate: '2026-07-20',
    expireDate: '2026-08-20',
    paymentMethod: 'Visa ending in •••• 5511 (Failed)',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Automated SMS Reminders',
      'Invoicing & QuickBooks Sync',
      'Multi-Bay Scheduling',
      'Advanced Financial Analytics',
      'REST API & Webhooks Integration',
    ],
    quotas: {
      staffUsers: { used: 42, total: 50 },
      workOrders: { used: 4890, total: 5000 },
      storageGb: { used: 89.2, total: 100 },
      monthlySms: { used: 9940, total: 10000 },
    },
  },
  {
    tenantId: 'tnt-7731',
    shopName: 'Precision Performance Tuning',
    ownerName: 'Carlos Benitez',
    email: 'carlos@precisiontuning.net',
    packageName: 'Pro Auto Hub',
    tierCode: 'PRO_HUB',
    billingCycle: 'Monthly',
    price: '$119.00',
    status: 'ACTIVE',
    lastPaymentDate: '2026-08-20',
    expireDate: '2026-09-20',
    paymentMethod: 'Visa ending in •••• 9012',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Multi-Bay Scheduling',
      'Invoicing & QuickBooks Sync',
    ],
    quotas: {
      staffUsers: { used: 6, total: 10 },
      workOrders: { used: 390, total: 800 },
      storageGb: { used: 11.2, total: 25 },
      monthlySms: { used: 740, total: 1500 },
    },
  },
  {
    tenantId: 'tnt-9024',
    shopName: 'Vanguard Euro Autoworks',
    ownerName: 'Henri Laurent',
    email: 'henri@vanguardeuro.com',
    packageName: 'Enterprise Fleet',
    tierCode: 'ENT_FLEET',
    billingCycle: 'Yearly',
    price: '$2,490.00',
    status: 'ACTIVE',
    lastPaymentDate: '2026-03-01',
    expireDate: '2027-03-01',
    paymentMethod: 'Corporate ACH ending in •••• 3341',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Automated SMS Reminders',
      'Invoicing & QuickBooks Sync',
      'Multi-Bay Scheduling',
      'Advanced Financial Analytics',
      'REST API & Webhooks Integration',
    ],
    quotas: {
      staffUsers: { used: 22, total: 50 },
      workOrders: { used: 1980, total: 5000 },
      storageGb: { used: 45.0, total: 100 },
      monthlySms: { used: 4100, total: 10000 },
    },
  },
  {
    tenantId: 'tnt-3310',
    shopName: 'Urban EV Diagnostics & Brake',
    ownerName: 'Chloe Bennett',
    email: 'chloe@urbanev.io',
    packageName: 'Starter Garage',
    tierCode: 'STRT_GARAGE',
    billingCycle: 'Monthly',
    price: '$49.00',
    status: 'ACTIVE',
    lastPaymentDate: '2026-08-25',
    expireDate: '2026-09-25',
    paymentMethod: 'Discover ending in •••• 7720',
    modules: [
      'Work Orders & Job Sheets',
      'Parts & Inventory Tracking',
      'Customer & Vehicle History',
      'Invoicing & QuickBooks Sync',
    ],
    quotas: {
      staffUsers: { used: 2, total: 3 },
      workOrders: { used: 88, total: 150 },
      storageGb: { used: 2.3, total: 5 },
      monthlySms: { used: 110, total: 200 },
    },
  },
]

/**
 * Fetch tenant subscription data from server endpoint with HTTP Request Body pagination parameters
 * @param {Object} queryParams - { page: number, pageSize: number }
 * @returns {Promise<Object>} Promise resolving to paginated response object: { data, page, pageSize, totalItems, totalPages }
 */
export async function fetchTenantSubscriptions(queryParams = {}) {
  const page = Number(queryParams.page || 1)
  const pageSize = Number(queryParams.pageSize || 3)

  // HTTP Request Body payload passed to endpoint
  const requestBody = {
    page,
    pageSize,
  }

  // Simulate HTTP POST request with body payload
  console.log('[HTTP POST /api/v1/super-admin/tenants/subscriptions/query]', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      const totalItems = MOCK_TENANTS_LIST.length
      const totalPages = Math.ceil(totalItems / pageSize) || 1
      const validPage = Math.min(Math.max(1, page), totalPages)
      const startIndex = (validPage - 1) * pageSize
      const paginatedItems = MOCK_TENANTS_LIST.slice(startIndex, startIndex + pageSize)

      resolve({
        data: paginatedItems,
        page: validPage,
        pageSize,
        totalItems,
        totalPages,
      })
    }, 350)
  })
}
