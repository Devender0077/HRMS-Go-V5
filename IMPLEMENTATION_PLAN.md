# 🚀 HRMS Feature Implementation Plan

## Overview
This document outlines the implementation plan for 8 requested features to enhance the HRMS system.

---

## ✅ Phase 1: Quick Wins (30-45 minutes)

### 1. Font Size & Font Family Selection
**Status:** In Progress  
**Files to Modify:**
- `src/components/settings/config-setting.js` - Add font defaults
- `src/components/settings/SettingsContext.js` - Add font handlers
- `src/components/settings/drawer/FontOptions.js` - NEW: Font selector component
- `src/components/settings/drawer/SettingsDrawer.js` - Add font options
- `src/theme/typography.js` - Apply font settings

**Implementation:**
```javascript
// Add to defaultSettings
themeFontSize: 'medium', // small, medium, large
themeFontFamily: 'Roboto', // Roboto, Inter, Poppins, Public Sans
```

**Font Sizes:**
- Small: 0.875rem base
- Medium: 1rem base (default)
- Large: 1.125rem base

**Font Families:**
- Roboto (default)
- Inter
- Poppins
- Public Sans

---

### 2. Show Settings Button Only for Admin/Super Admin
**Status:** Pending  
**Files to Modify:**
- `src/components/settings/drawer/ToggleButton.js` - Add role check
- `src/components/settings/ThemeSettings.js` - Conditional render

**Implementation:**
```javascript
// Check user role
const user = useSelector(selectUser);
const isAdmin = ['super_admin', 'hr_manager'].includes(user?.userType);

// Conditional render
{isAdmin && <SettingsDrawer />}
```

---

### 3. Fix Flag Images
**Status:** Pending  
**Files to Check:**
- `src/layouts/dashboard/header/LanguagePopover.js`
- `public/assets/icons/flags/` directory

**Issue:** Flag icons not loading properly  
**Solution:** Verify flag image paths and formats

---

## ⏳ Phase 2: Medium Priority (1-2 hours)

### 4. Fix Stretch Section (All Pages)
**Status:** Pending  
**Issue:** `themeStretch` not working across all pages  
**Files to Check:**
- All page components in `src/pages/`
- Container components with `maxWidth` prop

**Implementation:**
- Ensure all pages use `useSettingsContext()`
- Apply `themeStretch` to Container components
- Test on pages: Dashboard, Employees, Attendance, etc.

**Pattern to apply:**
```javascript
const { themeStretch } = useSettingsContext();

<Container maxWidth={themeStretch ? false : 'xl'}>
  {/* Page content */}
</Container>
```

---

### 5. Fix Account Page
**Status:** Pending  
**Current Issues:** TBD (need to check what's broken)  
**Files:**
- `src/pages/account/` - Account pages
- Check user data display
- Check form submissions
- Check role-based visibility

---

### 6. Fix Profile Pages Based on Roles
**Status:** Pending  
**Requirements:**
- Employee: Can only edit own profile
- Manager: Can view team profiles (read-only)
- HR: Can view/edit all profiles
- Super Admin: Full access

**Files:**
- `src/pages/profile/` or `src/pages/employees/`
- Add permission checks
- Conditional form fields
- Role-based data filtering

---

## 🔄 Phase 3: Complex Features (2-3 hours)

### 7. Top Nav - Real Notifications & Contacts
**Status:** Pending  
**Current State:** Mock data  
**Required Changes:**

#### Notifications
- Create backend API: `/api/notifications`
- Database table: `notifications`
- Features:
  - Mark as read
  - Real-time count
  - Pagination
  - Filter by type

#### Contacts
- Create backend API: `/api/contacts`
- Database table: `contacts` or use `employees`
- Features:
  - Search employees
  - Filter by department
  - Online status
  - Direct messaging link

**Files to Modify:**
- `backend/models/Notification.js` - NEW
- `backend/controllers/notification.controller.js` - NEW
- `backend/routes/notification.routes.js` - NEW
- `src/layouts/dashboard/header/NotificationsPopover.js`
- `src/layouts/dashboard/header/ContactsPopover.js`
- `src/services/notificationService.js` - NEW

---

### 8. Translation Support
**Status:** Pending  
**Current State:** i18n configured but not fully utilized  
**Implementation:**

#### Setup
- Languages: English (default), Arabic, Spanish, French
- Library: Already using `react-i18next`

#### Tasks
1. Create translation files:
   - `public/locales/en/translation.json`
   - `public/locales/ar/translation.json`
   - `public/locales/es/translation.json`
   - `public/locales/fr/translation.json`

2. Translate key areas:
   - Navigation menus
   - Dashboard headings
   - Form labels
   - Button text
   - Error messages

3. Add language selector:
   - Top nav dropdown
   - Persist in localStorage
   - RTL support for Arabic

**Files to Modify:**
- `src/locales/` - All translation files
- `src/layouts/dashboard/header/LanguagePopover.js`
- All page components - Wrap text with `t()` function

**Example:**
```javascript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<Typography>{t('dashboard.welcome')}</Typography>
```

---

## 📊 Implementation Order

### Day 1 (2-3 hours)
✅ Font Settings  
✅ Settings Visibility  
✅ Flag Images Fix  
⏳ Stretch Fix  

### Day 2 (2-3 hours)
⏳ Account Page Fix  
⏳ Profile Pages (Role-based)  

### Day 3 (3-4 hours)
⏳ Notifications Backend + Frontend  
⏳ Contacts Backend + Frontend  

### Day 4 (2-3 hours)
⏳ Translation Setup  
⏳ Key Area Translation  
⏳ Testing & Refinement  

---

## 🧪 Testing Checklist

### After Each Feature:
- [ ] Test with all 5 roles (Employee, Manager, HR, HR Manager, Super Admin)
- [ ] Test on different screen sizes
- [ ] Test dark/light mode
- [ ] Test RTL/LTR direction
- [ ] Check console for errors
- [ ] Verify database changes

### Final Integration Test:
- [ ] All features work together
- [ ] No performance degradation
- [ ] Clean console (no warnings)
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation)

---

## 📝 Notes

- All changes will be committed incrementally
- Each feature will have its own commit
- Test accounts ready for all roles
- Database backups before major changes
- Documentation updated as we go

---

## 🎯 Success Criteria

1. ✅ Font settings work and persist
2. ✅ Settings only visible to admins
3. ✅ All flags display correctly
4. ✅ Stretch works on all pages
5. ✅ Account page fully functional
6. ✅ Profile access based on role
7. ✅ Real notification data
8. ✅ Multi-language support

---

**Last Updated:** October 25, 2025  
**Status:** Phase 1 - Starting Implementation

