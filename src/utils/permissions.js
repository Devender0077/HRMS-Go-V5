// Permission utilities for HRMS

/**
 * Check if user has specific permission
 * @param {Array} userPermissions - User's permissions array
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userPermissions, permission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  return userPermissions.includes(permission) || userPermissions.includes('*');
};

/**
 * Check if user has any of the specified permissions
 * @param {Array} userPermissions - User's permissions array
 * @param {Array} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  if (userPermissions.includes('*')) {
    return true;
  }

  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Array} userPermissions - User's permissions array
 * @param {Array} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  if (userPermissions.includes('*')) {
    return true;
  }

  return permissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has specific role
 * @param {Object} userRole - User's role object
 * @param {string|Array} role - Role(s) to check
 * @returns {boolean}
 */
export const hasRole = (userRole, role) => {
  if (!userRole) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.includes(userRole.name) || role.includes(userRole.id);
  }

  return userRole.name === role || userRole.id === role;
};

/**
 * HRMS Permission Constants
 */
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Roles
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',

  // Permissions
  PERMISSIONS_VIEW: 'permissions.view',
  PERMISSIONS_MANAGE: 'permissions.manage',

  // Employees
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_EDIT: 'employees.edit',
  EMPLOYEES_DELETE: 'employees.delete',
  EMPLOYEES_VIEW_SALARY: 'employees.view_salary',

  // Departments
  DEPARTMENTS_VIEW: 'departments.view',
  DEPARTMENTS_MANAGE: 'departments.manage',

  // Branches
  BRANCHES_VIEW: 'branches.view',
  BRANCHES_MANAGE: 'branches.manage',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_VIEW_ALL: 'attendance.view_all',
  ATTENDANCE_MANAGE: 'attendance.manage',
  ATTENDANCE_APPROVE: 'attendance.approve',

  // Leaves
  LEAVES_VIEW: 'leaves.view',
  LEAVES_APPLY: 'leaves.apply',
  LEAVES_APPROVE: 'leaves.approve',
  LEAVES_MANAGE: 'leaves.manage',

  // Payroll
  PAYROLL_VIEW: 'payroll.view',
  PAYROLL_VIEW_ALL: 'payroll.view_all',
  PAYROLL_PROCESS: 'payroll.process',
  PAYROLL_MANAGE: 'payroll.manage',

  // Recruitment
  RECRUITMENT_VIEW: 'recruitment.view',
  RECRUITMENT_MANAGE: 'recruitment.manage',
  RECRUITMENT_HIRE: 'recruitment.hire',

  // Contracts
  CONTRACTS_VIEW: 'contracts.view',
  CONTRACTS_MANAGE: 'contracts.manage',

  // Documents
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_UPLOAD: 'documents.upload',
  DOCUMENTS_MANAGE: 'documents.manage',

  // Meetings
  MEETINGS_VIEW: 'meetings.view',
  MEETINGS_CREATE: 'meetings.create',
  MEETINGS_MANAGE: 'meetings.manage',

  // Performance
  PERFORMANCE_VIEW: 'performance.view',
  PERFORMANCE_MANAGE: 'performance.manage',

  // Training
  TRAINING_VIEW: 'training.view',
  TRAINING_MANAGE: 'training.manage',

  // Assets
  ASSETS_VIEW: 'assets.view',
  ASSETS_MANAGE: 'assets.manage',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_MANAGE: 'settings.manage',

  // Super Admin
  SUPER_ADMIN: '*',
};

/**
 * HRMS Role Constants
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

/**
 * Get permissions for a role
 * @param {string} roleName - Role name
 * @returns {Array} Array of permissions
 */
export const getRolePermissions = (roleName) => {
  const rolePermissions = {
    [ROLES.SUPER_ADMIN]: [PERMISSIONS.SUPER_ADMIN],

    [ROLES.ADMIN]: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_EDIT,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_CREATE,
      PERMISSIONS.EMPLOYEES_EDIT,
      PERMISSIONS.DEPARTMENTS_VIEW,
      PERMISSIONS.DEPARTMENTS_MANAGE,
      PERMISSIONS.BRANCHES_VIEW,
      PERMISSIONS.BRANCHES_MANAGE,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.ATTENDANCE_MANAGE,
      PERMISSIONS.LEAVES_VIEW,
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.LEAVES_MANAGE,
      PERMISSIONS.PAYROLL_VIEW_ALL,
      PERMISSIONS.PAYROLL_MANAGE,
      PERMISSIONS.RECRUITMENT_VIEW,
      PERMISSIONS.RECRUITMENT_MANAGE,
      PERMISSIONS.CONTRACTS_VIEW,
      PERMISSIONS.CONTRACTS_MANAGE,
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_MANAGE,
      PERMISSIONS.MEETINGS_VIEW,
      PERMISSIONS.MEETINGS_MANAGE,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_MANAGE,
    ],

    [ROLES.HR_MANAGER]: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_CREATE,
      PERMISSIONS.EMPLOYEES_EDIT,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.ATTENDANCE_APPROVE,
      PERMISSIONS.LEAVES_VIEW,
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.PAYROLL_VIEW_ALL,
      PERMISSIONS.PAYROLL_PROCESS,
      PERMISSIONS.RECRUITMENT_VIEW,
      PERMISSIONS.RECRUITMENT_MANAGE,
      PERMISSIONS.PERFORMANCE_VIEW,
      PERMISSIONS.PERFORMANCE_MANAGE,
      PERMISSIONS.TRAINING_VIEW,
      PERMISSIONS.TRAINING_MANAGE,
    ],

    [ROLES.HR]: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.LEAVES_VIEW,
      PERMISSIONS.RECRUITMENT_VIEW,
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_UPLOAD,
    ],

    [ROLES.MANAGER]: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_APPROVE,
      PERMISSIONS.LEAVES_VIEW,
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.MEETINGS_VIEW,
      PERMISSIONS.MEETINGS_CREATE,
      PERMISSIONS.PERFORMANCE_VIEW,
    ],

    [ROLES.EMPLOYEE]: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.LEAVES_VIEW,
      PERMISSIONS.LEAVES_APPLY,
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.MEETINGS_VIEW,
    ],
  };

  return rolePermissions[roleName] || [];
};

