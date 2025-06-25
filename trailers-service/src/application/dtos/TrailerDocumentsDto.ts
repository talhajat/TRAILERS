/// <reference types="multer" />

/**
 * Trailer Documents Upload DTO
 *
 * Handles document file uploads for trailers.
 * These are processed separately from the main trailer data using multipart/form-data.
 *
 * Business Purpose: Manages document attachments for compliance and record-keeping
 */
export class TrailerDocumentsDto {
  // Trailer ID to associate documents with
  trailerId: string;

  // Document types that can be uploaded
  // These will be actual file objects when received via multipart/form-data
  titleDoc?: Express.Multer.File;        // Vehicle title/ownership document
  leaseDoc?: Express.Multer.File;        // Lease agreement (required for leased trailers)
  registrationDoc?: Express.Multer.File; // Registration document
  insuranceDoc?: Express.Multer.File;    // Insurance certificate
  inspectionDoc?: Express.Multer.File[]; // Inspection reports (can be multiple)
}

/**
 * Document metadata after upload
 * Returned after successful document upload
 */
export class DocumentUploadResponseDto {
  documentType: string;  // Type of document (title, lease, etc.)
  fileName: string;      // Original file name
  filePath: string;      // Storage path or URL
  uploadedAt: Date;      // Upload timestamp
  fileSize: number;      // File size in bytes
}

/**
 * Allowed document types and file extensions
 */
export const ALLOWED_DOCUMENT_TYPES = {
  titleDoc: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  leaseDoc: {
    mimeTypes: ['application/pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: ['.pdf']
  },
  registrationDoc: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  insuranceDoc: {
    mimeTypes: ['application/pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: ['.pdf']
  },
  inspectionDoc: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 10 * 1024 * 1024, // 10MB per file
    extensions: ['.pdf', '.jpg', '.jpeg', '.png']
  }
};