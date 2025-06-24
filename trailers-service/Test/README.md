# Trailers Service E2E Tests

This directory contains end-to-end tests for the Trailers Service API using Postman.

## Prerequisites

1. **Application Running**: Ensure the Trailers Service is running on `http://localhost:3001`
   ```bash
   npm run start:dev
   ```

2. **Database**: PostgreSQL database should be running and accessible

## Running Tests with Postman

### Option 1: Using Postman GUI

1. Open Postman
2. Click "Import" button
3. Select the file: `Trailers-API-E2E-Tests.postman_collection.json`
4. Click "Run" to open the Collection Runner
5. Click "Run Trailers Service - E2E Tests"

### Option 2: Using Newman (Command Line)

1. Install Newman globally:
   ```bash
   npm install -g newman
   ```

2. Run the tests:
   ```bash
   newman run Trailers-API-E2E-Tests.postman_collection.json
   ```

3. Or use the provided script:
   ```bash
   node run-e2e-tests.js
   ```

## Test Coverage

The E2E test suite covers:

1. **Health Check** - Verify API is running
2. **Get All Trailers (Empty)** - Initial empty state
3. **Create Trailer - Owned Dry Van** - Create a fully specified owned trailer
4. **Create Trailer - Leased Refrigerated** - Create a leased trailer with lease end date
5. **Create Trailer - Minimal Data** - Create with only required fields
6. **Get All Trailers (With Data)** - Verify trailers are returned
7. **Get Trailers with Pagination** - Test pagination parameters
8. **Get Trailers Filtered by Status** - Test status filtering
9. **Get Trailers Filtered by Type** - Test trailer type filtering
10. **Create Trailer - Validation Error** - Missing required field
11. **Create Trailer - Lease Validation Error** - Missing lease end date for leased trailer
12. **Create Trailer - Duplicate ID Error** - Duplicate trailer ID validation

## Test Data

The tests create sample trailers with various configurations:
- Different trailer types (Dry Van, Refrigerated, Flatbed)
- Different ownership types (Owned, Leased)
- Various specifications and optional fields

## Expected Results

All tests should pass with:
- ✅ 12 tests passing
- 0 failures
- Proper HTTP status codes (200, 201, 400)
- Correct response data structures

## Troubleshooting

1. **Connection Refused**: Make sure the application is running on port 3001
2. **Database Errors**: Ensure PostgreSQL is running and migrations are applied
3. **Port Conflicts**: Check if port 3001 is available

## Manual Testing Examples

### Create a Trailer
```bash
curl -X POST http://localhost:3001/api/trailers \
  -H "Content-Type: application/json" \
  -d '{
    "trailerType": "dry_van",
    "ownershipType": "owned",
    "year": 2023,
    "vin": "1HGBH41JXMN109186"
  }'
```

### Get All Trailers
```bash
curl http://localhost:3001/api/trailers
```

### Get Trailers with Filters
```bash
curl "http://localhost:3001/api/trailers?status=available&trailerType=dry_van&page=1&limit=10"