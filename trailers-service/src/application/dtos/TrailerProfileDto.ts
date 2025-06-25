/**
 * Data Transfer Object for Trailer Profile
 * This DTO represents the detailed information about a trailer that will be displayed
 * when a user clicks on a trailer ID in the table
 */
export class TrailerProfileDto {
  // Basic trailer identification
  id: string;
  unitNumber: string;
  type: string;
  status: string;
  currentLocation?: string;
  
  /**
   * Basic Information Section
   * Contains fundamental details about the trailer
   */
  basicInformation: {
    vin: string;        // Vehicle Identification Number
    color: string;      // Trailer color
    year: number;       // Manufacturing year
    axleCountType: string; // Number and type of axles (e.g., "2 Axles")
  };

  /**
   * Specifications Section
   * Contains physical dimensions and capacity information
   */
  specifications: {
    length: number;     // Length in feet
    height: number;     // Height in inches
    width: number;      // Width in inches
    capacity: number;   // Weight capacity in pounds (lbs)
  };

  /**
   * Ownership & Financials Section
   * Contains information about ownership and financial details
   */
  ownershipFinancials: {
    ownershipType: string;      // Type of ownership (Owned, Leased, Rented)
    leaseStartDate?: Date;      // Purchase date or lease start date
    leaseEndDate?: Date;        // Lease end date (only for leased trailers)
    leaseCost?: number;         // Purchase price or lease cost
  };

  /**
   * Registration & Compliance Section
   * Contains regulatory and compliance information
   */
  registrationCompliance: {
    licensePlate: string;       // License plate number
    registrationExpiry: Date;   // Registration expiration date
    insurancePolicy: string;    // Insurance policy number
    insuranceExpiry: Date;      // Insurance expiration date
    ptiDueDate?: string;        // PTI (Periodic Technical Inspection) due date - "N/A" for now
  };

  /**
   * Documents Section
   * Contains uploaded documents related to the trailer
   */
  documents: {
    id: string;           // Document unique identifier
    fileName: string;     // Name of the file
    fileType: string;     // Type of file (pdf, jpg, etc.)
    uploadDate: Date;     // Date when document was uploaded
    fileUrl: string;      // URL to access the document
  }[];

  // Additional metadata
  assignedYard?: string;  // Current yard/location assignment
  createdAt: Date;        // When the trailer was added to the system
  updatedAt: Date;        // Last update timestamp
}