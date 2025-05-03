import { IContext, IVote } from "../../types.js";

export const link = async (parent: IVote, args: undefined, context: IContext) =>
  await context.prisma.vote
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .link();

export const user = async (parent: IVote, args: undefined, context: IContext) =>
  await context.prisma.vote
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .user();
