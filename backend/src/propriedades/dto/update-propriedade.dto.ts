import { IsString, IsNumber, IsUUID, IsOptional, IsObject, Min } from 'class-validator';

export class UpdatePropriedadeDto {
  @IsUUID()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  cultura?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  areaHectares?: number;

  @IsObject()
  @IsOptional()
  geometria?: any;
}

