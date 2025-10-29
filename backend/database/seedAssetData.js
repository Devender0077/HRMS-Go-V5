const db = require('../config/database');

async function seedAssetData() {
  try {
    console.log('\n🌱 Starting Asset Data Seeding...\n');

    // 1. Insert Asset Categories
    console.log('📂 Inserting Asset Categories...');
    await db.query(`
      INSERT IGNORE INTO asset_categories (name, description, created_at, updated_at) VALUES
      ('Laptops', 'Portable computers for employees', NOW(), NOW()),
      ('Desktops', 'Desktop computers and workstations', NOW(), NOW()),
      ('Mobile Devices', 'Smartphones and tablets', NOW(), NOW()),
      ('Monitors', 'Display screens and monitors', NOW(), NOW()),
      ('Printers', 'Printing devices', NOW(), NOW()),
      ('Networking', 'Routers, switches, and network equipment', NOW(), NOW()),
      ('Furniture', 'Office furniture and fixtures', NOW(), NOW()),
      ('Accessories', 'Keyboards, mice, cables, etc.', NOW(), NOW())
    `);

    const [categories] = await db.query('SELECT COUNT(*) as count FROM asset_categories');
    console.log(`   ✅ ${categories[0].count} categories in database\n`);

    // 2. Insert Assets
    console.log('💼 Inserting Assets...');
    await db.query(`
      INSERT IGNORE INTO assets (
        asset_code, asset_name, category_id, brand, model, serial_number, 
        purchase_date, purchase_cost, current_value, warranty_expiry, 
        location, current_status, \`condition\`, notes, created_at, updated_at
      ) VALUES
      ('LAP-001', 'MacBook Pro 16"', 1, 'Apple', 'MacBook Pro 16" M2', 'MBP-2023-001', '2023-01-15', 2499.00, 2200.00, '2026-01-15', 'HQ Office - 3rd Floor', 'assigned', 'excellent', 'High-performance laptop for developers', NOW(), NOW()),
      ('LAP-002', 'Dell XPS 15', 1, 'Dell', 'XPS 15 9530', 'DL-XPS-2023-002', '2023-02-20', 1899.00, 1700.00, '2026-02-20', 'HQ Office - 2nd Floor', 'assigned', 'good', 'Developer workstation', NOW(), NOW()),
      ('LAP-003', 'Lenovo ThinkPad X1', 1, 'Lenovo', 'ThinkPad X1 Carbon Gen 11', 'LNV-TP-2023-003', '2023-03-10', 1699.00, 1500.00, '2026-03-10', 'IT Storage Room', 'available', 'excellent', 'Business laptop', NOW(), NOW()),
      ('LAP-004', 'HP EliteBook 840', 1, 'HP', 'EliteBook 840 G9', 'HP-EB-2023-004', '2023-04-05', 1499.00, 1300.00, '2026-04-05', 'IT Maintenance', 'under_maintenance', 'fair', 'Need keyboard replacement', NOW(), NOW()),
      ('LAP-005', 'MacBook Air M2', 1, 'Apple', 'MacBook Air 13" M2', 'MBA-2023-005', '2023-05-12', 1199.00, 1100.00, '2026-05-12', 'Marketing Department', 'assigned', 'excellent', 'Lightweight laptop for marketing team', NOW(), NOW()),
      ('DKT-001', 'iMac 24"', 2, 'Apple', 'iMac 24" M1', 'IMAC-2023-001', '2023-01-20', 1799.00, 1600.00, '2026-01-20', 'Design Studio', 'assigned', 'excellent', 'Designer workstation', NOW(), NOW()),
      ('DKT-002', 'Dell OptiPlex 7000', 2, 'Dell', 'OptiPlex 7000', 'DL-OPX-2023-002', '2023-02-15', 1299.00, 1150.00, '2026-02-15', 'Accounting Department', 'assigned', 'good', 'Office workstation', NOW(), NOW()),
      ('DKT-003', 'HP Z2 Tower', 2, 'HP', 'Z2 Tower G9', 'HP-Z2-2023-003', '2023-03-25', 2199.00, 2000.00, '2026-03-25', 'Engineering Team', 'assigned', 'excellent', 'High-performance workstation', NOW(), NOW()),
      ('MOB-001', 'iPhone 14 Pro', 3, 'Apple', 'iPhone 14 Pro', 'IPH14P-2023-001', '2023-01-10', 999.00, 850.00, '2024-01-10', 'Sales Department', 'assigned', 'excellent', 'Sales team phone', NOW(), NOW()),
      ('MOB-002', 'Samsung Galaxy S23', 3, 'Samsung', 'Galaxy S23 Ultra', 'SAM-S23-2023-002', '2023-02-05', 1199.00, 1050.00, '2024-02-05', 'Marketing Manager', 'assigned', 'excellent', 'Marketing team phone', NOW(), NOW()),
      ('MOB-003', 'iPad Pro 12.9"', 3, 'Apple', 'iPad Pro 12.9" M2', 'IPD-2023-003', '2023-03-15', 1099.00, 1000.00, '2025-03-15', 'Executive Office', 'assigned', 'excellent', 'Executive tablet', NOW(), NOW()),
      ('MON-001', 'Dell UltraSharp 27"', 4, 'Dell', 'UltraSharp U2723DE', 'DL-US-2023-001', '2023-01-25', 599.00, 550.00, '2026-01-25', 'Development Team', 'assigned', 'excellent', '4K monitor for developers', NOW(), NOW()),
      ('MON-002', 'LG 34" Ultrawide', 4, 'LG', '34WN80C-B', 'LG-UW-2023-002', '2023-02-10', 699.00, 650.00, '2026-02-10', 'Design Studio', 'assigned', 'excellent', 'Ultrawide for designers', NOW(), NOW()),
      ('MON-003', 'Samsung 32" 4K', 4, 'Samsung', 'M8 32"', 'SAM-M8-2023-003', '2023-03-20', 799.00, 750.00, '2026-03-20', 'IT Storage Room', 'available', 'excellent', 'Spare monitor', NOW(), NOW()),
      ('PRN-001', 'HP LaserJet Pro', 5, 'HP', 'LaserJet Pro M404n', 'HP-LJ-2023-001', '2023-01-05', 399.00, 350.00, '2026-01-05', 'Print Room', 'available', 'good', 'Office printer', NOW(), NOW()),
      ('PRN-002', 'Canon ImageClass', 5, 'Canon', 'ImageCLASS MF445dw', 'CAN-IC-2023-002', '2023-02-12', 499.00, 450.00, '2026-02-12', 'Admin Office', 'assigned', 'excellent', 'Multifunction printer', NOW(), NOW()),
      ('NET-001', 'Cisco Router', 6, 'Cisco', 'RV340', 'CSC-RV-2023-001', '2023-01-08', 299.00, 280.00, '2026-01-08', 'Server Room', 'assigned', 'excellent', 'Main office router', NOW(), NOW()),
      ('NET-002', 'Ubiquiti Switch', 6, 'Ubiquiti', 'UniFi 24-Port', 'UBI-US-2023-002', '2023-02-18', 449.00, 420.00, '2026-02-18', 'Server Room', 'assigned', 'excellent', '24-port managed switch', NOW(), NOW()),
      ('FUR-001', 'Herman Miller Chair', 7, 'Herman Miller', 'Aeron Chair', 'HM-AER-2023-001', '2023-01-12', 1395.00, 1300.00, '2033-01-12', 'Executive Office', 'assigned', 'excellent', 'Ergonomic office chair', NOW(), NOW()),
      ('FUR-002', 'Standing Desk', 7, 'FlexiSpot', 'E7 Pro', 'FLX-E7-2023-002', '2023-02-22', 599.00, 580.00, '2028-02-22', 'Development Team', 'assigned', 'excellent', 'Electric standing desk', NOW(), NOW())
    `);

    const [assets] = await db.query('SELECT COUNT(*) as count FROM assets');
    console.log(`   ✅ ${assets[0].count} assets in database\n`);

    // 3. Insert Asset Assignments
    console.log('👥 Inserting Asset Assignments...');
    await db.query(`
      INSERT IGNORE INTO asset_assignments (
        asset_id, employee_id, assigned_date, expected_return_date, status, assignment_notes, created_at, updated_at
      ) VALUES
      (1, 1, '2023-02-01', NULL, 'active', 'Assigned to Lead Developer', NOW(), NOW()),
      (2, 2, '2023-03-01', NULL, 'active', 'Assigned to Senior Developer', NOW(), NOW()),
      (5, 3, '2023-06-01', NULL, 'active', 'Assigned to Marketing Manager', NOW(), NOW()),
      (6, 4, '2023-02-15', NULL, 'active', 'Assigned to UI/UX Designer', NOW(), NOW()),
      (7, 5, '2023-03-10', NULL, 'active', 'Assigned to Accountant', NOW(), NOW()),
      (8, 6, '2023-04-01', NULL, 'active', 'Assigned to DevOps Engineer', NOW(), NOW()),
      (9, 7, '2023-01-20', NULL, 'active', 'Assigned to Sales Manager', NOW(), NOW()),
      (10, 8, '2023-02-20', NULL, 'active', 'Assigned to Marketing Director', NOW(), NOW()),
      (11, 1, '2023-03-25', NULL, 'active', 'Secondary device for presentations', NOW(), NOW()),
      (12, 2, '2023-02-05', NULL, 'active', 'External monitor for workstation', NOW(), NOW()),
      (13, 4, '2023-03-05', NULL, 'active', 'Ultrawide monitor for design work', NOW(), NOW()),
      (16, 1, '2023-03-01', NULL, 'active', 'Assigned to Admin Department', NOW(), NOW()),
      (17, 1, '2023-02-01', NULL, 'active', 'Main office router', NOW(), NOW()),
      (18, 1, '2023-02-20', NULL, 'active', 'Network switch in server room', NOW(), NOW()),
      (19, 1, '2023-02-10', NULL, 'active', 'Executive office chair', NOW(), NOW()),
      (20, 2, '2023-03-15', NULL, 'active', 'Standing desk for developer', NOW(), NOW())
    `);

    const [assignments] = await db.query('SELECT COUNT(*) as count FROM asset_assignments');
    console.log(`   ✅ ${assignments[0].count} assignments in database\n`);

    // 4. Insert Asset Maintenance
    console.log('🔧 Inserting Asset Maintenance Records...');
    await db.query(`
      INSERT IGNORE INTO asset_maintenance (
        asset_id, maintenance_type, title, description, service_provider, 
        start_date, end_date, cost, status, notes, created_at, updated_at
      ) VALUES
      (1, 'inspection', 'Annual Hardware Checkup', 'Complete system inspection and diagnostics', 'IT Support Team', '2024-01-15', '2024-01-16', 0.00, 'completed', 'All systems working fine', NOW(), NOW()),
      (2, 'repair', 'Battery Replacement', 'Replace old battery with new one', 'Tech Solutions Inc', '2023-12-10', '2023-12-12', 150.00, 'completed', 'New battery installed, 100% health', NOW(), NOW()),
      (4, 'repair', 'Keyboard Replacement', 'Replace faulty keyboard', 'IT Support Team', '2024-02-01', NULL, 250.00, 'scheduled', 'Keys are sticking, needs new keyboard', NOW(), NOW()),
      (6, 'inspection', 'Software Updates', 'Update OS and applications', 'IT Support Team', '2024-01-20', '2024-01-20', 0.00, 'completed', 'Updated macOS and applications', NOW(), NOW()),
      (7, 'inspection', 'Quarterly System Checkup', 'Regular system health check', 'IT Support Team', '2024-02-15', NULL, 0.00, 'scheduled', 'Scheduled quarterly maintenance', NOW(), NOW()),
      (15, 'repair', 'Toner Cartridge Replacement', 'Replace empty toner cartridge', 'Print Tech Services', '2023-11-20', '2023-11-22', 180.00, 'completed', 'Installed new HP toner cartridge', NOW(), NOW()),
      (16, 'scheduled', 'Printer Maintenance', 'Cleaning and paper jam prevention', 'IT Support Team', '2024-03-01', NULL, 50.00, 'scheduled', 'Monthly printer maintenance', NOW(), NOW()),
      (17, 'upgrade', 'Firmware Upgrade', 'Update router firmware to latest version', 'Network Admin', '2024-01-10', '2024-01-11', 0.00, 'completed', 'Updated to latest firmware version', NOW(), NOW()),
      (18, 'inspection', 'Network Equipment Check', 'Quarterly network inspection', 'Network Admin', '2024-02-28', NULL, 0.00, 'scheduled', 'Check all ports and connections', NOW(), NOW())
    `);

    const [maintenance] = await db.query('SELECT COUNT(*) as count FROM asset_maintenance');
    console.log(`   ✅ ${maintenance[0].count} maintenance records in database\n`);

    // 5. Final Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ASSET DATA SEEDING COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const [summary] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM asset_categories) as categories,
        (SELECT COUNT(*) FROM assets) as assets,
        (SELECT COUNT(*) FROM asset_assignments) as assignments,
        (SELECT COUNT(*) FROM asset_maintenance) as maintenance
    `);
    
    console.log(`📊 Summary:`);
    console.log(`   Categories:  ${summary[0].categories}`);
    console.log(`   Assets:      ${summary[0].assets}`);
    console.log(`   Assignments: ${summary[0].assignments}`);
    console.log(`   Maintenance: ${summary[0].maintenance}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding asset data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAssetData();

