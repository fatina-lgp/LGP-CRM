import { Module } from '@nestjs/common';

import { AnalyticsReportModule } from 'src/modules/analytics-report/analytics-report.module';
import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ClientAssetModule } from 'src/modules/client-asset/client-asset.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { ContractModule } from 'src/modules/contract/contract.module';
import { CpqModule } from 'src/modules/cpq/cpq.module';
import { DiscoveryCallModule } from 'src/modules/discovery-call/discovery-call.module';
import { DocumentTrackingModule } from 'src/modules/document-tracking/document-tracking.module';
import { FavoriteFolderModule } from 'src/modules/favorite-folder/favorite-folder.module';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';
import { IntakeQualifierModule } from 'src/modules/intake-qualifier/intake-qualifier.module';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { LeadModule } from 'src/modules/lead/lead.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { ProjectChecklistModule } from 'src/modules/project-checklist/project-checklist.module';
import { QcCheckModule } from 'src/modules/qc-check/qc-check.module';
import { RenewalModule } from 'src/modules/renewal/renewal.module';
import { TestimonialModule } from 'src/modules/testimonial/testimonial.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';
import { WorkspaceMemberModule } from 'src/modules/workspace-member/workspace-member.module';

@Module({
  imports: [
    // Core Twenty modules
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    WorkflowModule,
    FavoriteFolderModule,
    FavoriteModule,
    WorkspaceMemberModule,
    // Phase 1: Lead Intake & Scoring
    LeadModule,
    // Phase 2: Discovery Call
    DiscoveryCallModule,
    DocumentTrackingModule,
    IntakeQualifierModule,
    // Phase 3: Quarterly Alignment & Contract
    CpqModule,
    ContractModule,
    // Phase 4: Pre-Activation Planning
    ProjectChecklistModule,
    ClientAssetModule,
    // Phase 5: Production & Activation Live
    QcCheckModule,
    InventoryModule,
    // Phase 6: Post-Activation & Renewal
    AnalyticsReportModule,
    TestimonialModule,
    RenewalModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}



