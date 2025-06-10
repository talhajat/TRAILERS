import { TrailerType, getTrailerTypeDisplayName } from '../../domain/enums/TrailerType';
import { TrailerStatus, getTrailerStatusDisplayName } from '../../domain/enums/TrailerStatus';
import { Trailer } from '../../domain/entities/Trailer';

/**
 * Trailer Response DTO
 *
 * Data Transfer Object for returning trailer data to the API.
 * This formats the data exactly as expected by the frontend table.
 *
 * Business Purpose: Transforms domain entities into API response format for table display
 */
export class TrailerResponseDto {
  // Maps directly to table columns only
  id: string;                    // ID/UNIT column
  trailerType: string;           // TYPE column (human-readable)
  year: number | null;           // YEAR column
  vin: string | null;            // VIN column
  status: string;                // STATUS column (human-readable)
  lengthCapacity: string;        // LENGTH/CAPACITY column (combined format)
  axleCount: number | null;      // AXLES column
  attachedTruck: string;         // ATTACHED TRUCK column
  currentLocation: string;       // CURRENT LOCATION column

  constructor(trailer: Trailer) {
    const specs = trailer.getSpecifications();
    
    // Map to table columns with proper formatting
    this.id = trailer.getTrailerId();
    this.trailerType = getTrailerTypeDisplayName(trailer.getTrailerType());
    this.year = trailer.getYear() || null;
    this.vin = trailer.getVin()?.getValue() || null;
    this.status = getTrailerStatusDisplayName(trailer.getStatus());
    this.lengthCapacity = specs.getLengthCapacityDisplay();
    this.axleCount = specs.getAxleCount() || null;
    this.attachedTruck = trailer.getAttachedTruckId() || 'None';
    this.currentLocation = trailer.getCurrentLocation() || 'N/A';
  }

  /**
   * Create response DTO from domain entity
   */
  static fromDomain(trailer: Trailer): TrailerResponseDto {
    return new TrailerResponseDto(trailer);
  }

  /**
   * Create response DTOs from array of domain entities
   */
  static fromDomainArray(trailers: Trailer[]): TrailerResponseDto[] {
    return trailers.map(trailer => new TrailerResponseDto(trailer));
  }
}

/**
 * Paginated Trailers Response DTO
 * 
 * Response format for the GET /trailers endpoint with pagination
 */
export class TrailersListResponseDto {
  trailers: TrailerResponseDto[];
  total: number;
  page: number;
  limit: number;

  constructor(
    trailers: Trailer[],
    total: number,
    page: number,
    limit: number
  ) {
    this.trailers = TrailerResponseDto.fromDomainArray(trailers);
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}