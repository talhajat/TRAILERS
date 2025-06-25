import { Injectable } from '@nestjs/common';
import { ITrailerRepository } from '../../../domain/repositories/ITrailerRepository';
import { Trailer } from '../../../domain/entities/Trailer';
import { PrismaService } from '../PrismaService';
import { TrailerType } from '../../../domain/enums/TrailerType';
import { TrailerStatus } from '../../../domain/enums/TrailerStatus';
import { OwnershipType } from '../../../domain/enums/OwnershipType';

/**
 * Trailer Repository Implementation
 * 
 * Implements the ITrailerRepository interface using Prisma ORM.
 * Handles the mapping between domain entities and database records.
 * 
 * Business Purpose: Provides data persistence for trailer entities
 */
@Injectable()
export class TrailerRepository implements ITrailerRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save a new trailer to the database
   */
  async save(trailer: Trailer): Promise<Trailer> {
    const data = trailer.toObject();
    
    // Convert enum values to database format
    const dbData = {
      id: data.id,
      trailerId: data.trailerId,
      trailerType: this.mapTrailerTypeToDb(data.trailerType),
      year: data.year,
      vin: data.vin,
      color: data.color,
      length: data.length,
      width: data.width,
      height: data.height,
      capacity: data.capacity,
      axleCount: data.axleCount,
      ownershipType: this.mapOwnershipTypeToDb(data.ownershipType),
      purchaseDate: data.purchaseDate,
      leaseEndDate: data.leaseEndDate,
      purchasePrice: data.purchasePrice,
      licensePlate: data.licensePlate,
      issuingState: data.issuingState,
      registrationExp: data.registrationExp,
      insurancePolicy: data.insurancePolicy,
      insuranceExp: data.insuranceExp,
      jurisdiction: data.jurisdiction,
      gvwr: data.gvwr,
      status: this.mapTrailerStatusToDb(data.status),
      assignedYard: data.assignedYard,
      currentLocation: data.currentLocation,
      attachedTruckId: data.attachedTruckId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };

    const savedTrailer = await this.prisma.trailer.create({
      data: dbData
    });

    return this.mapToEntity(savedTrailer);
  }

  /**
   * Get all trailers with optional filtering and pagination
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: string;
    trailerType?: string;
  }): Promise<{
    trailers: Trailer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    if (options?.status) {
      where.status = this.mapTrailerStatusToDb(options.status as TrailerStatus);
    }
    if (options?.trailerType) {
      where.trailerType = this.mapTrailerTypeToDb(options.trailerType as TrailerType);
    }

    // Execute queries in parallel
    const [trailers, total] = await Promise.all([
      this.prisma.trailer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.trailer.count({ where })
    ]);

    return {
      trailers: trailers.map(trailer => this.mapToEntity(trailer)),
      total,
      page,
      limit
    };
  }

  /**
   * Check if a trailer ID already exists
   */
  async existsByTrailerId(trailerId: string): Promise<boolean> {
    const count = await this.prisma.trailer.count({
      where: { trailerId }
    });
    return count > 0;
  }

  /**
   * Check if a VIN already exists
   */
  async existsByVin(vin: string): Promise<boolean> {
    const count = await this.prisma.trailer.count({
      where: { vin }
    });
    return count > 0;
  }

  /**
   * Find a trailer by its unique ID
   * Can accept either the database ID or the trailer ID (e.g., TR501)
   * Returns null if trailer is not found
   */
  async findById(id: string): Promise<Trailer | null> {
    // First try to find by database ID
    let trailer = await this.prisma.trailer.findUnique({
      where: { id }
    });

    // If not found, try to find by trailer ID
    if (!trailer) {
      trailer = await this.prisma.trailer.findFirst({
        where: { trailerId: id }
      });
    }

    if (!trailer) {
      return null;
    }

    return this.mapToEntity(trailer);
  }

  /**
   * Private helper: Map database record to domain entity
   */
  private mapToEntity(dbTrailer: any): Trailer {
    return Trailer.fromDatabase({
      id: dbTrailer.id,
      trailerId: dbTrailer.trailerId,
      trailerType: this.mapTrailerTypeFromDb(dbTrailer.trailerType),
      year: dbTrailer.year,
      vin: dbTrailer.vin,
      color: dbTrailer.color,
      length: dbTrailer.length,
      width: dbTrailer.width,
      height: dbTrailer.height,
      capacity: dbTrailer.capacity,
      axleCount: dbTrailer.axleCount,
      ownershipType: this.mapOwnershipTypeFromDb(dbTrailer.ownershipType),
      purchaseDate: dbTrailer.purchaseDate,
      leaseEndDate: dbTrailer.leaseEndDate,
      purchasePrice: dbTrailer.purchasePrice,
      licensePlate: dbTrailer.licensePlate,
      issuingState: dbTrailer.issuingState,
      registrationExp: dbTrailer.registrationExp,
      insurancePolicy: dbTrailer.insurancePolicy,
      insuranceExp: dbTrailer.insuranceExp,
      jurisdiction: dbTrailer.jurisdiction,
      gvwr: dbTrailer.gvwr,
      status: this.mapTrailerStatusFromDb(dbTrailer.status),
      assignedYard: dbTrailer.assignedYard,
      currentLocation: dbTrailer.currentLocation,
      attachedTruckId: dbTrailer.attachedTruckId,
      createdAt: dbTrailer.createdAt,
      updatedAt: dbTrailer.updatedAt
    });
  }

  /**
   * Enum mapping helpers - Domain to Database
   */
  private mapTrailerTypeToDb(type: TrailerType): string {
    // TrailerType enum values are already strings, so we can return them directly
    return type;
  }

  private mapTrailerStatusToDb(status: TrailerStatus): string {
    // TrailerStatus enum values are already strings, so we can return them directly
    return status;
  }

  private mapOwnershipTypeToDb(type: OwnershipType): string {
    // OwnershipType enum values are already strings, so we can return them directly
    return type;
  }

  /**
   * Enum mapping helpers - Database to Domain
   */
  private mapTrailerTypeFromDb(type: string): TrailerType {
    // Since our enums use string values, we can cast directly
    // But we should validate it's a valid enum value
    const validTypes = Object.values(TrailerType);
    if (validTypes.includes(type as TrailerType)) {
      return type as TrailerType;
    }
    return TrailerType.DRY_VAN; // Default fallback
  }

  private mapTrailerStatusFromDb(status: string): TrailerStatus {
    // Since our enums use string values, we can cast directly
    // But we should validate it's a valid enum value
    const validStatuses = Object.values(TrailerStatus);
    if (validStatuses.includes(status as TrailerStatus)) {
      return status as TrailerStatus;
    }
    return TrailerStatus.AVAILABLE; // Default fallback
  }

  private mapOwnershipTypeFromDb(type: string): OwnershipType {
    // Since our enums use string values, we can cast directly
    // But we should validate it's a valid enum value
    const validTypes = Object.values(OwnershipType);
    if (validTypes.includes(type as OwnershipType)) {
      return type as OwnershipType;
    }
    return OwnershipType.OWNED; // Default fallback
  }
}