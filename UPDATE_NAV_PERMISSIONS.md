# Navigation Permissions Update Guide

## Quick Reference: Add These Permissions to Each Module

```javascript
// PAYROLL
{
  title: 'Payroll',
  permission: ['payroll.view_all', 'payroll.view_own'],
  children: [
    { title: 'Employee Salary', permission: ['payroll.view_all', 'payroll.edit'] },
    { title: 'Process Payroll', permission: 'payroll.process' },
    { title: 'Payslips', permission: ['payroll.view_all', 'payroll.view_own'] },
    { title: 'Reports', permission: ['payroll.view_all', 'payroll.export'] },
  ],
}

// RECRUITMENT
{
  title: 'Recruitment',
  permission: ['recruitment.view_jobs', 'recruitment.view_applications'],
  children: [
    { title: 'Job Postings', permission: 'recruitment.view_jobs' },
    { title: 'Applications', permission: 'recruitment.view_applications' },
    { title: 'Candidate Pipeline', permission: 'recruitment.review_applications' },
    { title: 'Interviews', permission: 'recruitment.review_applications' },
    { title: 'Offers', permission: 'recruitment.review_applications' },
  ],
}

// PERFORMANCE
{
  title: 'Performance',
  permission: ['performance.view_all', 'performance.view_own'],
  children: [
    { title: 'Dashboard', permission: ['performance.view_all', 'performance.view_own'] },
    { title: 'Goals & KPIs', permission: ['performance.view_all', 'performance.view_own', 'performance.set_goals'] },
    { title: 'Reviews', permission: ['performance.view_all', 'performance.view_own'] },
    { title: '360° Feedback', permission: ['performance.view_all', 'performance.view_own'] },
    { title: 'Reports', permission: ['performance.view_all', 'reports.view'] },
  ],
}

// TRAINING
{
  title: 'Training',
  permission: 'training.view',
  children: [
    { title: 'Programs', permission: 'training.view' },
    { title: 'Sessions', permission: 'training.view' },
    { title: 'Employee Training', permission: ['training.view', 'training.enroll'] },
    { title: 'Reports', permission: ['training.view', 'reports.view'] },
  ],
}

// DOCUMENTS
{
  title: 'Documents',
  permission: ['documents.view_all', 'documents.view_own'],
  children: [
    { title: 'Library', permission: ['documents.view_all', 'documents.view_own'] },
    { title: 'Employee Documents', permission: ['documents.view_all', 'documents.view_own'] },
  ],
}

// ASSETS
{
  title: 'Assets',
  permission: 'assets.view',
  children: [
    { title: 'All Assets', permission: 'assets.view' },
    { title: 'Add Asset', permission: 'assets.create' },
    { title: 'Categories', permission: 'assets.manage_categories' },
    { title: 'Assignments', permission: ['assets.view', 'assets.assign'] },
    { title: 'Maintenance', permission: ['assets.view', 'assets.edit'] },
  ],
}

// REPORTS
{
  title: 'Reports Dashboard',
  permission: 'reports.view',
}

// SETTINGS
{
  title: 'System Setup',
  permission: 'settings.view_system',
}
{
  title: 'General Settings',
  permission: 'settings.view_general',
}
{
  title: 'Roles & Permissions',
  permission: 'roles.view',
}
{
  title: 'Users Management',
  permission: 'users.view',
}
```

## How Navigation Filtering Works

1. **Parent Menu Item:** Shows if user has ANY of the permissions listed
2. **Child Menu Item:** Shows only if user has that specific permission
3. **Super Admin:** Always sees everything
4. **Employee:** Only sees items they have permission for

## Example for Different Roles:

### Super Admin (sees everything):
- All menu items visible

### HR Manager (sees most things):
- Dashboard ✅
- Employees ✅
- Attendance ✅ (all sub-items except personal clock)
- Leaves ✅ (can view all, approve)
- Payroll ✅
- etc.

### Employee (sees limited):
- Dashboard ✅
- Attendance → Clock In/Out only ✅
- Leaves → Apply Leave, View Own ✅
- Payroll → View Own Payslip ✅
- Documents → View Own ✅
- Calendar ✅

### Manager (custom):
- Can be configured via Roles page
- Typically: team attendance, leave approvals, reports

