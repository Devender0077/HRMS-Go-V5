-- ============================================================================
-- ADD CONTRACT NOTIFICATION TYPES
-- Adds contract-related notification types to the notifications table
-- Database: hrms_go_v5
-- ============================================================================

USE hrms_go_v5;

-- Modify the type column to include contract notification types
ALTER TABLE notifications 
MODIFY COLUMN type ENUM(
  'leave_request',
  'leave_approved',
  'leave_rejected',
  'leave_cancelled',
  'attendance_alert',
  'attendance_approved',
  'payroll_generated',
  'document_uploaded',
  'document_approved',
  'contract_sent',
  'contract_signed',
  'contract_declined',
  'contract_expiring',
  'contract_expired',
  'system_announcement',
  'task_assigned',
  'task_completed',
  'performance_review',
  'training_enrollment',
  'birthday_reminder',
  'work_anniversary'
) NOT NULL DEFAULT 'system_announcement';

SELECT '✅ Contract notification types added successfully!' as Status;

