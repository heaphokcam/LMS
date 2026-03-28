/** Static loan approval timeline used for UI (aligned with typical LMS stages). */
export const approvalWorkflow = [
  {
    id: 'submit',
    step: 'Application submitted',
    stepKh: 'បានដាក់ពាក្យសុំ',
    role: 'CUSTOMER',
    sla: '—',
  },
  {
    id: 'officer',
    step: 'Officer review',
    stepKh: 'ការពិនិត្យរបស់មន្ត្រី',
    role: 'OFFICER',
    sla: '2 business days',
  },
  {
    id: 'manager',
    step: 'Manager approval',
    stepKh: 'ការអនុម័តរបស់អ្នកគ្រប់គ្រង',
    role: 'MANAGER',
    sla: '1 business day',
  },
  {
    id: 'disburse',
    step: 'Disbursement',
    stepKh: 'បញ្ចេញប្រាក់',
    role: 'MANAGER',
    sla: 'As per schedule',
  },
]
