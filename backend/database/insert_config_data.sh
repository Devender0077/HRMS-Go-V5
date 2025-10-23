#!/bin/bash

echo "🔧 Inserting Configuration Data into HRMS Go V5..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Function to run SQL
run_sql() {
    docker exec hrms_mysql mysql -uroot -proot hrms_go_v5 -e "$1" 2>/dev/null
}

echo "📊 Inserting configuration data..."

# Job Types
run_sql "INSERT IGNORE INTO job_types (name, description, status, created_at, updated_at) VALUES ('Full Time', 'Full-time employment', 'active', NOW(), NOW()), ('Part Time', 'Part-time employment', 'active', NOW(), NOW()), ('Contract', 'Contract-based', 'active', NOW(), NOW()), ('Intern', 'Internship', 'active', NOW(), NOW());"
echo "✓ Job Types"

# Hiring Stages
run_sql "INSERT IGNORE INTO hiring_stages (name, description, status, created_at, updated_at) VALUES ('Application Received', 'Initial stage', 'active', NOW(), NOW()), ('Resume Screening', 'Review stage', 'active', NOW(), NOW()), ('Technical Interview', 'Technical assessment', 'active', NOW(), NOW()), ('HR Interview', 'HR round', 'active', NOW(), NOW()), ('Final Interview', 'Final decision', 'active', NOW(), NOW()), ('Offer Extended', 'Offer sent', 'active', NOW(), NOW());"
echo "✓ Hiring Stages"

# KPI Indicators  
run_sql "INSERT IGNORE INTO kpi_indicators (name, description, status, created_at, updated_at) VALUES ('Productivity', 'Work output', 'active', NOW(), NOW()), ('Quality', 'Work quality', 'active', NOW(), NOW()), ('Attendance', 'Attendance record', 'active', NOW(), NOW()), ('Team Collaboration', 'Teamwork', 'active', NOW(), NOW());"
echo "✓ KPI Indicators"

# Review Cycles
run_sql "INSERT IGNORE INTO review_cycles (name, description, status, created_at, updated_at) VALUES ('Quarterly', 'Every 3 months', 'active', NOW(), NOW()), ('Semi-Annual', 'Every 6 months', 'active', NOW(), NOW()), ('Annual', 'Once per year', 'active', NOW(), NOW());"
echo "✓ Review Cycles"

# Goal Categories
run_sql "INSERT IGNORE INTO goal_categories (name, description, status, created_at, updated_at) VALUES ('Project Goals', 'Project targets', 'active', NOW(), NOW()), ('Learning', 'Skill development', 'active', NOW(), NOW()), ('KPI Targets', 'Performance metrics', 'active', NOW(), NOW());"
echo "✓ Goal Categories"

# Training Types
run_sql "INSERT IGNORE INTO training_types (name, description, status, created_at, updated_at) VALUES ('Technical', 'Technical skills', 'active', NOW(), NOW()), ('Soft Skills', 'Interpersonal skills', 'active', NOW(), NOW()), ('Leadership', 'Leadership training', 'active', NOW(), NOW());"
echo "✓ Training Types"

# Document Types
run_sql "INSERT IGNORE INTO document_types (name, description, status, created_at, updated_at) VALUES ('Passport', 'Passport copy', 'active', NOW(), NOW()), ('Driving License', 'Driver license', 'active', NOW(), NOW()), ('Degree', 'Educational certificate', 'active', NOW(), NOW());"
echo "✓ Document Types"

# Company Policies
run_sql "INSERT IGNORE INTO company_policies (name, description, status, created_at, updated_at) VALUES ('Code of Conduct', 'Employee conduct policy', 'active', NOW(), NOW()), ('Leave Policy', 'Leave policy', 'active', NOW(), NOW()), ('Remote Work', 'Work from home', 'active', NOW(), NOW());"
echo "✓ Company Policies"

# Award Types
run_sql "INSERT IGNORE INTO award_types (name, description, status, created_at, updated_at) VALUES ('Employee of Month', 'Monthly award', 'active', NOW(), NOW()), ('Best Performer', 'Top performance', 'active', NOW(), NOW());"
echo "✓ Award Types"

