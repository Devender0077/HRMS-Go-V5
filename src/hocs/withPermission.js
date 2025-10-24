import PermissionGuard from '../guards/PermissionGuard';

/**
 * Higher Order Component to wrap pages with permission checking
 * Usage: export default withPermission(MyPage, 'users.view');
 * Usage: export default withPermission(MyPage, ['users.view', 'users.edit']);
 */
export const withPermission = (Component, permission, requireAll = false) => {
  const WithPermissionComponent = (props) => (
    <PermissionGuard permission={permission} requireAll={requireAll}>
      <Component {...props} />
    </PermissionGuard>
  );

  // Preserve component name for debugging
  WithPermissionComponent.displayName = `withPermission(${Component.displayName || Component.name || 'Component'})`;

  return WithPermissionComponent;
};

export default withPermission;

