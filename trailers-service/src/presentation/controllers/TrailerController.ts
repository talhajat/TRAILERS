/// <reference types="multer" />
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTrailerUseCase } from '../../application/use-cases/CreateTrailerUseCase';
import { GetTrailersUseCase } from '../../application/use-cases/GetTrailersUseCase';
import { GetTrailerByIdUseCase } from '../../application/use-cases/GetTrailerByIdUseCase';
import { CreateTrailerDto } from '../../application/dtos/CreateTrailerDto';
import { TrailerResponseDto } from '../../application/dtos/TrailerResponseDto';
import { TrailerProfileDto } from '../../application/dtos/TrailerProfileDto';
import { TrailerDocumentsDto } from '../../application/dtos/TrailerDocumentsDto';

/**
 * Trailer Controller
 * 
 * Handles HTTP requests for trailer operations.
 * Implements REST API endpoints for trailer management.
 * 
 * Business Purpose: Provides web API interface for trailer operations
 */
@Controller('trailers')
export class TrailerController {
  constructor(
    private readonly createTrailerUseCase: CreateTrailerUseCase,
    private readonly getTrailersUseCase: GetTrailersUseCase,
    private readonly getTrailerByIdUseCase: GetTrailerByIdUseCase
  ) {}


  /**
   * GET /trailers
   * Retrieve all trailers with optional filtering and pagination
   */
  @Get()
  async getTrailers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('trailerType') trailerType?: string
  ): Promise<{
    trailers: TrailerResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const options = {
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        status,
        trailerType
      };

      const result = await this.getTrailersUseCase.execute(options);
      
      return {
        trailers: result.trailers,
        total: result.total,
        page: result.page,
        limit: result.limit
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve trailers');
    }
  }

  /**
   * GET /trailers/:id
   * Retrieve detailed information about a specific trailer
   * This endpoint is called when a user clicks on a trailer ID in the table
   * Note: The :id parameter can be either the database ID or the trailer ID (e.g., TR501)
   */
  @Get(':id')
  async getTrailerById(@Param('id') id: string): Promise<TrailerProfileDto> {
    try {
      // Execute the use case to get trailer profile
      const trailerProfile = await this.getTrailerByIdUseCase.execute(id);
      return trailerProfile;
    } catch (error) {
      // Handle specific errors
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Log unexpected errors for debugging
      console.error('Error retrieving trailer profile:', error);
      throw new InternalServerErrorException('Failed to retrieve trailer profile');
    }
  }

  /**
   * POST /trailers
   * Create a new trailer with optional document uploads
   * 
   * Accepts multipart/form-data with:
   * - Trailer data as form fields
   * - Document files as file uploads
   */
  @Post()
  @UseInterceptors(FilesInterceptor('documents', 10)) // Allow up to 10 document files
  async createTrailer(
    @Body() createTrailerDto: CreateTrailerDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<TrailerResponseDto> {
    try {
      // Validate required fields
      this.validateCreateTrailerDto(createTrailerDto);

      // Process uploaded documents if any
      const documents = this.processUploadedDocuments(files);
      
      // TODO: Handle document uploads separately after trailer creation
      // For now, we'll just create the trailer without documents

      // Execute the use case
      const trailer = await this.createTrailerUseCase.execute(createTrailerDto);
      
      return trailer;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle domain errors (like duplicate trailer ID/VIN)
      if (error instanceof Error && error.message.includes('already exists')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Failed to create trailer');
    }
  }

  /**
   * Private helper: Validate CreateTrailerDto
   */
  private validateCreateTrailerDto(dto: CreateTrailerDto): void {
    // Check if dto is empty or missing required fields
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }

    if (!dto.trailerType) {
      throw new BadRequestException('Trailer type is required');
    }

    if (!dto.ownershipType) {
      throw new BadRequestException('Ownership type is required');
    }


    // Validate year if provided
    if (dto.year) {
      const currentYear = new Date().getFullYear();
      if (dto.year < 1900 || dto.year > currentYear + 1) {
        throw new BadRequestException('Invalid year');
      }
    }

    // Validate lease end date for leased trailers
    if (dto.ownershipType === 'leased' && !dto.leaseEndDate) {
      throw new BadRequestException('Lease end date is required for leased trailers');
    }

    // Validate lease end date is in the future
    if (dto.leaseEndDate) {
      const leaseDate = new Date(dto.leaseEndDate);
      const today = new Date();
      // Set time to start of day for fair comparison
      today.setHours(0, 0, 0, 0);
      leaseDate.setHours(0, 0, 0, 0);
      
      if (leaseDate <= today) {
        throw new BadRequestException('Lease end date must be in the future');
      }
    }

    // Validate numeric fields
    if (dto.length && dto.length <= 0) {
      throw new BadRequestException('Length must be positive');
    }
    if (dto.width && dto.width <= 0) {
      throw new BadRequestException('Width must be positive');
    }
    if (dto.height && dto.height <= 0) {
      throw new BadRequestException('Height must be positive');
    }
    if (dto.capacity && dto.capacity <= 0) {
      throw new BadRequestException('Capacity must be positive');
    }
    if (dto.axleCount && dto.axleCount <= 0) {
      throw new BadRequestException('Axle count must be positive');
    }
    if (dto.gvwr && dto.gvwr <= 0) {
      throw new BadRequestException('GVWR must be positive');
    }
  }

  /**
   * Private helper: Process uploaded document files
   */
  private processUploadedDocuments(files?: Express.Multer.File[]): TrailerDocumentsDto | undefined {
    if (!files || files.length === 0) {
      return undefined;
    }

    const documents: TrailerDocumentsDto = {
      trailerId: '' // Will be set after trailer creation
    };

    // Process each uploaded file based on fieldname
    files.forEach(file => {
      switch (file.fieldname) {
        case 'titleDoc':
          documents.titleDoc = file;
          break;
        case 'leaseDoc':
          documents.leaseDoc = file;
          break;
        case 'registrationDoc':
          documents.registrationDoc = file;
          break;
        case 'insuranceDoc':
          documents.insuranceDoc = file;
          break;
        case 'inspectionDoc':
          if (!documents.inspectionDoc) {
            documents.inspectionDoc = [];
          }
          documents.inspectionDoc.push(file);
          break;
        default:
          // Ignore unknown file fields
          break;
      }
    });

    return documents;
  }
}