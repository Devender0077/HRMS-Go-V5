import { Helmet } from 'react-helmet-async';
import { useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [currentContract, setCurrentContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const isView = location.pathname.includes('/view');
  const isEdit = Boolean(id) && location.pathname.includes('/edit');

  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await contractService.getById(id);
      console.log('📄 Contract data loaded:', response);
      if (response.success) {
        const contractData = response.data;
        console.log('✅ Contract with employee:', contractData);
        setCurrentContract(contractData);
      }
    } catch (error) {
      console.error('❌ Error fetching contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (isView) return 'View Contract';
    if (isEdit) return 'Edit Contract';
    return 'New Contract';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={getPageTitle()}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: isView ? 'View' : isEdit ? 'Edit' : 'New' },
          ]}
        />

        {!loading && (
          <ContractNewEditForm 
            isEdit={isEdit} 
            isView={isView}
            currentContract={currentContract} 
          />
        )}
      </Container>
    </>
  );
}

