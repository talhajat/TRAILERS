const newman = require('newman');
const path = require('path');
const { setupTestDatabase } = require('./setup-test-db');
const { spawn } = require('child_process');

// Configuration
const COLLECTION_PATH = path.join(__dirname, 'trailers-service.postman_collection.json');
const ENVIRONMENT_PATH = path.join(__dirname, 'trailers-service.postman_environment.json');
const TEST_PORT = 3001;

let serverProcess = null;

async function startTestServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting test server...');
    
    // Start the NestJS application with test environment
    serverProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        NODE_ENV: 'test',
        DATABASE_URL: `postgresql://postgres:Coolmanjat123!@localhost:5432/trailers_db_test?schema=public`,
        PORT: TEST_PORT
      },
      shell: true
    });

    let serverStarted = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Server: ${output}`);
      
      // Check if server has started
      if (output.includes('Nest application successfully started') || 
          output.includes(`listening on port ${TEST_PORT}`)) {
        if (!serverStarted) {
          serverStarted = true;
          console.log('✅ Test server is ready!');
          setTimeout(() => resolve(), 2000); // Give it 2 more seconds to fully initialize
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        reject(new Error('Server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

function stopTestServer() {
  if (serverProcess) {
    console.log('🛑 Stopping test server...');
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

async function runPostmanTests() {
  try {
    // Step 1: Setup fresh test database
    console.log('\n📦 Step 1: Setting up test database');
    await setupTestDatabase();
    
    // Step 2: Start test server
    console.log('\n📦 Step 2: Starting test server');
    await startTestServer();
    
    // Step 3: Run Postman tests
    console.log('\n📦 Step 3: Running Postman tests');
    
    return new Promise((resolve, reject) => {
      newman.run({
        collection: require(COLLECTION_PATH),
        environment: require(ENVIRONMENT_PATH),
        reporters: ['cli', 'json'],
        reporter: {
          json: {
            export: path.join(__dirname, 'postman-test-results.json')
          }
        },
        insecure: true,
        timeout: 180000, // 3 minutes timeout
        timeoutRequest: 10000, // 10 seconds per request
        color: true,
        verbose: true
      }, (err, summary) => {
        if (err) {
          reject(err);
        } else {
          // Check if any tests failed
          const failures = summary.run.stats.assertions.failed;
          if (failures > 0) {
            reject(new Error(`${failures} test(s) failed`));
          } else {
            resolve(summary);
          }
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    throw error;
  } finally {
    // Always stop the server
    stopTestServer();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Interrupted! Cleaning up...');
  stopTestServer();
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Terminated! Cleaning up...');
  stopTestServer();
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  runPostmanTests()
    .then((summary) => {
      console.log('\n✅ All tests passed!');
      console.log(`📊 Test Summary:`);
      console.log(`   Total: ${summary.run.stats.assertions.total}`);
      console.log(`   Passed: ${summary.run.stats.assertions.passed}`);
      console.log(`   Failed: ${summary.run.stats.assertions.failed}`);
      console.log(`   Duration: ${summary.run.timings.completed - summary.run.timings.started}ms`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Tests failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runPostmanTests };