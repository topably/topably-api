import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor( private prisma: PrismaService) {}

  @Get("/valuations")
  getValuations() {
    return this.prisma.valuation.findMany({
      where: {
        stock: {
          is : {
            ticker: 'VNT'
          }
        }
      }
    });
  }

}
