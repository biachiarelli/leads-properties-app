import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class UpdatePropertyDto {
  @IsUUID()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  culture?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  areaHectares?: number;
}
