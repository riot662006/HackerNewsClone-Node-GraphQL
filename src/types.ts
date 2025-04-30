import { PrismaClient } from "../generated/prisma/index.js";

export interface Context {
  prisma: PrismaClient;
}

export type Link = {
  id: string;
  url: string;
  description: string;
};
