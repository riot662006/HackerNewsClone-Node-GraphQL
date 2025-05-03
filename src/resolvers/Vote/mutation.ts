import { GraphQLResolveInfo } from "graphql";
import { IContext } from "../../types.js";

export const vote = async (
  parent: unknown,
  args: { linkId: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) {
    throw new Error("Not authenticated");
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        userId: Number(context.userId),
        linkId: Number(args.linkId),
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error("Already voted for this link");
  }

  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: Number(context.userId) } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  return newVote;
};

export const deleteVote = async (
  parent: unknown,
  args: { linkId: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) {
    throw new Error("Not authenticated");
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        userId: Number(context.userId),
        linkId: Number(args.linkId),
      },
    },
  });

  if (!vote) {
    throw new Error("Vote not found");
  }

  if (vote.userId !== Number(context.userId)) {
    throw new Error("Not authorized to delete this vote");
  }

  const deletedVote = await context.prisma.vote.delete({
    where: {
      linkId_userId: {
        userId: Number(context.userId),
        linkId: Number(args.linkId),
      },
    },
  });

  return deletedVote;
};
