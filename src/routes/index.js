import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// guards
import RoutePermissionWrapper from '../guards/RoutePermissionWrapper';
// layouts
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  HRMSLoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralFilePage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralAnalyticsPage,
  // Dashboard: User
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  // Dashboard: Ecommerce
  EcommerceShopPage,
  EcommerceCheckoutPage,
  EcommerceProductListPage,
  EcommerceProductEditPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  // Dashboard: Blog
  BlogPostsPage,
  BlogPostPage,
  BlogNewPostPage,
  // Dashboard: FileManager
  FileManagerPage,
  // Dashboard: App
  ChatPage,
  MailPage,
  CalendarPage,
  KanbanPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  PricingPage,
  PaymentPage,
  ComingSoonPage,
  MaintenancePage,
  //
  ComponentsOverviewPage,
  FoundationColorsPage,
  FoundationTypographyPage,
  FoundationShadowsPage,
  FoundationGridPage,
  FoundationIconsPage,
  //
  MUIAccordionPage,
  MUIAlertPage,
  MUIAutocompletePage,
  MUIAvatarPage,
  MUIBadgePage,
  MUIBreadcrumbsPage,
  MUIButtonsPage,
  MUICheckboxPage,
  MUIChipPage,
  MUIDataGridPage,
  MUIDialogPage,
  MUIListPage,
  MUIMenuPage,
  MUIPaginationPage,
  MUIPickersPage,
  MUIPopoverPage,
  MUIProgressPage,
  MUIRadioButtonsPage,
  MUIRatingPage,
  MUISliderPage,
  MUIStepperPage,
  MUISwitchPage,
  MUITablePage,
  MUITabsPage,
  MUITextFieldPage,
  MUITimelinePage,
  MUITooltipPage,
  MUITransferListPage,
  MUITreesViewPage,
  //
  DemoAnimatePage,
  DemoCarouselsPage,
  DemoChartsPage,
  DemoCopyToClipboardPage,
  DemoEditorPage,
  DemoFormValidationPage,
  DemoImagePage,
  DemoLabelPage,
  DemoLightboxPage,
  DemoMapPage,
  DemoMegaMenuPage,
  DemoMultiLanguagePage,
  DemoNavigationBarPage,
  DemoOrganizationalChartPage,
  DemoScrollbarPage,
  DemoSnackbarPage,
  DemoTextMaxLinePage,
  DemoUploadPage,
  DemoMarkdownPage,
  // HRMS Pages
  HRMSDashboardPage,
  EmployeeListPage,
  EmployeeCreatePage,
  EmployeeDetailsPage,
  EmployeeEditPage,
  OrganizationChartPage,
  AttendanceClockPage,
  AttendanceRecordsPage,
  RegularizationsPage,
  AttendanceMusterPage,
  AttendanceCalendarPage,
  LeaveApplicationsPage,
  LeaveBalancesPage,
  LeaveApplyPage,
  SystemSetupPage,
  GeneralSettingsPage,
  GeneralSettingsDetailPage,
  LeaveBalanceAllocationPage,
  HolidaysPage,
  ConfigurationPage,
  EmployeeSalaryPage,
  PayrollProcessingPage,
  PayslipsPage,
  PayrollReportsPage,
  JobPostingsPage,
  ApplicationsPage,
  CandidatePipelinePage,
  InterviewsPage,
  OffersPage,
  GoalsPage,
  ReviewsPage,
  FeedbackPage,
  PerformanceDashboardPage,
  PerformanceReportsPage,
  TrainingProgramsPage,
  TrainingSessionsPage,
  EmployeeTrainingPage,
  TrainingReportsPage,
  DocumentLibraryPage,
  EmployeeDocumentsPage,
  ExpensesPage,
  IncomePage,
  FinanceReportsPage,
  ContractsListPage,
  AssetsListPage,
  AnnouncementsListPage,
  MessengerPage,
  ReportsDashboardPage,
  ProgramsPage,
  RolesPage,
  PermissionsPage,
  UsersPage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <HRMSLoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <HRMSLoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <RoutePermissionWrapper />,
          children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <HRMSDashboardPage /> },
        { path: 'ecommerce', element: <GeneralEcommercePage /> },
        { path: 'analytics', element: <GeneralAnalyticsPage /> },
        { path: 'banking', element: <GeneralBankingPage /> },
        { path: 'booking', element: <GeneralBookingPage /> },
        { path: 'file', element: <GeneralFilePage /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShopPage /> },
            { path: 'product/:name', element: <EcommerceProductDetailsPage /> },
            { path: 'list', element: <EcommerceProductListPage /> },
            { path: 'product/new', element: <EcommerceProductCreatePage /> },
            { path: 'product/:name/edit', element: <EcommerceProductEditPage /> },
            { path: 'checkout', element: <EcommerceCheckoutPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: ':name/edit', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceListPage /> },
            { path: ':id', element: <InvoiceDetailsPage /> },
            { path: ':id/edit', element: <InvoiceEditPage /> },
            { path: 'new', element: <InvoiceCreatePage /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
          ],
        },
        { path: 'files-manager', element: <FileManagerPage /> },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <MailPage /> },
            { path: 'label/:customLabel/:mailId', element: <MailPage /> },
            { path: ':systemLabel', element: <MailPage /> },
            { path: ':systemLabel/:mailId', element: <MailPage /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
            { path: 'new', element: <ChatPage /> },
            { path: ':conversationKey', element: <ChatPage /> },
          ],
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'kanban', element: <KanbanPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
        // HRMS Pages (Added to existing dashboard)
        {
          path: 'hr',
          children: [
            { element: <Navigate to="/dashboard/hr/employees" replace />, index: true },
            { path: 'employees', element: <EmployeeListPage /> },
            { path: 'employees/new', element: <EmployeeCreatePage /> },
            { path: 'employees/:id', element: <EmployeeDetailsPage /> },
            { path: 'employees/:id/edit', element: <EmployeeEditPage /> },
            { path: 'organization-chart', element: <OrganizationChartPage /> },
          ],
        },
        {
          path: 'attendance',
          children: [
            { element: <Navigate to="/dashboard/attendance/clock" replace />, index: true },
            { path: 'clock', element: <AttendanceClockPage /> },
            { path: 'records', element: <AttendanceRecordsPage /> },
            { path: 'regularizations', element: <RegularizationsPage /> },
            { path: 'muster', element: <AttendanceMusterPage /> },
            { path: 'calendar', element: <AttendanceCalendarPage /> },
          ],
        },
        {
          path: 'leaves',
          children: [
            { element: <Navigate to="/dashboard/leaves/applications" replace />, index: true },
            { path: 'applications', element: <LeaveApplicationsPage /> },
            { path: 'apply', element: <LeaveApplyPage /> },
            { path: 'balances', element: <LeaveBalancesPage /> },
          ],
        },
        {
          path: 'settings',
          children: [
            { element: <Navigate to="/dashboard/settings/system-setup" replace />, index: true },
            { path: 'system-setup', element: <SystemSetupPage /> },
            { path: 'general', element: <GeneralSettingsPage /> },
            { path: 'general/:categoryId', element: <GeneralSettingsDetailPage /> },
            { path: 'leave-balance-allocation', element: <LeaveBalanceAllocationPage /> },
            { path: 'holidays', element: <HolidaysPage /> },
            { path: 'configuration', element: <ConfigurationPage /> },
            { path: 'roles', element: <RolesPage /> },
            { path: 'permissions', element: <PermissionsPage /> },
            { path: 'users', element: <UsersPage /> },
          ],
        },
        {
          path: 'payroll',
          children: [
            { element: <Navigate to="/dashboard/payroll/salaries" replace />, index: true },
            { path: 'salaries', element: <EmployeeSalaryPage /> },
            { path: 'processing', element: <PayrollProcessingPage /> },
            { path: 'payslips', element: <PayslipsPage /> },
            { path: 'reports', element: <PayrollReportsPage /> },
          ],
        },
        {
          path: 'recruitment',
          children: [
            { element: <Navigate to="/dashboard/recruitment/jobs" replace />, index: true },
            { path: 'jobs', element: <JobPostingsPage /> },
            { path: 'applications', element: <ApplicationsPage /> },
            { path: 'pipeline', element: <CandidatePipelinePage /> },
            { path: 'interviews', element: <InterviewsPage /> },
            { path: 'offers', element: <OffersPage /> },
          ],
        },
        {
          path: 'performance',
          children: [
            { element: <Navigate to="/dashboard/performance/dashboard" replace />, index: true },
            { path: 'dashboard', element: <PerformanceDashboardPage /> },
            { path: 'goals', element: <GoalsPage /> },
            { path: 'reviews', element: <ReviewsPage /> },
            { path: 'feedback', element: <FeedbackPage /> },
            { path: 'reports', element: <PerformanceReportsPage /> },
          ],
        },
        {
          path: 'training',
          children: [
            { element: <Navigate to="/dashboard/training/programs" replace />, index: true },
            { path: 'programs', element: <TrainingProgramsPage /> },
            { path: 'sessions', element: <TrainingSessionsPage /> },
            { path: 'employee-training', element: <EmployeeTrainingPage /> },
            { path: 'reports', element: <TrainingReportsPage /> },
          ],
        },
        {
          path: 'documents',
          children: [
            { element: <Navigate to="/dashboard/documents/library" replace />, index: true },
            { path: 'library', element: <DocumentLibraryPage /> },
            { path: 'employee-documents', element: <EmployeeDocumentsPage /> },
          ],
        },
        {
          path: 'finance',
          children: [
            { element: <Navigate to="/dashboard/finance/expenses" replace />, index: true },
            { path: 'expenses', element: <ExpensesPage /> },
            { path: 'income', element: <IncomePage /> },
            { path: 'reports', element: <FinanceReportsPage /> },
          ],
        },
        { path: 'contracts', element: <ContractsListPage /> },
        { path: 'assets', element: <AssetsListPage /> },
        { path: 'announcements', element: <AnnouncementsListPage /> },
        { path: 'messenger', element: <MessengerPage /> },
        { path: 'reports', element: <ReportsDashboardPage /> },
          ], // End of RoutePermissionWrapper children
        }, // End of RoutePermissionWrapper
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <AboutPage /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <FaqsPage /> },
        // Demo Components
        {
          path: 'components',
          children: [
            { element: <ComponentsOverviewPage />, index: true },
            {
              path: 'foundation',
              children: [
                { element: <Navigate to="/components/foundation/colors" replace />, index: true },
                { path: 'colors', element: <FoundationColorsPage /> },
                { path: 'typography', element: <FoundationTypographyPage /> },
                { path: 'shadows', element: <FoundationShadowsPage /> },
                { path: 'grid', element: <FoundationGridPage /> },
                { path: 'icons', element: <FoundationIconsPage /> },
              ],
            },
            {
              path: 'mui',
              children: [
                { element: <Navigate to="/components/mui/accordion" replace />, index: true },
                { path: 'accordion', element: <MUIAccordionPage /> },
                { path: 'alert', element: <MUIAlertPage /> },
                { path: 'autocomplete', element: <MUIAutocompletePage /> },
                { path: 'avatar', element: <MUIAvatarPage /> },
                { path: 'badge', element: <MUIBadgePage /> },
                { path: 'breadcrumbs', element: <MUIBreadcrumbsPage /> },
                { path: 'buttons', element: <MUIButtonsPage /> },
                { path: 'checkbox', element: <MUICheckboxPage /> },
                { path: 'chip', element: <MUIChipPage /> },
                { path: 'data-grid', element: <MUIDataGridPage /> },
                { path: 'dialog', element: <MUIDialogPage /> },
                { path: 'list', element: <MUIListPage /> },
                { path: 'menu', element: <MUIMenuPage /> },
                { path: 'pagination', element: <MUIPaginationPage /> },
                { path: 'pickers', element: <MUIPickersPage /> },
                { path: 'popover', element: <MUIPopoverPage /> },
                { path: 'progress', element: <MUIProgressPage /> },
                { path: 'radio-button', element: <MUIRadioButtonsPage /> },
                { path: 'rating', element: <MUIRatingPage /> },
                { path: 'slider', element: <MUISliderPage /> },
                { path: 'stepper', element: <MUIStepperPage /> },
                { path: 'switch', element: <MUISwitchPage /> },
                { path: 'table', element: <MUITablePage /> },
                { path: 'tabs', element: <MUITabsPage /> },
                { path: 'textfield', element: <MUITextFieldPage /> },
                { path: 'timeline', element: <MUITimelinePage /> },
                { path: 'tooltip', element: <MUITooltipPage /> },
                { path: 'transfer-list', element: <MUITransferListPage /> },
                { path: 'tree-view', element: <MUITreesViewPage /> },
              ],
            },
            {
              path: 'extra',
              children: [
                { element: <Navigate to="/components/extra/animate" replace />, index: true },
                { path: 'animate', element: <DemoAnimatePage /> },
                { path: 'carousel', element: <DemoCarouselsPage /> },
                { path: 'chart', element: <DemoChartsPage /> },
                { path: 'copy-to-clipboard', element: <DemoCopyToClipboardPage /> },
                { path: 'editor', element: <DemoEditorPage /> },
                { path: 'form-validation', element: <DemoFormValidationPage /> },
                { path: 'image', element: <DemoImagePage /> },
                { path: 'label', element: <DemoLabelPage /> },
                { path: 'lightbox', element: <DemoLightboxPage /> },
                { path: 'map', element: <DemoMapPage /> },
                { path: 'mega-menu', element: <DemoMegaMenuPage /> },
                { path: 'multi-language', element: <DemoMultiLanguagePage /> },
                { path: 'navigation-bar', element: <DemoNavigationBarPage /> },
                { path: 'organization-chart', element: <DemoOrganizationalChartPage /> },
                { path: 'scroll', element: <DemoScrollbarPage /> },
                { path: 'snackbar', element: <DemoSnackbarPage /> },
                { path: 'text-max-line', element: <DemoTextMaxLinePage /> },
                { path: 'upload', element: <DemoUploadPage /> },
                { path: 'markdown', element: <DemoMarkdownPage /> },
              ],
            },
          ],
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: 'pricing', element: <PricingPage /> },
        { path: 'payment', element: <PaymentPage /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
