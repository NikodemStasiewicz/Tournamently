import { PrismaClient } from "@prisma/client";

declare global {
  // Zapobiega tworzeniu wielu instancji Prisma w trybie development (Next.js hot reload)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // Możesz usunąć lub zmienić np. na ["error"] w produkcji
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
