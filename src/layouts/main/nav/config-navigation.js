// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
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
    title: 'Contact',
    icon: <Iconify icon="eva:email-fill" />,
    path: PATH_PAGE.contact,
  },
  {
    title: 'Documentation',
    icon: <Iconify icon="eva:book-open-fill" />,
    path: PATH_DOCS.root,
  },
];

export default navConfig;
