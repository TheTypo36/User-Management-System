// db/client.ts or wherever your Prisma client lives
import { PrismaClient } from "@prisma/client"; // or from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
