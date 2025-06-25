import { Injectable, NotFoundException } from '@nestjs/common';
import { ITrailerRepository } from '../../domain/repositories/ITrailerRepository';
import { TrailerProfileDto } from '../dtos/TrailerProfileDto';

/**
 * Use Case: Get Trailer By ID
 * This use case handles the business logic for retrieving detailed information
 * about a specific trailer when a user clicks on the trailer ID in the table
 */
@Injectable()
export class GetTrailerByIdUseCase {
  constructor(private readonly trailerRepository: ITrailerRepository) {}

  /**
   * Executes the use case to get trailer details by ID
   * @param id - The unique identifier of the trailer
   * @returns TrailerProfileDto with all trailer details organized by sections
   * @throws NotFoundException if trailer is not found
   */
  async execute(id: string): Promise<TrailerProfileDto> {
    // Retrieve the trailer from the repository
    const trailer = await this.trailerRepository.findById(id);
    
    // Check if trailer exists
    if (!trailer) {
      throw new NotFoundException(`Trailer with ID ${id} not found`);
    }

    // Get trailer specifications for easier access
    const specifications = trailer.getSpecifications();
    
    // Map the trailer entity to the profile DTO with proper field mappings
    const profileDto: TrailerProfileDto = {
      // Basic identification fields
      id: trailer.getId(),
      unitNumber: trailer.getTrailerId(),
      type: trailer.getTrailerType(),
      status: trailer.getStatus(),
      currentLocation: trailer.getCurrentLocation() || undefined,
      
      // Basic Information section mapping
      basicInformation: {
        vin: trailer.getVin()?.getValue() || '',           // VIN from form
        color: trailer.getColor() || '',                   // Color from form
        year: trailer.getYear() || 0,                      // Year from form
        axleCountType: `${specifications.getAxleCount() || 0} Axles`, // Format: "2 Axles"
      },

      // Specifications section mapping
      specifications: {
        length: specifications.getLength() || 0,           // Length in feet from form
        height: specifications.getHeight() || 0,           // Height in inches from form
        width: specifications.getWidth() || 0,             // Width in inches from form
        capacity: specifications.getCapacity() || 0,       // Capacity in lbs from form
      },

      // Ownership & Financials section mapping
      ownershipFinancials: {
        ownershipType: trailer.getOwnershipType(),         // Ownership Type from form
        leaseStartDate: trailer.getPurchaseDate(),         // Purchase/Lease Start Date from form
        leaseEndDate: trailer.getLeaseEndDate(),           // Lease End Date (if leased)
        leaseCost: trailer.getPurchasePrice(),             // Purchase Price/Lease Cost
      },

      // Registration & Compliance section mapping
      registrationCompliance: {
        licensePlate: trailer.getLicensePlate() || '',     // License Plate Number from form
        registrationExpiry: trailer.getRegistrationExp() || new Date(), // Registration Expiration from form
        insurancePolicy: trailer.getInsurancePolicy() || '', // Insurance Policy Number from form
        insuranceExpiry: trailer.getInsuranceExp() || new Date(), // Insurance Expiration from form
        ptiDueDate: 'N/A',  // PTI Due Date - Not available in form, so sending "N/A" as requested
      },

      // Documents section mapping
      // TODO: Implement documents functionality when document management is added
      documents: [],

      // Additional metadata
      assignedYard: trailer.getAssignedYard() || undefined,
      createdAt: trailer.getCreatedAt(),
      updatedAt: trailer.getUpdatedAt(),
    };

    return profileDto;
  }
}