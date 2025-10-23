import { useSelector } from 'react-redux';
// redux
import { selectPermissions, selectRole } from '../../redux/slices/hrms/authSlice';
// utils
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole as checkRole,
} from '../../utils/permissions';

// ----------------------------------------------------------------------

export default function usePermission() {
  const userPermissions = useSelector(selectPermissions);
  const userRole = useSelector(selectRole);

  const can = (permission) => hasPermission(userPermissions, permission);

  const canAny = (permissions) => hasAnyPermission(userPermissions, permissions);

  const canAll = (permissions) => hasAllPermissions(userPermissions, permissions);

  const hasRole = (role) => checkRole(userRole, role);

  return {
    can,
    canAny,
    canAll,
    hasRole,
    permissions: userPermissions,
    role: userRole,
  };
}

