import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import AssetAssignmentNewEditForm from '../../sections/@dashboard/asset/AssetAssignmentNewEditForm';
// services
import assetAssignmentService from '../../services/api/assetAssignmentService';

// ----------------------------------------------------------------------

export default function AssetAssignmentNewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const assignment = await assetAssignmentService.getById(id);
      setCurrentAssignment(assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit' : 'New'} Asset Assignment | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={isEdit ? 'Edit Assignment' : 'New Assignment'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.list },
            { name: 'Assignments', href: '/dashboard/assets/assignments' },
            { name: isEdit ? 'Edit' : 'New' },
          ]}
        />

        {!loading && <AssetAssignmentNewEditForm isEdit={isEdit} currentAssignment={currentAssignment} />}
      </Container>
    </>
  );
}

