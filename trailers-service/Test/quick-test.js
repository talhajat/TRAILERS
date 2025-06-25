const { setupTestDatabase } = require('./setup-test-db');

console.log('🧪 Quick Test - Verifying E2E Test Setup\n');

async function quickTest() {
  try {
    // Test 1: Database setup
    console.log('1️⃣ Testing database setup...');
    const dbUrl = await setupTestDatabase();
    console.log('   ✅ Database setup successful');
    console.log(`   📍 Test DB URL: ${dbUrl}\n`);
    
    // Test 2: Check if Newman is available
    console.log('2️⃣ Checking Newman installation...');
    try {
      require('newman');
      console.log('   ✅ Newman is installed\n');
    } catch (error) {
      console.log('   ❌ Newman not found. Install with: npm install -g newman\n');
    }
    
    // Test 3: Check collection files
    console.log('3️⃣ Checking test files...');
    const fs = require('fs');
    const path = require('path');
    
    const files = [
      'trailers-service.postman_collection.json',
      'trailers-service.postman_environment.json',
      'run-postman-tests.js',
      'run-e2e-tests.bat'
    ];
    
    let allFilesExist = true;
    files.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
      } else {
        console.log(`   ❌ ${file} - NOT FOUND`);
        allFilesExist = false;
      }
    });
    
    console.log('\n📊 Summary:');
    console.log('   - Test database: ✅ Ready');
    console.log('   - Test files: ' + (allFilesExist ? '✅ All present' : '❌ Some missing'));
    console.log('   - Newman: ' + (require.resolve('newman') ? '✅ Installed' : '❌ Not installed'));
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run the full E2E tests: node run-postman-tests.js');
    console.log('   2. Or use the batch file: run-e2e-tests.bat');
    console.log('   3. Or import to Postman manually (see import-to-postman.md)');
    
  } catch (error) {
    console.error('\n❌ Quick test failed:', error.message);
    process.exit(1);
  }
}

quickTest();