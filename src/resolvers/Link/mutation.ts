import { GraphQLResolveInfo } from "graphql";
import { IContext } from "../../types.js";

export const post = async (
  parent: unknown,
  args: { url: string; description: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) throw new Error("Not authenticated");

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: { id: Number(context.userId) },
      },
    },
  });
  return newLink;
};

export const updateLink = async (
  parent: unknown,
  args: { id: string; url: string; description: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) {
    throw new Error("Not authenticated");
  }

  const existingLink = await context.prisma.link.findUnique({
    where: { id: Number(args.id) },
  });

  if (!existingLink) {
    throw new Error("Link not found");
  }

  if (existingLink.postedById !== Number(context.userId)) {
    throw new Error("Not authorized to update this link");
  }

  const updatedLink = await context.prisma.link.update({
    where: { id: Number(args.id) },
    data: {
      url: args.url,
      description: args.description,
    },
  });

  return updatedLink;
};

export const deleteLink = async (
  parent: unknown,
  args: { id: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) {
    throw new Error("Not authenticated");
  }

  const existingLink = await context.prisma.link.findUnique({
    where: { id: Number(args.id) },
  });

  if (!existingLink) {
    throw new Error("Link not found");
  }

  if (existingLink.postedById !== Number(context.userId)) {
    throw new Error("Not authorized to delete this link");
  }

  const deletedLink = await context.prisma.link.delete({
    where: { id: Number(args.id) },
  });

  return deletedLink;
};
