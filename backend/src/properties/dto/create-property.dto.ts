import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsUUID()
  leadId: string;

  @IsString()
  @IsOptional()
  culture?: string;

  @IsNumber()
  @Min(0)
  areaHectares: number;
}
