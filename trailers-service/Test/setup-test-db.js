const { Client } = require('pg');
const { execSync } = require('child_process');
const path = require('path');

// Database configuration
const config = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Coolmanjat123!',
  database: 'postgres' // Connect to default database first
};

const TEST_DB_NAME = 'trailers_db_test';

async function setupTestDatabase() {
  const client = new Client(config);
  
  try {
    console.log('🔧 Setting up test database...');
    
    // Connect to PostgreSQL
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Drop test database if it exists
    try {
      await client.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
      console.log(`✅ Dropped existing test database: ${TEST_DB_NAME}`);
    } catch (error) {
      console.log(`⚠️  Could not drop database: ${error.message}`);
    }
    
    // Create fresh test database
    await client.query(`CREATE DATABASE ${TEST_DB_NAME}`);
    console.log(`✅ Created fresh test database: ${TEST_DB_NAME}`);
    
    // Close connection
    await client.end();
    
    // Run Prisma migrations on test database
    console.log('🔧 Running Prisma migrations...');
    const testDbUrl = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${TEST_DB_NAME}?schema=public`;
    
    // Set environment variable for Prisma
    process.env.DATABASE_URL = testDbUrl;
    
    // Run migrations
    execSync('npx prisma migrate deploy', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl
      }
    });
    
    console.log('✅ Migrations applied successfully');
    console.log('✅ Test database is ready!');
    console.log(`📍 Connection string: ${testDbUrl}`);
    
    return testDbUrl;
    
  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupTestDatabase()
    .then(() => {
      console.log('\n🎉 Test database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupTestDatabase };