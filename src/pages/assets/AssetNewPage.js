import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
// sections
import AssetNewEditForm from '../../sections/@dashboard/asset/AssetNewEditForm';

// ----------------------------------------------------------------------

export default function AssetNewPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>New Asset | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create New Asset"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.list },
            { name: 'New Asset' },
          ]}
        />

        <AssetNewEditForm isEdit={false} />
      </Container>
    </>
  );
}

