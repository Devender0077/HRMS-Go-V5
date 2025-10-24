import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { Container, Alert, AlertTitle, Button } from '@mui/material';
import usePermissions from '../hooks/usePermissions';

/**
 * Route-to-Permission mapping
 * Maps each route path to required permission(s)
 */
const ROUTE_PERMISSIONS = {
  // Employees
  '/dashboard/employees': ['employees.view'],
  '/dashboard/employees/directory': ['employees.view'],
  '/dashboard/employees/new': ['employees.create'],
  '/dashboard/employees/edit': ['employees.edit'],
  
  // Departments, Branches, Designations
  '/dashboard/organization/departments': ['departments.view'],
  '/dashboard/organization/branches': ['branches.view'],
  '/dashboard/organization/designations': ['designations.view'],
  
  // Attendance
  '/dashboard/attendance': ['attendance.view_all', 'attendance.view_own'],
  '/dashboard/attendance/clock': ['attendance.clock'],
  '/dashboard/attendance/calendar': ['attendance.view_all', 'attendance.view_team'],
  '/dashboard/attendance/muster': ['attendance.view_all', 'attendance.view_team'],
  '/dashboard/attendance/regularizations': ['attendance.view_all', 'attendance.view_own'],
  
  // Leaves
  '/dashboard/leaves': ['leaves.view_all', 'leaves.view_own'],
  '/dashboard/leaves/apply': ['leaves.apply'],
  '/dashboard/leaves/balance': ['leaves.view_own'],
  '/dashboard/leaves/types': ['leaves.manage_types'],
  
  // Payroll
  '/dashboard/payroll': ['payroll.view_all', 'payroll.view_own'],
  '/dashboard/payroll/components': ['payroll.manage_components'],
  '/dashboard/payroll/runs': ['payroll.process'],
  
  // Recruitment
  '/dashboard/recruitment': ['recruitment.view'],
  '/dashboard/recruitment/jobs': ['recruitment.view', 'recruitment.create_jobs'],
  '/dashboard/recruitment/applications': ['recruitment.view_applications'],
  
  // Performance
  '/dashboard/performance': ['performance.view_all', 'performance.view_own'],
  '/dashboard/performance/goals': ['performance.view_all', 'performance.view_own'],
  '/dashboard/performance/reviews': ['performance.view_all', 'performance.view_own'],
  
  // Training
  '/dashboard/training': ['training.view'],
  '/dashboard/training/programs': ['training.view', 'training.manage'],
  
  // Documents
  '/dashboard/documents': ['documents.view_all', 'documents.view_own'],
  
  // Assets
  '/dashboard/assets': ['assets.view'],
  '/dashboard/assets/categories': ['assets.manage_categories'],
  '/dashboard/assets/assignments': ['assets.view'],
  
  // Reports
  '/dashboard/reports': ['reports.view'],
  
  // Settings (Admin only)
  '/dashboard/settings/general': ['settings.view', 'settings.manage'],
  '/dashboard/settings/system-setup': ['system.manage'],
  '/dashboard/settings/roles': ['roles.view'],
  '/dashboard/settings/permissions': ['permissions.view'],
  '/dashboard/settings/users': ['users.view'],
  
  // Calendar
  '/dashboard/calendar': ['calendar.view'],
};

/**
 * Wrapper component that checks permissions for current route
 */
export default function RoutePermissionWrapper() {
  const location = useLocation();
  const { hasPermission, hasAnyPermission, permissions } = usePermissions();

  // Get user to check if super admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Super admin bypasses all permission checks
  if (user.userType === 'super_admin') {
    return <Outlet />;
  }

  // Get required permission(s) for current route
  const requiredPermission = ROUTE_PERMISSIONS[location.pathname];

  // No permission required for this route - allow access
  if (!requiredPermission) {
    return <Outlet />;
  }

  // Check if user has required permission(s)
  let hasAccess = false;

  if (typeof requiredPermission === 'string') {
    hasAccess = hasPermission(requiredPermission);
  } else if (Array.isArray(requiredPermission)) {
    hasAccess = hasAnyPermission(requiredPermission);
  }

  // Access denied
  if (!hasAccess) {
    console.log('🚫 ACCESS DENIED:', location.pathname);
    console.log('   Required:', requiredPermission);
    console.log('   User permissions:', permissions);
    
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">
          <AlertTitle>Access Denied</AlertTitle>
          You don't have permission to access this page. Please contact your administrator.
          <br /><br />
          <strong>Required permission:</strong> {Array.isArray(requiredPermission) ? requiredPermission.join(' OR ') : requiredPermission}
        </Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 3 }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  // User has permission - render the route
  return <Outlet />;
}

