const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Test data for creating trailers
const testTrailers = [
  {
    trailerType: 'dry_van',
    ownershipType: 'owned',
    vin: 'ABCDEFGHIJ1234567',
    year: 2022,
    color: 'White',
    length: 53,
    width: 102,
    height: 110,
    capacity: 45000,
    axleCount: 2,
    purchaseDate: '2022-01-15',
    purchasePrice: 35000,
    licensePlate: 'TRL-001',
    issuingState: 'TX',
    registrationExp: '2025-01-15',
    insurancePolicy: 'POL-12345',
    insuranceExp: '2025-06-01',
    jurisdiction: 'Texas',
    gvwr: 80000,
    initialStatus: 'available',
    assignedYard: 'Dallas Main Yard'
  },
  {
    trailerType: 'reefer',
    ownershipType: 'leased',
    vin: 'ZYXWVUTSRQ7654321',
    year: 2023,
    color: 'Silver',
    length: 48,
    width: 102,
    height: 108,
    capacity: 42000,
    axleCount: 2,
    leaseEndDate: '2026-12-31',
    licensePlate: 'TRL-002',
    issuingState: 'CA',
    registrationExp: '2025-03-20',
    insurancePolicy: 'POL-67890',
    insuranceExp: '2025-07-15',
    jurisdiction: 'California',
    gvwr: 75000,
    initialStatus: 'assigned',
    assignedYard: 'Los Angeles Depot'
  },
  {
    trailerType: 'flatbed',
    ownershipType: 'owned',
    vin: 'MNBVCXZLKJ0987654',
    year: 2021,
    color: 'Black',
    length: 48,
    width: 102,
    height: 60,
    capacity: 48000,
    axleCount: 3,
    purchaseDate: '2021-06-10',
    purchasePrice: 28000,
    licensePlate: 'TRL-003',
    issuingState: 'FL',
    registrationExp: '2024-12-01',
    insurancePolicy: 'POL-11111',
    insuranceExp: '2025-01-01',
    jurisdiction: 'Florida',
    gvwr: 85000,
    initialStatus: 'maintenance',
    assignedYard: 'Miami Service Center'
  }
];

// Helper function to delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test creating trailers
async function testCreateTrailers() {
  console.log('\n🚛 Testing POST /api/trailers - Creating Trailers\n');
  
  const createdTrailers = [];
  
  for (const trailer of testTrailers) {
    try {
      console.log(`Creating ${trailer.trailerType} trailer (${trailer.licensePlate})...`);
      const response = await axios.post(`${API_BASE_URL}/trailers`, trailer);
      createdTrailers.push(response.data);
      console.log(`✅ Created successfully with ID: ${response.data.id}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   VIN: ${response.data.vin}`);
      console.log(`   Type: ${response.data.trailerType}`);
      console.log(`   Ownership: ${response.data.ownershipType}\n`);
    } catch (error) {
      console.error(`❌ Failed to create trailer:`, error.response?.data || error.message);
    }
    
    // Small delay between requests
    await delay(500);
  }
  
  return createdTrailers;
}

// Test retrieving all trailers
async function testGetAllTrailers() {
  console.log('\n📋 Testing GET /api/trailers - Retrieving All Trailers\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/trailers`);
    console.log(`✅ Retrieved ${response.data.trailers.length} trailers`);
    console.log(`   Total: ${response.data.total}`);
    console.log(`   Page: ${response.data.page}`);
    console.log(`   Limit: ${response.data.limit}`);
    
    console.log('\n   Trailers:');
    response.data.trailers.forEach(trailer => {
      console.log(`   - ${trailer.licensePlate || 'No plate'} | ${trailer.trailerType} | ${trailer.status} | ${trailer.ownershipType}`);
    });
  } catch (error) {
    console.error(`❌ Failed to retrieve trailers:`, error.response?.data || error.message);
  }
}

// Test filtering by status
async function testFilterByStatus() {
  console.log('\n🔍 Testing GET /api/trailers?status=available - Filter by Status\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/trailers?status=available`);
    console.log(`✅ Retrieved ${response.data.trailers.length} available trailers`);
    
    response.data.trailers.forEach(trailer => {
      console.log(`   - ${trailer.licensePlate || 'No plate'} | ${trailer.trailerType} | Status: ${trailer.status}`);
    });
  } catch (error) {
    console.error(`❌ Failed to filter by status:`, error.response?.data || error.message);
  }
}

