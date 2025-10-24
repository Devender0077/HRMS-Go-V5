/**
 * Route Permissions Configuration
 * Maps routes to required permissions
 */

export const ROUTE_PERMISSIONS = {
  // Dashboard
  '/dashboard': 'dashboard.view',
  
  // Users & Roles
  '/dashboard/settings/users': 'users.view',
  '/dashboard/settings/roles': 'roles.view',
  '/dashboard/settings/permissions': 'roles.manage_permissions',
  
  // Employees
  '/dashboard/employees': 'employees.view',
  '/dashboard/employees/list': 'employees.view',
  '/dashboard/employees/create': 'employees.create',
  '/dashboard/employees/edit': 'employees.edit',
  
  // Attendance
  '/dashboard/attendance': ['attendance.view_all', 'attendance.view_own'],
  '/dashboard/attendance/records': ['attendance.view_all', 'attendance.view_own'],
  '/dashboard/attendance/clock': 'attendance.clock',
  '/dashboard/attendance/calendar': ['attendance.view_all', 'attendance.manage'],
  '/dashboard/attendance/muster': ['attendance.view_all', 'attendance.export'],
  '/dashboard/attendance/regularizations': ['attendance.view_all', 'attendance.approve_regularization'],
  
  // Leave
  '/dashboard/leave': ['leaves.view_all', 'leaves.view_own'],
  '/dashboard/leave/requests': ['leaves.view_all', 'leaves.view_own'],
  '/dashboard/leave/apply': 'leaves.apply',
  '/dashboard/leave/balance': ['leaves.view_all', 'leaves.view_own'],
  '/dashboard/leave/calendar': ['leaves.view_all', 'leaves.view_own'],
  
  // Payroll
  '/dashboard/payroll': ['payroll.view_all', 'payroll.view_own'],
  '/dashboard/payroll/list': ['payroll.view_all', 'payroll.view_own'],
  '/dashboard/payroll/process': 'payroll.process',
  '/dashboard/payroll/components': 'payroll.manage_components',
  
  // Performance
  '/dashboard/performance': ['performance.view_all', 'performance.view_own'],
  '/dashboard/performance/reviews': ['performance.view_all', 'performance.view_own'],
  '/dashboard/performance/goals': ['performance.view_all', 'performance.view_own', 'performance.set_goals'],
  
  // Recruitment
  '/dashboard/recruitment': 'recruitment.view_jobs',
  '/dashboard/recruitment/jobs': 'recruitment.view_jobs',
  '/dashboard/recruitment/applications': 'recruitment.view_applications',
  
  // Training
  '/dashboard/training': 'training.view',
  '/dashboard/training/programs': 'training.view',
  '/dashboard/training/enroll': 'training.enroll',
  
  // Documents
  '/dashboard/documents': ['documents.view_all', 'documents.view_own'],
  
  // Assets
  '/dashboard/assets': 'assets.view',
  '/dashboard/assets/list': 'assets.view',
  '/dashboard/assets/assignments': ['assets.view', 'assets.assign'],
  '/dashboard/assets/maintenance': ['assets.view', 'assets.edit'],
  
  // Organization
  '/dashboard/organization/departments': 'departments.view',
  '/dashboard/organization/designations': 'designations.view',
  '/dashboard/organization/branches': 'branches.view',
  '/dashboard/organization/shifts': 'shifts.view',
  '/dashboard/organization/policies': 'policies.view',
  
  // Reports
  '/dashboard/reports': 'reports.view',
  
  // Settings
  '/dashboard/settings': 'settings.view_general',
  '/dashboard/settings/general': 'settings.view_general',
  '/dashboard/settings/system-setup': 'settings.view_system',
  
  // Calendar
  '/dashboard/calendar': 'calendar.view',
};

/**
 * Get permission required for a route
 * @param {string} path - Route path
 * @returns {string|Array<string>|null}
 */
export function getRoutePermission(path) {
  // Exact match
  if (ROUTE_PERMISSIONS[path]) {
    return ROUTE_PERMISSIONS[path];
  }

  // Find matching pattern (for routes with params like /dashboard/employees/:id)
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(route)) {
      return permission;
    }
  }

  return null;
}

/**
 * Module-level permissions
 * Used for menu items and navigation
 */
export const MODULE_PERMISSIONS = {
  dashboard: 'dashboard.view',
  users: 'users.view',
  roles: 'roles.view',
  employees: 'employees.view',
  attendance: ['attendance.view_all', 'attendance.view_own', 'attendance.clock'],
  leave: ['leaves.view_all', 'leaves.view_own', 'leaves.apply'],
  payroll: ['payroll.view_all', 'payroll.view_own'],
  performance: ['performance.view_all', 'performance.view_own'],
  recruitment: 'recruitment.view_jobs',
  training: 'training.view',
  documents: ['documents.view_all', 'documents.view_own'],
  assets: 'assets.view',
  departments: 'departments.view',
  designations: 'designations.view',
  branches: 'branches.view',
  shifts: 'shifts.view',
  policies: 'policies.view',
  reports: 'reports.view',
  settings: ['settings.view_general', 'settings.view_system'],
  calendar: 'calendar.view',
};

