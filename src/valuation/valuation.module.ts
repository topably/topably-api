import { Module } from '@nestjs/common';
import { SWIntegrationService } from './integrations/sw-integration.service';

@Module({
    providers: [SWIntegrationService]
})
export class ValuationModule {}
