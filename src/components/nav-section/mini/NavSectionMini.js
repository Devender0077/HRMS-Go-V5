import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
// @mui
import { Box, Stack } from '@mui/material';
// hooks
import usePermissions from '../../../hooks/usePermissions';
//
import NavList from './NavList';

// ----------------------------------------------------------------------

NavSectionMini.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
};

function NavSectionMini({ data, sx, ...other }) {
  const { permissions } = usePermissions();

  // Get user to check if super admin
  const user = useMemo(() => {
    try {
      const userData = window.localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

  // Filter data based on permissions
  const filteredData = useMemo(() => {
    // Force reload permissions from localStorage
    let actualPermissions = permissions;
    if (!actualPermissions || actualPermissions.length === 0) {
      try {
        const stored = localStorage.getItem('permissions');
        if (stored) {
          actualPermissions = JSON.parse(stored);
        }
      } catch (e) {
        actualPermissions = [];
      }
    }

    console.log('🔍 MINI NAV FILTER - Permissions:', actualPermissions.length);

    // Super admin sees everything
    if (user?.userType === 'super_admin') {
      return data;
    }

    const filterItems = (items) => {
      return items.filter((item) => {
        if (!item.permission) return true;

        let hasAccess = false;
        if (typeof item.permission === 'string') {
          hasAccess = actualPermissions.includes(item.permission);
        } else if (Array.isArray(item.permission)) {
          hasAccess = item.permission.some(perm => actualPermissions.includes(perm));
        }

        if (!hasAccess) return false;

        // Filter children if they exist
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0) {
            item.children = filteredChildren;
            return true;
          }
          return false;
        }

        return true;
      });
    };

    return data
      .map((group) => ({
        ...group,
        items: filterItems(group.items),
      }))
      .filter((group) => group.items.length > 0);
  }, [data, user, permissions]);

  return (
    <Stack
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 0.75,
        ...sx,
      }}
      {...other}
    >
      {filteredData.map((group, index) => (
        <Items key={group.subheader} items={group.items} isLastGroup={index + 1 === filteredData.length} />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

Items.propTypes = {
  items: PropTypes.array,
  isLastGroup: PropTypes.bool,
};

function Items({ items, isLastGroup }) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} />
      ))}

      {!isLastGroup && (
        <Box
          sx={{
            width: 24,
            height: '1px',
            bgcolor: 'divider',
            my: '8px !important',
          }}
        />
      )}
    </>
  );
}
