import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Lead } from '../entities/lead.entity';
import { PropriedadeRural } from '../entities/propriedade-rural.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, PropriedadeRural])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

