// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
  },
  
  // HRMS - Dashboard
  hrms: {
    root: path(ROOTS_DASHBOARD, ''),
    dashboard: path(ROOTS_DASHBOARD, '/dashboard'),
  },

  // HRMS - Staff Management
  staff: {
    root: path(ROOTS_DASHBOARD, '/staff'),
    users: {
      root: path(ROOTS_DASHBOARD, '/staff/users'),
      list: path(ROOTS_DASHBOARD, '/staff/users/list'),
      new: path(ROOTS_DASHBOARD, '/staff/users/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/staff/users/${id}/edit`),
      view: (id) => path(ROOTS_DASHBOARD, `/staff/users/${id}`),
    },
    roles: {
      root: path(ROOTS_DASHBOARD, '/staff/roles'),
      list: path(ROOTS_DASHBOARD, '/staff/roles/list'),
      new: path(ROOTS_DASHBOARD, '/staff/roles/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/staff/roles/${id}/edit`),
    },
    permissions: path(ROOTS_DASHBOARD, '/staff/permissions'),
  },

  // HRMS - HR Management
  hr: {
    root: path(ROOTS_DASHBOARD, '/hr'),
    employees: {
      root: path(ROOTS_DASHBOARD, '/hr/employees'),
      list: path(ROOTS_DASHBOARD, '/hr/employees'),
      new: path(ROOTS_DASHBOARD, '/hr/employees/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/hr/employees/${id}/edit`),
      view: (id) => path(ROOTS_DASHBOARD, `/hr/employees/${id}`),
    },
    departments: {
      root: path(ROOTS_DASHBOARD, '/hr/departments'),
      list: path(ROOTS_DASHBOARD, '/hr/departments'),
      new: path(ROOTS_DASHBOARD, '/hr/departments/new'),
    },
    branches: {
      root: path(ROOTS_DASHBOARD, '/hr/branches'),
      list: path(ROOTS_DASHBOARD, '/hr/branches'),
      new: path(ROOTS_DASHBOARD, '/hr/branches/new'),
    },
    designations: {
      root: path(ROOTS_DASHBOARD, '/hr/designations'),
      list: path(ROOTS_DASHBOARD, '/hr/designations'),
      new: path(ROOTS_DASHBOARD, '/hr/designations/new'),
    },
    awards: path(ROOTS_DASHBOARD, '/hr/awards'),
    promotions: path(ROOTS_DASHBOARD, '/hr/promotions'),
    transfers: path(ROOTS_DASHBOARD, '/hr/transfers'),
    warnings: path(ROOTS_DASHBOARD, '/hr/warnings'),
    resignations: path(ROOTS_DASHBOARD, '/hr/resignations'),
    terminations: path(ROOTS_DASHBOARD, '/hr/terminations'),
    trips: path(ROOTS_DASHBOARD, '/hr/trips'),
    complaints: path(ROOTS_DASHBOARD, '/hr/complaints'),
    holidays: path(ROOTS_DASHBOARD, '/hr/holidays'),
    announcements: path(ROOTS_DASHBOARD, '/hr/announcements'),
    assets: {
      root: path(ROOTS_DASHBOARD, '/hr/assets'),
      types: path(ROOTS_DASHBOARD, '/hr/assets/types'),
      list: path(ROOTS_DASHBOARD, '/hr/assets/list'),
      new: path(ROOTS_DASHBOARD, '/hr/assets/new'),
      view: (id) => path(ROOTS_DASHBOARD, `/hr/assets/${id}`),
    },
    training: {
      root: path(ROOTS_DASHBOARD, '/hr/training'),
      types: path(ROOTS_DASHBOARD, '/hr/training/types'),
      programs: path(ROOTS_DASHBOARD, '/hr/training/programs'),
      sessions: path(ROOTS_DASHBOARD, '/hr/training/sessions'),
      employees: path(ROOTS_DASHBOARD, '/hr/training/employees'),
    },
    performance: {
      root: path(ROOTS_DASHBOARD, '/hr/performance'),
      indicators: path(ROOTS_DASHBOARD, '/hr/performance/indicators'),
      goals: path(ROOTS_DASHBOARD, '/hr/performance/goals'),
      reviews: path(ROOTS_DASHBOARD, '/hr/performance/reviews'),
      cycles: path(ROOTS_DASHBOARD, '/hr/performance/cycles'),
    },
  },

  // HRMS - Recruitment
  recruitment: {
    root: path(ROOTS_DASHBOARD, '/recruitment'),
    jobs: {
      root: path(ROOTS_DASHBOARD, '/recruitment/jobs'),
      categories: path(ROOTS_DASHBOARD, '/recruitment/jobs/categories'),
      types: path(ROOTS_DASHBOARD, '/recruitment/jobs/types'),
      locations: path(ROOTS_DASHBOARD, '/recruitment/jobs/locations'),
      requisitions: path(ROOTS_DASHBOARD, '/recruitment/jobs/requisitions'),
      postings: {
        root: path(ROOTS_DASHBOARD, '/recruitment/jobs/postings'),
        list: path(ROOTS_DASHBOARD, '/recruitment/jobs/postings/list'),
        new: path(ROOTS_DASHBOARD, '/recruitment/jobs/postings/new'),
        edit: (id) => path(ROOTS_DASHBOARD, `/recruitment/jobs/postings/${id}/edit`),
        view: (id) => path(ROOTS_DASHBOARD, `/recruitment/jobs/postings/${id}`),
      },
    },
    candidates: {
      root: path(ROOTS_DASHBOARD, '/recruitment/candidates'),
      list: path(ROOTS_DASHBOARD, '/recruitment/candidates/list'),
      new: path(ROOTS_DASHBOARD, '/recruitment/candidates/new'),
      view: (id) => path(ROOTS_DASHBOARD, `/recruitment/candidates/${id}`),
      sources: path(ROOTS_DASHBOARD, '/recruitment/candidates/sources'),
      assessments: path(ROOTS_DASHBOARD, '/recruitment/candidates/assessments'),
    },
    interviews: {
      root: path(ROOTS_DASHBOARD, '/recruitment/interviews'),
      types: path(ROOTS_DASHBOARD, '/recruitment/interviews/types'),
      rounds: path(ROOTS_DASHBOARD, '/recruitment/interviews/rounds'),
      schedule: path(ROOTS_DASHBOARD, '/recruitment/interviews/schedule'),
      feedback: path(ROOTS_DASHBOARD, '/recruitment/interviews/feedback'),
    },
    onboarding: {
      root: path(ROOTS_DASHBOARD, '/recruitment/onboarding'),
      offers: path(ROOTS_DASHBOARD, '/recruitment/onboarding/offers'),
      templates: path(ROOTS_DASHBOARD, '/recruitment/onboarding/templates'),
      checklists: path(ROOTS_DASHBOARD, '/recruitment/onboarding/checklists'),
      process: path(ROOTS_DASHBOARD, '/recruitment/onboarding/process'),
    },
  },

  // HRMS - Performance
  performance: {
    root: path(ROOTS_DASHBOARD, '/performance'),
    dashboard: path(ROOTS_DASHBOARD, '/performance/dashboard'),
    goals: path(ROOTS_DASHBOARD, '/performance/goals'),
    reviews: path(ROOTS_DASHBOARD, '/performance/reviews'),
    feedback: path(ROOTS_DASHBOARD, '/performance/feedback'),
    reports: path(ROOTS_DASHBOARD, '/performance/reports'),
  },

  // HRMS - Training
  training: {
    root: path(ROOTS_DASHBOARD, '/training'),
    programs: path(ROOTS_DASHBOARD, '/training/programs'),
    sessions: path(ROOTS_DASHBOARD, '/training/sessions'),
    employeeTraining: path(ROOTS_DASHBOARD, '/training/employee-training'),
    reports: path(ROOTS_DASHBOARD, '/training/reports'),
  },

  // HRMS - Contracts
  contracts: {
    root: path(ROOTS_DASHBOARD, '/contracts'),
    types: path(ROOTS_DASHBOARD, '/contracts/types'),
    list: path(ROOTS_DASHBOARD, '/contracts/list'),
    new: path(ROOTS_DASHBOARD, '/contracts/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/contracts/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/contracts/${id}`),
    renewals: path(ROOTS_DASHBOARD, '/contracts/renewals'),
    templates: path(ROOTS_DASHBOARD, '/contracts/templates'),
  },

  // HRMS - Documents
  documents: {
    root: path(ROOTS_DASHBOARD, '/documents'),
    categories: path(ROOTS_DASHBOARD, '/documents/categories'),
    list: path(ROOTS_DASHBOARD, '/documents/list'),
    upload: path(ROOTS_DASHBOARD, '/documents/upload'),
    acknowledgments: path(ROOTS_DASHBOARD, '/documents/acknowledgments'),
    templates: path(ROOTS_DASHBOARD, '/documents/templates'),
  },

  // HRMS - Meetings
  meetings: {
    root: path(ROOTS_DASHBOARD, '/meetings'),
    types: path(ROOTS_DASHBOARD, '/meetings/types'),
    rooms: path(ROOTS_DASHBOARD, '/meetings/rooms'),
    list: path(ROOTS_DASHBOARD, '/meetings/list'),
    new: path(ROOTS_DASHBOARD, '/meetings/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/meetings/${id}`),
    minutes: path(ROOTS_DASHBOARD, '/meetings/minutes'),
    actions: path(ROOTS_DASHBOARD, '/meetings/actions'),
  },

  // HRMS - Leave Management
  leaves: {
    root: path(ROOTS_DASHBOARD, '/leaves'),
    types: path(ROOTS_DASHBOARD, '/leaves/types'),
    policies: path(ROOTS_DASHBOARD, '/leaves/policies'),
    applications: {
      root: path(ROOTS_DASHBOARD, '/leaves/applications'),
      list: path(ROOTS_DASHBOARD, '/leaves/applications'),
      new: path(ROOTS_DASHBOARD, '/leaves/apply'),
      pending: path(ROOTS_DASHBOARD, '/leaves/applications?status=pending'),
      approved: path(ROOTS_DASHBOARD, '/leaves/applications?status=approved'),
    },
    balances: path(ROOTS_DASHBOARD, '/leaves/balances'),
  },

  // HRMS - Attendance
  attendance: {
    root: path(ROOTS_DASHBOARD, '/attendance'),
    shifts: path(ROOTS_DASHBOARD, '/attendance/shifts'),
    policies: path(ROOTS_DASHBOARD, '/attendance/policies'),
    records: path(ROOTS_DASHBOARD, '/attendance/records'),
    regularizations: path(ROOTS_DASHBOARD, '/attendance/regularizations'),
    muster: path(ROOTS_DASHBOARD, '/attendance/muster'),
    calendar: path(ROOTS_DASHBOARD, '/attendance/calendar'),
    clockInOut: path(ROOTS_DASHBOARD, '/attendance/clock'),
  },

  // HRMS - Time Tracking
  timeTracking: {
    root: path(ROOTS_DASHBOARD, '/time-tracking'),
    entries: path(ROOTS_DASHBOARD, '/time-tracking/entries'),
    reports: path(ROOTS_DASHBOARD, '/time-tracking/reports'),
  },

  // HRMS - Payroll
  payroll: {
    root: path(ROOTS_DASHBOARD, '/payroll'),
    components: path(ROOTS_DASHBOARD, '/payroll/components'),
    salaries: path(ROOTS_DASHBOARD, '/payroll/salaries'),
    processing: path(ROOTS_DASHBOARD, '/payroll/processing'),
    payslips: path(ROOTS_DASHBOARD, '/payroll/payslips'),
    reports: path(ROOTS_DASHBOARD, '/payroll/reports'),
    runs: {
      root: path(ROOTS_DASHBOARD, '/payroll/runs'),
      list: path(ROOTS_DASHBOARD, '/payroll/runs/list'),
      new: path(ROOTS_DASHBOARD, '/payroll/runs/new'),
      view: (id) => path(ROOTS_DASHBOARD, `/payroll/runs/${id}`),
    },
  },

  // HRMS - Media Library
  media: {
    root: path(ROOTS_DASHBOARD, '/media'),
    library: path(ROOTS_DASHBOARD, '/media/library'),
    directories: path(ROOTS_DASHBOARD, '/media/directories'),
  },

  // HRMS - Assets Management
  assets: {
    root: path(ROOTS_DASHBOARD, '/assets'),
    list: path(ROOTS_DASHBOARD, '/assets/list'),
    new: path(ROOTS_DASHBOARD, '/assets/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/assets/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/assets/${id}`),
    categories: path(ROOTS_DASHBOARD, '/assets/categories'),
    assignments: {
      root: path(ROOTS_DASHBOARD, '/assets/assignments'),
      list: path(ROOTS_DASHBOARD, '/assets/assignments'),
      new: path(ROOTS_DASHBOARD, '/assets/assignments/new'),
    },
    maintenance: {
      root: path(ROOTS_DASHBOARD, '/assets/maintenance'),
      list: path(ROOTS_DASHBOARD, '/assets/maintenance'),
      new: path(ROOTS_DASHBOARD, '/assets/maintenance/new'),
      upcoming: path(ROOTS_DASHBOARD, '/assets/maintenance/upcoming'),
    },
  },

  // HRMS - Reports & Analytics
  reports: path(ROOTS_DASHBOARD, '/reports'),

  // HRMS - Announcements
  announcements: path(ROOTS_DASHBOARD, '/announcements'),

  // HRMS - Messenger
  messenger: path(ROOTS_DASHBOARD, '/messenger'),

  // HRMS - Settings
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
    general: path(ROOTS_DASHBOARD, '/settings/general'),
    system: path(ROOTS_DASHBOARD, '/settings/system-setup'),
    roles: path(ROOTS_DASHBOARD, '/settings/roles'),
    permissions: path(ROOTS_DASHBOARD, '/settings/permissions'),
    users: path(ROOTS_DASHBOARD, '/settings/users'),
    company: path(ROOTS_DASHBOARD, '/settings/company'),
    branding: path(ROOTS_DASHBOARD, '/settings/branding'),
    email: path(ROOTS_DASHBOARD, '/settings/email'),
    storage: path(ROOTS_DASHBOARD, '/settings/storage'),
    security: path(ROOTS_DASHBOARD, '/settings/security'),
    integrations: path(ROOTS_DASHBOARD, '/settings/integrations'),
    subscription: path(ROOTS_DASHBOARD, '/settings/subscription'),
  },

  // HRMS - Landing Page
  landing: {
    root: path(ROOTS_DASHBOARD, '/landing'),
    sections: path(ROOTS_DASHBOARD, '/landing/sections'),
    pages: path(ROOTS_DASHBOARD, '/landing/pages'),
    seo: path(ROOTS_DASHBOARD, '/landing/seo'),
  },

  // Original sections
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },

  // Finance
  finance: {
    root: path(ROOTS_DASHBOARD, '/finance'),
    expenses: path(ROOTS_DASHBOARD, '/finance/expenses'),
    income: path(ROOTS_DASHBOARD, '/finance/income'),
    reports: path(ROOTS_DASHBOARD, '/finance/reports'),
  },

  // Assets
  assets: {
    root: path(ROOTS_DASHBOARD, '/assets'),
  },

  // Announcements
  announcements: path(ROOTS_DASHBOARD, '/announcements'),

  // Messenger
  messenger: path(ROOTS_DASHBOARD, '/messenger'),
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
