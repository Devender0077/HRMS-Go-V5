import { Helmet } from 'react-helmet-async';
// sections
import HRMSLogin from '../../sections/auth/HRMSLogin';

// ----------------------------------------------------------------------

export default function HRMSLoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | HRMS Go V5</title>
      </Helmet>

      <HRMSLogin />
    </>
  );
}

