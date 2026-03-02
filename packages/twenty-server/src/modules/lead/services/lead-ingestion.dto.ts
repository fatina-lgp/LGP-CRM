import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class IngestLeadDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  annualRevenue?: number;

  @IsOptional()
  @IsString()
  annualRevenueCurrency?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsNotEmpty()
  @IsString()
  intakeSource: string;

  @IsOptional()
  @IsString()
  intakeSourceDetail?: string;
}

export class BatchIngestLeadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngestLeadDto)
  leads: IngestLeadDto[];
}
