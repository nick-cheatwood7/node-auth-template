import Prisma from "@prisma/client";
import { __prod__ } from "./constants";

const { PrismaClient } = Prisma;

declare global {
    var prisma: Prisma.PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (__prod__) {
    global.prisma = prisma;
}
