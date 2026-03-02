import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class SubmitIntakeQualifierDto {
  @IsNotEmpty()
  @IsString()
  leadId: string;

  @IsOptional()
  @IsString()
  opportunityId?: string;

  @IsOptional()
  @IsString()
  budgetOwner?: string;

  @IsOptional()
  @IsNumber()
  budgetAmount?: number;

  @IsOptional()
  @IsString()
  budgetAmountCurrency?: string;

  @IsOptional()
  @IsNumber()
  headcount?: number;

  @IsOptional()
  @IsString()
  decisionTimeline?: string;

  @IsOptional()
  @IsString()
  currentSolution?: string;

  @IsOptional()
  @IsString()
  painPoints?: string;

  @IsOptional()
  @IsString()
  eventDate?: string;

  @IsOptional()
  @IsString()
  tier?: string;
}

export class CheckDecisionGateDto {
  @IsNotEmpty()
  @IsString()
  leadId: string;

  @IsNotEmpty()
  @IsString()
  targetStatus: string;
}
