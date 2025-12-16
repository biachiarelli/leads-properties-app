import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PropriedadesService } from './properties.service';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';

@Controller('api/propriedades')
export class PropriedadesController {
  constructor(private readonly propriedadesService: PropriedadesService) {}

  @Post()
  create(@Body(ValidationPipe) createPropriedadeDto: CreatePropriedadeDto) {
    return this.propriedadesService.create(createPropriedadeDto);
  }

  @Get()
  findAll(
    @Query('leadId') leadId?: string,
    @Query('cultura') cultura?: string,
    @Query('areaMinima') areaMinima?: number,
  ) {
    return this.propriedadesService.findAll({ leadId, cultura, areaMinima });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propriedadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePropriedadeDto: UpdatePropriedadeDto,
  ) {
    return this.propriedadesService.update(id, updatePropriedadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propriedadesService.remove(id);
  }
}

