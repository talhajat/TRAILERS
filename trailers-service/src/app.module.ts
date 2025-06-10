import { Module } from '@nestjs/common';
import { TrailerController } from './presentation/controllers/TrailerController';
import { CreateTrailerUseCase } from './application/use-cases/CreateTrailerUseCase';
import { GetTrailersUseCase } from './application/use-cases/GetTrailersUseCase';
import { TrailerRepository } from './infrastructure/persistence/repositories/TrailerRepository';
import { PrismaModule } from './infrastructure/persistence/prisma.module';
import { ITrailerRepository } from './domain/repositories/ITrailerRepository';

/**
 * Application Module
 *
 * Main module that configures dependency injection for the entire application.
 * Following NestJS conventions with a separate module file.
 */
@Module({
  imports: [PrismaModule], // Import PrismaModule for database access
  controllers: [TrailerController],
  providers: [
    // Infrastructure Layer - Repository Implementation
    {
      provide: 'ITrailerRepository',
      useClass: TrailerRepository,
    },
    // Application Layer - Use Cases
    {
      provide: CreateTrailerUseCase,
      useFactory: (repository: ITrailerRepository) => {
        return new CreateTrailerUseCase(repository);
      },
      inject: ['ITrailerRepository'],
    },
    {
      provide: GetTrailersUseCase,
      useFactory: (repository: ITrailerRepository) => {
        return new GetTrailersUseCase(repository);
      },
      inject: ['ITrailerRepository'],
    },
  ],
})
export class AppModule {}