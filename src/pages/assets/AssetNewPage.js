import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
// sections
import AssetNewEditForm from '../../sections/@dashboard/asset/AssetNewEditForm';
// services
import assetService from '../../services/api/assetService';

// ----------------------------------------------------------------------

export default function AssetNewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [currentAsset, setCurrentAsset] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      fetchAsset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const data = await assetService.getById(id);
      setCurrentAsset(data);
    } catch (error) {
      console.error('Error fetching asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Asset' : 'New Asset'} | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={isEdit ? 'Edit Asset' : 'Create New Asset'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.list },
            { name: isEdit ? 'Edit' : 'New Asset' },
          ]}
        />

        {!loading && <AssetNewEditForm isEdit={isEdit} currentAsset={currentAsset} />}
      </Container>
    </>
  );
}

