import { IsString, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { LeadStatus } from '../../common/enums/lead-status.enum';

export class CreateLeadDto {
  @IsString()
  @Length(3, 255)
  nome: string;

  @IsString()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve ter 11 dígitos ou formato XXX.XXX.XXX-XX',
  })
  cpf: string;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsString()
  @IsOptional()
  comentarios?: string;

  @IsString()
  @IsOptional()
  municipio?: string;
}

