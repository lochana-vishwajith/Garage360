GARAGE MANAGEMENT SAAS - COMPREHENSIVE PRODUCT FEATURE SPECIFICATION
===================================================================

CORE VALUE PROPOSITION:
Turn one-time repair jobs into predictable, recurring service revenue on autopilot.

UNIQUE SELLING POINT (USP):
"Never lose a customer because you forgot their next service."

TARGET AUDIENCE:
Independent auto repair shops, vehicle detailing studios, tire & alignment centers, and multi-bay garages.


1. WHATSAPP SELF-SERVICE & AUTOMATED ENGAGEMENT MODULE
------------------------------------------------------
1.1 Self-Service Appointment Booking (Chatbot Engine)
    - Automated Slot Availability Engine: Allows customers to query available slots for a specific date or time window directly over WhatsApp without calling the front desk.
    - Interactive Booking Flow: Leverages WhatsApp Interactive List Menus and Quick Reply Buttons to guide users through selecting registered vehicles, choosing service packages, picking time slots, and confirming bookings.
    - Dynamic Capacity Calculation: Calculates available slots based on active service bays, working technician hours, existing appointments, and active workshop job cards.
    - Smart Conflict Resolution: Applies automated buffer periods (e.g., 15 minutes) between bookings and offers adjacent alternative times if a requested slot is fully booked.
    - Self-Service Rescheduling & Cancellation: Permits customers to modify or cancel upcoming bookings via WhatsApp within garage-defined time limits.

1.2 Automated Service Reminders & Re-engagement
    - Predictive Maintenance Alerts: Sends automated, personalized WhatsApp reminders for upcoming or overdue services (e.g., oil changes, ceramic coating top-ups, fluid flushes) calculated by elapsed time or estimated mileage.
    - Status Updates & Notifications: Automated dispatches for key workshop milestones: Vehicle Checked-In, Estimate Ready for Approval, Job In-Progress, and Vehicle Ready for Pickup.
    - Two-Way Messaging Inbox: Centralized garage inbox allowing staff to handle custom customer inquiries sent over WhatsApp.


2. CUSTOMER & VEHICLE INTELLIGENCE (CRM)
----------------------------------------
2.1 Customer Database
    - Unified Profile Management: Central repository storing customer contact details, communication logs, booking history, outstanding balances, and total lifetime spend.
    - Multi-Vehicle Association: Links multiple vehicles (personal, family, or commercial fleet) to a single customer profile.

2.2 Vehicle Records & Service History
    - Digital Vehicle Passport: Detailed records per vehicle including VIN, license plate number, make, model, year, engine code, color, and current mileage tracking.
    - Comprehensive Service History: Complete, immutable timeline detailing all past workshop visits, performed line items, replaced parts, technician inspection notes, attached diagnostic photos, and historical invoices.


3. WORKSHOP OPERATIONS & FLOOR MANAGEMENT
-----------------------------------------
3.1 Live Master Calendar & Scheduling
    - Unified Intake Dashboard: Visual Drag-and-Drop Calendar showing all upcoming appointments categorized by source (WhatsApp Self-Booked, Phone/Manual, Walk-in).
    - Real-Time System Synchronization: Instant reflection of WhatsApp bookings on the garage dashboard to prevent double-booking by front-desk staff.

3.2 Digital Job Cards
    - Vehicle Intake & Inspection: Digital intake workflow on tablet/desktop to record initial vehicle condition, customer complaints, fuel levels, and existing body damages.
    - Status Tracking Lifecycle: Tracks work progression from Pending Intake -> Under Inspection -> Awaiting Approval -> In Repair -> Quality Check -> Ready for Delivery.

3.3 Mechanic & Bay Assignments
    - Technician Task Allocation: Assign individual line items or entire job cards to specific mechanics or work bays.
    - Labor Tracking: Monitors active time spent per technician per job for productivity tracking and flat-rate vs. actual labor cost analysis.


4. FINANCIALS, ESTIMATES & BILLING
----------------------------------
4.1 Digital Estimates & Approvals
    - Instant Quotation Generation: Create itemized estimates (parts + labor + tax) linked directly to inventory prices.
    - Digital Customer Approval: Sends estimate links via WhatsApp/SMS allowing customers to review and approve specific line items remotely before work begins.

4.2 Invoicing & Payment Processing
    - One-Click Estimate Conversion: Converts approved job card line items directly into a final tax-compliant invoice.
    - Flexible Payments: Supports cash, card, bank transfers, and online payment links dispatched over WhatsApp. Tracks split payments and partial deposits.


5. PARTS & INVENTORY MANAGEMENT
-------------------------------
5.1 Inventory Control & Tracking
    - Real-Time Stock Deductions: Stock quantities are automatically reserved upon estimate approval and deducted upon job card closure.
    - Parts Catalog: Stores part numbers, OEM codes, supplier info, cost prices, selling prices, and reorder thresholds.
    - Low-Stock Alerts: Automatic dashboard notifications and reorder triggers when stock drops below safety thresholds.


6. BUSINESS INTELLIGENCE & REVENUE ANALYTICS
--------------------------------------------
6.1 Revenue Reports
    - Financial Performance: Reports on Gross Revenue, Net Profit Margins, Outstanding Receivables, and Daily/Monthly/Annual comparisons.
    - Sales Breakdown: Itemized analysis of revenue generated from Parts vs. Labor vs. Subcontracted Services.

6.2 Operational & Retention Analytics
    - Technician Efficiency: Tracking completed labor units, billable hours, and jobs finished on time per mechanic.
    - Customer Retention Rate: Metrics on return rates driven by WhatsApp reminders, customer churn, and lifetime value (LTV).


7. TECHNICAL & NON-FUNCTIONAL REQUIREMENTS
------------------------------------------
    - Multi-Tenancy & Security: Isolated tenant data isolation, encrypted data at rest and in transit (SSL/TLS), and Role-Based Access Control (RBAC) for Admins, Front-Desk, and Mechanics.
    - Real-Time Concurrency: WebSockets/Server-Sent Events (SSE) to ensure instant synchronization between WhatsApp customer bookings and the garage web dashboard without manual page refreshes.
    - WhatsApp Business API Integration: Official Meta Cloud API usage adhering to template message policies, 24-hour customer service window rules, and rate limits.
    - Cross-Platform Accessibility: Responsive Web App tailored for Desktop (Front Desk/Admin) and Mobile/Tablet views (Mechanic Bay Intake).
