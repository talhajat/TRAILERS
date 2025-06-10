/**
 * Ownership Type Enum
 *
 * This enum defines how the company acquires and uses trailers.
 *
 * Business Purpose: Tracks financial relationship and determines required documentation
 */
export enum OwnershipType {
  // Company owns the trailer outright
  OWNED = 'owned',
  
  // Company leases the trailer from another party
  LEASED = 'leased',
  
  // Company rents the trailer short-term
  RENTED = 'rented'
}

/**
 * Helper function to get human-readable display name for ownership type
 */
export function getOwnershipTypeDisplayName(type: OwnershipType): string {
  switch (type) {
    case OwnershipType.OWNED:
      return 'Owned';
    case OwnershipType.LEASED:
      return 'Leased';
    case OwnershipType.RENTED:
      return 'Rented';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to convert string to OwnershipType enum
 * Used when processing input data
 */
export function parseOwnershipType(value: string): OwnershipType {
  const normalizedValue = value.toLowerCase();
  
  switch (normalizedValue) {
    case 'owned':
      return OwnershipType.OWNED;
    case 'leased':
      return OwnershipType.LEASED;
    case 'rented':
      return OwnershipType.RENTED;
    default:
      return OwnershipType.OWNED; // Default to owned
  }
}

/**
 * Business rule: Check if lease end date is required
 * Lease end date is only required for leased trailers
 */
export function requiresLeaseEndDate(type: OwnershipType): boolean {
  return type === OwnershipType.LEASED;
}

/**
 * Business rule: Check if lease agreement document is required
 * Used for document validation - lease agreement is only required for leased trailers
 */
export function requiresLeaseDocument(type: OwnershipType): boolean {
  return type === OwnershipType.LEASED;
}