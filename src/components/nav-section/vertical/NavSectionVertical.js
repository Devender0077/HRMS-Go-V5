import PropTypes from 'prop-types';
import { useMemo } from 'react';
// @mui
import { List, Stack } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// hooks
import usePermissions from '../../../hooks/usePermissions';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
};

export default function NavSectionVertical({ data, sx, ...other }) {
  const { translate } = useLocales();
  const { hasPermission, hasAnyPermission, permissions } = usePermissions();

  // Get user from localStorage to check role
  const user = useMemo(() => {
    try {
      const userData = window.localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Filter navigation items based on ACTUAL permissions from database
   */
  const filteredData = useMemo(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 NAVIGATION FILTER - Using Database Permissions');
    console.log('   User:', user?.email);
    console.log('   User Type:', user?.userType);
    console.log('   Total permissions:', permissions.length);
    console.log('   Permissions:', permissions);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Super admin sees EVERYTHING - no filtering
    if (user?.userType === 'super_admin') {
      console.log('✅ SUPER ADMIN: Showing ALL menu items (no filtering)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return data;
    }
    
    const filterItems = (items) => {
      return items
        .map(item => ({ ...item })) // Clone to avoid mutating original
        .filter((item) => {
          // No permission required - show to everyone
          if (!item.permission) {
            console.log(`✅ ${item.title}: No permission required`);
            return true;
          }

          // Check if user has required permission(s)
          let hasAccess = false;
          
          if (typeof item.permission === 'string') {
            hasAccess = hasPermission(item.permission);
            console.log(`   ${item.title}: Checking "${item.permission}" → ${hasAccess ? 'YES' : 'NO'}`);
          } else if (Array.isArray(item.permission)) {
            hasAccess = hasAnyPermission(item.permission);
            console.log(`   ${item.title}: Checking ANY of ${JSON.stringify(item.permission)} → ${hasAccess ? 'YES' : 'NO'}`);
            if (!hasAccess) {
              // Debug which permissions are missing
              item.permission.forEach(perm => {
                const has = permissions.includes(perm);
                console.log(`      - ${perm}: ${has ? '✅' : '❌'}`);
              });
            }
          }

          if (!hasAccess) {
            console.log(`❌ HIDE: ${item.title}`);
            return false;
          }

          // If has children, filter them recursively
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            if (filteredChildren.length > 0) {
              item.children = filteredChildren;
              console.log(`✅ SHOW: ${item.title} (${filteredChildren.length} children)`);
              return true;
            }
            // Hide parent if no children visible
            console.log(`❌ HIDE: ${item.title} (no visible children)`);
            return false;
          }

          console.log(`✅ SHOW: ${item.title}`);
          return true;
        });
    };

    const filtered = data
      .map((group) => ({
        ...group,
        items: filterItems(group.items),
      }))
      .filter((group) => group.items.length > 0);
    
    console.log(`📊 Result: ${filtered.length} groups, ${filtered.reduce((sum, g) => sum + g.items.length, 0)} total items`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return filtered;
  }, [data, hasPermission, hasAnyPermission, permissions]);

  return (
    <Stack sx={sx} {...other}>
      {filteredData.map((group) => {
        const key = group.subheader || group.items[0]?.title || 'group';

        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader && (
              <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
            )}

            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChild={!!list.children}
              />
            ))}
          </List>
        );
      })}
    </Stack>
  );
}
