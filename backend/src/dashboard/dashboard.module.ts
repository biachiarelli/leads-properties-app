import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Lead } from '../entities/lead.entity';
import { Property } from '../entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Property])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
