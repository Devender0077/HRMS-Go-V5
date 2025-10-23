// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  // HRMS Icons - Using unique icons for each module
  employees: icon('ic_user'),           // Employees
  attendance: icon('ic_booking'),       // Attendance (clock-like)
  leaves: icon('ic_calendar'),          // Leaves
  payroll: icon('ic_banking'),          // Payroll (money-related)
  recruitment: icon('ic_kanban'),       // Recruitment (pipeline/process)
  performance: icon('ic_analytics'),    // Performance (metrics/analytics)
  training: icon('ic_blog'),            // Training (learning/education)
  documents: icon('ic_folder'),         // Documents
  settings: icon('ic_label'),           // Settings (gear-like)
  reports: icon('ic_invoice'),          // Reports
  finance: icon('ic_banking'),          // Finance
  contracts: icon('ic_file'),           // Contracts
  assets: icon('ic_ecommerce'),         // Assets
  announcements: icon('ic_external'),   // Announcements
  messenger: icon('ic_chat'),           // Messenger
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
    ],
  },

  // HRMS - HUMAN RESOURCES
  // ----------------------------------------------------------------------
  {
    subheader: 'Human Resources',
    items: [
      // EMPLOYEES
      {
        title: 'Employees',
        path: PATH_DASHBOARD.hr.employees.root,
        icon: ICONS.employees,
        children: [
          { title: 'All Employees', path: '/dashboard/hr/employees' },
          { title: 'Add Employee', path: '/dashboard/hr/employees/new' },
          { title: 'Organization Chart', path: '/dashboard/hr/organization-chart' },
        ],
      },
      
      // ATTENDANCE
      {
        title: 'Attendance',
        path: PATH_DASHBOARD.attendance.root,
        icon: ICONS.attendance,
        children: [
          { title: 'Clock In/Out', path: '/dashboard/attendance/clock' },
          { title: 'Records', path: '/dashboard/attendance/records' },
          { title: 'Calendar Muster', path: '/dashboard/attendance/calendar' },
          { title: 'Muster Report', path: '/dashboard/attendance/muster' },
          { title: 'Regularizations', path: '/dashboard/attendance/regularizations' },
        ],
      },

      // LEAVES
      {
        title: 'Leaves',
        path: PATH_DASHBOARD.leaves.root,
        icon: ICONS.leaves,
        children: [
          { title: 'Applications', path: '/dashboard/leaves/applications' },
          { title: 'Apply Leave', path: '/dashboard/leaves/apply' },
          { title: 'Balances', path: '/dashboard/leaves/balances' },
        ],
      },

      // PAYROLL
      {
        title: 'Payroll',
        path: PATH_DASHBOARD.payroll.root,
        icon: ICONS.payroll,
        children: [
          { title: 'Employee Salary', path: '/dashboard/payroll/salaries' },
          { title: 'Process Payroll', path: '/dashboard/payroll/processing' },
          { title: 'Payslips', path: '/dashboard/payroll/payslips' },
          { title: 'Reports', path: '/dashboard/payroll/reports' },
        ],
      },

      // RECRUITMENT
      {
        title: 'Recruitment',
        path: PATH_DASHBOARD.recruitment.root,
        icon: ICONS.recruitment,
        children: [
          { title: 'Job Postings', path: '/dashboard/recruitment/jobs' },
          { title: 'Applications', path: '/dashboard/recruitment/applications' },
          { title: 'Candidate Pipeline', path: '/dashboard/recruitment/pipeline' },
          { title: 'Interviews', path: '/dashboard/recruitment/interviews' },
          { title: 'Offers', path: '/dashboard/recruitment/offers' },
        ],
      },

      // PERFORMANCE
      {
        title: 'Performance',
        path: PATH_DASHBOARD.performance.root,
        icon: ICONS.performance,
        children: [
          { title: 'Dashboard', path: '/dashboard/performance/dashboard' },
          { title: 'Goals & KPIs', path: '/dashboard/performance/goals' },
          { title: 'Reviews', path: '/dashboard/performance/reviews' },
          { title: '360° Feedback', path: '/dashboard/performance/feedback' },
          { title: 'Reports', path: '/dashboard/performance/reports' },
        ],
      },

      // TRAINING
      {
        title: 'Training',
        path: PATH_DASHBOARD.training.root,
        icon: ICONS.training,
        children: [
          { title: 'Programs', path: '/dashboard/training/programs' },
          { title: 'Sessions', path: '/dashboard/training/sessions' },
          { title: 'Employee Training', path: '/dashboard/training/employee-training' },
          { title: 'Reports', path: '/dashboard/training/reports' },
        ],
      },

      // DOCUMENTS
      {
        title: 'Documents',
        path: PATH_DASHBOARD.documents.root,
        icon: ICONS.documents,
        children: [
          { title: 'Library', path: '/dashboard/documents/library' },
          { title: 'Employee Documents', path: '/dashboard/documents/employee-documents' },
        ],
      },
    ],
  },

  // FINANCE & OPERATIONS
  // ----------------------------------------------------------------------
  {
    subheader: 'Finance & Operations',
    items: [
      // FINANCE
      {
        title: 'Finance',
        path: PATH_DASHBOARD.finance.root,
        icon: ICONS.finance,
        children: [
          { title: 'Expenses', path: '/dashboard/finance/expenses' },
          { title: 'Income', path: '/dashboard/finance/income' },
          { title: 'Reports', path: '/dashboard/finance/reports' },
        ],
      },

      // CONTRACTS
      {
        title: 'Contracts',
        path: PATH_DASHBOARD.contracts.root,
        icon: ICONS.contracts,
      },

      // ASSETS
      {
        title: 'Assets',
        path: PATH_DASHBOARD.assets.root,
        icon: ICONS.assets,
        children: [
          { title: 'All Assets', path: '/dashboard/assets/list' },
          { title: 'Add Asset', path: '/dashboard/assets/new' },
          { title: 'Categories', path: '/dashboard/assets/categories' },
          { title: 'Assignments', path: '/dashboard/assets/assignments' },
          { title: 'Maintenance', path: '/dashboard/assets/maintenance' },
        ],
      },
    ],
  },

  // COMMUNICATION
  // ----------------------------------------------------------------------
  {
    subheader: 'Communication',
    items: [
      {
        title: 'Announcements',
        path: PATH_DASHBOARD.announcements,
        icon: ICONS.announcements,
      },
      {
        title: 'Messenger',
        path: PATH_DASHBOARD.messenger,
        icon: ICONS.messenger,
      },
    ],
  },

  // REPORTS & ANALYTICS
  // ----------------------------------------------------------------------
  {
    subheader: 'Reports & Analytics',
    items: [
      {
        title: 'Reports Dashboard',
        path: PATH_DASHBOARD.reports,
        icon: ICONS.reports,
      },
    ],
  },

  // SETTINGS & ACCOUNT
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      {
        title: 'System Setup',
        path: PATH_DASHBOARD.settings.system,
        icon: ICONS.settings,
      },
      {
        title: 'General Settings',
        path: PATH_DASHBOARD.settings.general,
        icon: ICONS.settings,
      },
      {
        title: 'Roles & Permissions',
        path: PATH_DASHBOARD.settings.roles,
        icon: ICONS.user,
      },
      {
        title: 'Users Management',
        path: PATH_DASHBOARD.settings.users,
        icon: ICONS.user,
      },
      {
        title: 'My Account',
        path: PATH_DASHBOARD.user.account,
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfig;
