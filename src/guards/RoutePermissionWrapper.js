import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { Container, Alert, AlertTitle, Button } from '@mui/material';
import usePermissions from '../hooks/usePermissions';

/**
 * Route-to-Permission mapping
 * Maps each route path to required permission(s)
 * Using ONLY permissions that exist in the database
 */
const ROUTE_PERMISSIONS = {
  // Dashboard - accessible to all
  '/dashboard/app': ['dashboard.view'],
  
  // Employees
  '/dashboard/hr/employees': ['employees.view'],
  '/dashboard/hr/employees/new': ['employees.create'],
  '/dashboard/hr/employees/edit': ['employees.edit'],
  '/dashboard/hr/organization-chart': ['employees.view'],
  
  // Attendance
  '/dashboard/attendance/records': ['attendance.view_all', 'attendance.view_own'],
  '/dashboard/attendance/clock': ['attendance.clock'],
  '/dashboard/attendance/calendar': ['attendance.view_all', 'attendance.manage'],
  '/dashboard/attendance/muster': ['attendance.view_all', 'attendance.manage'],
  '/dashboard/attendance/regularizations': ['attendance.view_all', 'attendance.view_own'],
  
  // Leaves
  '/dashboard/leaves/applications': ['leaves.view_all', 'leaves.view_own'],
  '/dashboard/leaves/apply': ['leaves.apply'],
  '/dashboard/leaves/balance': ['leaves.view_own'],
  '/dashboard/leaves/types': ['leaves.manage'],
  
  // Payroll
  '/dashboard/payroll/run': ['payroll.view_all', 'payroll.view_own'],
  '/dashboard/payroll/components': ['payroll.manage'],
  '/dashboard/payroll/history': ['payroll.view_all', 'payroll.view_own'],
  
  // Recruitment
  '/dashboard/recruitment/jobs': ['recruitment.view'],
  '/dashboard/recruitment/applications': ['recruitment.view'],
  '/dashboard/recruitment/candidates': ['recruitment.view'],
  
  // Performance
  '/dashboard/performance/reviews': ['performance.view', 'performance.view_own'],
  '/dashboard/performance/goals': ['performance.view', 'performance.view_own'],
  '/dashboard/performance/feedback': ['performance.view', 'performance.view_own'],
  
  // Training
  '/dashboard/training/programs': ['training.view'],
  '/dashboard/training/schedule': ['training.view'],
  '/dashboard/training/certificates': ['training.view'],
  
  // Documents
  '/dashboard/documents/employee': ['documents.view'],
  '/dashboard/documents/library': ['documents.view'],
  '/dashboard/documents/templates': ['documents.manage'],
  
  // Assets
  '/dashboard/assets/list': ['assets.view'],
  '/dashboard/assets/categories': ['assets.manage'],
  '/dashboard/assets/assignments': ['assets.view'],
  '/dashboard/assets/maintenance': ['assets.manage'],
  
  // Reports
  '/dashboard/reports/attendance': ['reports.view'],
  '/dashboard/reports/leave': ['reports.view'],
  '/dashboard/reports/payroll': ['reports.view'],
  '/dashboard/reports/custom': ['reports.generate'],
  
  // Settings
  '/dashboard/settings/general': ['settings.view'],
  '/dashboard/settings/system-setup': ['settings.manage'],
  '/dashboard/settings/roles': ['settings.roles'],
  '/dashboard/settings/users': ['settings.users'],
  
  // Calendar
  '/dashboard/calendar': ['calendar.view'],
  
  // Announcements
  '/dashboard/announcements': ['announcements.view'],
};

/**
 * Wrapper component that checks permissions for current route
 */
export default function RoutePermissionWrapper() {
  const location = useLocation();
  const { hasPermission, hasAnyPermission, permissions: hookPermissions } = usePermissions();

  // Get user and permissions directly from localStorage for most reliable check
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  
  // Use stored permissions if hook permissions are empty (timing issue)
  const permissions = hookPermissions.length > 0 ? hookPermissions : storedPermissions;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 ROUTE PERMISSION CHECK');
  console.log('   Path:', location.pathname);
  console.log('   User Type:', user.userType);
  console.log('   Hook Permissions:', hookPermissions.length);
  console.log('   Stored Permissions:', storedPermissions.length);
  console.log('   Using Permissions:', permissions.length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Super admin bypasses all permission checks
  if (user.userType === 'super_admin') {
    console.log('✅ SUPER ADMIN: Access granted\n');
    return <Outlet />;
  }

  // Get required permission(s) for current route
  const requiredPermission = ROUTE_PERMISSIONS[location.pathname];

  // No permission required for this route - allow access
  if (!requiredPermission) {
    console.log('✅ NO PERMISSION REQUIRED: Access granted\n');
    return <Outlet />;
  }

  // Check if user has required permission(s) - using stored permissions directly
  let hasAccess = false;

  if (typeof requiredPermission === 'string') {
    hasAccess = permissions.includes(requiredPermission);
    console.log(`   Checking: "${requiredPermission}"`);
    console.log(`   Result: ${hasAccess ? '✅ YES' : '❌ NO'}`);
  } else if (Array.isArray(requiredPermission)) {
    hasAccess = requiredPermission.some(perm => permissions.includes(perm));
    console.log(`   Checking ANY of: [${requiredPermission.join(', ')}]`);
    console.log(`   Result: ${hasAccess ? '✅ YES' : '❌ NO'}`);
    
    if (!hasAccess) {
      console.log('   Individual checks:');
      requiredPermission.forEach(perm => {
        const has = permissions.includes(perm);
        console.log(`      - ${perm}: ${has ? '✅' : '❌'}`);
      });
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Access denied
  if (!hasAccess) {
    console.log('🚫 ACCESS DENIED:', location.pathname);
    console.log('   Required:', requiredPermission);
    console.log('   User permissions:', permissions);
    console.log('   All permissions:', permissions);
    
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">
          <AlertTitle>Access Denied</AlertTitle>
          You don't have permission to access this page. Please contact your administrator.
          <br /><br />
          <strong>Required permission:</strong> {Array.isArray(requiredPermission) ? requiredPermission.join(' OR ') : requiredPermission}
          <br /><br />
          <strong>Debug Info:</strong>
          <br />Your permissions ({permissions.length}): {permissions.join(', ')}
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
  console.log('✅ ACCESS GRANTED:', location.pathname);
  return <Outlet />;
}

