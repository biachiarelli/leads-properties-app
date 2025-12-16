import { IsString, IsNumber, IsUUID, IsOptional, IsObject, Min } from 'class-validator';

export class CreatePropriedadeDto {
  @IsUUID()
  leadId: string;

  @IsString()
  @IsOptional()
  cultura?: string;

  @IsNumber()
  @Min(0)
  areaHectares: number;

  @IsObject()
  @IsOptional()
  geometria?: any; // GeoJSON object
}

