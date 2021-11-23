import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ValuationModule } from './valuation/valuation.module';

@Module({
  imports: [
    PrismaModule, 
    ScheduleModule.forRoot(), 
    ValuationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
