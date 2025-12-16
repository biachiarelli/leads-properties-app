import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropriedadesController } from './properties.controller';
import { PropriedadesService } from './properties.service';
import { PropriedadeRural } from '../entities/propriedade-rural.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropriedadeRural])],
  controllers: [PropriedadesController],
  providers: [PropriedadesService],
  exports: [PropriedadesService],
})
export class PropriedadesModule {}

