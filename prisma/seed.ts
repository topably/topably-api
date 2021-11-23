import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.company.create({
    data: {
      name: 'Vontier',
      sector: 'Tech',
      market: 'US',
      stocks: {
        create: [
          {
            ticker: 'VNT',
            exchange: 'NYSE',
          },
        ],
      },
    },
  });

  await prisma.analyst.create({
    data: {
      name: 'simplywall.st',
      origin: 'https://simplywall.st/stocks'
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
