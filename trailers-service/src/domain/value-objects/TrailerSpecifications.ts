/**
 * Trailer Specifications Value Object
 * 
 * This value object encapsulates trailer physical specifications including
 * dimensions (length, width, height) and capacity information.
 * 
 * Business Purpose: Ensures consistent handling of trailer physical properties
 */
export class TrailerSpecifications {
  private readonly length?: number;    // Length in feet
  private readonly width?: number;     // Width in inches
  private readonly height?: number;    // Height in inches
  private readonly capacity?: number;  // Capacity in pounds
  private readonly axleCount?: number; // Number of axles

  private constructor(
    length?: number,
    width?: number,
    height?: number,
    capacity?: number,
    axleCount?: number
  ) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.capacity = capacity;
    this.axleCount = axleCount;
  }

  /**
   * Factory method to create trailer specifications with validation
   */
  public static create(
    length?: number,
    width?: number,
    height?: number,
    capacity?: number,
    axleCount?: number
  ): TrailerSpecifications {
    // Validate length (if provided)
    if (length !== undefined && length !== null) {
      if (length <= 0 || length > 100) {
        throw new Error('Trailer length must be between 1 and 100 feet');
      }
    }

    // Validate width (if provided)
    if (width !== undefined && width !== null) {
      if (width <= 0 || width > 200) {
        throw new Error('Trailer width must be between 1 and 200 inches');
      }
    }

    // Validate height (if provided)
    if (height !== undefined && height !== null) {
      if (height <= 0 || height > 300) {
        throw new Error('Trailer height must be between 1 and 300 inches');
      }
    }

    // Validate capacity (if provided)
    if (capacity !== undefined && capacity !== null) {
      if (capacity <= 0 || capacity > 200000) {
        throw new Error('Trailer capacity must be between 1 and 200,000 pounds');
      }
    }

    // Validate axle count (if provided)
    if (axleCount !== undefined && axleCount !== null) {
      if (axleCount < 1 || axleCount > 10) {
        throw new Error('Trailer must have between 1 and 10 axles');
      }
    }

    return new TrailerSpecifications(length, width, height, capacity, axleCount);
  }

  /**
   * Factory method with default values for missing specifications
   * Used when input data is incomplete
   */
  public static createWithDefaults(
    length?: number,
    width?: number,
    height?: number,
    capacity?: number,
    axleCount?: number
  ): TrailerSpecifications {
    return new TrailerSpecifications(
      length ?? 53,      // Default: 53 feet (standard trailer length)
      width ?? 102,      // Default: 102 inches (standard trailer width)
      height ?? 162,     // Default: 162 inches (standard trailer height)
      capacity ?? 45000, // Default: 45,000 lbs (standard capacity)
      axleCount ?? 2     // Default: 2 axles (most common)
    );
  }

  /**
   * Get length in feet
   */
  public getLength(): number | undefined {
    return this.length;
  }

  /**
   * Get width in inches
   */
  public getWidth(): number | undefined {
    return this.width;
  }

  /**
   * Get height in inches
   */
  public getHeight(): number | undefined {
    return this.height;
  }

  /**
   * Get capacity in pounds
   */
  public getCapacity(): number | undefined {
    return this.capacity;
  }

  /**
   * Get axle count
   */
  public getAxleCount(): number | undefined {
    return this.axleCount;
  }

  /**
   * Format length and capacity for display
   * Creates a standardized format for length and capacity information
   * Example: "53 ft / 45,000 lbs"
   */
  public getLengthCapacityDisplay(): string {
    const lengthDisplay = this.length ? `${this.length} ft` : 'N/A';
    const capacityDisplay = this.capacity ? `${this.capacity.toLocaleString()} lbs` : 'N/A';
    return `${lengthDisplay} / ${capacityDisplay}`;
  }

  /**
   * Get formatted dimensions string
   * Example: "53' L x 102" W x 162" H"
   */
  public getDimensionsDisplay(): string {
    const parts: string[] = [];
    
    if (this.length) parts.push(`${this.length}' L`);
    if (this.width) parts.push(`${this.width}" W`);
    if (this.height) parts.push(`${this.height}" H`);
    
    return parts.length > 0 ? parts.join(' x ') : 'N/A';
  }

  /**
   * Check if specifications are complete
   */
  public isComplete(): boolean {
    return !!(this.length && this.width && this.height && this.capacity && this.axleCount);
  }

  /**
   * Convert to plain object for persistence
   */
  public toObject(): {
    length?: number;
    width?: number;
    height?: number;
    capacity?: number;
    axleCount?: number;
  } {
    return {
      length: this.length,
      width: this.width,
      height: this.height,
      capacity: this.capacity,
      axleCount: this.axleCount
    };
  }
}