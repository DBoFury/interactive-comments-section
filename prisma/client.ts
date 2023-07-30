import { PrismaClient } from "@prisma/client";

declare global {
  namespace Next {
    interface Global {}
  }
}

interface PrismaGlobal extends Next.Global {
  prisma: PrismaClient;
}

declare const global: PrismaGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
