import { Trailer } from '../entities/Trailer';

/**
 * Trailer Repository Interface
 * 
 * This interface defines the contract for trailer data persistence.
 * It follows the Repository pattern from Domain-Driven Design.
 * 
 * Business Purpose: Abstracts data access operations for trailers
 */
export interface ITrailerRepository {
  /**
   * Save a new trailer to the database
   * Returns the saved trailer with generated ID
   */
  save(trailer: Trailer): Promise<Trailer>;

  /**
   * Get all trailers with optional filtering and pagination
   */
  findAll(options?: {
    page?: number;
    limit?: number;
    status?: string;
    trailerType?: string;
  }): Promise<{
    trailers: Trailer[];
    total: number;
    page: number;
    limit: number;
  }>;

  /**
   * Check if a trailer ID already exists
   * Used for uniqueness validation
   */
  existsByTrailerId(trailerId: string): Promise<boolean>;

  /**
   * Check if a VIN already exists
   * Used for uniqueness validation
   */
  existsByVin(vin: string): Promise<boolean>;
}