// Test filtering by trailer type
async function testFilterByType() {
  console.log('\n🔍 Testing GET /api/trailers?trailerType=reefer - Filter by Type\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/trailers?trailerType=reefer`);
    console.log(`✅ Retrieved ${response.data.trailers.length} reefer trailers`);
    
    response.data.trailers.forEach(trailer => {
      console.log(`   - ${trailer.licensePlate || 'No plate'} | Type: ${trailer.trailerType} | ${trailer.status}`);
    });
  } catch (error) {
    console.error(`❌ Failed to filter by type:`, error.response?.data || error.message);
  }
}

// Test pagination
async function testPagination() {
  console.log('\n📄 Testing GET /api/trailers?page=1&limit=2 - Pagination\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/trailers?page=1&limit=2`);
    console.log(`✅ Page 1 with limit 2:`);
    console.log(`   Total trailers: ${response.data.total}`);
    console.log(`   Showing: ${response.data.trailers.length} trailers`);
    console.log(`   Page: ${response.data.page}/${Math.ceil(response.data.total / response.data.limit)}`);
    
    response.data.trailers.forEach(trailer => {
      console.log(`   - ${trailer.licensePlate || 'No plate'} | ${trailer.trailerType}`);
    });
  } catch (error) {
    console.error(`❌ Failed to test pagination:`, error.response?.data || error.message);
  }
}

// Test validation errors
async function testValidationErrors() {
  console.log('\n⚠️  Testing Validation Errors\n');
  
  // Test missing required fields
  console.log('1. Testing missing required fields...');
  try {
    await axios.post(`${API_BASE_URL}/trailers`, {
      // Missing trailerType and ownershipType
      vin: '12345678901234567'
    });
    console.log('❌ Should have failed but didn\'t');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.response?.data?.message || error.message}`);
  }
  
  await delay(500);
  
  // Test invalid VIN length
  console.log('\n2. Testing invalid VIN length...');
  try {
    await axios.post(`${API_BASE_URL}/trailers`, {
      trailerType: 'dry_van',
      ownershipType: 'owned',
      vin: 'SHORT' // Too short
    });
    console.log('❌ Should have failed but didn\'t');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.response?.data?.message || error.message}`);
  }
  
  await delay(500);
  
  // Test invalid year
  console.log('\n3. Testing invalid year...');
  try {
    await axios.post(`${API_BASE_URL}/trailers`, {
      trailerType: 'dry_van',
      ownershipType: 'owned',
      year: 1800 // Too old
    });
    console.log('❌ Should have failed but didn\'t');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.response?.data?.message || error.message}`);
  }
  
  await delay(500);
  
  // Test leased trailer without lease end date
  console.log('\n4. Testing leased trailer without lease end date...');
  try {
    await axios.post(`${API_BASE_URL}/trailers`, {
      trailerType: 'dry_van',
      ownershipType: 'leased'
      // Missing leaseEndDate
    });
    console.log('❌ Should have failed but didn\'t');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.response?.data?.message || error.message}`);
  }
  
  await delay(500);
  
  // Test past lease end date
  console.log('\n5. Testing past lease end date...');
  try {
    await axios.post(`${API_BASE_URL}/trailers`, {
      trailerType: 'dry_van',
      ownershipType: 'leased',
      leaseEndDate: '2020-01-01' // Past date
    });
    console.log('❌ Should have failed but didn\'t');
  } catch (error) {
    console.log(`✅ Correctly rejected: ${error.response?.data?.message || error.message}`);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Trailer Service API Tests');
  console.log('=====================================\n');
  
  try {
    // Test creating trailers
    await testCreateTrailers();
    
    // Wait a bit for data to be persisted
    await delay(1000);
    
    // Test retrieving trailers
    await testGetAllTrailers();
    await delay(500);
    
    // Test filtering
    await testFilterByStatus();
    await delay(500);
    
    await testFilterByType();
    await delay(500);
    
    // Test pagination
    await testPagination();
    await delay(500);
    
    // Test validation
    await testValidationErrors();
    
    console.log('\n\n✅ All tests completed!');
    console.log('=====================================\n');
    
  } catch (error) {
    console.error('\n\n❌ Test suite failed:', error.message);
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  runTests();
} catch (e) {
  console.log('Installing axios...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
  console.log('Axios installed. Please run the script again.');
}