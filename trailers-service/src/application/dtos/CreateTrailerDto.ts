import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, IsDecimal, Min, Max } from 'class-validator';
import { TrailerType } from '../../domain/enums/TrailerType';
import { TrailerStatus } from '../../domain/enums/TrailerStatus';
import { OwnershipType } from '../../domain/enums/OwnershipType';

/**
 * Create Trailer DTO
 * 
 * Data Transfer Object for creating a new trailer.
 * This matches the structure of the "Add New Trailer" form.
 * 
 * Business Purpose: Validates and transfers trailer creation data from API to domain
 */
export class CreateTrailerDto {
  // Section 1: Identification & Basic Details
  @IsOptional()
  @IsString()
  trailerId?: string; // Auto-generated if not provided

  @IsEnum(TrailerType)
  trailerType: TrailerType = TrailerType.DRY_VAN;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2030)
  year?: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  color?: string;

  // Section 2: Specifications
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  length?: number; // feet

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  width?: number; // inches

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  height?: number; // inches

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200000)
  capacity?: number; // lbs

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  axleCount?: number;

  // Section 3: Ownership & Financials
  @IsEnum(OwnershipType)
  ownershipType: OwnershipType = OwnershipType.OWNED;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsDateString()
  leaseEndDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  // Section 4: Registration & Compliance
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  issuingState?: string;

  @IsOptional()
  @IsDateString()
  registrationExp?: string;

  @IsOptional()
  @IsString()
  insurancePolicy?: string;

  @IsOptional()
  @IsDateString()
  insuranceExp?: string;

  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200000)
  gvwr?: number; // lbs

  // Section 5: Status & Location
  @IsOptional()
  @IsEnum(TrailerStatus)
  initialStatus?: TrailerStatus;

  @IsOptional()
  @IsString()
  assignedYard?: string;

  @IsOptional()
  @IsString()
  defaultTruckId?: string;

  // Section 6: Documents are handled separately via multipart/form-data upload
  // Document fields are not included in this DTO as they require file upload handling
}