# Termination Types
run_sql "INSERT IGNORE INTO termination_types (name, description, status, created_at, updated_at) VALUES ('Voluntary Resignation', 'Employee resignation', 'active', NOW(), NOW()), ('Retirement', 'Retirement', 'active', NOW(), NOW()), ('End of Contract', 'Contract end', 'active', NOW(), NOW());"
echo "✓ Termination Types"

# Termination Reasons
run_sql "INSERT IGNORE INTO termination_reasons (name, description, status, created_at, updated_at) VALUES ('Better Opportunity', 'New job', 'active', NOW(), NOW()), ('Personal Reasons', 'Personal', 'active', NOW(), NOW()), ('Relocation', 'Moving away', 'active', NOW(), NOW());"
echo "✓ Termination Reasons"

# Expense Categories
run_sql "INSERT IGNORE INTO expense_categories (name, description, status, created_at, updated_at) VALUES ('Travel', 'Business travel', 'active', NOW(), NOW()), ('Meals', 'Client meals', 'active', NOW(), NOW()), ('Office Supplies', 'Office equipment', 'active', NOW(), NOW());"
echo "✓ Expense Categories"

# Expense Limits
run_sql "INSERT IGNORE INTO expense_limits (name, description, status, created_at, updated_at) VALUES ('Daily Meal', 'Daily limit', 'active', NOW(), NOW()), ('Monthly Travel', 'Monthly budget', 'active', NOW(), NOW());"
echo "✓ Expense Limits"

# Income Categories
run_sql "INSERT IGNORE INTO income_categories (name, description, status, created_at, updated_at) VALUES ('Product Sales', 'Software products', 'active', NOW(), NOW()), ('Services', 'Consulting services', 'active', NOW(), NOW());"
echo "✓ Income Categories"

# Income Sources
run_sql "INSERT IGNORE INTO income_sources (name, description, status, created_at, updated_at) VALUES ('Direct Sales', 'Direct customers', 'active', NOW(), NOW()), ('Partners', 'Channel partners', 'active', NOW(), NOW());"
echo "✓ Income Sources"

# Contract Types
run_sql "INSERT IGNORE INTO contract_types (name, description, status, created_at, updated_at) VALUES ('Permanent', 'Permanent contract', 'active', NOW(), NOW()), ('Fixed Term', 'Fixed duration', 'active', NOW(), NOW()), ('Probation', 'Probation period', 'active', NOW(), NOW());"
echo "✓ Contract Types"

# Message Templates
run_sql "INSERT IGNORE INTO message_templates (name, description, status, created_at, updated_at) VALUES ('Welcome', 'Welcome message', 'active', NOW(), NOW()), ('Birthday', 'Birthday wishes', 'active', NOW(), NOW());"
echo "✓ Message Templates"

# Notification Settings
run_sql "INSERT IGNORE INTO notification_settings (name, description, status, created_at, updated_at) VALUES ('Email Alerts', 'Email notifications', 'active', NOW(), NOW()), ('Push Alerts', 'Push notifications', 'active', NOW(), NOW());"
echo "✓ Notification Settings"

# Leave Policies
run_sql "INSERT IGNORE INTO leave_policies (name, description, status, created_at, updated_at) VALUES ('Standard Policy', 'Default leave policy', 'active', NOW(), NOW()), ('Senior Staff', 'Enhanced benefits', 'active', NOW(), NOW());"
echo "✓ Leave Policies"

echo ""
echo "✅ All configuration data inserted successfully!"
echo ""
echo "📊 Checking counts..."
docker exec hrms_mysql mysql -uroot -proot hrms_go_v5 -e "
SELECT 
  (SELECT COUNT(*) FROM job_categories) as job_categories,
  (SELECT COUNT(*) FROM salary_components) as salary_components,
  (SELECT COUNT(*) FROM payment_methods) as payment_methods,
  (SELECT COUNT(*) FROM tax_settings) as tax_settings,
  (SELECT COUNT(*) FROM job_types) as job_types,
  (SELECT COUNT(*) FROM hiring_stages) as hiring_stages;
" 2>/dev/null
echo ""

