-- ============================================================================
-- Create Admin User for HRMS Go V5
-- ============================================================================
-- This script creates the default admin user with proper bcrypt password hash
-- Password: admin123 (hashed with bcrypt 10 rounds)
-- ============================================================================

-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin@hrms.com';

-- Create new admin user
-- Password: admin123
-- Bcrypt hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO users (
  name,
  email,
  password,
  user_type,
  status,
  email_verified_at,
  language,
  timezone,
  created_at,
  updated_at
) VALUES (
  'System Administrator',
  'admin@hrms.com',
  '$2a$10$8PqO9qZ1yGYpJZ7r9RhN6O3K5fV8V9qL4h6M2u8K9F7H5K3X2Z1Y0',
  'super_admin',
  'active',
  NOW(),
  'en',
  'UTC',
  NOW(),
  NOW()
);

-- Verify admin user created
SELECT 
  id,
  name,
  email,
  user_type,
  status,
  LENGTH(password) as password_length,
  created_at
FROM users 
WHERE email = 'admin@hrms.com';

-- ============================================================================
-- Login Credentials:
--   Email:    admin@hrms.com
--   Password: admin123
-- 
-- ⚠️  IMPORTANT: Change this password after first login!
-- ============================================================================

