import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import fetch from 'node-fetch';

@Injectable()
export class SWIntegrationService implements OnModuleInit {
  private readonly logger = new Logger(SWIntegrationService.name);
  private readonly intrinsicValueRegExp = /\"intrinsicValue\"\:(\d+\.?\d*)/m;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.obtainValuations();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async obtainValuations() {
    const { origin } = await this.prisma.analyst.findFirst({
      where: {
        name: 'simplywall.st',
      },
      select: {
        origin: true,
      },
    });
    this.logger.log(`${origin}`);
    const stocks = await this.prisma.stock.findMany({
      select: {
        company: {
          select: {
            market: true,
            name: true,
            sector: true,
          },
        },
        exchange: true,
        ticker: true,
      },
    });
    stocks.forEach(async (stock) => {
      const { market, sector, name } = stock.company;
      //https://simplywall.st/stocks/us/tech/nyse-vnt/vontier
      // https://simplywall.st/stocks/us/pharmaceuticals-biotech/nyse-bmy/bristol-myers-squibb
      // https://simplywall.st/stocks/ru/food-beverage-tobacco/mcx-agro/ros-agro-shares
      const url = `${origin}/${market}/${sector}/${stock.exchange}-${stock.ticker}/${name}`;
      const res = await fetch(url.toLocaleLowerCase());
      const pageHtml = await res.text();
      const [_, intrinsicValue] = pageHtml.match(this.intrinsicValueRegExp) || [undefined, 0];
      this.logger.log(`${intrinsicValue}`);
    });
  }
}
