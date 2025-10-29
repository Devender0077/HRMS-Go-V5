-- ============================================================================
-- HRMS Go V5 - Complete Database Schema
-- ============================================================================
-- This file contains CREATE TABLE statements for ALL 53+ tables
-- Run this FIRST before seeds.sql
-- Compatible with MySQL 5.7+ and 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS hrms_go_v5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hrms_go_v5;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- CORE TABLES - Users & Roles
-- ============================================================================

CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL UNIQUE,
  `description` text,
  `level` int DEFAULT 100,
  `is_system` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL UNIQUE,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permission_unique` (`role_id`,`permission_id`),
  KEY `role_id` (`role_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `user_type` enum('super_admin','admin','hr_manager','hr','manager','employee','accountant') DEFAULT 'employee',
  `role_id` bigint UNSIGNED DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `last_login` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_status` (`status`),
  KEY `fk_user_role` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ORGANIZATION STRUCTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `branches` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) UNIQUE,
  `address` text,
  `city` varchar(100),
  `state` varchar(100),
  `country` varchar(100),
  `postal_code` varchar(20),
  `phone` varchar(50),
  `email` varchar(255),
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `departments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) UNIQUE,
  `description` text,
  `head_id` bigint UNSIGNED DEFAULT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `designations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) UNIQUE,
  `description` text,
  `level` int DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EMPLOYEES TABLE - WITH ALL REGION FIELDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `employees` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `employee_id` varchar(50) NOT NULL UNIQUE,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `phone` varchar(50),
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `marital_status` enum('single','married','divorced','widowed') DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `address` text,
  `city` varchar(100),
  `state` varchar(100),
  `country` varchar(100),
  `postal_code` varchar(20),
  `branch_id` bigint UNSIGNED DEFAULT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `designation_id` bigint UNSIGNED DEFAULT NULL,
  `manager_id` bigint UNSIGNED DEFAULT NULL,
  `joining_date` date NOT NULL,
  `employment_type` enum('full_time','part_time','contract','intern') DEFAULT 'full_time',
  `basic_salary` decimal(15,2) DEFAULT 0.00,
  `shift` varchar(100) DEFAULT NULL,
  `attendance_policy` varchar(100) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT 'Bank Transfer',
  `status` enum('active','inactive','terminated') DEFAULT 'active',
  `termination_date` date DEFAULT NULL,
  `termination_reason` text,
  `profile_photo` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(200) DEFAULT NULL,
  `emergency_contact_phone` varchar(50) DEFAULT NULL,
  `emergency_contact_relation` varchar(100) DEFAULT NULL,
  -- Region-specific fields
  `region` enum('india','usa','other') DEFAULT 'india',
  `ssn` varchar(20) DEFAULT NULL COMMENT 'Social Security Number (USA)',
  `driver_license_number` varchar(50) DEFAULT NULL COMMENT 'Driver License Number (USA)',
  `driver_license_state` varchar(50) DEFAULT NULL COMMENT 'Driver License State (USA)',
  `driver_license_expiry` date DEFAULT NULL COMMENT 'Driver License Expiry Date (USA)',
  `w4_form_status` enum('pending','submitted','approved') DEFAULT NULL COMMENT 'W-4 Tax Form Status (USA)',
  `pan_number` varchar(20) DEFAULT NULL COMMENT 'PAN Number (India)',
  `aadhaar_number` varchar(20) DEFAULT NULL COMMENT 'Aadhaar Number (India)',
  `pf_number` varchar(50) DEFAULT NULL COMMENT 'Provident Fund Number (India)',
  `esi_number` varchar(50) DEFAULT NULL COMMENT 'ESI Number (India)',
  `uan_number` varchar(50) DEFAULT NULL COMMENT 'Universal Account Number (India)',
  -- Bank details
  `bank_name` varchar(200) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `routing_number` varchar(100) DEFAULT NULL,
  `swift_code` varchar(50) DEFAULT NULL,
  `bank_address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_id` (`employee_id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_department` (`department_id`),
  KEY `idx_branch` (`branch_id`),
  KEY `idx_region` (`region`),
  KEY `idx_ssn` (`ssn`),
  KEY `idx_pan` (`pan_number`),
  KEY `idx_aadhaar` (`aadhaar_number`),
  KEY `fk_user` (`user_id`),
  KEY `fk_branch` (`branch_id`),
  KEY `fk_department` (`department_id`),
  KEY `fk_designation` (`designation_id`),
  KEY `fk_manager` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_5` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- HOLIDAYS TABLE - WITH MULTI-REGION SUPPORT
