import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { Container, Alert, AlertTitle, Button } from '@mui/material';
import { PATH_DASHBOARD } from '../routes/paths';
import usePermissions from '../hooks/usePermissions';
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

PermissionGuard.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  requireAll: PropTypes.bool, // If true, requires ALL permissions; if false, requires ANY
  fallback: PropTypes.node,
};

export default function PermissionGuard({ 
  children, 
  permission, 
  requireAll = false,
  fallback = null 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return <LoadingScreen />;
  }

  // No permission required - allow access
  if (!permission) {
    return <>{children}</>;
  }

  // Check permissions
  let hasAccess = false;

  if (typeof permission === 'string') {
    // Single permission
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    // Multiple permissions
    hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  if (!hasAccess) {
    // Show custom fallback or default access denied page
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="error">
          <AlertTitle>Access Denied</AlertTitle>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
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

  return <>{children}</>;
}

