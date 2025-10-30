// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },
  {
    title: 'About',
    icon: <Iconify icon="eva:info-fill" />,
    path: PATH_PAGE.about,
  },
  {
    title: 'Jobs',
    icon: <Iconify icon="eva:briefcase-fill" />,
    path: PATH_PAGE.jobs,
  },
  {
    title: 'Contact',
    icon: <Iconify icon="eva:email-fill" />,
    path: PATH_PAGE.contact,
  },
];

export default navConfig;
