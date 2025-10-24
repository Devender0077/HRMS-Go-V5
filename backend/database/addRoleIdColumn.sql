-- Add role_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id BIGINT UNSIGNED NULL AFTER user_type;

-- Add foreign key constraint (if column was just added)
-- Note: This may fail if constraint already exists, that's OK
ALTER TABLE users ADD CONSTRAINT fk_users_role_id 
  FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE SET NULL;

-- Update existing users with roles based on user_type
UPDATE users u
INNER JOIN user_roles r ON (
  CASE 
    WHEN u.user_type = 'super_admin' THEN r.slug = 'super_admin'
    WHEN u.user_type = 'hr_manager' THEN r.slug = 'hr_manager'
    WHEN u.user_type = 'hr' THEN r.slug = 'hr'
    WHEN u.user_type = 'manager' THEN r.slug = 'manager'
    WHEN u.user_type = 'employee' THEN r.slug = 'employee'
    ELSE r.slug = 'employee'
  END
)
SET u.role_id = r.id
WHERE u.role_id IS NULL;

-- Verify
SELECT 
  u.id,
  u.email,
  u.user_type,
  r.name as role_name
FROM users u
LEFT JOIN user_roles r ON u.role_id = r.id
ORDER BY u.id;

