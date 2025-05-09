import { IncomingMessage } from "http";
import { PrismaClient } from "../generated/prisma/index.js";
import { PubSub } from "graphql-subscriptions";

export type SortOrder = "asc" | "desc";

export interface IContext {
  prisma: PrismaClient;
  pubsub: PubSub;

  userId: string | null;
  req: IncomingMessage;
}

export interface ILink {
  id: string;
  createdAt: string;
  url: string;
  description: string;
  postedBy: IUser | null;
  votes: IVote[];
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  links: ILink[];
  votes: IVote[];
}

export interface IVote {
  id: string;
  user: IUser;
  link: ILink;
}

export interface IFeed {
  links: ILink[];
  count: number;
}

export interface ILinkOrderByInput {
  description?: SortOrder;
  url?: SortOrder;
  createdAt?: SortOrder;
}
