/**
 * VIN (Vehicle Identification Number) Value Object
 * 
 * This value object encapsulates VIN validation and formatting logic.
 * VINs are unique identifiers for trailers and must follow specific format rules.
 * 
 * Business Purpose: Ensures data integrity and uniqueness for trailer identification
 */
export class VIN {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Factory method to create a VIN with validation
   * Validates format and throws error if invalid
   */
  public static create(value: string): VIN {
    if (!value || value.trim().length === 0) {
      throw new Error('VIN cannot be empty');
    }

    const cleanedValue = value.trim().toUpperCase();

    // Basic VIN validation rules
    if (!this.isValidFormat(cleanedValue)) {
      throw new Error('VIN must be 17 characters long and contain only letters and numbers');
    }

    if (this.containsInvalidCharacters(cleanedValue)) {
      throw new Error('VIN cannot contain I, O, or Q characters');
    }

    return new VIN(cleanedValue);
  }

  /**
   * Factory method to create VIN without validation (for existing data)
   * Used when loading data from database that's already been validated
   */
  public static fromDatabase(value: string): VIN {
    return new VIN(value);
  }

  /**
   * Get the VIN value as string
   * Used when storing to database or returning in API responses
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Get formatted VIN for display
   * Formats VIN with spaces for better readability
   */
  public getFormattedValue(): string {
    // Format as: XXX XXXX XXXX XXXX X (groups of 3-4-4-4-2)
    if (this.value.length === 17) {
      return `${this.value.slice(0, 3)} ${this.value.slice(3, 7)} ${this.value.slice(7, 11)} ${this.value.slice(11, 15)} ${this.value.slice(15)}`;
    }
    return this.value;
  }

  /**
   * Check if two VINs are equal
   */
  public equals(other: VIN): boolean {
    return this.value === other.value;
  }

  /**
   * Private helper: Validate VIN format
   */
  private static isValidFormat(value: string): boolean {
    // VIN must be exactly 17 characters
    if (value.length !== 17) {
      return false;
    }

    // VIN must contain only alphanumeric characters
    const alphanumericRegex = /^[A-Z0-9]+$/;
    return alphanumericRegex.test(value);
  }

  /**
   * Private helper: Check for invalid characters
   * VINs cannot contain I, O, or Q to avoid confusion with 1, 0
   */
  private static containsInvalidCharacters(value: string): boolean {
    return /[IOQ]/.test(value);
  }

  /**
   * Convert to string representation
   */
  public toString(): string {
    return this.value;
  }
}