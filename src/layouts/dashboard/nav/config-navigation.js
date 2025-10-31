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
      { 
        title: 'Dashboard', 
        path: PATH_DASHBOARD.general.app, 
        icon: ICONS.dashboard,
        permission: 'dashboard.view'
      },
      { 
        title: 'Calendar', 
        path: PATH_DASHBOARD.calendar, 
        icon: ICONS.calendar,
        permission: 'calendar.view'
      },
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
        permission: ['employees.view'],
        children: [
          { title: 'All Employees', path: '/dashboard/hr/employees', permission: 'employees.view' },
          { title: 'Add Employee', path: '/dashboard/hr/employees/new', permission: 'employees.create' },
          { title: 'Organization Chart', path: '/dashboard/hr/organization-chart', permission: 'employees.view' },
        ],
      },
      
      // ATTENDANCE
      {
        title: 'Attendance',
        path: PATH_DASHBOARD.attendance.root,
        icon: ICONS.attendance,
        permission: ['attendance.view_all', 'attendance.view_own', 'attendance.clock'],
        children: [
          { title: 'Clock In/Out', path: '/dashboard/attendance/clock', permission: 'attendance.clock' },
          { title: 'Records', path: '/dashboard/attendance/records', permission: ['attendance.view_all', 'attendance.view_own'] },
          { title: 'Calendar Muster', path: '/dashboard/attendance/calendar', permission: ['attendance.view_all', 'attendance.manage'] },
          { title: 'Muster Report', path: '/dashboard/attendance/muster', permission: ['attendance.view_all', 'attendance.export'] },
          { title: 'Regularizations', path: '/dashboard/attendance/regularizations', permission: ['attendance.view_all', 'attendance.approve_regularization'] },
        ],
      },

      // LEAVES
      {
        title: 'Leaves',
        path: PATH_DASHBOARD.leaves.root,
        icon: ICONS.leaves,
        permission: ['leaves.view_all', 'leaves.view_own', 'leaves.apply'],
        children: [
          { title: 'Applications', path: '/dashboard/leaves/applications', permission: ['leaves.view_all', 'leaves.view_own'] },
          { title: 'Apply Leave', path: '/dashboard/leaves/apply', permission: 'leaves.apply' },
          { title: 'Balances', path: '/dashboard/leaves/balances', permission: ['leaves.view_all', 'leaves.view_own'] },
        ],
      },

      // PAYROLL
      {
        title: 'Payroll',
        path: PATH_DASHBOARD.payroll.root,
        icon: ICONS.payroll,
        permission: ['payroll.view_all', 'payroll.view_own'],
        children: [
          { title: 'Employee Salary', path: '/dashboard/payroll/salaries', permission: ['payroll.view_all', 'payroll.edit'] },
          { title: 'Process Payroll', path: '/dashboard/payroll/processing', permission: 'payroll.process' },
          { title: 'Payslips', path: '/dashboard/payroll/payslips', permission: ['payroll.view_all', 'payroll.view_own'] },
          { title: 'Reports', path: '/dashboard/payroll/reports', permission: ['payroll.view_all', 'payroll.export'] },
        ],
      },

      // RECRUITMENT
      {
        title: 'Recruitment',
        path: PATH_DASHBOARD.recruitment.root,
        icon: ICONS.recruitment,
        permission: ['recruitment.view_jobs', 'recruitment.view_applications'],
        children: [
          { title: 'Job Postings', path: '/dashboard/recruitment/jobs', permission: 'recruitment.view_jobs' },
          { title: 'Applications', path: '/dashboard/recruitment/applications', permission: 'recruitment.view_applications' },
          { title: 'Candidate Pipeline', path: '/dashboard/recruitment/pipeline', permission: 'recruitment.review_applications' },
          { title: 'Interviews', path: '/dashboard/recruitment/interviews', permission: 'recruitment.review_applications' },
          { title: 'Offers', path: '/dashboard/recruitment/offers', permission: 'recruitment.review_applications' },
        ],
      },

      // PERFORMANCE
      {
        title: 'Performance',
        path: PATH_DASHBOARD.performance.root,
        icon: ICONS.performance,
        permission: ['performance.view_all', 'performance.view_own'],
        children: [
          { title: 'Dashboard', path: '/dashboard/performance/dashboard', permission: ['performance.view_all', 'performance.view_own'] },
          { title: 'Goals & KPIs', path: '/dashboard/performance/goals', permission: ['performance.view_all', 'performance.view_own', 'performance.set_goals'] },
          { title: 'Reviews', path: '/dashboard/performance/reviews', permission: ['performance.view_all', 'performance.view_own'] },
          { title: '360° Feedback', path: '/dashboard/performance/feedback', permission: ['performance.view_all', 'performance.view_own'] },
          { title: 'Reports', path: '/dashboard/performance/reports', permission: ['performance.view_all', 'reports.view'] },
        ],
      },

      // TRAINING
      {
        title: 'Training',
        path: PATH_DASHBOARD.training.root,
        icon: ICONS.training,
        permission: 'training.view',
        children: [
          { title: 'Programs', path: '/dashboard/training/programs', permission: 'training.view' },
          { title: 'Sessions', path: '/dashboard/training/sessions', permission: 'training.view' },
          { title: 'Employee Training', path: '/dashboard/training/employee-training', permission: ['training.view', 'training.enroll'] },
          { title: 'Reports', path: '/dashboard/training/reports', permission: ['training.view', 'reports.view'] },
        ],
      },

      // DOCUMENTS
      {
        title: 'Documents',
        path: PATH_DASHBOARD.documents.root,
        icon: ICONS.documents,
        permission: ['documents.view_all', 'documents.view_own'],
        children: [
          { title: 'Library', path: '/dashboard/documents/library', permission: ['documents.view_all', 'documents.view_own'] },
          { title: 'Employee Documents', path: '/dashboard/documents/employee-documents', permission: ['documents.view_all', 'documents.view_own'] },
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
        permission: ['payroll.view_all'], // Using payroll permissions for finance
        children: [
          { title: 'Expenses', path: '/dashboard/finance/expenses', permission: 'payroll.view_all' },
          { title: 'Income', path: '/dashboard/finance/income', permission: 'payroll.view_all' },
          { title: 'Reports', path: '/dashboard/finance/reports', permission: ['payroll.view_all', 'reports.view'] },
        ],
      },

      // CONTRACTS (Digital Contract Management)
      {
        title: 'Contracts',
        path: PATH_DASHBOARD.contracts.root,
        icon: ICONS.contracts,
        permission: 'documents.view_all',
        children: [
          { title: 'Manage Agreements', path: '/dashboard/contracts/agreements', permission: 'documents.view_all' },
          { title: 'Templates', path: '/dashboard/contracts/templates', permission: 'documents.view_all' },
          { title: 'Send for E-Signature', path: '/dashboard/contracts/send', permission: 'documents.create' },
        ],
      },

      // ASSETS
      {
        title: 'Assets',
        path: PATH_DASHBOARD.assets.root,
        icon: ICONS.assets,
        permission: 'assets.view',
        children: [
          { title: 'All Assets', path: '/dashboard/assets/list', permission: 'assets.view' },
          { title: 'Add Asset', path: '/dashboard/assets/new', permission: 'assets.create' },
          { title: 'Categories', path: '/dashboard/assets/categories', permission: 'assets.manage_categories' },
          { title: 'Assignments', path: '/dashboard/assets/assignments', permission: ['assets.view', 'assets.assign'] },
          { title: 'Maintenance', path: '/dashboard/assets/maintenance', permission: ['assets.view', 'assets.edit'] },
        ],
      },
    ],
  },

  // EMPLOYEE SELF-SERVICE
  // ----------------------------------------------------------------------
  {
    subheader: 'Employee Self-Service',
    items: [
      {
        title: 'My Contracts',
        path: '/dashboard/contracts/my-contracts',
        icon: ICONS.contracts,
        permission: 'contracts.sign', // Employees who need to sign contracts
      },
      {
        title: 'Onboarding',
        path: '/dashboard/onboarding',
        icon: ICONS.file,
        permission: 'dashboard.view', // All employees can access onboarding
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
        permission: 'dashboard.view', // All users can view announcements
      },
      {
        title: 'Messenger',
        path: PATH_DASHBOARD.messenger,
        icon: ICONS.messenger,
        permission: 'dashboard.view', // All users can access messenger
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
        permission: 'reports.view',
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
        permission: 'settings.view_system',
      },
      {
        title: 'General Settings',
        path: PATH_DASHBOARD.settings.general,
        icon: ICONS.settings,
        permission: 'settings.view_general',
      },
      {
        title: 'Roles & Permissions',
        path: PATH_DASHBOARD.settings.roles,
        icon: ICONS.user,
        permission: 'roles.view',
      },
      {
        title: 'Users Management',
        path: PATH_DASHBOARD.settings.users,
        icon: ICONS.user,
        permission: 'users.view',
      },
      {
        title: 'Holidays',
        path: PATH_DASHBOARD.settings.holidays,
        icon: ICONS.calendar,
        permission: 'settings.view',
      },
      {
        title: 'My Account',
        path: PATH_DASHBOARD.user.account,
        icon: ICONS.user,
        // No permission required - everyone can access their own account
      },
    ],
  },
];

export default navConfig;
