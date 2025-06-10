import { Module, Global } from '@nestjs/common';
import { PrismaService } from './PrismaService';

/**
 * Prisma Module
 * 
 * Provides database connection service to the entire application.
 * Marked as @Global so it can be used anywhere without re-importing.
 * 
 * This follows NestJS best practices for database modules.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}