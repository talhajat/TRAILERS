# Importing Tests to Postman

If you prefer to run the tests manually in Postman instead of using Newman CLI, follow these steps:

## Import Collection

1. Open Postman
2. Click "Import" button
3. Select `trailers-service.postman_collection.json`
4. Click "Import"

## Import Environment

1. Click the gear icon (⚙️) in the top right
2. Click "Import"
3. Select `trailers-service.postman_environment.json`
4. Click "Import"
5. Select "Trailers Service Environment" from the dropdown

## Prepare Database

Before running tests in Postman:

```bash
cd trailers-service/test
node setup-test-db.js
```

## Start Test Server

In a separate terminal:

```bash
cd trailers-service
npm run start:dev
```

Or with test environment:

```bash
cd trailers-service
set NODE_ENV=test
set DATABASE_URL=postgresql://postgres:Coolmanjat123!@localhost:5432/trailers_db_test?schema=public
npm run start:dev
```

## Run Tests

1. In Postman, select the "Trailers Service E2E Tests" collection
2. Click "Run" button
3. Select all tests or specific folders
4. Click "Run Trailers Service E2E Tests"

## View Results

- Green checkmarks indicate passed tests
- Red X marks indicate failed tests
- Click on individual requests to see details
- Export results as JSON or HTML report