#!/usr/bin/env node
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'hrms_go_v5',
  });

  console.log('✅ Connected to database: hrms_go_v5\n');

  // Show permissions table structure
  const [columns] = await connection.query('DESCRIBE permissions');
  console.log('📋 PERMISSIONS TABLE STRUCTURE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  columns.forEach(col => {
    console.log(`   ${col.Field.padEnd(20)} ${col.Type.padEnd(20)} ${col.Null} ${col.Key} ${col.Default || ''}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Count current permissions
  const [count] = await connection.query('SELECT COUNT(*) as total FROM permissions');
  console.log(`📊 Current permissions in database: ${count[0].total}\n`);

  // Show sample permissions
  const [sample] = await connection.query('SELECT * FROM permissions LIMIT 5');
  console.log('📄 SAMPLE PERMISSIONS:');
  console.log(JSON.stringify(sample, null, 2));

  await connection.end();
}

checkTable().catch(console.error);

