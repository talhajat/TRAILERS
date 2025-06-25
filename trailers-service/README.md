# Trailers Service

A microservice for managing trailer fleet information built with NestJS, Prisma, and PostgreSQL. This service provides a RESTful API for creating, retrieving, and managing trailer data with comprehensive validation and business logic.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Business Logic](#business-logic)
- [Development](#development)

## Overview

The Trailers Service is designed to manage a fleet of trailers with various types (dry van, reefer, flatbed, etc.) and ownership models (owned, leased, rented). It provides endpoints for:

- Creating new trailers with comprehensive validation
- Retrieving trailer lists with pagination and filtering
- Getting detailed trailer profiles
- Managing trailer specifications, ownership, and compliance information

## Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                 (Controllers, DTOs)                          │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│              (Use Cases, Application DTOs)                   │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│        (Entities, Value Objects, Repository Interfaces)      │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│          (Database, Repository Implementations)              │
└─────────────────────────────────────────────────────────────┘
```

### Key Components:

- **Domain Layer**: Contains business entities, value objects, and repository interfaces
- **Application Layer**: Implements use cases that orchestrate business logic
- **Infrastructure Layer**: Handles data persistence using Prisma ORM
- **Presentation Layer**: REST API controllers and request/response DTOs

## Features

- ✅ **Trailer Management**: Create and retrieve trailer information
- ✅ **Multiple Trailer Types**: Support for dry van, reefer, flatbed, tanker, lowboy, step deck
- ✅ **Ownership Models**: Track owned, leased, and rented trailers
- ✅ **VIN Validation**: Ensures valid Vehicle Identification Numbers
- ✅ **Business Rules**: Enforces rules like lease end dates for leased trailers
- ✅ **Pagination & Filtering**: Efficient data retrieval with query options
- ✅ **Comprehensive Validation**: Input validation using class-validator
- ✅ **Clean Architecture**: Maintainable and testable code structure

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
cd trailers-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Create the database
createdb trailers_db

# Run migrations
npx prisma migrate deploy
```

## Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/trailers_db?schema=public"

# Application Configuration
PORT=3001
NODE_ENV=development

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start
```

The application will start on `http://localhost:3001`

## API Documentation

### Base URL
All API endpoints are prefixed with `/api`

### Endpoints

#### 1. Health Check
```http
GET /api
```
Returns the service status.

#### 2. Create Trailer
```http
POST /api/trailers
Content-Type: application/json

{
  "trailerType": "dry_van",
  "ownershipType": "owned",
  "year": 2023,
  "vin": "1HGBH41JXMN109186",
  "color": "White",
  "length": 53,
  "width": 102,
  "height": 110,
  "capacity": 45000,
  "axleCount": 2,
  "purchaseDate": "2023-01-15",
  "purchasePrice": 35000,
  "licensePlate": "ABC123",
  "issuingState": "CA",
  "registrationExp": "2025-01-15",
  "insurancePolicy": "POL123456",
  "insuranceExp": "2025-06-30",
  "jurisdiction": "California",
  "gvwr": 80000,
  "assignedYard": "Main Yard"
}
```

**Required Fields:**
- `trailerType`: One of: dry_van, reefer, flatbed, tanker, lowboy, step_deck, other
- `ownershipType`: One of: owned, leased, rented

**Business Rules:**
- If `ownershipType` is "leased", `leaseEndDate` is required and must be in the future
- VIN must be unique if provided
- Year must be between 1900 and current year + 1

#### 3. Get All Trailers
```http
GET /api/trailers?page=1&limit=10&status=available&trailerType=dry_van
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `trailerType`: Filter by trailer type

**Response:**
```json
{
  "trailers": [
    {
      "id": "TR1234",
      "trailerType": "Dry Van",
      "year": 2023,
      "vin": "1HGBH41JXMN109186",
      "status": "Available",
      "lengthCapacity": "53 ft / 45,000 lbs",
      "axleCount": 2,
      "attachedTruck": "None",
      "currentLocation": "Main Yard"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### 4. Get Trailer by ID
```http
GET /api/trailers/:id
```

Returns detailed trailer profile including:
- Basic information (VIN, color, year, axles)
- Specifications (dimensions, capacity)
- Ownership & financial details
- Registration & compliance information
- Document references

## Testing

### Running E2E Tests

The project includes comprehensive end-to-end tests using Postman/Newman:

```bash
cd test
run-e2e-tests.bat
```

Or manually:
```bash
node test/run-postman-tests.js
```

### Test Coverage
- ✅ API endpoint validation
- ✅ Business rule enforcement
- ✅ Error handling
- ✅ Data validation
- ✅ Edge cases

### Test Database
Tests use a separate database (`trailers_db_test`) that is automatically created and cleaned for each test run.

## Project Structure

```
trailers-service/
├── src/
│   ├── domain/                 # Business logic layer
│   │   ├── entities/          # Domain entities
│   │   ├── enums/             # Business enumerations
│   │   ├── repositories/      # Repository interfaces
│   │   └── value-objects/     # Value objects (VIN, Specifications)
│   ├── application/           # Application services layer
│   │   ├── dtos/             # Data transfer objects
│   │   └── use-cases/        # Business use cases
│   ├── infrastructure/        # Infrastructure layer
│   │   └── persistence/      # Database implementation
│   │       ├── repositories/ # Repository implementations
│   │       └── PrismaService.ts
│   ├── presentation/          # API layer
│   │   └── controllers/      # REST controllers
│   ├── app.module.ts         # Main application module
│   └── main.ts               # Application entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── test/                     # E2E tests
│   ├── *.postman_collection.json
│   ├── run-postman-tests.js
│   └── setup-test-db.js
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

## Business Logic

### Trailer Types
- **Dry Van**: Standard enclosed trailer for general freight
- **Reefer**: Refrigerated trailer for temperature-controlled cargo
- **Flatbed**: Open platform trailer for oversized materials
- **Tanker**: Specialized trailer for liquid cargo
- **Lowboy**: Heavy-duty trailer for equipment
- **Step Deck**: Two-level trailer for tall cargo

### Ownership Types
- **Owned**: Company owns the trailer outright
- **Leased**: Company leases from another party (requires lease end date)
- **Rented**: Short-term rental

### Validation Rules
1. **VIN Validation**: Must be 17 characters, alphanumeric (excluding I, O, Q)
2. **Lease Validation**: Leased trailers must have future lease end date
3. **Dimension Validation**: All dimensions must be positive numbers
4. **Year Validation**: Between 1900 and current year + 1

### Status Management
- **Available**: Ready for assignment
- **Assigned**: Currently attached to a truck
- **Maintenance**: Under repair/maintenance
- **Out of Service**: Not available for use

## Development

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# View database in Prisma Studio
npx prisma studio
```

### Code Style
The project follows:
- TypeScript strict mode
- Clean Architecture principles
- SOLID principles
- Domain-Driven Design concepts

### Adding New Features

1. **Domain Layer**: Define entities and value objects
2. **Application Layer**: Create use cases and DTOs
3. **Infrastructure Layer**: Implement repository methods
4. **Presentation Layer**: Add controller endpoints
5. **Testing**: Write E2E tests in Postman collection

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in .env
   - Kill process using port 3001

3. **Migration Errors**
   - Run `npx prisma migrate reset` to reset database
   - Check schema.prisma for syntax errors

## License

This project is part of a fleet management system.

## Support

For issues or questions, please refer to the project documentation or contact the development team.