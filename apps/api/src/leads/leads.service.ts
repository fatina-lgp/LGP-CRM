import { Injectable, NotFoundException } from '@nestjs/common';
import { Stage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

const STAGE_ORDER: Stage[] = [
  Stage.NEW, Stage.CONTACTED, Stage.CALL_BOOKED, Stage.CALL_COMPLETED,
  Stage.INTAKE_COMPLETED, Stage.PROPOSAL, Stage.NEGOTIATIONS,
  Stage.CONTRACT_AND_PAYMENT, Stage.CLOSED_WON,
];

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { stage?: Stage; assigneeId?: string }) {
    return this.prisma.lead.findMany({
      where: {
        ...(filters.stage && { stage: filters.stage }),
        ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
      },
      include: { assignee: { select: { id: true, name: true } }, activities: { take: 3, orderBy: { createdAt: 'desc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getPipelineSummary() {
    const leads = await this.prisma.lead.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, company: true, stage: true, assignee: { select: { name: true } }, stageChangedAt: true },
    });
    const columns = STAGE_ORDER.map((stage) => ({
      stage,
      count: leads.filter((l) => l.stage === stage).length,
      leads: leads.filter((l) => l.stage === stage),
    }));
    return columns;
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true } },
        activities: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  create(dto: CreateLeadDto, creatorId: string) {
    return this.prisma.lead.create({
      data: { ...dto, assigneeId: dto.assigneeId ?? creatorId },
    });
  }

  update(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  updateStage(id: string, stage: Stage) {
    return this.prisma.lead.update({
      where: { id },
      data: { stage, stageChangedAt: new Date() },
    });
  }

  remove(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }
}
