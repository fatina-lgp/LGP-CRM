import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
} from '@nestjs/common';

import {
    CheckDecisionGateDto,
    SubmitIntakeQualifierDto,
} from 'src/modules/intake-qualifier/services/intake-qualifier.dto';
import { IntakeQualifierService } from 'src/modules/intake-qualifier/services/intake-qualifier.service';

@Controller('api/intake-qualifiers')
export class IntakeQualifierController {
  private readonly logger = new Logger(IntakeQualifierController.name);

  constructor(
    private readonly intakeQualifierService: IntakeQualifierService,
  ) {}

  // Submit or update the intake qualifier form
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitForm(@Body() dto: SubmitIntakeQualifierDto) {
    this.logger.log(`Intake qualifier submission for lead ${dto.leadId}`);

    // TODO: Extract workspaceId and submittedById from authenticated request context
    const workspaceId = 'default-workspace';
    const submittedById = 'default-user';

    const result = await this.intakeQualifierService.submitForm({
      ...dto,
      submittedById,
      workspaceId,
    });

    return { success: true, data: result };
  }

  // Get intake qualifier for a lead
  @Get(':leadId')
  async getByLeadId(@Param('leadId') leadId: string) {
    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const qualifier = await this.intakeQualifierService.getByLeadId({
      leadId,
      workspaceId,
    });

    return { success: true, data: qualifier };
  }

  // Check Decision Gate — can this lead advance?
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async checkDecisionGate(@Body() dto: CheckDecisionGateDto) {
    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const result = await this.intakeQualifierService.enforceDecisionGate({
      leadId: dto.leadId,
      targetStatus: dto.targetStatus,
      workspaceId,
    });

    return { success: true, data: result };
  }
}
