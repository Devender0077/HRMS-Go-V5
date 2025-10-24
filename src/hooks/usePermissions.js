import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

/**
 * Hook to check user permissions
 * Returns functions to check if user has specific permissions
 * Permissions are loaded from user object (set during login)
 */
export default function usePermissions() {
  const user = useSelector(selectUser);

  // Get permissions from user object (loaded during login)
  const permissions = useMemo(() => {
    if (!user) {
      console.log('usePermissions: No user, returning empty permissions');
      return [];
    }

    // Check if permissions are in user object
    if (user.permissions && Array.isArray(user.permissions)) {
      console.log('usePermissions: Loaded from user object:', user.permissions.length, 'permissions');
      console.log('usePermissions: Permissions:', user.permissions);
      return user.permissions;
    }

    // Fallback: try localStorage
    const storedPermissions = window.localStorage.getItem('permissions');
    if (storedPermissions) {
      try {
        const perms = JSON.parse(storedPermissions);
        console.log('usePermissions: Loaded from localStorage:', perms.length, 'permissions');
        return perms;
      } catch (e) {
        console.error('usePermissions: Error parsing localStorage permissions:', e);
      }
    }

    console.warn('usePermissions: No permissions found!');
    return [];
  }, [user]);

  const userRole = useMemo(() => {
    return user?.roleData || { name: user?.role || user?.userType };
  }, [user]);

  const loading = false; // No loading since we get permissions from user object

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission slug (e.g., 'users.create')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!user) {
      console.log(`hasPermission("${permission}"): No user`);
      return false;
    }
    
    // Super admin has all permissions
    if (user.userType === 'super_admin') {
      console.log(`hasPermission("${permission}"): Super admin = YES`);
      return true;
    }

    const has = permissions.includes(permission);
    console.log(`hasPermission("${permission}"): ${has ? 'YES' : 'NO'} (in ${permissions.length} perms)`);
    return has;
  };

  /**
   * Check if user has ANY of the provided permissions
   * @param {Array<string>} permissionList - Array of permission slugs
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionList) => {
    if (!user) {
      console.log(`hasAnyPermission([...]): No user`);
      return false;
    }
    
    if (user.userType === 'super_admin') {
      console.log(`hasAnyPermission([...]): Super admin = YES`);
      return true;
    }

    const hasAny = permissionList.some(perm => permissions.includes(perm));
    console.log(`hasAnyPermission([${permissionList.join(', ')}]): ${hasAny ? 'YES' : 'NO'}`);
    
    if (!hasAny) {
      console.log('   Checking each:');
      permissionList.forEach(perm => {
        console.log(`   - ${perm}: ${permissions.includes(perm) ? '✅' : '❌'}`);
      });
    }
    
    return hasAny;
  };

  /**
   * Check if user has ALL of the provided permissions
   * @param {Array<string>} permissionList - Array of permission slugs
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionList) => {
    if (!user) return false;
    if (user.userType === 'super_admin') return true;
    return permissionList.every(perm => permissions.includes(perm));
  };

  /**
   * Check if user can access a specific module
   * @param {string} module - Module name (e.g., 'users', 'employees')
   * @returns {boolean}
   */
  const canAccessModule = (module) => {
    if (!user) return false;
    if (user.userType === 'super_admin') return true;
    return permissions.some(perm => perm.startsWith(`${module}.`));
  };

  return {
    permissions,
    loading,
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule,
  };
}

