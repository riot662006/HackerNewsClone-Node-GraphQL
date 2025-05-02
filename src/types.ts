import { IncomingMessage } from "http";
import { PrismaClient } from "../generated/prisma/index.js";

export interface IContext {
  prisma: PrismaClient;
  userId: string | null;
  req: IncomingMessage;
}

export interface ILink {
  id: string;
  url: string;
  description: string;
  postedBy: IUser | null;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  links: ILink[];
}
