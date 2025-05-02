import { IncomingMessage } from "http";
import { PrismaClient } from "../generated/prisma/index.js";

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
  req: IncomingMessage;
}

export type Link = {
  id: string;
  url: string;
  description: string;
  postedBy: User | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  links: Link[];
};
