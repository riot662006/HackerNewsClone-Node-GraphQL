import { IncomingMessage } from "http";
import { PrismaClient } from "../generated/prisma/index.js";
import { PubSub } from "graphql-subscriptions";

export interface IContext {
  prisma: PrismaClient;
  pubsub: PubSub;
  
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
