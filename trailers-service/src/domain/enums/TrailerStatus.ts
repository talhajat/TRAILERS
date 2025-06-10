/**
 * Trailer Status Enum
 *
 * This enum defines the operational status of trailers in the system.
 * These values represent the business states a trailer can be in.
 *
 * Business Purpose: Tracks the current operational state of each trailer
 */
export enum TrailerStatus {
  // Trailer is ready for assignment to loads
  AVAILABLE = 'available',
  
  // Trailer is currently assigned to a truck and/or load
  ASSIGNED = 'assigned',
  
  // Trailer is undergoing maintenance or repairs
  MAINTENANCE = 'maintenance',
  
  // Trailer is not operational and cannot be used
  OUT_OF_SERVICE = 'out-of-service'
}

/**
 * Helper function to get human-readable display name for trailer status
 * Pure business logic for status display names
 */
export function getTrailerStatusDisplayName(status: TrailerStatus): string {
  switch (status) {
    case TrailerStatus.AVAILABLE:
      return 'Available';
    case TrailerStatus.ASSIGNED:
      return 'Assigned';
    case TrailerStatus.MAINTENANCE:
      return 'Maintenance';
    case TrailerStatus.OUT_OF_SERVICE:
      return 'Out of Service';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to convert string to TrailerStatus enum
 * Used when processing input data
 */
export function parseTrailerStatus(value: string): TrailerStatus {
  const normalizedValue = value.toLowerCase().replace(/\s+/g, '-');
  
  switch (normalizedValue) {
    case 'available':
      return TrailerStatus.AVAILABLE;
    case 'assigned':
      return TrailerStatus.ASSIGNED;
    case 'maintenance':
      return TrailerStatus.MAINTENANCE;
    case 'out-of-service':
    case 'out of service':
      return TrailerStatus.OUT_OF_SERVICE;
    default:
      return TrailerStatus.AVAILABLE; // Default to available
  }
}

/**
 * Business rule: Check if trailer can be assigned to a truck
 * Only available trailers can be assigned
 */
export function canBeAssigned(status: TrailerStatus): boolean {
  return status === TrailerStatus.AVAILABLE;
}

/**
 * Business rule: Check if trailer requires maintenance attention
 */
export function requiresMaintenanceAttention(status: TrailerStatus): boolean {
  return status === TrailerStatus.MAINTENANCE || status === TrailerStatus.OUT_OF_SERVICE;
}