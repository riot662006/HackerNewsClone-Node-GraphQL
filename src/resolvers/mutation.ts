import { Context } from "../types.js";
import { GraphQLResolveInfo } from "graphql";

export const Mutation = {
  post: (
    parent: unknown,
    args: { url: string; description: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    const newLink = context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
      },
    });
    return newLink;
  },
  updateLink: (
    parent: unknown,
    args: { id: string; url: string; description: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    const updatedLink = context.prisma.link.update({
      where: { id: Number(args.id) },
      data: {
        url: args.url,
        description: args.description,
      },
    });
    return updatedLink;
  },
  deleteLink: (
    parent: unknown,
    args: { id: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    const deletedLink = context.prisma.link.delete({
      where: { id: Number(args.id) },
    });
    return deletedLink;
  },
};
