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
   * Find a trailer by its unique ID
   * Returns undefined if not found
   */
  findById(id: string): Promise<Trailer | undefined>;

  /**
   * Find a trailer by its trailer ID (unit number)
   * Returns undefined if not found
   */
  findByTrailerId(trailerId: string): Promise<Trailer | undefined>;

  /**
   * Find a trailer by its VIN
   * Returns undefined if not found
   */
  findByVin(vin: string): Promise<Trailer | undefined>;

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
   * Update an existing trailer
   * Returns the updated trailer
   */
  update(trailer: Trailer): Promise<Trailer>;

  /**
   * Delete a trailer by ID
   * Returns true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

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