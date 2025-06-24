import { TrailerType } from '../enums/TrailerType';
import { TrailerStatus } from '../enums/TrailerStatus';
import { OwnershipType } from '../enums/OwnershipType';
import { VIN } from '../value-objects/VIN';
import { TrailerSpecifications } from '../value-objects/TrailerSpecifications';

/**
 * Trailer Entity (Aggregate Root)
 * 
 * This is the main business entity representing a trailer in the system.
 * It encapsulates all trailer-related business logic and maintains data consistency.
 * 
 * Business Purpose: Represents a physical trailer asset with all its properties and business rules
 */
export class Trailer {
  private constructor(
    private readonly id: string,
    private trailerId: string,
    private trailerType: TrailerType,
    private status: TrailerStatus,
    private specifications: TrailerSpecifications,
    private ownershipType: OwnershipType,
    private vin?: VIN,
    private year?: number,
    private color?: string,
    private purchaseDate?: Date,
    private leaseEndDate?: Date,
    private purchasePrice?: number,
    private licensePlate?: string,
    private issuingState?: string,
    private registrationExp?: Date,
    private insurancePolicy?: string,
    private insuranceExp?: Date,
    private jurisdiction?: string,
    private gvwr?: number,
    private assignedYard?: string,
    private currentLocation?: string,
    private attachedTruckId?: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  /**
   * Factory method to create a new trailer with validation
   * This is the primary way to create trailer instances
   */
  public static create(data: {
    trailerId?: string;
    trailerType: TrailerType;
    year?: number;
    vin?: string;
    color?: string;
    length?: number;
    width?: number;
    height?: number;
    capacity?: number;
    axleCount?: number;
    ownershipType: OwnershipType;
    purchaseDate?: Date;
    leaseEndDate?: Date;
    purchasePrice?: number;
    licensePlate?: string;
    issuingState?: string;
    registrationExp?: Date;
    insurancePolicy?: string;
    insuranceExp?: Date;
    jurisdiction?: string;
    gvwr?: number;
    initialStatus?: TrailerStatus;
    assignedYard?: string;
    attachedTruckId?: string;
  }): Trailer {
    // Generate trailer ID if not provided
    const trailerId = data.trailerId || this.generateTrailerId();

    // Validate VIN if provided
    let vin: VIN | undefined;
    if (data.vin) {
      vin = VIN.create(data.vin);
    }

    // Create specifications with defaults if needed
    const specifications = TrailerSpecifications.createWithDefaults(
      data.length,
      data.width,
      data.height,
      data.capacity,
      data.axleCount
    );

    // Set initial status
    const status = data.initialStatus || TrailerStatus.AVAILABLE;

    // Business rule: Validate lease end date for leased trailers
    if (data.ownershipType === OwnershipType.LEASED && !data.leaseEndDate) {
      throw new Error('Lease end date is required for leased trailers');
    }

    // Business rule: Lease end date must be in the future
    if (data.leaseEndDate) {
      const leaseDate = new Date(data.leaseEndDate);
      const today = new Date();
      // Set time to start of day for fair comparison
      today.setHours(0, 0, 0, 0);
      leaseDate.setHours(0, 0, 0, 0);
      
      if (leaseDate <= today) {
        throw new Error('Lease end date must be in the future');
      }
    }

    // Set current location based on assigned yard or default
    const currentLocation = data.assignedYard ? this.getYardName(data.assignedYard) : 'Yard';

    // Generate unique ID for the entity
    const id = this.generateId();

    return new Trailer(
      id,
      trailerId,
      data.trailerType,
      status,
      specifications,
      data.ownershipType,
      vin,
      data.year,
      data.color,
      data.purchaseDate,
      data.leaseEndDate,
      data.purchasePrice,
      data.licensePlate,
      data.issuingState,
      data.registrationExp,
      data.insurancePolicy,
      data.insuranceExp,
      data.jurisdiction || 'IFTA',
      data.gvwr,
      data.assignedYard,
      currentLocation,
      data.attachedTruckId
    );
  }

  /**
   * Factory method to recreate trailer from database data
   * Used when loading existing trailers from persistence
   */
  public static fromDatabase(data: any): Trailer {
    const vin = data.vin ? VIN.fromDatabase(data.vin) : undefined;
    const specifications = TrailerSpecifications.create(
      data.length,
      data.width,
      data.height,
      data.capacity,
      data.axleCount
    );

    return new Trailer(
      data.id,
      data.trailerId,
      data.trailerType as TrailerType,
      data.status as TrailerStatus,
      specifications,
      data.ownershipType as OwnershipType,
      vin,
      data.year,
      data.color,
      data.purchaseDate,
      data.leaseEndDate,
      data.purchasePrice,
      data.licensePlate,
      data.issuingState,
      data.registrationExp,
      data.insurancePolicy,
      data.insuranceExp,
      data.jurisdiction,
      data.gvwr,
      data.assignedYard,
      data.currentLocation,
      data.attachedTruckId,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters for accessing trailer properties
  public getId(): string { return this.id; }
  public getTrailerId(): string { return this.trailerId; }
  public getTrailerType(): TrailerType { return this.trailerType; }
  public getStatus(): TrailerStatus { return this.status; }
  public getSpecifications(): TrailerSpecifications { return this.specifications; }
  public getOwnershipType(): OwnershipType { return this.ownershipType; }
  public getVin(): VIN | undefined { return this.vin; }
  public getYear(): number | undefined { return this.year; }
  public getColor(): string | undefined { return this.color; }
  public getCurrentLocation(): string | undefined { return this.currentLocation; }
  public getAttachedTruckId(): string | undefined { return this.attachedTruckId; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  /**
   * Convert trailer to plain object for persistence
   */
  public toObject(): any {
    return {
      id: this.id,
      trailerId: this.trailerId,
      trailerType: this.trailerType,
      status: this.status,
      year: this.year,
      vin: this.vin?.getValue(),
      color: this.color,
      ...this.specifications.toObject(),
      ownershipType: this.ownershipType,
      purchaseDate: this.purchaseDate,
      leaseEndDate: this.leaseEndDate,
      purchasePrice: this.purchasePrice,
      licensePlate: this.licensePlate,
      issuingState: this.issuingState,
      registrationExp: this.registrationExp,
      insurancePolicy: this.insurancePolicy,
      insuranceExp: this.insuranceExp,
      jurisdiction: this.jurisdiction,
      gvwr: this.gvwr,
      assignedYard: this.assignedYard,
      currentLocation: this.currentLocation,
      attachedTruckId: this.attachedTruckId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Private helper: Generate unique trailer ID
   */
  private static generateTrailerId(): string {
    const prefix = 'TR';
    const number = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    return `${prefix}${number}`;
  }

  /**
   * Private helper: Generate unique entity ID
   */
  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Private helper: Get yard name from yard ID
   * In a real system, this would lookup from a yards service
   */
  private static getYardName(yardId: string): string {
    const yardMap: { [key: string]: string } = {
      'loc1': 'Detroit Yard',
      'loc2': 'Chicago Terminal',
      'loc3': 'Shop - Cleveland',
      'loc4': 'Toledo Drop Yard',
      'loc5': 'Customer Site - Acme Corp'
    };
    return yardMap[yardId] || 'Unknown Yard';
  }
}