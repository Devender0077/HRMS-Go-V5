#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Verifies all required environment variables are set
 */

require('dotenv').config();

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           🔍 Environment Variables Check                      ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const requiredVars = {
  'Database': [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ],
  'Server': [
    'PORT',
    'NODE_ENV',
  ],
  'CORS': [
    'CORS_ORIGIN',
  ],
  'JWT': [
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRATION',
  ],
};

let allGood = true;

for (const [category, vars] of Object.entries(requiredVars)) {
  console.log(`${category} Configuration:`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const varName of vars) {
    const value = process.env[varName];
    if (value) {
      // Mask sensitive values
      let displayValue = value;
      if (varName.includes('PASSWORD') || varName.includes('SECRET')) {
        displayValue = '*'.repeat(Math.min(value.length, 20));
      }
      console.log(`  ✅ ${varName.padEnd(25)} = ${displayValue}`);
    } else {
      console.log(`  ❌ ${varName.padEnd(25)} = NOT SET`);
      allGood = false;
    }
  }
  console.log('');
}

if (allGood) {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              ✅ ALL ENVIRONMENT VARIABLES SET!                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log('Your backend is properly configured! 🎉\n');
  process.exit(0);
} else {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              ❌ MISSING ENVIRONMENT VARIABLES!                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log('Action Required:');
  console.log('1. Check backend/.env file exists');
  console.log('2. Copy from backend/.env.example if needed:');
  console.log('   cp backend/.env.example backend/.env');
  console.log('3. Ensure all variables are set\n');
  process.exit(1);
}

