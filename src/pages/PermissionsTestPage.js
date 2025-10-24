import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, Stack, Chip, Box, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import usePermissions from '../hooks/usePermissions';

export default function PermissionsTestPage() {
  const user = useSelector(selectUser);
  const { permissions, loading, userRole, hasPermission } = usePermissions();

  return (
    <>
      <Helmet>
        <title>Permissions Test | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>
          🔍 Permissions Debug Page
        </Typography>

        <Stack spacing={3}>
          {/* User Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👤 Current User
              </Typography>
              <Box sx={{ fontFamily: 'monospace', fontSize: 14 }}>
                <div>ID: {user?.id || 'null'}</div>
                <div>Email: {user?.email || 'null'}</div>
                <div>Type: {user?.userType || 'null'}</div>
                <div>Display Name: {user?.displayName || 'null'}</div>
              </Box>
            </CardContent>
          </Card>

          {/* Role Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎭 User Role
              </Typography>
              {loading ? (
                <Alert severity="info">Loading role data...</Alert>
              ) : userRole ? (
                <Box sx={{ fontFamily: 'monospace', fontSize: 14 }}>
                  <div>Role ID: {userRole.role_id}</div>
                  <div>Role Name: {userRole.role_name || 'Not loaded yet'}</div>
                  <div>User Type: {userRole.user_type}</div>
                </Box>
              ) : (
                <Alert severity="warning">No role data loaded</Alert>
              )}
            </CardContent>
          </Card>

          {/* Permissions List */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔐 Loaded Permissions ({permissions.length})
              </Typography>
              
              {loading ? (
                <Alert severity="info">Loading permissions...</Alert>
              ) : permissions.length === 0 ? (
                <Alert severity="warning">No permissions loaded! Check console for errors.</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {permissions.map((perm) => (
                    <Chip 
                      key={perm} 
                      label={perm} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Permission Tests */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧪 Permission Tests
              </Typography>
              
              <Stack spacing={1}>
                <TestPermission perm="dashboard.view" hasPermission={hasPermission} />
                <TestPermission perm="employees.view" hasPermission={hasPermission} />
                <TestPermission perm="attendance.clock" hasPermission={hasPermission} />
                <TestPermission perm="leaves.apply" hasPermission={hasPermission} />
                <TestPermission perm="users.view" hasPermission={hasPermission} />
                <TestPermission perm="settings.manage_system" hasPermission={hasPermission} />
              </Stack>
            </CardContent>
          </Card>

          {/* Console Instructions */}
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              📋 Check Browser Console (F12)
            </Typography>
            <Typography variant="body2">
              Look for logs starting with "usePermissions:" to see permission loading process.
              Look for "hasPermission" logs to see individual permission checks.
            </Typography>
          </Alert>
        </Stack>
      </Container>
    </>
  );
}

function TestPermission({ perm, hasPermission }) {
  const has = hasPermission(perm);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
      <Chip 
        label={has ? 'YES' : 'NO'} 
        color={has ? 'success' : 'error'} 
        size="small" 
        sx={{ minWidth: 60 }}
      />
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {perm}
      </Typography>
    </Box>
  );
}

