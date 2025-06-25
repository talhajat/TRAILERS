# Trailers Service E2E Tests

This directory contains end-to-end tests for the Trailers Service API using Postman/Newman.

## Overview

The E2E tests ensure that all API endpoints work correctly with a real database. The tests:
- Create a fresh test database before each run
- Test all CRUD operations
- Validate business rules and edge cases
- Clean up after completion

## Prerequisites

1. **PostgreSQL** must be running locally on port 5432
2. **Node.js** and **npm** installed
3. **Newman** (Postman CLI) - will be installed automatically if missing

## Test Structure

- `trailers-service.postman_collection.json` - Postman collection with all test cases
- `trailers-service.postman_environment.json` - Environment variables for tests
- `setup-test-db.js` - Script to create fresh test database
- `run-postman-tests.js` - Main test runner script
- `run-e2e-tests.bat` - Windows batch file to run tests

## Running Tests

### Windows
Simply double-click `run-e2e-tests.bat` or run from command line:
```bash
cd trailers-service/test
run-e2e-tests.bat
```

### Manual Run
```bash
cd trailers-service/test
node run-postman-tests.js
```

### Using npm script
Add to `package.json`:
```json
"scripts": {
  "test:e2e": "node test/run-postman-tests.js"
}
```

Then run:
```bash
npm run test:e2e
```

## Test Cases

### Setup
- Health Check - Verifies service is running

### CRUD Operations
1. **Create Trailer - Owned Dry Van**
   - Creates a trailer with all fields
   - Validates response structure
   - Stores ID for subsequent tests

2. **Create Trailer - Leased Reefer**
   - Creates a leased trailer
   - Validates lease end date requirement

3. **Create Trailer - Invalid Cases**
   - Missing required fields
   - Missing lease end date for leased trailers

4. **Get All Trailers**
   - Retrieves trailer list
   - Tests pagination

5. **Get Trailers by Type**
   - Filters by trailer type

6. **Get Trailer by ID**
   - Retrieves specific trailer
   - Tests both trailer ID and database ID

7. **Get Non-Existent Trailer**
   - Validates 404 response

### Edge Cases
1. **Duplicate VIN** - Ensures VINs are unique
2. **Invalid Year** - Validates year constraints
3. **Past Lease End Date** - Ensures future dates only
4. **Negative Dimensions** - Validates positive values

## Database

The tests use a separate database `trailers_db_test` which is:
- Created fresh before each test run
- Migrated with latest schema
- Isolated from development data

## Test Results

After running, you'll find:
- Console output with pass/fail status
- `postman-test-results.json` - Detailed test results

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env.test`
- Ensure user has CREATE DATABASE permissions

### Port Conflicts
- Default test port is 3001
- Change in environment file if needed

### Server Startup Issues
- Check console output for errors
- Ensure all dependencies are installed
- Verify no other instance is running

## Adding New Tests

1. Import collection into Postman
2. Add new requests/tests
3. Export collection back to this directory
4. Update documentation

## Environment Variables

Test environment uses:
- `DATABASE_URL` - Test database connection
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Set to 'test'

## Best Practices

1. Always run with fresh database
2. Use meaningful test names
3. Test both success and failure cases
4. Clean up test data after runs
5. Keep tests independent