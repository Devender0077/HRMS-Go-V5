import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { selectPermissions } from '../../redux/slices/hrms/authSlice';
// utils
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/permissions';

// ----------------------------------------------------------------------

PermissionGuard.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.string,
  permissions: PropTypes.array,
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
};

export default function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback,
}) {
  const userPermissions = useSelector(selectPermissions);

  // Check single permission
  if (permission) {
    const allowed = hasPermission(userPermissions, permission);

    if (!allowed) {
      return fallback || <Navigate to={PATH_DASHBOARD.permissionDenied} replace />;
    }

    return <>{children}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const allowed = requireAll
      ? hasAllPermissions(userPermissions, permissions)
      : hasAnyPermission(userPermissions, permissions);

    if (!allowed) {
      return fallback || <Navigate to={PATH_DASHBOARD.permissionDenied} replace />;
    }

    return <>{children}</>;
  }

  // No permission check specified - allow access
  return <>{children}</>;
}

