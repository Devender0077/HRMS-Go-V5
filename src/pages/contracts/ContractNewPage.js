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
import ContractNewEditForm from '../../sections/@dashboard/contract/ContractNewEditForm';
// services
import contractService from '../../services/api/contractService';

// ----------------------------------------------------------------------

export default function ContractNewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [currentContract, setCurrentContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await contractService.getById(id);
      if (response.success) {
        setCurrentContract(response.data);
      }
    } catch (error) {
      console.error('Error fetching contract:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit' : 'New'} Contract | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={isEdit ? 'Edit Contract' : 'New Contract'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: isEdit ? 'Edit' : 'New' },
          ]}
        />

        {!loading && <ContractNewEditForm isEdit={isEdit} currentContract={currentContract} />}
      </Container>
    </>
  );
}

