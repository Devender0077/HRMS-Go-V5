import PropTypes from 'prop-types';
import usePermissions from '../../hooks/usePermissions';

// ----------------------------------------------------------------------

PermissionBased.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
};

/**
 * Component that conditionally renders children based on user permissions
 * 
 * Usage:
 *   <PermissionBased permission="users.create">
 *     <Button>Create User</Button>
 *   </PermissionBased>
 * 
 *   <PermissionBased permission={['users.edit', 'users.delete']}>
 *     <Button>Edit/Delete User</Button>
 *   </PermissionBased>
 */
export default function PermissionBased({ 
  children, 
  permission, 
  requireAll = false,
  fallback = null 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (typeof permission === 'string') {
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  if (!hasAccess) {
    return fallback || null;
  }

  return <>{children}</>;
}

