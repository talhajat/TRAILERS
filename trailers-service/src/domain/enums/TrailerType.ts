/**
 * Trailer Type Enum
 *
 * This enum defines the different types of trailers available in the system.
 *
 * Business Purpose: Categorizes trailers by their intended use and cargo type
 */
export enum TrailerType {
  // Standard enclosed trailer for general freight
  DRY_VAN = 'dry_van',
  
  // Refrigerated trailer for temperature-controlled cargo
  REEFER = 'reefer',
  
  // Open platform trailer for oversized or construction materials
  FLATBED = 'flatbed',
  
  // Specialized trailer for liquid cargo
  TANKER = 'tanker',
  
  // Heavy-duty trailer for extremely heavy equipment
  LOWBOY = 'lowboy',
  
  // Two-level trailer for tall cargo
  STEP_DECK = 'step_deck',
  
  // Custom or specialized trailer types
  OTHER = 'other'
}

/**
 * Helper function to get human-readable display name for trailer types
 * Provides standardized naming for trailer types
 */
export function getTrailerTypeDisplayName(type: TrailerType): string {
  switch (type) {
    case TrailerType.DRY_VAN:
      return 'Dry Van';
    case TrailerType.REEFER:
      return 'Reefer';
    case TrailerType.FLATBED:
      return 'Flatbed';
    case TrailerType.TANKER:
      return 'Tanker';
    case TrailerType.LOWBOY:
      return 'Lowboy';
    case TrailerType.STEP_DECK:
      return 'Step Deck';
    case TrailerType.OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to convert string to TrailerType enum
 * Used when processing input data
 */
export function parseTrailerType(value: string): TrailerType {
  const normalizedValue = value.toLowerCase().replace(/\s+/g, '_');
  
  switch (normalizedValue) {
    case 'dry_van':
    case 'dry van':
      return TrailerType.DRY_VAN;
    case 'reefer':
      return TrailerType.REEFER;
    case 'flatbed':
      return TrailerType.FLATBED;
    case 'tanker':
      return TrailerType.TANKER;
    case 'lowboy':
      return TrailerType.LOWBOY;
    case 'step_deck':
    case 'step deck':
      return TrailerType.STEP_DECK;
    case 'other':
      return TrailerType.OTHER;
    default:
      return TrailerType.DRY_VAN; // Default fallback
  }
}