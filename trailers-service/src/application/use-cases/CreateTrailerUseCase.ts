import { Injectable } from '@nestjs/common';
import { Trailer } from '../../domain/entities/Trailer';
import { ITrailerRepository } from '../../domain/repositories/ITrailerRepository';
import { CreateTrailerDto } from '../dtos/CreateTrailerDto';
import { TrailerResponseDto } from '../dtos/TrailerResponseDto';
import { TrailerType, parseTrailerType } from '../../domain/enums/TrailerType';
import { TrailerStatus, parseTrailerStatus } from '../../domain/enums/TrailerStatus';
import { OwnershipType, parseOwnershipType } from '../../domain/enums/OwnershipType';

/**
 * Create Trailer Use Case
 * 
 * Handles the business logic for creating a new trailer.
 * Validates input, applies business rules, and persists the trailer.
 * 
 * Business Purpose: Ensures trailers are created with valid data and proper defaults
 */
@Injectable()
export class CreateTrailerUseCase {
  constructor(
    private readonly trailerRepository: ITrailerRepository
  ) {}

  /**
   * Execute the use case to create a new trailer
   */
  async execute(dto: CreateTrailerDto): Promise<TrailerResponseDto> {
    // Check if trailer ID already exists (if provided)
    if (dto.trailerId) {
      const exists = await this.trailerRepository.existsByTrailerId(dto.trailerId);
      if (exists) {
        throw new Error(`Trailer with ID ${dto.trailerId} already exists`);
      }
    }

    // Check if VIN already exists (if provided)
    if (dto.vin) {
      const exists = await this.trailerRepository.existsByVin(dto.vin);
      if (exists) {
        throw new Error(`Trailer with VIN ${dto.vin} already exists`);
      }
    }

    // Parse enums from string values
    const trailerType = parseTrailerType(dto.trailerType);
    const ownershipType = parseOwnershipType(dto.ownershipType);
    const initialStatus = dto.initialStatus ? parseTrailerStatus(dto.initialStatus) : undefined;

    // Convert date strings to Date objects
    const purchaseDate = dto.purchaseDate ? new Date(dto.purchaseDate) : undefined;
    const leaseEndDate = dto.leaseEndDate ? new Date(dto.leaseEndDate) : undefined;
    const registrationExp = dto.registrationExp ? new Date(dto.registrationExp) : undefined;
    const insuranceExp = dto.insuranceExp ? new Date(dto.insuranceExp) : undefined;

    // Create the trailer entity using factory method
    const trailer = Trailer.create({
      trailerId: dto.trailerId,
      trailerType,
      year: dto.year,
      vin: dto.vin,
      color: dto.color,
      length: dto.length,
      width: dto.width,
      height: dto.height,
      capacity: dto.capacity,
      axleCount: dto.axleCount,
      ownershipType,
      purchaseDate,
      leaseEndDate,
      purchasePrice: dto.purchasePrice,
      licensePlate: dto.licensePlate,
      issuingState: dto.issuingState,
      registrationExp,
      insurancePolicy: dto.insurancePolicy,
      insuranceExp,
      jurisdiction: dto.jurisdiction,
      gvwr: dto.gvwr,
      initialStatus,
      assignedYard: dto.assignedYard,
      attachedTruckId: dto.defaultTruckId // Map from form field name
    });

    // Save the trailer to the repository
    const savedTrailer = await this.trailerRepository.save(trailer);

    // Return the response DTO
    return TrailerResponseDto.fromDomain(savedTrailer);
  }
}