-- ============================================================================

CREATE TABLE IF NOT EXISTS `holidays` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `type` enum('public','optional','company') DEFAULT 'public',
  `region` varchar(500) NOT NULL DEFAULT '["global"]' COMMENT 'JSON array of regions',
  `is_recurring` tinyint(1) DEFAULT 0 COMMENT 'If true, holiday repeats every year',
  `branch_id` bigint UNSIGNED DEFAULT NULL COMMENT 'If specified, holiday only applies to this branch',
  `department_id` bigint UNSIGNED DEFAULT NULL COMMENT 'If specified, holiday only applies to this department',
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `fk_branch` (`branch_id`),
  KEY `fk_department` (`department_id`),
  CONSTRAINT `holidays_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `holidays_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--============================================================================
-- ATTENDANCE & SHIFTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `shifts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `grace_period` int DEFAULT 15 COMMENT 'Grace period in minutes',
  `half_day_duration` int DEFAULT 4 COMMENT 'Half day duration in hours',
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendance_policies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `description` text,
  `requires_check_in` tinyint(1) DEFAULT 1,
  `requires_check_out` tinyint(1) DEFAULT 1,
  `allow_web_check_in` tinyint(1) DEFAULT 1,
  `allow_mobile_check_in` tinyint(1) DEFAULT 1,
  `geo_fencing_enabled` tinyint(1) DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `radius` int DEFAULT 100 COMMENT 'Radius in meters',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendances` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('present','absent','half_day','late','on_leave','holiday','week_off') DEFAULT 'present',
  `work_hours` decimal(5,2) DEFAULT 0.00,
  `overtime_hours` decimal(5,2) DEFAULT 0.00,
  `notes` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_date` (`employee_id`,`date`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendance_regularizations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `attendance_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `requested_check_in` time DEFAULT NULL,
  `requested_check_out` time DEFAULT NULL,
  `reason` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  KEY `fk_attendance` (`attendance_id`),
  CONSTRAINT `attendance_regularizations_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_regularizations_ibfk_2` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- LEAVE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS `leave_types` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `days_per_year` int DEFAULT 0,
  `carry_forward` tinyint(1) DEFAULT 0,
  `max_carry_forward` int DEFAULT 0,
  `encashable` tinyint(1) DEFAULT 0,
  `requires_approval` tinyint(1) DEFAULT 1,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `leave_type_id` bigint UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days` decimal(5,2) NOT NULL,
  `reason` text,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `fk_employee` (`employee_id`),
  KEY `fk_leave_type` (`leave_type_id`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leave_balances` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `leave_type_id` bigint UNSIGNED NOT NULL,
  `year` int NOT NULL,
  `allocated_days` decimal(5,2) DEFAULT 0.00,
  `used_days` decimal(5,2) DEFAULT 0.00,
  `pending_days` decimal(5,2) DEFAULT 0.00,
  `remaining_days` decimal(5,2) DEFAULT 0.00,
  `carry_forward_days` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_type_year` (`employee_id`,`leave_type_id`,`year`),
  KEY `fk_employee` (`employee_id`),
  KEY `fk_leave_type` (`leave_type_id`),
  CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leave_balances_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CALENDAR & EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `all_day` tinyint(1) DEFAULT 0,
  `event_type` varchar(50) DEFAULT 'Meeting',
  `location` varchar(255) DEFAULT NULL,
  `color` varchar(20) DEFAULT '#1890FF',
  `text_color` varchar(20) DEFAULT '#FFFFFF',
  `visibility` enum('everyone','team','private','hr_only','managers_only') DEFAULT 'everyone',
  `reminder` varchar(50) DEFAULT 'None',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PAYROLL & FINANCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `salary_components` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `type` enum('earning','deduction') NOT NULL,
  `calculation_type` enum('fixed','percentage') DEFAULT 'fixed',
  `value` decimal(15,2) DEFAULT 0.00,
  `is_taxable` tinyint(1) DEFAULT 1,
  `is_mandatory` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employee_salary_structure` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `component_id` bigint UNSIGNED NOT NULL,
  `value` decimal(15,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_employee` (`employee_id`),
  KEY `fk_component` (`component_id`),
  CONSTRAINT `employee_salary_structure_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employee_salary_structure_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `salary_components` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payrolls` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `basic_salary` decimal(15,2) DEFAULT 0.00,
  `gross_salary` decimal(15,2) DEFAULT 0.00,
  `total_deductions` decimal(15,2) DEFAULT 0.00,
  `net_salary` decimal(15,2) DEFAULT 0.00,
  `status` enum('draft','approved','paid') DEFAULT 'draft',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_month_year` (`employee_id`,`month`,`year`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `payrolls_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `expense_date` date NOT NULL,
  `description` text,
  `receipt_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected','reimbursed') DEFAULT 'pending',
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `income` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `income_type` varchar(100) DEFAULT NULL,
  `source` varchar(200) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `income_date` date NOT NULL,
  `description` text,
  `status` enum('pending','received') DEFAULT 'received',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_income_date` (`income_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contracts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `contract_type` enum('permanent','fixed_term','consultant','intern') DEFAULT 'permanent',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `salary` decimal(15,2) DEFAULT NULL,
  `terms` text,
  `status` enum('draft','active','expired','terminated') DEFAULT 'draft',
  `signed_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- RECRUITMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS `job_postings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `department_id` bigint UNSIGNED DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT 'full-time',
  `experience_required` varchar(50) DEFAULT NULL,
  `description` text,
  `requirements` text,
  `salary_range` varchar(100) DEFAULT NULL,
  `positions` int DEFAULT 1,
  `status` enum('draft','active','closed','cancelled') DEFAULT 'draft',
  `posted_date` date DEFAULT NULL,
  `closing_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_department` (`department_id`),
  CONSTRAINT `job_postings_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_posting_id` bigint UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `experience` int DEFAULT 0,
  `resume_path` varchar(255) DEFAULT NULL,
  `cover_letter` text,
  `status` enum('applied','screening','interview','offered','rejected','hired') DEFAULT 'applied',
  `applied_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_job_posting` (`job_posting_id`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PERFORMANCE & TRAINING
-- ============================================================================

CREATE TABLE IF NOT EXISTS `performance_goals` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` bigint UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `target_date` date DEFAULT NULL,
  `progress` int DEFAULT 0,
  `status` enum('not_started','in_progress','completed','cancelled') DEFAULT 'not_started',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `performance_goals_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `training_programs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `trainer` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ASSETS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `asset_categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `assets` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `category_id` bigint UNSIGNED DEFAULT NULL,
  `asset_code` varchar(100) UNIQUE,
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `purchase_cost` decimal(15,2) DEFAULT NULL,
  `warranty_end` date DEFAULT NULL,
  `status` enum('available','assigned','under_maintenance','retired') DEFAULT 'available',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `asset_assignments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `asset_id` bigint UNSIGNED NOT NULL,
  `employee_id` bigint UNSIGNED NOT NULL,
  `assigned_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('assigned','returned') DEFAULT 'assigned',
  `condition_on_assignment` varchar(200) DEFAULT NULL,
  `condition_on_return` varchar(200) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `fk_asset` (`asset_id`),
  KEY `fk_employee` (`employee_id`),
  CONSTRAINT `asset_assignments_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_assignments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `asset_maintenance` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `asset_id` bigint UNSIGNED NOT NULL,
  `maintenance_type` varchar(100) DEFAULT NULL,
  `maintenance_date` date NOT NULL,
  `cost` decimal(15,2) DEFAULT NULL,
  `vendor` varchar(200) DEFAULT NULL,
  `description` text,
  `next_maintenance_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_asset` (`asset_id`),
  CONSTRAINT `asset_maintenance_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `document_categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) UNIQUE,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PAYMENT METHODS & TAX SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tax_settings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `min_amount` decimal(15,2) DEFAULT 0.00,
  `max_amount` decimal(15,2) DEFAULT 0.00,
  `percentage` decimal(5,2) DEFAULT 0.00,
  `type` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- Summary:
-- - All core tables created
-- - Employees table with USA/India region fields
-- - Holidays table with multi-region VARCHAR(500) support
-- - All necessary foreign keys and indexes
-- - Ready for seeds.sql import
-- ============================================================================

