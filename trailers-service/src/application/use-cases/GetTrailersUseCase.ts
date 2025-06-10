import { Injectable } from '@nestjs/common';
import { ITrailerRepository } from '../../domain/repositories/ITrailerRepository';
import { TrailersListResponseDto } from '../dtos/TrailerResponseDto';

/**
 * Get Trailers Use Case
 * 
 * Handles the business logic for retrieving trailers for table display.
 * Supports pagination and basic filtering.
 * 
 * Business Purpose: Provides trailer data formatted for frontend table consumption
 */
@Injectable()
export class GetTrailersUseCase {
  constructor(
    private readonly trailerRepository: ITrailerRepository
  ) {}

  /**
   * Execute the use case to get trailers with pagination
   */
  async execute(options?: {
    page?: number;
    limit?: number;
    status?: string;
    trailerType?: string;
  }): Promise<TrailersListResponseDto> {
    // Set default pagination values
    const page = options?.page || 1;
    const limit = options?.limit || 10;

    // Validate pagination parameters
    if (page < 1) {
      throw new Error('Page number must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Get trailers from repository with filtering and pagination
    const result = await this.trailerRepository.findAll({
      page,
      limit,
      status: options?.status,
      trailerType: options?.trailerType
    });

    // Return formatted response
    return new TrailersListResponseDto(
      result.trailers,
      result.total,
      result.page,
      result.limit
    );
  }
}